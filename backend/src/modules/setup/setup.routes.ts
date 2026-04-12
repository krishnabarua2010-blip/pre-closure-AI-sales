import { FastifyInstance } from 'fastify';
import { SetupController } from './setup.controller';
import { authenticate } from '../../middlewares/auth';

export default async function setupRoutes(fastify: FastifyInstance) {
  fastify.get('/config', { preHandler: [authenticate] }, SetupController.getConfig);
  fastify.put('/business-context', { preHandler: [authenticate] }, SetupController.updateBusinessContext);
  fastify.put('/chatbot-config', { preHandler: [authenticate] }, SetupController.updateChatbotConfig);
}
