"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupController = void 0;
const prisma_1 = require("../../config/prisma");
const scraper_service_1 = require("./scraper.service");
class SetupController {
    /**
     * GET /setup/config
     * Returns all current business config for the settings UI.
     */
    static async getConfig(request, reply) {
        try {
            const user = request.user;
            const bp = user?.BusinessProfiles?.[0];
            if (!bp)
                return reply.code(404).send({ error: 'No business profile found. Complete onboarding first.' });
            const profile = await prisma_1.prisma.businessProfile.findUnique({
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
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    /**
     * PUT /setup/business-context
     * Saves the 7 business context fields.
     */
    static async updateBusinessContext(request, reply) {
        try {
            const user = request.user;
            const bp = user?.BusinessProfiles?.[0];
            if (!bp)
                return reply.code(404).send({ error: 'No business profile found.' });
            const { business_description, ideal_customer, services_offered, pricing_range, common_objections, selling_points, target_audience, company_name, industry, } = request.body;
            const updated = await prisma_1.prisma.businessProfile.update({
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
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    /**
     * PUT /setup/chatbot-config
     * Saves chatbot tone, qualification mode, lead field toggles, and custom questions.
     */
    static async updateChatbotConfig(request, reply) {
        try {
            const user = request.user;
            const bp = user?.BusinessProfiles?.[0];
            if (!bp)
                return reply.code(404).send({ error: 'No business profile found.' });
            const { chatbot_tone, qualification_mode, lead_fields_config, custom_questions, } = request.body;
            const updated = await prisma_1.prisma.businessProfile.update({
                where: { id: bp.id },
                data: {
                    ...(chatbot_tone !== undefined && { chatbot_tone }),
                    ...(qualification_mode !== undefined && { qualification_mode }),
                    ...(lead_fields_config !== undefined && { lead_fields_config }),
                    ...(custom_questions !== undefined && { custom_questions }),
                }
            });
            return reply.send({ message: 'Chatbot configuration updated.', profile: updated });
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    /**
     * POST /setup/scrape
     * Triggers the web crawler and auto-populates the business profile context via NIM LLM.
     */
    static async scrapeAndAutoFill(request, reply) {
        try {
            const user = request.user;
            const bp = user?.BusinessProfiles?.[0];
            if (!bp)
                return reply.code(404).send({ error: 'No business profile found.' });
            const { url } = request.body;
            if (!url)
                return reply.code(400).send({ error: 'Missing website url' });
            const result = await scraper_service_1.ScraperService.crawlAndExtract(bp.id, url);
            const profile = result.profile;
            const updated = await prisma_1.prisma.businessProfile.update({
                where: { id: bp.id },
                data: {
                    company_name: profile.business_name || bp.company_name,
                    industry: profile.industry || bp.industry,
                    business_description: profile.value_propositions.join('\n') || bp.business_description,
                    services_offered: profile.services.join(', ') || bp.services_offered,
                    pricing_range: profile.pricing.join(', ') || bp.pricing_range,
                    target_audience: profile.target_audience.join(', ') || bp.target_audience,
                    common_objections: profile.common_objections.map((o) => `${o.objection}: ${o.response}`).join('\n') || bp.common_objections,
                    selling_points: profile.value_propositions.join('\n') || bp.selling_points
                }
            });
            return reply.send({
                message: 'Website scraped and business profile auto-filled successfully.',
                confidence_score: result.confidence_score,
                profile: updated
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error: ' + error.message });
        }
    }
}
exports.SetupController = SetupController;
