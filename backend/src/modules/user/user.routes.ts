import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller';
import { authenticate } from '../../middlewares/auth';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/me', { preHandler: [authenticate] }, UserController.me);
}
