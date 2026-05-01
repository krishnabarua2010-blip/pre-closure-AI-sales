import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';
import { DiscoveryService } from './discovery.service';
import { ResendService } from '../external/resend.service';
import { TwilioService } from '../external/twilio.service';

export class DiscoveryController {
  
  static async generateLeads(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { niche, location, count = 10 } = request.body as any;

      const results = await DiscoveryService.discoverAndScorePipeline(bpId, niche, location, count);
      return reply.send({ success: true, leads: results });
    } catch (e: any) {
      request.log.error(e);
      return reply.code(500).send({ error: 'Failed to generate leads pipeline' });
    }
  }

  static async generateOutreach(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { leadIds } = request.body as any;
      // Triggers outreach generation for these specific leads if not already done.
      // Wait, our super prompt does scoring AND outreach together. 
      // So if they are already scored, the outreach is already saved!
      // But we can just fetch them representing the new messages.
      const outreaches = await prisma.outreach.findMany({
        where: { lead_id: { in: leadIds } }
      });
      
      // Mark leads as outreach_status = 'GENERATED'
      await prisma.lead.updateMany({
        where: { id: { in: leadIds } },
        data: { outreach_status: 'GENERATED' }
      });

      return reply.send({ success: true, outreaches });
    } catch(e: any) {
      request.log.error(e);
      return reply.code(500).send({ error: 'Failed to generate outreach' });
    }
  }

  static async deployOutreach(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { outreachId, platform } = request.body as any; // platform: 'EMAIL' | 'WHATSAPP'

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
        data: { outreach_status: 'CONTACTED' }
      });

      return reply.send({ success: true, outreach: updatedOutreach });

    } catch(e: any) {
      request.log.error(e);
      return reply.code(500).send({ error: 'Failed to deploy outreach via external API' });
    }
  }
}
