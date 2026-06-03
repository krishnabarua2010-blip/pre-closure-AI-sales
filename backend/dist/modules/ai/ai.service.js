"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = require("openai");
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../../config/prisma");
const weave = __importStar(require("weave"));
dotenv_1.default.config();
if (process.env.WANDB_PROJECT) {
    weave.init(process.env.WANDB_PROJECT);
}
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
});
const deepseek = new openai_1.OpenAI({
    apiKey: process.env.NGC_API_KEY || process.env.MISTRAL_API_KEY || 'nvapi-dummy',
    baseURL: 'https://integrate.api.nvidia.com/v1'
});
const mistral = new openai_1.OpenAI({
    apiKey: process.env.MISTRAL_API_KEY || process.env.NGC_API_KEY || 'nvapi-dummy',
    baseURL: process.env.MISTRAL_BASE_URL || 'http://localhost:8000/v1'
});
const wandb = new openai_1.OpenAI({
    apiKey: process.env.WANDB_API_KEY || 'wandb-dummy',
    baseURL: process.env.WANDB_BASE_URL || 'https://api.inference.wandb.ai/v1'
});
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'gemini-dummy-key');
// A robust AI service mapping to Agent 3's strict requirements
class AIService {
    /**
     * Universal wrapper for OpenAI calls to encapsulate Reliability Logic (Retries, Timeouts, Fallbacks)
     */
    static async executeWithReliability(operation, retries = 2, timeoutMs = 15000, fallback) {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI Request Timeout')), timeoutMs));
        for (let attempt = 1; attempt <= retries + 1; attempt++) {
            try {
                // Race the openai call against the 15s hard timeout
                return await Promise.race([operation(), timeoutPromise]);
            }
            catch (error) {
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
    static async generateResponse(conversationId, userMessage) {
        const conversation = await prisma_1.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                BusinessProfile: {
                    include: { ConversationRules: { where: { is_active: true } } }
                },
                Messages: { orderBy: { created_at: 'asc' }, take: 10 }
            }
        });
        if (!conversation)
            return "I cannot find the context for this chat.";
        const bp = conversation.BusinessProfile;
        const rules = bp.ConversationRules.map((r) => r.rule_type + ': ' + JSON.stringify(r.parameters)).join('\n');
        // Build tone instruction
        const toneMap = {
            formal: 'Use a polished, professional tone. Speak like a senior consultant.',
            casual: 'Use a friendly, conversational tone. Speak like a helpful colleague.',
            persuasive: 'Use a confident, persuasive tone. Apply urgency and scarcity naturally.',
            professional: 'Use a balanced professional tone that is warm but authoritative.'
        };
        const toneInstruction = toneMap[bp.chatbot_tone || 'professional'] || toneMap.professional;
        // Build qualification mode instruction
        const qualMap = {
            strict: 'Be very selective. Only push for a call if the lead shows strong buying signals (budget, urgency, authority).',
            balanced: 'Balance value-building with qualification. Gently probe for readiness without being pushy.',
            relaxed: 'Focus on building rapport and trust first. Collect contact info naturally without heavy qualification.'
        };
        const qualInstruction = qualMap[bp.qualification_mode || 'balanced'] || qualMap.balanced;
        // Build custom questions instruction
        let customQuestionsBlock = '';
        if (bp.custom_questions && Array.isArray(bp.custom_questions) && bp.custom_questions.length > 0) {
            const qs = bp.custom_questions.map((q, i) => `${i + 1}. ${q.question} (type: ${q.type})`);
            customQuestionsBlock = `\nCUSTOM QUESTIONS TO WEAVE INTO CONVERSATION (ask naturally, not all at once):\n${qs.join('\n')}`;
        }
        // Build lead fields instruction
        let fieldsBlock = '';
        if (bp.lead_fields_config && typeof bp.lead_fields_config === 'object') {
            const cfg = bp.lead_fields_config;
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
        const messages = conversation.Messages.map((m) => ({
            role: m.sender === 'USER' ? 'user' : 'assistant',
            content: m.content
        }));
        messages.push({ role: 'user', content: userMessage });
        const operation = async () => {
            const hasNvidia = (process.env.NGC_API_KEY && process.env.NGC_API_KEY.startsWith('nvapi-')) ||
                (process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY.startsWith('nvapi-'));
            if (hasNvidia) {
                try {
                    console.log("[AI Service] Routing conversation response to deepseek-ai/deepseek-v4-pro via NVIDIA NIM...");
                    const response = await deepseek.chat.completions.create({
                        model: "deepseek-ai/deepseek-v4-pro",
                        messages: [{ role: "system", content: systemPrompt }, ...messages],
                        temperature: 0.7
                    });
                    return response.choices[0].message.content || "I understand. Can you elaborate on your current situation?";
                }
                catch (err) {
                    console.warn("[AI Service Warn] DeepSeek v4 Pro call failed, trying Llama-3.3-70b on NVIDIA NIM:", err.message);
                    try {
                        const response = await deepseek.chat.completions.create({
                            model: "meta/llama-3.3-70b-instruct",
                            messages: [{ role: "system", content: systemPrompt }, ...messages],
                            temperature: 0.7
                        });
                        return response.choices[0].message.content || "I understand. Can you elaborate on your current situation?";
                    }
                    catch (llamaErr) {
                        console.error("[AI Service Error] Llama-3.3-70b fallback on NVIDIA NIM also failed, falling back to OpenAI/Gemini:", llamaErr.message);
                    }
                }
            }
            if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-dummy-key') {
                console.log("[AI Service] Routing conversation response to OpenAI gpt-4o-mini...");
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "system", content: systemPrompt }, ...messages],
                    temperature: 0.7
                });
                return response.choices[0].message.content || "I understand. Can you elaborate on your current situation?";
            }
            console.log("[AI Service] Routing conversation response to Gemini fallback...");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const chat = model.startChat({
                history: messages.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))
            });
            const result = await chat.sendMessage(systemPrompt + "\n\nUser: " + userMessage);
            return result.response.text() || "I understand. Can you elaborate on your current situation?";
        };
        return await this.executeWithReliability(operation, 2, 30000, "We're experiencing heavy traffic, but I want to make sure I understand your needs perfectly.");
    }
    /**
     * Deep multi-dimensional lead analysis engine.
     * Analyzes behavioral signals, psychological indicators, and produces business-friendly scoring.
     */
    static async analyzeAndScore(conversationId, userMessage) {
        const fallbackScores = {
            urgency_score: 0,
            authority_score: 0,
            budget_score: 0,
            objection_score: 0,
            revenue_probability_score: 0,
            signals: ["fallback_triggered"]
        };
        // Fetch full conversation context for deep analysis
        const conversation = await prisma_1.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                BusinessProfile: true,
                Messages: { orderBy: { created_at: 'asc' }, take: 20 }
            }
        });
        if (!conversation)
            return fallbackScores;
        const transcript = conversation.Messages.map((m) => `${m.sender}: ${m.content}`).join('\n');
        const bp = conversation.BusinessProfile;
        const operation = async () => {
            let client = openai;
            let model = "gpt-4o-mini";
            const hasNvidia = (process.env.NGC_API_KEY && process.env.NGC_API_KEY.startsWith('nvapi-')) ||
                (process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY.startsWith('nvapi-'));
            if (hasNvidia) {
                console.log("[AI Service] Routing lead analysis to deepseek-ai/deepseek-v4-pro via NVIDIA NIM...");
                client = deepseek;
                model = "deepseek-ai/deepseek-v4-pro";
            }
            else {
                console.log("[AI Service] Routing lead analysis to OpenAI gpt-4o-mini...");
            }
            const options = {
                model: model,
                messages: [
                    {
                        role: "system",
                        content: `You are the Chief Revenue Intelligence Agent for ${bp.company_name} (${bp.industry || 'software'}).
You act as a hybrid of Elite Sales Setter, Elite Sales Closer, Revenue Strategist, Lead Qualifier, and Business Analyst.

Business context: ${bp.business_description || 'SaaS product'}.
Pricing: ${bp.pricing_range || 'Not specified'}.

Analyze the FULL conversation transcript below. Apply deep behavioral psychology and consultative closing principles.

Evaluate these dimensions:
1. Intent Level (0-100): How serious is the lead? Exploring vs ready to buy.
2. Budget Score (0-100): Inferred capability based on roles, sizing, or direct mention.
3. Urgency Score (0-100): Immediate need vs long-term explorer.
4. Authority Score (0-100): Decision maker capability.
5. Objection Score (0-100): Severity of unresolved objections.
6. Fit Score (0-100): Overall ICP fit.
7. Lead Category: COLD, WARM, or HOT.

Produce a JSON response with EXACTLY this structure:
{
  "intent_score": <0-100>,
  "budget_score": <0-100>,
  "urgency_score": <0-100>,
  "authority_score": <0-100>,
  "objection_score": <0-100>,
  "fit_score": <0-100>,
  "conversion_probability": <0-100>,
  "lead_value_estimate": <dollar amount based on pricing context>,
  "qualification_level": "HOT" | "WARM" | "COLD",
  "summary": "<1-2 sentence lead summary in simple business language>",
  "explanation": "<2-3 sentence explanation of WHY this lead is categorized this way, in plain English>",
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
                temperature: 0.2
            };
            if (client === openai) {
                options.response_format = { type: "json_object" };
            }
            else {
                options.messages[0].content += "\n\nCRITICAL: Output raw JSON only. Do not enclose in markdown blocks. No other text.";
            }
            let response;
            try {
                const res = await client.chat.completions.create(options);
                response = res;
            }
            catch (err) {
                if (hasNvidia && model === "deepseek-ai/deepseek-v4-pro") {
                    console.warn("[AI Service Warn] DeepSeek v4 Pro analysis failed, trying Llama-3.3-70b on NVIDIA NIM:", err.message);
                    options.model = "meta/llama-3.3-70b-instruct";
                    const res = await client.chat.completions.create(options);
                    response = res;
                }
                else {
                    throw err;
                }
            }
            let content = (response.choices[0].message.content || "{}").trim();
            if (content.startsWith("```")) {
                content = content.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            }
            const parsed = JSON.parse(content);
            // Ensure revenue_probability_score for backward compat with Conversation model
            const revenue_probability_score = parsed.conversion_probability || Math.max(0, ((parsed.urgency_score || 0) * 0.3) +
                ((parsed.authority_score || 0) * 0.3) +
                ((parsed.budget_score || 0) * 0.4) -
                ((parsed.objection_score || 0) * 0.2));
            return {
                ...parsed,
                revenue_probability_score
            };
        };
        const scores = await this.executeWithReliability(operation, 2, 45000, fallbackScores);
        // Update Conversation scores (backward compatible)
        await prisma_1.prisma.conversation.update({
            where: { id: conversationId },
            data: {
                urgency_score: { increment: Math.floor((scores.urgency_score || 0) / 10) }, // Scale to original 1-10 range in DB
                authority_score: { increment: Math.floor((scores.authority_score || 0) / 5) },
                budget_score: { increment: Math.floor((scores.budget_score || 0) / 10) }, // Scale to original 1-10 range in DB
                objection_score: { increment: Math.floor((scores.objection_score || 0) / 5) },
                revenue_probability_score: scores.revenue_probability_score,
                raw_signals: scores.buying_signals
            }
        });
        // Auto-trigger Lead Promotion Logic with deep intelligence data
        const isHighOrHot = scores.qualification_level === 'HIGH' || scores.qualification_level === 'HOT';
        if (scores.conversion_probability >= 40 || isHighOrHot || scores.buying_signals?.includes("pricing")) {
            await prisma_1.prisma.conversation.update({
                where: { id: conversationId },
                data: { status: 'QUALIFIED' }
            });
            const lead = await prisma_1.prisma.lead.upsert({
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
                    qualification_level: scores.qualification_level || 'COLD',
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
                    qualification_level: scores.qualification_level || 'COLD',
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
    static async generateFollowUp(leadId, companyName, conversationId) {
        const existing = await prisma_1.prisma.followUp.findFirst({ where: { lead_id: leadId } });
        if (existing)
            return; // Prevent spamming if already generated
        const msgs = await prisma_1.prisma.message.findMany({
            where: { conversation_id: conversationId },
            orderBy: { created_at: 'asc' },
            take: 20
        });
        const transcript = msgs.map((m) => `${m.sender}: ${m.content}`).join('\n');
        const prompt = `You are the elite sales director for ${companyName}. 
Based on this chat transcript, write a highly personalized, high-converting follow-up email/SMS to this prospect.
Focus on their specific pain points. End with a soft-pressure CTA (e.g., "Are you free Tuesday at 2pm for 15 mins?").
Keep it under 3 short paragraphs.
TRANSCRIPT:
${transcript}`;
        let content = "Hey! Following up on our chat. Let me know when you're free for a quick call.";
        try {
            let client = openai;
            let model = "gpt-4o-mini";
            if (process.env.WANDB_API_KEY && process.env.WANDB_API_KEY !== 'your_wandb_api_key_here') {
                client = wandb;
                model = process.env.WANDB_MODEL || "Qwen/Qwen3-Coder-480B-A35B-Instruct";
            }
            else if (process.env.MISTRAL_API_KEY) {
                client = mistral;
                model = "mistralai/mistral-medium-3.5-128b";
            }
            const response = await client.chat.completions.create({
                model: model,
                messages: [{ role: "system", content: prompt }]
            });
            content = response.choices[0].message.content || content;
        }
        catch (e) {
            console.error("AI failed:", e);
        }
        try {
            await prisma_1.prisma.followUp.create({
                data: {
                    lead_id: leadId,
                    content,
                    scheduled_for: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                    status: "DRAFT"
                }
            });
        }
        catch (e) {
            console.error("Prisma error:", e);
        }
    }
}
exports.AIService = AIService;
