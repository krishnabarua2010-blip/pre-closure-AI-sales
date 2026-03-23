import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';
import { initConversationSchema, aiMessageSchema } from './conversation.schema';

export class ConversationController {
  
  static async initPublicConversation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { slug } = initConversationSchema.parse(request.params);
      
      const businessProfile = await prisma.businessProfile.findUnique({
        where: { slug },
        include: { User: true }
      });

      if (!businessProfile) {
        return reply.code(404).send({ error: 'Business profile not found' });
      }

      // Check if user has active limits
      if (businessProfile.User.messages_used >= businessProfile.User.message_limit) {
        return reply.code(402).send({ error: 'Assistant is temporarily unavailable.' });
      }

      // Create a fresh conversation bounded to this anonymous user session
      const conversation = await prisma.conversation.create({
        data: {
          business_profile_id: businessProfile.id,
          user_id: businessProfile.user_id, // Owner's user_id
          status: 'ACTIVE'
        }
      });

      return reply.send({
        conversation_id: conversation.id,
        public_token: businessProfile.public_token,
        assistant_name: businessProfile.company_name
      });

    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation failed', details: error.errors });
      }
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async handleAiMessage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsedBody = aiMessageSchema.parse(request.body);
      
      // 1. Strict validation of conversation AND public_token
      const conversation = await prisma.conversation.findUnique({
        where: { id: parsedBody.conversation_id },
        include: { 
          BusinessProfile: { include: { User: true } } 
        }
      });

      if (!conversation || conversation.BusinessProfile.public_token !== parsedBody.public_token) {
        return reply.code(401).send({ error: 'Unauthorized conversation access' });
      }

      const owner = conversation.BusinessProfile.User;

      // 2. Enforce limits on the Owner account
      if (owner.messages_used >= owner.message_limit) {
        return reply.code(402).send({ error: 'Assistant limits reached.' });
      }

      // Save user message
      await prisma.message.create({
        data: {
          conversation_id: conversation.id,
          sender: 'USER',
          content: parsedBody.message
        }
      });

      // Increment owner's usage counter
      await prisma.user.update({
        where: { id: owner.id },
        data: { messages_used: { increment: 1 } }
      });

      // --- DELEGATING TO AI LOGIC (Agent 3) ---
      
      const { AIService } = await import('../ai/ai.service');
      const aiResponseContent = await AIService.generateResponse(conversation.id, parsedBody.message);

      // Save AI Response
      await prisma.message.create({
        data: {
          conversation_id: conversation.id,
          sender: 'AI',
          content: aiResponseContent
        }
      });

      // Execute deep AI scoring and intent extraction in the background
      setImmediate(async () => {
        try {
          await AIService.analyzeAndScore(conversation.id, parsedBody.message);
        } catch (bgError) {
          console.error("Background AI Job Failed: ", bgError);
        }
      });

      return reply.send({
        reply: aiResponseContent,
        conversation_id: conversation.id
      });

    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation failed', details: error.errors });
      }
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
