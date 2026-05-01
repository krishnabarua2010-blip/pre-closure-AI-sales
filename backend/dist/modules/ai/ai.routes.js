"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = aiRoutes;
const ai_controller_1 = require("./ai.controller");
const auth_1 = require("../../middlewares/auth");
const usage_1 = require("../../middlewares/usage");
const planAccess_1 = require("../../middlewares/planAccess");
async function aiRoutes(fastify) {
    fastify.post('/generate_followups', { preHandler: [auth_1.authenticate, usage_1.checkUsageLimit, planAccess_1.requireGrowthPlan] }, ai_controller_1.AIController.generateFollowUp);
    fastify.post('/generate_proposal', { preHandler: [auth_1.authenticate, usage_1.checkUsageLimit, planAccess_1.requireGrowthPlan] }, ai_controller_1.AIController.generateProposal);
}
