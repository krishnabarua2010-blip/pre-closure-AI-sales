import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';
import { DiscoveryService } from './discovery.service';
import { ResendService } from '../external/resend.service';
import { TwilioService } from '../external/twilio.service';
import { NotificationController } from '../notification/notification.controller';
import { getUserUsageStats } from '../../middlewares/usage';

export class DiscoveryController {

  /**
   * POST /discovery/generate
   * Full pipeline: Discover → Enrich → Score → Outreach → Follow-ups
   */
  static async generateLeads(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile. Complete onboarding first.' });

      const { niche, location, count = 10 } = request.body as any;

      if (!niche || !location) {
        return reply.code(400).send({ error: 'niche and location are required' });
      }

      const results = await DiscoveryService.discoverAndScorePipeline(bpId, niche, location, Math.min(count, 15));

      // Trigger hot lead notifications
      for (const lead of results) {
        if ((lead as any).intent_score >= 70) {
          await NotificationController.triggerHotLeadAlert(
            user.id,
            (lead as any).name || 'Unknown Lead',
            (lead as any).intent_score,
            lead.id
          );
        }
      }

      return reply.send({ success: true, leads: results, count: results.length });
    } catch (e: any) {
      request.log.error(e);
      return reply.code(500).send({ error: 'Failed to generate leads pipeline' });
    }
  }

  /**
   * POST /discovery/outreach
   * Fetch generated outreach for specific leads
   */
  static async generateOutreach(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { leadIds } = request.body as any;
      const outreaches = await prisma.outreach.findMany({
        where: { lead_id: { in: leadIds } }
      });

      // Mark leads as outreach_status = 'GENERATED'
      await prisma.lead.updateMany({
        where: { id: { in: leadIds } },
        data: { outreach_status: 'GENERATED' }
      });

      return reply.send({ success: true, outreaches });
    } catch (e: any) {
      request.log.error(e);
      return reply.code(500).send({ error: 'Failed to generate outreach' });
    }
  }

  /**
   * POST /discovery/deploy
   * Send outreach via EMAIL or WHATSAPP
   */
  static async deployOutreach(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { outreachId, platform } = request.body as any;

      const outreach = await prisma.outreach.findUnique({
        where: { id: outreachId },
        include: { Lead: { include: { BusinessProfile: true } } }
      });

      if (!outreach || outreach.Lead.business_profile_id !== bpId) {
        return reply.code(404).send({ error: 'Outreach block not found' });
      }

      const lead = outreach.Lead;

      if (platform === 'EMAIL') {
        const toEmail = lead.email || 'mock_email@example.com';
        await ResendService.sendOutreachEmail(toEmail, outreach.hook || 'Quick question', outreach.message);
      } else if (platform === 'WHATSAPP') {
        const toPhone = lead.phone || '15555555555';
        await TwilioService.sendWhatsAppMessage(toPhone, outreach.message);
      }

      const updatedOutreach = await prisma.outreach.update({
        where: { id: outreachId },
        data: { status: 'DEPLOYED', platform: platform || outreach.platform }
      });

      await prisma.lead.update({
        where: { id: lead.id },
        data: { outreach_status: 'CONTACTED', lead_status: 'CONTACTED' }
      });

      // Increment message usage
      await prisma.user.update({
        where: { id: user.id },
        data: { messages_used: { increment: 1 } }
      });

      return reply.send({ success: true, outreach: updatedOutreach });
    } catch (e: any) {
      request.log.error(e);
      return reply.code(500).send({ error: 'Failed to deploy outreach' });
    }
  }

  /**
   * GET /discovery/follow-ups/:leadId
   * Get follow-up sequence for a specific lead
   */
  static async getFollowUps(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { leadId } = request.params as { leadId: string };

      const lead = await prisma.lead.findFirst({
        where: { id: parseInt(leadId), business_profile_id: bpId }
      });

      if (!lead) return reply.code(404).send({ error: 'Lead not found' });

      const followUps = await prisma.followUp.findMany({
        where: { lead_id: lead.id },
        orderBy: { scheduled_for: 'asc' }
      });

      return reply.send({ followUps });
    } catch (e: any) {
      return reply.code(500).send({ error: 'Failed to get follow-ups' });
    }
  }

  /**
   * POST /discovery/lead-status
   * Update lead pipeline status: new → contacted → replied → qualified → converted
   */
  static async updateLeadStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { leadId, status } = request.body as any;
      const validStatuses = ['DISCOVERED', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'BOOKED', 'CONVERTED'];

      if (!validStatuses.includes(status)) {
        return reply.code(400).send({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }

      const lead = await prisma.lead.findFirst({
        where: { id: leadId, business_profile_id: bpId }
      });

      if (!lead) return reply.code(404).send({ error: 'Lead not found' });

      const updated = await prisma.lead.update({
        where: { id: leadId },
        data: { lead_status: status as any }
      });

      // Notify on significant status changes
      if (status === 'REPLIED') {
        if ((lead.intent_score || 0) >= 70) {
          await NotificationController.triggerHotLeadAlert(user.id, lead.name || 'Lead', lead.intent_score || 0, lead.id);
        }
      }

      return reply.send({ success: true, lead: updated });
    } catch (e: any) {
      return reply.code(500).send({ error: 'Failed to update lead status' });
    }
  }

  /**
   * GET /discovery/usage
   * Get current usage stats for the user
   */
  static async getUsageStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      const stats = await getUserUsageStats(user.id, user.plan, bpId);
      return reply.send(stats);
    } catch (e: any) {
      return reply.code(500).send({ error: 'Failed to get usage stats' });
    }
  }
}
