"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserUsageStats = exports.enforceCooldown = exports.checkDailyEnrichmentCap = exports.checkDailyLeadCap = exports.checkUsageLimit = void 0;
const prisma_1 = require("../config/prisma");
/**
 * PLAN LIMITS — Strict enforcement
 */
const PLAN_LIMITS = {
    FREE: {
        totalLeads: 80,
        totalEnrichments: 40,
        totalMessages: 40,
        totalAiChats: 20,
        dailyLeads: 10,
        dailyEnrichments: 5,
        dailyMessages: 5,
        cooldownMs: 15000, // 15 second cooldown
    },
    GROWTH: {
        totalLeads: 1000,
        totalEnrichments: 500,
        totalMessages: 2000,
        totalAiChats: 500,
        dailyLeads: 100,
        dailyEnrichments: 50,
        dailyMessages: 100,
        cooldownMs: 3000, // 3 second cooldown
    },
    PRO: {
        totalLeads: 10000,
        totalEnrichments: 5000,
        totalMessages: 20000,
        totalAiChats: 5000,
        dailyLeads: 500,
        dailyEnrichments: 250,
        dailyMessages: 500,
        cooldownMs: 1000, // 1 second cooldown
    },
};
// In-memory cooldown tracker (per user)
const lastActionTimestamps = new Map();
/**
 * Check if the authenticated user has hit their plan's message limit.
 */
const checkUsageLimit = async (request, reply) => {
    const user = request.user;
    if (!user) {
        return reply.code(401).send({ error: 'Unauthorized: User not identified' });
    }
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE;
    if (user.messages_used >= limits.totalMessages) {
        return reply.code(402).send({
            error: 'Payment Required: Message limit reached. Please upgrade your plan.',
            current_usage: user.messages_used,
            limit: limits.totalMessages,
        });
    }
};
exports.checkUsageLimit = checkUsageLimit;
/**
 * Check daily cap for lead generation
 */
const checkDailyLeadCap = async (request, reply) => {
    const user = request.user;
    if (!user)
        return reply.code(401).send({ error: 'Unauthorized' });
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE;
    const bp = user.BusinessProfiles?.[0];
    if (!bp)
        return;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayLeadCount = await prisma_1.prisma.lead.count({
        where: {
            business_profile_id: bp.id,
            created_at: { gte: todayStart },
        }
    });
    if (todayLeadCount >= limits.dailyLeads) {
        return reply.code(429).send({
            error: `Daily lead limit reached (${limits.dailyLeads}/day). Try again tomorrow or upgrade your plan.`,
            used: todayLeadCount,
            limit: limits.dailyLeads,
        });
    }
    // Also check total limit
    const totalLeadCount = await prisma_1.prisma.lead.count({
        where: { business_profile_id: bp.id }
    });
    if (totalLeadCount >= limits.totalLeads) {
        return reply.code(402).send({
            error: `Total lead limit reached (${limits.totalLeads}). Upgrade to generate more leads.`,
            used: totalLeadCount,
            limit: limits.totalLeads,
        });
    }
};
exports.checkDailyLeadCap = checkDailyLeadCap;
/**
 * Check daily cap for AI enrichment operations
 */
const checkDailyEnrichmentCap = async (request, reply) => {
    const user = request.user;
    if (!user)
        return reply.code(401).send({ error: 'Unauthorized' });
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE;
    const bp = user.BusinessProfiles?.[0];
    if (!bp)
        return;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    // Count today's enrichments (leads with ai_summary updated today)
    const todayEnrichments = await prisma_1.prisma.lead.count({
        where: {
            business_profile_id: bp.id,
            ai_summary: { not: null },
            created_at: { gte: todayStart },
        }
    });
    if (todayEnrichments >= limits.dailyEnrichments) {
        return reply.code(429).send({
            error: `Daily AI enrichment limit reached (${limits.dailyEnrichments}/day). Upgrade for more.`,
            used: todayEnrichments,
            limit: limits.dailyEnrichments,
        });
    }
};
exports.checkDailyEnrichmentCap = checkDailyEnrichmentCap;
/**
 * Enforce cooldown between heavy actions (lead gen, AI enrichment, outreach)
 * Prevents API cost abuse
 */
const enforceCooldown = async (request, reply) => {
    const user = request.user;
    if (!user)
        return reply.code(401).send({ error: 'Unauthorized' });
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE;
    const lastAction = lastActionTimestamps.get(user.id);
    const now = Date.now();
    if (lastAction && (now - lastAction) < limits.cooldownMs) {
        const waitSecs = Math.ceil((limits.cooldownMs - (now - lastAction)) / 1000);
        return reply.code(429).send({
            error: `Please wait ${waitSecs} seconds before the next action.`,
            cooldown_remaining: waitSecs,
        });
    }
    // Record this action
    lastActionTimestamps.set(user.id, now);
};
exports.enforceCooldown = enforceCooldown;
/**
 * Get usage stats for the current user (for dashboard display)
 */
const getUserUsageStats = async (userId, plan, bpId) => {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [totalLeads, todayLeads, totalMessages] = await Promise.all([
        bpId ? prisma_1.prisma.lead.count({ where: { business_profile_id: bpId } }) : 0,
        bpId ? prisma_1.prisma.lead.count({ where: { business_profile_id: bpId, created_at: { gte: todayStart } } }) : 0,
        prisma_1.prisma.user.findUnique({ where: { id: userId }, select: { messages_used: true } }),
    ]);
    return {
        plan,
        limits,
        usage: {
            totalLeads,
            todayLeads,
            totalMessages: totalMessages?.messages_used || 0,
        },
        remaining: {
            leads: limits.totalLeads - totalLeads,
            dailyLeads: limits.dailyLeads - todayLeads,
            messages: limits.totalMessages - (totalMessages?.messages_used || 0),
        }
    };
};
exports.getUserUsageStats = getUserUsageStats;
