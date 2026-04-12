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
   * Injects full business context, tone, qualification mode, and custom questions.
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

    // Build tone instruction
    const toneMap: Record<string, string> = {
      formal: 'Use a polished, professional tone. Speak like a senior consultant.',
      casual: 'Use a friendly, conversational tone. Speak like a helpful colleague.',
      persuasive: 'Use a confident, persuasive tone. Apply urgency and scarcity naturally.',
      professional: 'Use a balanced professional tone that is warm but authoritative.'
    };
    const toneInstruction = toneMap[bp.chatbot_tone || 'professional'] || toneMap.professional;

    // Build qualification mode instruction
    const qualMap: Record<string, string> = {
      strict: 'Be very selective. Only push for a call if the lead shows strong buying signals (budget, urgency, authority).',
      balanced: 'Balance value-building with qualification. Gently probe for readiness without being pushy.',
      relaxed: 'Focus on building rapport and trust first. Collect contact info naturally without heavy qualification.'
    };
    const qualInstruction = qualMap[bp.qualification_mode || 'balanced'] || qualMap.balanced;

    // Build custom questions instruction
    let customQuestionsBlock = '';
    if (bp.custom_questions && Array.isArray(bp.custom_questions) && (bp.custom_questions as any[]).length > 0) {
      const qs = (bp.custom_questions as any[]).map((q: any, i: number) => `${i+1}. ${q.question} (type: ${q.type})`);
      customQuestionsBlock = `\nCUSTOM QUESTIONS TO WEAVE INTO CONVERSATION (ask naturally, not all at once):\n${qs.join('\n')}`;
    }

    // Build lead fields instruction
    let fieldsBlock = '';
    if (bp.lead_fields_config && typeof bp.lead_fields_config === 'object') {
      const cfg = bp.lead_fields_config as Record<string, boolean>;
      const activeFields = Object.entries(cfg).filter(([_, v]) => v).map(([k]) => k);
      if (activeFields.length > 0) {
        fieldsBlock = `\nLEAD INFO TO COLLECT (naturally, during conversation): ${activeFields.join(', ')}`;
      }
    }

    const systemPrompt = `You are a world-class, human-like sales closer representing ${bp.company_name} in the ${bp.industry || 'software'} industry.

BUSINESS CONTEXT:
- What we do: ${bp.business_description || 'Not specified'}
- Services/Products: ${bp.services_offered || 'Not specified'}
- Ideal Customer: ${bp.ideal_customer || 'Not specified'}
- Key Selling Points: ${bp.selling_points || 'Not specified'}
- Pricing Range: ${bp.pricing_range || 'Not specified'}
- Common Objections to Handle: ${bp.common_objections || 'Not specified'}
- Target Audience: ${bp.target_audience || 'Not specified'}

TONE: ${toneInstruction}
QUALIFICATION APPROACH: ${qualInstruction}

Your goal is to build deep trust, uncover latent pain points, and seamlessly guide the prospect to book a strategy call.
Apply psychological principles internally: Reciprocity, Authority, Social Proof, Scarcity, Loss Aversion.

CRITICAL RULES:
1. NEVER act like an AI or a bot. Speak with the confident, natural tone described above.
2. NEVER ask for budget directly or give the price early. Build massive value first.
3. Keep responses punchy, concise (2-3 sentences max), and end with a soft-pressure question.
4. If the user seems highly qualified and ready, suggest scheduling a brief strategy call.
5. Handle objections by acknowledging concerns and reframing with selling points.
6. Adapt your follow-up questions based on what the user has already shared.
${customQuestionsBlock}
${fieldsBlock}

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
   * Deep multi-dimensional lead analysis engine.
   * Analyzes behavioral signals, psychological indicators, and produces business-friendly scoring.
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

    // Fetch full conversation context for deep analysis
    const conversation = await prisma.conversation.findUnique({ 
      where: { id: conversationId },
      include: { 
        BusinessProfile: true,
        Messages: { orderBy: { created_at: 'asc' }, take: 20 }
      }
    });
    if (!conversation) return fallbackScores;

    const transcript = conversation.Messages.map((m: any) => `${m.sender}: ${m.content}`).join('\n');
    const bp = conversation.BusinessProfile;

    const operation = async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an elite AI Lead Intelligence Engine for ${bp.company_name} (${bp.industry || 'software'}).
Business context: ${bp.business_description || 'SaaS product'}.
Pricing: ${bp.pricing_range || 'Not specified'}.

Analyze the FULL conversation transcript below. Apply deep behavioral psychology and neuromarketing principles INTERNALLY (loss aversion, urgency triggers, trust signals, commitment patterns) but DO NOT output technical jargon.

Evaluate these dimensions:
1. Intent Level (1-10): How serious is the lead? Exploring vs ready to buy.
2. Budget Capability (1-10): Direct mention OR inferred from context, role, company size.
3. Urgency (1-10): Immediate / short-term / long-term need.
4. Behavioral Signals: hesitation level, confidence level, clarity of need, emotional tone (each: low/medium/high).
5. Psychological Indicators (use internally): buying readiness, pain intensity, decision authority.

Produce a JSON response with EXACTLY this structure:
{
  "intent_score": <1-10>,
  "budget_score": <1-10>,
  "urgency_score": <1-10>,
  "authority_score": <0-100>,
  "objection_score": <0-100>,
  "conversion_probability": <0-100>,
  "lead_value_estimate": <dollar amount based on pricing context>,
  "qualification_level": "HIGH" | "MEDIUM" | "LOW",
  "summary": "<1-2 sentence lead summary in simple business language>",
  "explanation": "<2-3 sentence explanation of WHY this lead is good or bad, in simple plain English a business owner would understand>",
  "recommended_action": "follow_up_immediately" | "send_proposal" | "nurture_later" | "ignore",
  "behavioral_signals": {
    "hesitation": "low" | "medium" | "high",
    "confidence": "low" | "medium" | "high",
    "clarity": "low" | "medium" | "high",
    "tone": "positive" | "neutral" | "negative"
  },
  "buying_signals": ["<string>"]
}`
          },
          { role: "user", content: `FULL TRANSCRIPT:\n${transcript}\n\nLATEST MESSAGE: ${userMessage}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const parsed = JSON.parse(response.choices[0].message.content || "{}");
      
      // Ensure revenue_probability_score for backward compat with Conversation model
      const revenue_probability_score = parsed.conversion_probability || Math.max(0, 
        ((parsed.urgency_score || 0) * 10 * 0.3) + 
        ((parsed.authority_score || 0) * 0.3) + 
        ((parsed.budget_score || 0) * 10 * 0.4) - 
        ((parsed.objection_score || 0) * 0.2)
      );

      return {
        ...parsed,
        revenue_probability_score
      };
    };

    const scores = await this.executeWithReliability(operation, 2, 15000, fallbackScores);

    // Update Conversation scores (backward compatible)
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        urgency_score: { increment: Math.floor((scores.urgency_score || 0)) },
        authority_score: { increment: Math.floor((scores.authority_score || 0) / 5) },
        budget_score: { increment: Math.floor((scores.budget_score || 0)) },
        objection_score: { increment: Math.floor((scores.objection_score || 0) / 5) },
        revenue_probability_score: scores.revenue_probability_score,
        raw_signals: scores.buying_signals
      }
    });
    
    // Auto-trigger Lead Promotion Logic with deep intelligence data
    if (scores.conversion_probability >= 40 || scores.qualification_level === 'HIGH' || scores.buying_signals?.includes("pricing")) {
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
          collected_fields: scores.buying_signals || [],
          intent_score: scores.intent_score || 0,
          budget_score: scores.budget_score || 0,
          urgency_score: scores.urgency_score || 0,
          conversion_probability: scores.conversion_probability || 0,
          lead_value_estimate: scores.lead_value_estimate || 0,
          qualification_level: scores.qualification_level || 'LOW',
          ai_summary: scores.summary || '',
          ai_explanation: scores.explanation || '',
          recommended_action: scores.recommended_action || 'nurture_later',
          behavioral_signals: scores.behavioral_signals || {},
        },
        update: {
          lead_status: 'QUALIFIED',
          collected_fields: scores.buying_signals || [],
          intent_score: scores.intent_score || 0,
          budget_score: scores.budget_score || 0,
          urgency_score: scores.urgency_score || 0,
          conversion_probability: scores.conversion_probability || 0,
          lead_value_estimate: scores.lead_value_estimate || 0,
          qualification_level: scores.qualification_level || 'LOW',
          ai_summary: scores.summary || '',
          ai_explanation: scores.explanation || '',
          recommended_action: scores.recommended_action || 'nurture_later',
          behavioral_signals: scores.behavioral_signals || {},
        }
      });

      // Trigger Auto-Follow Up Generation immediately
      setImmediate(() => {
          this.generateFollowUp(lead.id, conversation.BusinessProfile.company_name, conversationId).catch(console.error);
      });
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
