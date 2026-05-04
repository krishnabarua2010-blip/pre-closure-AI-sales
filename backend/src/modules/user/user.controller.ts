import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../config/prisma';

export class UserController {
  static async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user;
      if (!user) {
        return reply.code(401).send({ error: 'User not found' });
      }

      // Return consistent fields as requested
      return reply.send({
        id: user.id,
        email: user.email,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
      });
    } catch (error) {
      console.error("🔥 ME ERROR:", error);
      return reply.code(500).send({ error: 'Failed to fetch user' });
    }
  }
}
