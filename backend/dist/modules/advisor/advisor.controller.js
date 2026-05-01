"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvisorController = void 0;
const prisma_1 = require("../../config/prisma");
const zod_1 = require("zod");
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
const actionSchema = zod_1.z.object({
    business_profile_id: zod_1.z.number(),
    action_type: zod_1.z.string(),
    parameters: zod_1.z.any()
});
const confirmSchema = zod_1.z.object({
    action_id: zod_1.z.number(),
    approved: zod_1.z.boolean()
});
class AdvisorController {
    static async suggestAction(request, reply) {
        try {
            const parsed = actionSchema.parse(request.body);
            const user = request.user;
            const businessProfile = await prisma_1.prisma.businessProfile.findFirst({
                where: {
                    id: parsed.business_profile_id,
                    user_id: user.id,
                },
            });
            if (!businessProfile) {
                return reply.code(403).send({ error: "Unauthorized" });
            }
            const action = await prisma_1.prisma.advisorAction.create({
                data: {
                    business_profile_id: parsed.business_profile_id,
                    action_type: parsed.action_type,
                    parameters: parsed.parameters,
                    status: 'PENDING'
                }
            });
            return reply.code(201).send({ message: 'Action suggested and requires confirmation.', action });
        }
        catch (error) {
            if (error.name === 'ZodError')
                return reply.code(400).send({ error: 'Validation failed', details: error.errors });
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    static async confirmAction(request, reply) {
        try {
            const { action_id, approved } = confirmSchema.parse(request.body);
            const user = request.user;
            const action = await prisma_1.prisma.advisorAction.findUnique({
                where: { id: action_id },
                include: { BusinessProfile: true },
            });
            if (!action)
                return reply.code(404).send({ error: 'Action not found' });
            if (action.BusinessProfile.user_id !== user.id) {
                return reply.code(403).send({ error: "Unauthorized" });
            }
            if (!approved) {
                await prisma_1.prisma.advisorAction.update({
                    where: { id: action_id },
                    data: { status: 'REJECTED' }
                });
                return reply.send({ message: 'Action rejected by user.' });
            }
            // Execute Action
            await prisma_1.prisma.conversationRule.create({
                data: {
                    business_profile_id: action.business_profile_id,
                    rule_type: action.action_type,
                    parameters: action.parameters || {},
                    is_active: true
                }
            });
            await prisma_1.prisma.advisorAction.update({
                where: { id: action_id },
                data: { status: 'EXECUTED' }
            });
            return reply.send({ message: 'Action executed and conversation rules updated.' });
        }
        catch (error) {
            if (error.name === 'ZodError')
                return reply.code(400).send({ error: 'Validation failed', details: error.errors });
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    static async chat(request, reply) {
        const isTrial = request.headers['x-is-trial-mode'] === 'true';
        const message = request.body?.message || '';
        const user = request.user;
        if (!message)
            return reply.code(400).send({ error: 'Message payload required' });
        // If trial mode, limit to basic insights.
        if (isTrial) {
            return reply.send({
                reply: "As a Trial user, I can only provide high-level insights. To actively execute optimizations like modifying scripts and saving behavior rules, please upgrade to the GROWTH plan."
            });
        }
        const businessProfile = user?.BusinessProfiles?.[0];
        if (!businessProfile)
            return reply.code(403).send({ error: 'You must complete onboarding to unlock the Advisor.' });
        try {
            const rules = await prisma_1.prisma.conversationRule.findMany({
                where: { business_profile_id: businessProfile.id, is_active: true }
            });
            const systemPrompt = `You are an elite AI Sales Operations Advisor. The user is the CEO.
They are asking you for advice or commanding you to change the behavior of their public AI Sales chatbot.
Current active rules:
${rules.length > 0 ? rules.map((r) => `- ${r.rule_type}: ${JSON.stringify(r.parameters)}`).join('\n') : 'No custom rules active.'}

If the user wants to adjust an existing rule or add a new constraint to their AI agent's behavior (e.g., "always offer 20% off", "stop asking about budget"), you MUST use the 'create_rule' tool to lock it into the system. Wait to use the tool until the user gives a clear instruction. If they just want advice on pipeline health, answer concisely.
Your tone should be authoritative, sharp, and growth-focused. Limit responses to 2-3 sentences max.`;
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "create_rule",
                            description: "Create a new permanent behavioral rule for the public AI agent.",
                            parameters: {
                                type: "object",
                                properties: {
                                    rule_type: { type: "string", description: "A machine key for the rule, e.g., 'offer_discount', 'skip_budget'" },
                                    parameters: { type: "object", description: "JSON parameters. E.g., {\"discount_amount\": \"20%\"}" },
                                    explanation: { type: "string", description: "A short success message to the CEO confirming the rule was applied." }
                                },
                                required: ["rule_type", "parameters", "explanation"]
                            }
                        }
                    }
                ],
                tool_choice: "auto"
            });
            const msg = response.choices[0].message;
            if (msg.tool_calls && msg.tool_calls.length > 0) {
                for (const call of msg.tool_calls) {
                    if (call.type === 'function' && call.function.name === 'create_rule') {
                        const args = JSON.parse(call.function.arguments);
                        await prisma_1.prisma.conversationRule.create({
                            data: {
                                business_profile_id: businessProfile.id,
                                rule_type: args.rule_type,
                                parameters: args.parameters || {},
                                is_active: true
                            }
                        });
                        return reply.send({
                            reply: `**[SYSTEM UPDATED]** ${args.explanation}`,
                            action_executed: true,
                            rule: args.rule_type
                        });
                    }
                }
            }
            return reply.send({ reply: msg.content || "I have analyzed your request." });
        }
        catch (e) {
            console.error("Advisor Error:", e);
            return reply.code(500).send({ error: 'Failed to process intelligence request' });
        }
    }
    static async scan(request, reply) {
        const user = request.user;
        const businessProfile = user?.BusinessProfiles?.[0];
        if (!businessProfile)
            return reply.code(403).send({ error: 'Complete onboarding first' });
        try {
            const leads = await prisma_1.prisma.lead.findMany({
                where: { business_profile_id: businessProfile.id },
                include: { Conversation: { select: { authority_score: true, budget_score: true, revenue_probability_score: true } } }
            });
            const total = leads.length;
            if (total === 0) {
                return reply.send({
                    summary: "No leads yet.",
                    cause: "Your AI agent hasn't interacted with anyone.",
                    recommendation: "Share your chat link to start gathering data."
                });
            }
            const noBudget = leads.filter((l) => l.Conversation?.budget_score < 50).length;
            const lowAuthority = leads.filter((l) => l.Conversation?.authority_score < 50).length;
            const budgetMissRate = Math.round((noBudget / total) * 100) || 0;
            const authorityMissRate = Math.round((lowAuthority / total) * 100) || 0;
            const systemPrompt = `You are a strict AI Revenue Operations Analyst.
Analyze these pipeline metrics and provide a 3-sentence insight:
Total Leads: ${total}
Missing Budget: ${budgetMissRate}%
Low Authority (Not Decision Maker): ${authorityMissRate}%

Respond EXACTLY in this JSON format:
{
  "summary": "1 sentence defining the biggest bottleneck",
  "cause": "1 sentence explaining why it's happening",
  "recommendation": "1 specific actionable command the user can tell their AI agent to fix it"
}`;
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: systemPrompt }],
                max_tokens: 150,
                response_format: { type: "json_object" }
            });
            const parsed = JSON.parse(response.choices[0].message.content || "{}");
            return reply.send(parsed);
        }
        catch (e) {
            console.error("Scan Error:", e);
            return reply.code(500).send({ error: 'Failed to run analysis scan.' });
        }
    }
    static async getActions(request, reply) {
        try {
            const user = request.user;
            const bpId = user?.BusinessProfiles?.[0]?.id;
            if (!bpId)
                return reply.send([]);
            const actions = await prisma_1.prisma.advisorAction.findMany({
                where: { business_profile_id: bpId, status: 'PENDING' }
            });
            return reply.send(actions);
        }
        catch (e) {
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
}
exports.AdvisorController = AdvisorController;
