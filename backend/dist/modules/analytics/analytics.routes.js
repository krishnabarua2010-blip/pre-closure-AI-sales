"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = analyticsRoutes;
const analytics_controller_1 = require("./analytics.controller");
const auth_1 = require("../../middlewares/auth");
const planAccess_1 = require("../../middlewares/planAccess");
async function analyticsRoutes(fastify) {
    fastify.get('/funnel_health', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, analytics_controller_1.AnalyticsController.getFunnelHealth);
    fastify.get('/revenue_metrics', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, analytics_controller_1.AnalyticsController.getRevenueMetrics);
    fastify.get('/leads', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, analytics_controller_1.AnalyticsController.getLeads);
    fastify.post('/track', analytics_controller_1.AnalyticsController.trackEvent);
    fastify.get('/lead-intelligence/:leadId', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, analytics_controller_1.AnalyticsController.getLeadIntelligence);
}
