"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = advisorRoutes;
const advisor_controller_1 = require("./advisor.controller");
const auth_1 = require("../../middlewares/auth");
const planAccess_1 = require("../../middlewares/planAccess");
async function advisorRoutes(fastify) {
    // Suggest action can be done internally by AI, but if an API calls it, we need auth.
    fastify.post('/suggest_action', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, advisor_controller_1.AdvisorController.suggestAction);
    // Executing action requires growth plan
    fastify.post('/execute_action', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, advisor_controller_1.AdvisorController.confirmAction);
    // Chat is limited for trial users
    fastify.post('/chat', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, advisor_controller_1.AdvisorController.chat);
    // Deep Scan
    fastify.post('/scan', { preHandler: [auth_1.authenticate, planAccess_1.requireGrowthPlan] }, advisor_controller_1.AdvisorController.scan);
    // Get pending actions
    fastify.get('/actions', { preHandler: [auth_1.authenticate] }, advisor_controller_1.AdvisorController.getActions);
}
