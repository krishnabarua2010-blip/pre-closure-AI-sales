import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

export interface DecodedUser {
  id: number;
}

// Extend fastify request with user
declare module 'fastify' {
  interface FastifyRequest {
    user?: Awaited<ReturnType<typeof prisma.user.findUnique>>;
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }
    const secret = process.env.JWT_SECRET;
    
    const decoded = jwt.verify(token, secret) as DecodedUser;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { BusinessProfiles: true }
    });

    if (!user) {
      return reply.code(401).send({ error: 'Unauthorized: User not found' });
    }

    request.user = user;
  } catch (error) {
    return reply.code(401).send({ error: 'Unauthorized: Token is invalid or expired' });
  }
};
