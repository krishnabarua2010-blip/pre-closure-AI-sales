import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';
import { z } from 'zod';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
});

const generateSchema = z.object({
  lead_id: z.number().int().positive()
});

export class AIController {
  
  static async generateFollowUp(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { lead_id } = generateSchema.parse(request.body);
      const user = request.user!;

      const lead = await prisma.lead.findUnique({
        where: { id: lead_id },
        include: { Conversation: { include: { Messages: true } } }
      });

      // Multi-tenancy check
      if (!lead || lead.Conversation?.user_id !== user.id) {
        return reply.code(404).send({ error: 'Lead not found or unauthorized' });
      }

      // BACKGROUND ASYNC PROCESSING to prevent blocking
      setImmediate(async () => {
        try {
          const messages = lead.Conversation.Messages.map(m => `${m.sender}: ${m.content}`).join('\n');
          
          const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
              {
                role: "system",
                content: "You are an expert sales closer. Generate a hyper-personalized follow-up email using the lead's conversation history, urgency score, and authority signals. Respond with ONLY the email body."
              },
              { role: "user", content: `Conversation History:\n${messages}\n\nScores: Urgency: ${lead.Conversation.urgency_score}, Authority: ${lead.Conversation.authority_score}` }
            ]
          });

          await prisma.followUp.create({
            data: {
              lead_id: lead.id,
              content: response.choices[0].message.content || 'Failed to generate',
              scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next day
            }
          });
        } catch (e) {
          console.error("Failed to generate follow up in background", e);
        }
      });

      return reply.send({ message: 'Follow-up generation started in background' });

    } catch (error: any) {
      if (error.name === 'ZodError') return reply.code(400).send({ error: 'Validation failed', details: error.errors });
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async generateProposal(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { lead_id } = generateSchema.parse(request.body);
      const user = request.user!;

      const lead = await prisma.lead.findUnique({
        where: { id: lead_id },
        include: { Conversation: { include: { Messages: true } } }
      });

      if (!lead || lead.Conversation?.user_id !== user.id) {
        return reply.code(404).send({ error: 'Lead not found or unauthorized' });
      }

      setImmediate(async () => {
         try {
           const messages = lead.Conversation.Messages.map(m => `${m.sender}: ${m.content}`).join('\n');
           const response = await openai.chat.completions.create({
             model: "gpt-4-turbo-preview",
             messages: [
               { role: "system", content: "You are generating a sales proposal based on the conversation." },
               { role: "user", content: `Conversation:\n${messages}\n\nDraft a proposal.` }
             ]
           });

           await prisma.proposal.create({
             data: {
               lead_id: lead.id,
               content: response.choices[0].message.content || 'Failed to generate'
             }
           });
         } catch (e) {
           console.error("Proposal bg job failed", e);
         }
      });

      return reply.send({ message: 'Proposal generation started in background' });

    } catch (error: any) {
      if (error.name === 'ZodError') return reply.code(400).send({ error: 'Validation failed', details: error.errors });
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
