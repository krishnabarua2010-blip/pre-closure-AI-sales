import { FastifyInstance } from 'fastify';
import { DiscoveryController } from './discovery.controller';
import { authenticate } from '../../middlewares/auth';
import { checkDailyLeadCap, enforceCooldown } from '../../middlewares/usage';

export default async function discoveryRoutes(server: FastifyInstance) {
  server.addHook('preValidation', authenticate);

  // Lead generation with daily caps + cooldown
  server.post('/generate', { preHandler: [enforceCooldown, checkDailyLeadCap] }, DiscoveryController.generateLeads);

  // Outreach management
  server.post('/outreach', DiscoveryController.generateOutreach);
  server.post('/deploy', { preHandler: [enforceCooldown] }, DiscoveryController.deployOutreach);

  // Follow-up sequence
  server.get('/follow-ups/:leadId', DiscoveryController.getFollowUps);

  // CRM pipeline status updates
  server.post('/lead-status', DiscoveryController.updateLeadStatus);

  // Usage stats
  server.get('/usage', DiscoveryController.getUsageStats);
}
