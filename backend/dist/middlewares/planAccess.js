"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialFeatureLimit = exports.requireGrowthPlan = void 0;
/**
 * Middleware to strictly require GROWTH plan for Premium features
 * (e.g. Generate follow ups, full proposal generation, execution of advisor actions)
 */
const requireGrowthPlan = async (request, reply) => {
    const user = request.user;
    if (!user) {
        return reply.code(401).send({ error: 'Unauthorized: User missing' });
    }
    // @ts-ignore: Workspace typescript resolves to root Prisma client instead of backend's Prisma client
    if (user.plan === 'FREE') {
        return reply.code(403).send({
            error: 'Upgrade required',
            message: 'This feature is only available on the Growth plan.',
            // @ts-ignore
            upgrade_stats: `You've generated ${user.messages_used} interactions. Upgrade to close these leads effectively.`
        });
    }
};
exports.requireGrowthPlan = requireGrowthPlan;
/**
 * Middleware for features that have a limited trial mode.
 * e.g. Analytics and Advisor Chat
 * Trial users (STARTER) get basic view but can't execute actions or see deep metrics.
 */
const trialFeatureLimit = async (request, reply) => {
    const user = request.user;
    if (!user) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }
    // Inject a readOnly flag into the request context we can use later in the controller
    // Since we can't easily modify fastify types dynamically here without declaring,
    // we attach it directly if they are not growth.
    request.headers['x-is-trial-mode'] = user.plan === 'FREE' ? 'true' : 'false';
};
exports.trialFeatureLimit = trialFeatureLimit;
