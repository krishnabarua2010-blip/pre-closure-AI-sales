import { FastifyInstance } from 'fastify';
import { AdvisorController } from './advisor.controller';
import { authenticate } from '../../middlewares/auth';
import { trialFeatureLimit, requireGrowthPlan } from '../../middlewares/planAccess';

export default async function advisorRoutes(fastify: FastifyInstance) {
  // Suggest action can be done internally by AI, but if an API calls it, we need auth.
  fastify.post('/suggest_action', { preHandler: [authenticate, requireGrowthPlan] }, AdvisorController.suggestAction);
  
  // Executing action requires growth plan
  fastify.post('/execute_action', { preHandler: [authenticate, requireGrowthPlan] }, AdvisorController.confirmAction);
  
  // Chat is limited for trial users
  fastify.post('/chat', { preHandler: [authenticate, trialFeatureLimit] }, AdvisorController.chat);

  // Deep Scan
  fastify.post('/scan', { preHandler: [authenticate, requireGrowthPlan] }, AdvisorController.scan);

  // Get pending actions
  fastify.get('/actions', { preHandler: [authenticate] }, AdvisorController.getActions);
}
