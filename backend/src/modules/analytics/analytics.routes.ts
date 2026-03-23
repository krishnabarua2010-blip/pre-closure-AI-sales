import { FastifyInstance } from 'fastify';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth';
import { trialFeatureLimit } from '../../middlewares/planAccess';

export default async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get('/funnel_health', { preHandler: [authenticate, trialFeatureLimit] }, AnalyticsController.getFunnelHealth);
  fastify.get('/revenue_metrics', { preHandler: [authenticate, trialFeatureLimit] }, AnalyticsController.getRevenueMetrics);
  fastify.get('/leads', { preHandler: [authenticate] }, AnalyticsController.getLeads);
}
