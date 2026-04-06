import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';

export class WidgetController {

  /**
   * POST /widget/init
   * Body: { slug: string }
   * Creates a conversation session for the widget visitor.
   */
  static async initSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { slug } = request.body as { slug: string };

      if (!slug || typeof slug !== 'string') {
        return reply.code(400).send({ error: 'slug is required' });
      }

      const businessProfile = await prisma.businessProfile.findUnique({
        where: { slug },
        include: { User: true }
      });

      if (!businessProfile) {
        return reply.code(404).send({ error: 'Business not found' });
      }

      if (businessProfile.User.messages_used >= businessProfile.User.message_limit) {
        return reply.code(402).send({ error: 'Assistant is temporarily unavailable.' });
      }

      const conversation = await prisma.conversation.create({
        data: {
          business_profile_id: businessProfile.id,
          user_id: businessProfile.user_id,
          status: 'ACTIVE'
        }
      });

      return reply.send({
        conversationId: conversation.id,
        publicToken: businessProfile.public_token,
        assistantName: businessProfile.company_name
      });

    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * POST /widget/chat
   * Body: { conversationId: number, publicToken: string, message: string }
   * Sends a user message and returns the AI reply.
   */
  static async chat(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { conversationId, publicToken, message } = request.body as {
        conversationId: number;
        publicToken: string;
        message: string;
      };

      if (!conversationId || !publicToken || !message) {
        return reply.code(400).send({ error: 'conversationId, publicToken, and message are required' });
      }

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          BusinessProfile: { include: { User: true } }
        }
      });

      if (!conversation || conversation.BusinessProfile.public_token !== publicToken) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const owner = conversation.BusinessProfile.User;

      if (owner.messages_used >= owner.message_limit) {
        return reply.code(402).send({ error: 'Message limit reached.' });
      }

      // Save user message
      await prisma.message.create({
        data: {
          conversation_id: conversation.id,
          sender: 'USER',
          content: message
        }
      });

      // Increment usage
      await prisma.user.update({
        where: { id: owner.id },
        data: { messages_used: { increment: 1 } }
      });

      // Generate AI response
      const { AIService } = await import('../ai/ai.service');
      const aiReply = await AIService.generateResponse(conversation.id, message);

      // Save AI response
      await prisma.message.create({
        data: {
          conversation_id: conversation.id,
          sender: 'AI',
          content: aiReply
        }
      });

      // Background scoring + lead capture
      setImmediate(async () => {
        try {
          await AIService.analyzeAndScore(conversation.id, message);
        } catch (err) {
          console.error('Widget background scoring error:', err);
        }
      });

      return reply.send({
        reply: aiReply,
        conversationId: conversation.id
      });

    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
