import { OpenAI } from 'openai';
import { prisma } from '../../config/prisma';
import { ScraperService, EnrichedLead } from '../external/scraper.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
});

export class DiscoveryService {

  /**
   * Full pipeline: Discover → Enrich → Score → Generate Outreach → Create Follow-up Sequence
   */
  static async discoverAndScorePipeline(businessProfileId: number, niche: string, location: string, count: number = 10) {
    const bp = await prisma.businessProfile.findUnique({ where: { id: businessProfileId } });
    if (!bp) throw new Error("Business profile not found");

    // 1. LEAD DISCOVERY: Google Maps + SERP scraping (replaces Apollo)
    const rawLeads = await ScraperService.discoverLeads(niche, location, count);

    const bpContext = {
      name: bp.company_name,
      description: bp.business_description || 'B2B Software',
      industry: bp.industry || 'Technology',
      services: bp.services_offered || '',
      idealCustomer: bp.ideal_customer || '',
    };

    // 2. Process each lead: Enrich → Score → Save → Generate Outreach + Follow-up
    const scoredLeadsPromises = rawLeads.map(async (rawLead) => {
      // Check for duplicates
      let existingLead = await prisma.lead.findFirst({
        where: { 
          name: rawLead.name, 
          business_profile_id: bp.id 
        }
      });

      if (!existingLead) {
        existingLead = await prisma.lead.create({
          data: {
            business_profile_id: bp.id,
            name: rawLead.name,
            company: rawLead.name,
            email: '',
            phone: rawLead.phone,
            industry: rawLead.industry,
            source: 'DISCOVERY',
            lead_status: 'DISCOVERED',
            outreach_status: 'NEW',
          }
        });
      }

      try {
        // 2a. AI Enrichment
        const enriched = await ScraperService.enrichLead(rawLead);

        // 2b. 5-Dimension Scoring
        const { score, tag, breakdown } = ScraperService.scoreLead(enriched, niche);

        // 2c. AI-Powered Outreach Generation
        const outreach = await this.generateOutreachMessage(enriched, bpContext);

        // 2d. Update Lead with enrichment + scores
        const updatedLead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            intent_score: score,
            budget_score: breakdown.nicheMatch + breakdown.serviceFit,
            urgency_score: breakdown.activity + breakdown.growthSignals,
            conversion_probability: score,
            lead_value_estimate: score * 150,
            qualification_level: tag,
            ai_summary: `${rawLead.name}: ${enriched.services.slice(0, 3).join(', ')} business. ${enriched.painPoints[0] ? 'Key pain: ' + enriched.painPoints[0] : ''} Score: ${score}/100 (${tag})`,
            ai_explanation: `Niche: ${breakdown.nicheMatch}/30, Activity: ${breakdown.activity}/20, Web: ${breakdown.websiteQuality}/10, Growth: ${breakdown.growthSignals}/20, Fit: ${breakdown.serviceFit}/20`,
            recommended_action: tag === 'HOT' ? 'follow_up_immediately' : tag === 'WARM' ? 'send_proposal' : 'nurture_later',
            behavioral_signals: {
              painPoints: enriched.painPoints,
              services: enriched.services,
              growthSignals: enriched.growthSignals,
              targetAudience: enriched.targetAudience,
              businessType: enriched.businessType,
              scoreBreakdown: breakdown,
            } as any,
          }
        });

        // 2e. Create Outreach
        const existingOutreach = await prisma.outreach.findFirst({
          where: { lead_id: existingLead.id }
        });

        if (!existingOutreach) {
          await prisma.outreach.create({
            data: {
              lead_id: existingLead.id,
              message: outreach.message,
              hook: outreach.hook,
              cta: outreach.cta,
              status: 'GENERATED',
            }
          });
        }

        // 2f. Generate Follow-up Sequence (Day 0, 2, 4, 7)
        await this.generateFollowUpSequence(existingLead.id, enriched, bpContext);

        return updatedLead;
      } catch (e) {
        console.error("[DiscoveryService] Processing failed for lead:", rawLead.name, e);
        return existingLead;
      }
    });

    const results = await Promise.all(scoredLeadsPromises);
    return results;
  }

  /**
   * Generate personalized outreach message using AI
   */
  static async generateOutreachMessage(lead: EnrichedLead, bp: any): Promise<{ message: string; hook: string; cta: string }> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: `You are an elite sales copywriter for ${bp.name} (${bp.description}).
We help businesses with: ${bp.services}
Our ideal customer: ${bp.idealCustomer}

Write a personalized outreach message for this lead:
- Business: ${lead.name}
- Industry: ${lead.industry}
- Location: ${lead.location}
- Their services: ${lead.services.join(', ')}
- Their pain points: ${lead.painPoints.join(', ')}
- Rating: ${lead.rating}/5 (${lead.reviews} reviews)

Return ONLY valid JSON:
{
  "message": "2-3 sentence personalized outreach. Reference specific details about their business. Include a custom problem statement based on their pain points.",
  "hook": "Attention-grabbing subject line / opener",
  "cta": "Soft call-to-action (not pushy)"
}

RULES:
- Sound human, NOT like a template
- Reference something specific about THEIR business
- No generic "I noticed your business" — be specific
- Keep it under 80 words
- Make them feel understood, not sold to`
        }],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      return {
        message: `Hi ${lead.name} team, I came across your work in ${lead.industry} and noticed an opportunity to help streamline your operations. Would love to share a quick idea.`,
        hook: `Quick thought about ${lead.name}`,
        cta: 'Open to a 5-min chat this week?'
      };
    }
  }

  /**
   * Generate multi-day follow-up sequence: Day 0, 2, 4, 7
   * Each message MUST be different and escalate appropriately
   */
  static async generateFollowUpSequence(leadId: number, lead: EnrichedLead, bp: any): Promise<void> {
    // Check if sequence already exists
    const existingFollowUps = await prisma.followUp.count({ where: { lead_id: leadId } });
    if (existingFollowUps >= 4) return;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: `You are an expert sales strategist for ${bp.name}.

Generate a 4-message follow-up sequence for this lead:
- Business: ${lead.name}
- Industry: ${lead.industry}
- Pain points: ${lead.painPoints.join(', ')}
- Services they offer: ${lead.services.join(', ')}

Return ONLY valid JSON:
{
  "day0": "Initial contact message — warm, specific, value-focused. Reference their specific business.",
  "day2": "Follow-up #1 — share a relevant insight or case study. Different angle from day0.",
  "day4": "Follow-up #2 — create gentle urgency. Mention limited availability or time-sensitive opportunity.",
  "day7": "Final message — honest, direct. Say you'll stop reaching out. Last chance CTA."
}

RULES:
- Each message MUST be completely different in angle and tone
- Each should be 2-3 sentences max
- Day 0: Curiosity + value
- Day 2: Social proof + insight
- Day 4: Urgency + scarcity (gentle)
- Day 7: Transparency + final offer
- NEVER be spammy or aggressive`
        }],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const sequence = JSON.parse(response.choices[0].message.content || '{}');
      const now = new Date();

      const followUps = [
        { content: sequence.day0 || 'Initial contact', dayOffset: 0, status: 'PENDING' },
        { content: sequence.day2 || 'Follow-up', dayOffset: 2, status: 'PENDING' },
        { content: sequence.day4 || 'Reminder', dayOffset: 4, status: 'PENDING' },
        { content: sequence.day7 || 'Final message', dayOffset: 7, status: 'PENDING' },
      ];

      for (const fu of followUps) {
        const scheduledDate = new Date(now.getTime() + fu.dayOffset * 24 * 60 * 60 * 1000);
        await prisma.followUp.create({
          data: {
            lead_id: leadId,
            content: fu.content,
            scheduled_for: scheduledDate,
            status: fu.status,
          }
        });
      }
    } catch (error) {
      console.error('[DiscoveryService] Follow-up sequence generation failed:', error);
      // Create basic fallback sequence
      const now = new Date();
      const fallbacks = [
        { content: `Hi ${lead.name}, wanted to quickly introduce ourselves. We help ${lead.industry} businesses grow faster.`, days: 0 },
        { content: `Following up on my previous message. We recently helped a similar business increase efficiency by 40%.`, days: 2 },
        { content: `Quick reminder — we have limited onboarding slots this month. Would love to include ${lead.name}.`, days: 4 },
        { content: `Last note from me. If timing isn't right, no worries at all. Here's my calendar link if things change.`, days: 7 },
      ];

      for (const f of fallbacks) {
        await prisma.followUp.create({
          data: {
            lead_id: leadId,
            content: f.content,
            scheduled_for: new Date(now.getTime() + f.days * 24 * 60 * 60 * 1000),
            status: 'PENDING',
          }
        });
      }
    }
  }
}
