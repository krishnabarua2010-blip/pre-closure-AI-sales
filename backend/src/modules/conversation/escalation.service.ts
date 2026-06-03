import dotenv from 'dotenv';
import { prisma } from '../../config/prisma';
import { ResendService } from '../external/resend.service';

dotenv.config();

export class EscalationService {
  
  static async checkAndEscalate(conversationId: number, userMessage: string): Promise<any> {
    console.log(`[Escalation Engine] Scanning conversation ${conversationId} for escalation triggers...`);

    // Fetch conversation context
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        BusinessProfile: {
          include: {
            User: true
          }
        },
        Messages: {
          orderBy: { created_at: 'asc' },
          take: 10
        }
      }
    });

    if (!conversation) {
      return { escalated: false, reply: null };
    }

    // Build chat transcript context
    const transcript = conversation.Messages.map(m => `${m.sender}: ${m.content}`).join('\n') + `\nUSER: ${userMessage}`;

    const apiKey = process.env.NGC_API_KEY || process.env.MISTRAL_API_KEY;
    if (!apiKey || !apiKey.startsWith('nvapi-')) {
      console.warn('[Escalation Engine] Nvidia API key not available, using fallback rules.');
      return this.runRuleBasedEscalation(conversationId, userMessage, conversation);
    }

    try {
      const prompt = `You are the Lead Human Escalation Classifier for Pre-Closure AI.
Your job is to analyze the conversation history and decide if the user wants human assistance, is highly frustrated, angry, or confused.

Analyze these indicators:
1. Direct requests for a human ("talk to someone", "human", "sales rep", "operator").
2. Frustration / Anger ("stop sending automated replies", "is this a bot?", "this is useless", "waste of time").
3. Urgency / Confusion ("I need help now", "getting frustrated").

Produce a valid, raw JSON response containing EXACTLY these keys:
{
  "escalation_score": <number 0-100 indicating escalation severity>,
  "escalate": <true | false>,
  "reason": "<1-sentence summary of the user's emotional state>"
}

CRITICAL: Output raw JSON only. Do not enclose in markdown blocks. No other text.

CONVERSATION TRANSCRIPT:
${transcript}`;

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'meta/llama-3.3-70b-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 300
        }),
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`LLM API returned status ${response.status}`);
      }

      const json = (await response.json()) as any;
      let rawContent = (json.choices[0].message.content || '{}').trim();
      if (rawContent.startsWith('```')) {
        rawContent = rawContent.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }

      const result = JSON.parse(rawContent);
      console.log(`[Escalation Engine] LLM Classification results: Score=${result.escalation_score}, Escalate=${result.escalate}`);

      if (result.escalate || result.escalation_score >= 75) {
        await this.triggerEscalationMode(conversationId, conversation, transcript, result.reason);
        return {
          escalated: true,
          escalation_score: result.escalation_score,
          reason: result.reason,
          reply: "Absolutely. I'll notify the team immediately. What's the best email and phone number to reach you?"
        };
      }

      return { escalated: false, escalation_score: result.escalation_score, reply: null };

    } catch (err: any) {
      console.warn('[Escalation Engine Warn] LLM classification failed, running rule-based failover:', err.message);
      return this.runRuleBasedEscalation(conversationId, userMessage, conversation);
    }
  }

  private static runRuleBasedEscalation(conversationId: number, message: string, conversation: any): any {
    const text = message.toLowerCase();
    const keywords = [
      'human', 'someone', 'sales rep', 'person', 'operator', 'agent', 
      'real person', 'talk to sales', 'connect me', 'stop bot', 'is this a bot'
    ];
    
    const matched = keywords.some(kw => text.includes(kw)) || text.includes('frustrated') || text.includes('useless');
    if (matched) {
      console.log('[Escalation Engine] Rule-based match detected, triggering escalation.');
      const transcript = conversation.Messages.map((m: any) => `${m.sender}: ${m.content}`).join('\n') + `\nUSER: ${message}`;
      
      this.triggerEscalationMode(conversationId, conversation, transcript, 'Matched rule-based human routing keywords.').catch(console.error);

      return {
        escalated: true,
        escalation_score: 85,
        reason: 'Rule-based keyword match',
        reply: "Absolutely. I'll notify the team immediately. What's the best email and phone number to reach you?"
      };
    }

    return { escalated: false, escalation_score: 10, reply: null };
  }

  private static async triggerEscalationMode(conversationId: number, conversation: any, transcript: string, reason: string): Promise<void> {
    console.log(`[Escalation Engine] Escalating Conversation ${conversationId} to human support.`);

    // 1. Update database Conversation Status
    try {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { status: 'ESCALATED' }
      });
    } catch (e: any) {
      console.warn('[Escalation DB Error] Failed to update conversation status:', e.message);
    }

    // 2. Dispatch notifications to business owner email
    const ownerEmail = conversation.BusinessProfile?.User?.email;
    if (ownerEmail) {
      const subject = `🚨 PRE-CLOSURE AI: Lead Escalated for ${conversation.BusinessProfile.company_name}`;
      const emailBody = `
        <h2>Lead Escalation Alert</h2>
        <p>A prospect in one of your sales funnels is requesting human assistance or has expressed frustration.</p>
        <p><strong>Reason for Escalation:</strong> ${reason}</p>
        <hr />
        <h3>Chat Transcript:</h3>
        <pre style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${transcript}</pre>
        <hr />
        <p>Log in to your dashboard to take over this conversation immediately.</p>
      `;

      try {
        await ResendService.sendOutreachEmail(ownerEmail, subject, emailBody);
        console.log(`[Escalation Engine] Escalation alert sent to owner email: ${ownerEmail}`);
      } catch (e: any) {
        console.error('[Escalation Email Error] Failed to send email alert:', e.message);
      }
    }
  }
}
