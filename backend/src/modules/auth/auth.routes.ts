import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', AuthController.signup);
  fastify.post('/login', AuthController.login);
  fastify.post('/guest', AuthController.guest);
}
