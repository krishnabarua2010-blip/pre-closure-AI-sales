import { OpenAI } from 'openai';
import { prisma } from '../../config/prisma';
import { ApolloService } from '../external/apollo.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
});

export class DiscoveryService {
  
  static async discoverAndScorePipeline(businessProfileId: number, niche: string, location: string, count: number = 10) {
    const bp = await prisma.businessProfile.findUnique({ where: { id: businessProfileId } });
    if (!bp) throw new Error("Business profile not found");

    // 1. LEAD DISCOVERY: Fetch raw leads from Apollo Data API
    const rawLeads = await ApolloService.searchLeads(niche, location, count);

    const bpContext = {
      name: bp.company_name,
      description: bp.business_description || 'B2B Software',
      industry: bp.industry || 'Technology'
    };

    // 2. Parallel Super Prompt for each lead
    const scoredLeadsPromises = rawLeads.map(async (rawLead: any) => {
      // Check if already in DB (to avoid dupes if ran multiple times)
      let existingLead = await prisma.lead.findFirst({
        where: { name: rawLead.name, business_profile_id: bp.id }
      });
      
      if (!existingLead) {
        existingLead = await prisma.lead.create({
          data: {
            business_profile_id: bp.id,
            name: rawLead.name,
            company: rawLead.name,
            industry: rawLead.industry,
            source: 'DISCOVERY',
            lead_status: 'DISCOVERED',
            outreach_status: 'NEW'
          }
        });
      }

      // Run Super Prompt
      try {
        const enriched = await this.runSuperPrompt(rawLead, bpContext);
        
        // Update Lead
        const updatedLead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            intent_score: enriched.score?.intent_estimate || 0,
            budget_score: enriched.score?.budget_level === 'high' ? 90 : (enriched.score?.budget_level === 'medium' ? 60 : 30),
            urgency_score: enriched.score?.relevance || 0,
            conversion_probability: enriched.score?.intent_estimate || 0,
            lead_value_estimate: (enriched.score?.relevance || 50) * 100, // Mock value math
            qualification_level: (enriched.score?.intent_estimate || 0) > 70 ? 'HIGH' : 'MEDIUM',
            ai_summary: `${rawLead.name} needs help with ${enriched.insights?.pain_points?.[0] || 'efficiency'}.`,
            ai_explanation: `Best angle: ${enriched.insights?.best_angle || 'Direct offer.'}`,
            recommended_action: 'follow_up_immediately',
            behavioral_signals: { "pain_points": enriched.insights?.pain_points, "desires": enriched.insights?.desires } as any
          }
        });

        // Upsert Outreach
        const existingOutreach = await prisma.outreach.findFirst({
          where: { lead_id: existingLead.id }
        });

        if (existingOutreach) {
          await prisma.outreach.update({
            where: { id: existingOutreach.id },
            data: {
              message: enriched.outreach?.message || 'Hello, I noticed your business...',
              hook: enriched.outreach?.hook || 'Quick question',
              cta: enriched.outreach?.cta || 'Let me know',
              status: 'GENERATED'
            }
          });
        } else {
          await prisma.outreach.create({
            data: {
              lead_id: existingLead.id,
              message: enriched.outreach?.message || 'Hello, I noticed your business...',
              hook: enriched.outreach?.hook || 'Quick question',
              cta: enriched.outreach?.cta || 'Let me know',
              status: 'GENERATED'
            }
          });
        }

        return updatedLead;
      } catch(e) {
        console.error("AI scoring failed for lead", rawLead.name, e);
        return existingLead;
      }
    });

    const results = await Promise.all(scoredLeadsPromises);
    return results;
  }


  static async runSuperPrompt(leadObj: any, bpCtx: any) {
    const systemPrompt = `You are an AI Sales Intelligence and Outreach Expert for ${bpCtx.name} (${bpCtx.description}).

Analyze the lead and generate a personalized outreach message.

INPUT:
- Business Name: ${leadObj.name}
- Description: ${leadObj.description}
- Industry: ${leadObj.industry}
- Location: ${leadObj.location}

OUTPUT EXCLUSIVELY AS A VALID JSON OBJECT:
{
  "score": {
    "relevance": 85,
    "intent_estimate": 70,
    "budget_level": "high"
  },
  "insights": {
    "pain_points": ["Client acquisition cost", "Staffing"],
    "desires": ["Automated operations", "Higher ROI"],
    "best_angle": "Reduce operations cost using AI"
  },
  "outreach": {
    "message": "Hi team at ${leadObj.name}, noticed you're growing in ${leadObj.location}. We help businesses like yours automate tasks to save 15h a week. Open to a quick chat?",
    "hook": "Quick question about your operations",
    "cta": "Open to a 5 min chat?"
  }
}

RULES:
- Keep message natural and non-spammy.
- Focus on business growth problems.
- Make it feel custom-written.
- Return ONLY valid JSON. Nothing else.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

}
