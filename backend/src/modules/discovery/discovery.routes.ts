import { FastifyInstance } from 'fastify';
import { DiscoveryController } from './discovery.controller';
import { authenticate } from '../../middlewares/auth';

export default async function discoveryRoutes(server: FastifyInstance) {
  server.addHook('preValidation', authenticate);

  server.post('/generate', DiscoveryController.generateLeads);
  server.post('/outreach', DiscoveryController.generateOutreach);
  server.post('/deploy', DiscoveryController.deployOutreach);
}
