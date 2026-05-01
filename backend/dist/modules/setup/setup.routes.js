"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRoutes;
const setup_controller_1 = require("./setup.controller");
const auth_1 = require("../../middlewares/auth");
async function setupRoutes(fastify) {
    fastify.get('/config', { preHandler: [auth_1.authenticate] }, setup_controller_1.SetupController.getConfig);
    fastify.put('/business-context', { preHandler: [auth_1.authenticate] }, setup_controller_1.SetupController.updateBusinessContext);
    fastify.put('/chatbot-config', { preHandler: [auth_1.authenticate] }, setup_controller_1.SetupController.updateChatbotConfig);
}
