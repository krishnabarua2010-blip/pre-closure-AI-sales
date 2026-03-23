import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { prisma } from '../../config/prisma';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key' // Replace with real key in production
});

// A robust AI service mapping to Agent 3's strict requirements
export class AIService {
  
  /**
   * Universal wrapper for OpenAI calls to encapsulate Reliability Logic (Retries, Timeouts, Fallbacks)
   */
  private static async executeWithReliability(
    operation: () => Promise<any>, 
    retries = 2, 
    timeoutMs = 15000, 
    fallback: any
  ): Promise<any> {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI Request Timeout')), timeoutMs)
    );

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        // Race the openai call against the 15s hard timeout
        return await Promise.race([operation(), timeoutPromise]);
      } catch (error: any) {
        if (attempt > retries) {
          console.error('[AI Service Error]: All retries exhausted.', error.message);
          return fallback;
        }
        console.warn(`[AI Service Warn]: Attempt ${attempt} failed, retrying...`, error.message);
        // Exponential backoff before retry (e.g. 1000ms -> 2000ms)
        await new Promise(res => setTimeout(res, attempt * 1000));
      }
    }
    return fallback;
  }

  /**
   * Generates a hyper-realistic, human-like sales conversational response.
   */
  static async generateResponse(conversationId: number, userMessage: string): Promise<string> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        BusinessProfile: {
          include: { ConversationRules: { where: { is_active: true } } }
        },
        Messages: { orderBy: { created_at: 'asc' }, take: 10 }
      }
    });

    if (!conversation) return "I cannot find the context for this chat.";

    const bp = conversation.BusinessProfile;
    const rules = bp.ConversationRules.map((r: any) => r.rule_type + ': ' + JSON.stringify(r.parameters)).join('\n');

    const systemPrompt = `You are a world-class, human-like sales closer representing ${bp.company_name} in the ${bp.industry || 'software'} industry.
Your goal is to build deep trust, uncover latent pain points, and seamlessly guide the prospect to book a strategy call.
Apply Robert Cialdini's principles of persuasion (Reciprocity, Authority, Social Proof, Scarcity).

CRITICAL RULES:
1. NEVER act like an AI or a bot. Speak with the confident, natural, and slightly informal tone of an elite human sales director.
2. NEVER ask for their budget or give the price early. Build massive value and confirm their authority first.
3. Keep responses punchy, concise (2-3 sentences max), and end with a soft-pressure question to maintain control of the frame.
4. If the user seems highly qualified and ready, tell them you want to schedule a brief strategy call.

Custom CEO Rules to obey:
${rules || 'None'}`;

    const messages = conversation.Messages.map((m: any) => ({
      role: m.sender === 'USER' ? 'user' : 'assistant',
      content: m.content
    })) as any[];

    messages.push({ role: 'user', content: userMessage });

    const operation = async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      });
      return response.choices[0].message.content || "I understand. Can you elaborate on your current situation?";
    };

    return await this.executeWithReliability(operation, 2, 10000, "We're experiencing heavy traffic, but I want to make sure I understand your needs perfectly.");
  }

  /**
   * Analyzes conversation context and parses dynamic multi-dimensional SaaS Lead criteria.
   * Backgroundly updates scores.
   */
  static async analyzeAndScore(conversationId: number, userMessage: string): Promise<any> {
    const fallbackScores = { 
      urgency_score: 0, 
      authority_score: 0, 
      budget_score: 0, 
      objection_score: 0, 
      revenue_probability_score: 0,
      signals: ["fallback_triggered"]
    };

    const operation = async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", // Assume premium model for intelligence
        messages: [
          {
            role: "system",
            content: `You are an AI Sales Qualification Engine.
Analyze the user message and extract:
1. Urgency: Is there a specific timeline? (0-100)
2. Authority: Are they the decision maker? (0-100)
3. Budget: Are they ready to pay? (0-100)
4. Objection: Are there strict hesitations? (0-100)
Respond ONLY with a strict JSON format exactly containing: 
{ "urgency_score": <int>, "authority_score": <int>, "budget_score": <int>, "objection_score": <int>, "buying_signals": [<string>] }`
          },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const parsed = JSON.parse(response.choices[0].message.content || "{}");
      
      const revenue_probability_score = Math.max(0, 
        ((parsed.urgency_score || 0) * 0.3) + 
        ((parsed.authority_score || 0) * 0.3) + 
        ((parsed.budget_score || 0) * 0.4) - 
        ((parsed.objection_score || 0) * 0.2)
      );

      return {
        ...parsed,
        revenue_probability_score
      };
    };

    const scores = await this.executeWithReliability(operation, 2, 12000, fallbackScores);

    // Save strictly back to PostgreSQL
    const conversation = await prisma.conversation.findUnique({ 
        where: { id: conversationId },
        include: { BusinessProfile: true }
    });
    if (conversation) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          urgency_score: { increment: Math.floor(scores.urgency_score / 5) }, // Aggregate slowly across conversation
          authority_score: { increment: Math.floor(scores.authority_score / 5) },
          budget_score: { increment: Math.floor(scores.budget_score / 5) },
          objection_score: { increment: Math.floor(scores.objection_score / 5) },
          revenue_probability_score: scores.revenue_probability_score,
          raw_signals: scores.buying_signals
        }
      });
      
      // Auto-trigger Lead Promotion Logic
      if (scores.revenue_probability_score >= 70 || scores.buying_signals?.includes("pricing")) {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { status: 'QUALIFIED' }
        });
        
        const lead = await prisma.lead.upsert({
          where: { conversation_id: conversationId },
          create: {
            conversation_id: conversationId,
            business_profile_id: conversation.business_profile_id,
            lead_status: 'QUALIFIED',
            collected_fields: scores.buying_signals
          },
          update: {
            lead_status: 'QUALIFIED',
            collected_fields: scores.buying_signals
          }
        });

        // Trigger Auto-Follow Up Generation immediately
        setImmediate(() => {
            this.generateFollowUp(lead.id, conversation.BusinessProfile.company_name, conversationId).catch(console.error);
        });
      }
    }

    return scores;
  }

  /**
   * Automatically generates customized follow-up copy tailored to the extracted buying signals.
   */
  static async generateFollowUp(leadId: number, companyName: string, conversationId: number): Promise<void> {
    const existing = await prisma.followUp.findFirst({ where: { lead_id: leadId } });
    if (existing) return; // Prevent spamming if already generated

    const msgs = await prisma.message.findMany({
        where: { conversation_id: conversationId },
        orderBy: { created_at: 'asc' },
        take: 20
    });

    const transcript = msgs.map((m: any) => `${m.sender}: ${m.content}`).join('\n');

    const prompt = `You are the elite sales director for ${companyName}. 
Based on this chat transcript, write a highly personalized, high-converting follow-up email/SMS to this prospect.
Focus on their specific pain points. End with a soft-pressure CTA (e.g., "Are you free Tuesday at 2pm for 15 mins?").
Keep it under 3 short paragraphs.
TRANSCRIPT:
${transcript}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: prompt }]
    });

    const content = response.choices[0].message.content || "Hey! Following up on our chat. Let me know when you're free for a quick call.";

    await prisma.followUp.create({
        data: {
            lead_id: leadId,
            content,
            scheduled_for: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            status: "DRAFT"
        }
    });
  }
}
