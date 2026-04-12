import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../config/prisma';
import { redis } from '../../config/redis';

export class AnalyticsController {
  
  static async getLeads(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.send({ leads: [] });
      
      const leads = await prisma.lead.findMany({
        where: { business_profile_id: bpId },
        include: { Conversation: true },
        orderBy: { created_at: 'desc' },
        take: 50
      });
      return reply.send({ leads });
    } catch(e) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
  
  static async getFunnelHealth(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user!;
      const cacheKey = `funnel_health:${user.id}`;

      // Redis Caching Logic
      const cached = await redis.get(cacheKey);
      if (cached) return reply.send(JSON.parse(cached));

      const [totalConversations, totalLeads, qualifiedLeads, convertedLeads] = await Promise.all([
        prisma.conversation.count({ where: { user_id: user.id } }),
        prisma.lead.count({ where: { Conversation: { user_id: user.id } } }),
        prisma.lead.count({ where: { Conversation: { user_id: user.id }, lead_status: 'QUALIFIED' } }),
        prisma.lead.count({ where: { Conversation: { user_id: user.id }, lead_status: 'BOOKED' } })
      ]);

      const win_rate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      const rql_rate = totalConversations > 0 ? (qualifiedLeads / totalConversations) * 100 : 0;

      const response = {
        total_conversations: totalConversations,
        total_leads: totalLeads,
        rql_count: qualifiedLeads,
        rql_rate,
        win_rate
      };

      // Set Cache TTL to 60 seconds
      await redis.setex(cacheKey, 60, JSON.stringify(response));

      return reply.send(response);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async getRevenueMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user!;
      const cacheKey = `revenue_metrics:${user.id}`;

      const cached = await redis.get(cacheKey);
      if (cached) return reply.send(JSON.parse(cached));

      // Summing strictly revenue probability thresholds over active leads
      const activeConversations = await prisma.conversation.findMany({
        where: { user_id: user.id, status: 'ACTIVE' },
        select: { revenue_probability_score: true }
      });

      // Simple mock formula: assume every 10 points over 50 is worth $1000 pipeline expectation
      const expected_revenue = activeConversations.reduce((acc, curr) => {
        return acc + (curr.revenue_probability_score > 50 ? (curr.revenue_probability_score * 20) : 0);
      }, 0);
      
      const droppedLeads = await prisma.conversation.count({ where: { user_id: user.id, status: 'DROPPED' } });

      const response = {
        expected_revenue,
        revenue_leakage: droppedLeads * 500, // Mock fixed leakage value
        active_pipeline_size: activeConversations.length
      };

      await redis.setex(cacheKey, 60, JSON.stringify(response));

      return reply.send(response);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async trackEvent(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { event_name, metadata } = request.body as any;
      let userId = null;
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const jwtResult = (request.server as any).jwt.verify(token);
          userId = (jwtResult as any).id;
        } catch(e) {}
      }
      await prisma.eventLog.create({
        data: {
          event_name,
          metadata: metadata || {},
          user_id: userId
        }
      });
      return reply.send({ success: true });
    } catch (e) {
      return reply.code(500).send({ error: 'Failed to track event' });
    }
  }

  /**
   * GET /analytics/lead-intelligence/:leadId
   * Returns the full deep analysis for a single lead.
   */
  static async getLeadIntelligence(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const bpId = user.BusinessProfiles?.[0]?.id;
      if (!bpId) return reply.code(403).send({ error: 'No business profile' });

      const { leadId } = request.params as { leadId: string };

      const lead = await prisma.lead.findFirst({
        where: { 
          id: parseInt(leadId),
          business_profile_id: bpId 
        },
        include: {
          Conversation: {
            select: {
              urgency_score: true,
              authority_score: true,
              budget_score: true,
              objection_score: true,
              revenue_probability_score: true,
              raw_signals: true,
              status: true,
              Messages: {
                orderBy: { created_at: 'asc' },
                take: 30,
                select: { sender: true, content: true, created_at: true }
              }
            }
          }
        }
      });

      if (!lead) return reply.code(404).send({ error: 'Lead not found' });

      return reply.send({
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          status: lead.lead_status,
          intent_score: lead.intent_score,
          budget_score: lead.budget_score,
          urgency_score: lead.urgency_score,
          conversion_probability: lead.conversion_probability,
          lead_value_estimate: lead.lead_value_estimate,
          qualification_level: lead.qualification_level,
          ai_summary: lead.ai_summary,
          ai_explanation: lead.ai_explanation,
          recommended_action: lead.recommended_action,
          behavioral_signals: lead.behavioral_signals,
          collected_fields: lead.collected_fields,
          conversation: lead.Conversation,
          created_at: lead.created_at,
        }
      });
    } catch (e: any) {
      request.log.error(e);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
