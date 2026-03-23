import { FastifyInstance } from 'fastify';
import { AIController } from './ai.controller';
import { authenticate } from '../../middlewares/auth';
import { checkUsageLimit } from '../../middlewares/usage';
import { requireGrowthPlan } from '../../middlewares/planAccess';

export default async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/generate_followups', { preHandler: [authenticate, checkUsageLimit, requireGrowthPlan] }, AIController.generateFollowUp);
  fastify.post('/generate_proposal', { preHandler: [authenticate, checkUsageLimit, requireGrowthPlan] }, AIController.generateProposal);
}
