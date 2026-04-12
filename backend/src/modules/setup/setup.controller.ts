import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';

export class SetupController {

  /**
   * GET /setup/config
   * Returns all current business config for the settings UI.
   */
  static async getConfig(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bp = user?.BusinessProfiles?.[0];
      if (!bp) return reply.code(404).send({ error: 'No business profile found. Complete onboarding first.' });

      const profile = await prisma.businessProfile.findUnique({
        where: { id: bp.id },
        select: {
          id: true,
          company_name: true,
          industry: true,
          slug: true,
          business_description: true,
          ideal_customer: true,
          services_offered: true,
          pricing_range: true,
          common_objections: true,
          selling_points: true,
          target_audience: true,
          chatbot_tone: true,
          qualification_mode: true,
          lead_fields_config: true,
          custom_questions: true,
        }
      });

      return reply.send(profile);
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * PUT /setup/business-context
   * Saves the 7 business context fields.
   */
  static async updateBusinessContext(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bp = user?.BusinessProfiles?.[0];
      if (!bp) return reply.code(404).send({ error: 'No business profile found.' });

      const {
        business_description,
        ideal_customer,
        services_offered,
        pricing_range,
        common_objections,
        selling_points,
        target_audience,
        company_name,
        industry,
      } = request.body as any;

      const updated = await prisma.businessProfile.update({
        where: { id: bp.id },
        data: {
          ...(business_description !== undefined && { business_description }),
          ...(ideal_customer !== undefined && { ideal_customer }),
          ...(services_offered !== undefined && { services_offered }),
          ...(pricing_range !== undefined && { pricing_range }),
          ...(common_objections !== undefined && { common_objections }),
          ...(selling_points !== undefined && { selling_points }),
          ...(target_audience !== undefined && { target_audience }),
          ...(company_name !== undefined && { company_name }),
          ...(industry !== undefined && { industry }),
        }
      });

      return reply.send({ message: 'Business context updated.', profile: updated });
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * PUT /setup/chatbot-config
   * Saves chatbot tone, qualification mode, lead field toggles, and custom questions.
   */
  static async updateChatbotConfig(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bp = user?.BusinessProfiles?.[0];
      if (!bp) return reply.code(404).send({ error: 'No business profile found.' });

      const {
        chatbot_tone,
        qualification_mode,
        lead_fields_config,
        custom_questions,
      } = request.body as any;

      const updated = await prisma.businessProfile.update({
        where: { id: bp.id },
        data: {
          ...(chatbot_tone !== undefined && { chatbot_tone }),
          ...(qualification_mode !== undefined && { qualification_mode }),
          ...(lead_fields_config !== undefined && { lead_fields_config }),
          ...(custom_questions !== undefined && { custom_questions }),
        }
      });

      return reply.send({ message: 'Chatbot configuration updated.', profile: updated });
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
