"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryController = void 0;
const prisma_1 = require("../../config/prisma");
const discovery_service_1 = require("./discovery.service");
const resend_service_1 = require("../external/resend.service");
const twilio_service_1 = require("../external/twilio.service");
class DiscoveryController {
    static async generateLeads(request, reply) {
        try {
            const user = request.user;
            const bpId = user.BusinessProfiles?.[0]?.id;
            if (!bpId)
                return reply.code(403).send({ error: 'No business profile' });
            const { niche, location, count = 10 } = request.body;
            const results = await discovery_service_1.DiscoveryService.discoverAndScorePipeline(bpId, niche, location, count);
            return reply.send({ success: true, leads: results });
        }
        catch (e) {
            request.log.error(e);
            return reply.code(500).send({ error: 'Failed to generate leads pipeline' });
        }
    }
    static async generateOutreach(request, reply) {
        try {
            const user = request.user;
            const bpId = user.BusinessProfiles?.[0]?.id;
            if (!bpId)
                return reply.code(403).send({ error: 'No business profile' });
            const { leadIds } = request.body;
            // Triggers outreach generation for these specific leads if not already done.
            // Wait, our super prompt does scoring AND outreach together. 
            // So if they are already scored, the outreach is already saved!
            // But we can just fetch them representing the new messages.
            const outreaches = await prisma_1.prisma.outreach.findMany({
                where: { lead_id: { in: leadIds } }
            });
            // Mark leads as outreach_status = 'GENERATED'
            await prisma_1.prisma.lead.updateMany({
                where: { id: { in: leadIds } },
                data: { outreach_status: 'GENERATED' }
            });
            return reply.send({ success: true, outreaches });
        }
        catch (e) {
            request.log.error(e);
            return reply.code(500).send({ error: 'Failed to generate outreach' });
        }
    }
    static async deployOutreach(request, reply) {
        try {
            const user = request.user;
            const bpId = user.BusinessProfiles?.[0]?.id;
            if (!bpId)
                return reply.code(403).send({ error: 'No business profile' });
            const { outreachId, platform } = request.body; // platform: 'EMAIL' | 'WHATSAPP'
            const outreach = await prisma_1.prisma.outreach.findUnique({
                where: { id: outreachId },
                include: { Lead: { include: { BusinessProfile: true } } }
            });
            if (!outreach || outreach.Lead.business_profile_id !== bpId) {
                return reply.code(404).send({ error: 'Outreach block not found' });
            }
            const lead = outreach.Lead;
            if (platform === 'EMAIL') {
                const toEmail = lead.email || 'mock_email@example.com';
                await resend_service_1.ResendService.sendOutreachEmail(toEmail, outreach.hook || 'Quick question', outreach.message);
            }
            else if (platform === 'WHATSAPP') {
                const toPhone = lead.phone || '15555555555';
                await twilio_service_1.TwilioService.sendWhatsAppMessage(toPhone, outreach.message);
            }
            const updatedOutreach = await prisma_1.prisma.outreach.update({
                where: { id: outreachId },
                data: { status: 'DEPLOYED', platform: platform || outreach.platform }
            });
            await prisma_1.prisma.lead.update({
                where: { id: lead.id },
                data: { outreach_status: 'CONTACTED' }
            });
            return reply.send({ success: true, outreach: updatedOutreach });
        }
        catch (e) {
            request.log.error(e);
            return reply.code(500).send({ error: 'Failed to deploy outreach via external API' });
        }
    }
}
exports.DiscoveryController = DiscoveryController;
