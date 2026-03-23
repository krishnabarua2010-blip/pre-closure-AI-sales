import { FastifyInstance } from 'fastify';
import { ConversationController } from './conversation.controller';

export default async function conversationRoutes(fastify: FastifyInstance) {
  fastify.post('/init/:slug', ConversationController.initPublicConversation);
  fastify.post('/ai_message', ConversationController.handleAiMessage);
}
