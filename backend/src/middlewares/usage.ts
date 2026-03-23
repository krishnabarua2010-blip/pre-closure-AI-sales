import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Middleware that checks if the authenticated user has hit their plan's message limit.
 * MUST be run after the authenticate middleware.
 */
export const checkUsageLimit = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user;
  if (!user) {
    return reply.code(401).send({ error: 'Unauthorized: User not identified' });
  }

  if (user.messages_used >= user.message_limit) {
    return reply.code(402).send({
      error: 'Payment Required: Message limit reached. Please upgrade your plan.',
      current_usage: user.messages_used,
      limit: user.message_limit
    });
  }
};
