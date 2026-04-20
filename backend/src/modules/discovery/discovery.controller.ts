import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';
import { DiscoveryService } from './discovery.service';

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
}
