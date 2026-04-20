import { FastifyInstance } from 'fastify';
import { DiscoveryController } from './discovery.controller';
import { verifyJwt } from '../../middlewares/auth.middleware';

export default async function discoveryRoutes(server: FastifyInstance) {
  server.addHook('preValidation', verifyJwt);

  server.post('/generate', DiscoveryController.generateLeads);
  server.post('/outreach', DiscoveryController.generateOutreach);
}
