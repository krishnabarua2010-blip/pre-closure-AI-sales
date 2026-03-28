import { FastifyInstance } from 'fastify';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth';
import { requireGrowthPlan } from '../../middlewares/planAccess';

export default async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get('/funnel_health', { preHandler: [authenticate, requireGrowthPlan] }, AnalyticsController.getFunnelHealth);
  fastify.get('/revenue_metrics', { preHandler: [authenticate, requireGrowthPlan] }, AnalyticsController.getRevenueMetrics);
  fastify.get('/leads', { preHandler: [authenticate, requireGrowthPlan] }, AnalyticsController.getLeads);
}
