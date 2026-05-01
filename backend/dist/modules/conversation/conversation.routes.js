"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = conversationRoutes;
const conversation_controller_1 = require("./conversation.controller");
async function conversationRoutes(fastify) {
    fastify.post('/init/:slug', conversation_controller_1.ConversationController.initPublicConversation);
    fastify.post('/ai_message', conversation_controller_1.ConversationController.handleAiMessage);
}
