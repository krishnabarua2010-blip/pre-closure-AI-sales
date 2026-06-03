"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarSyncService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../../config/prisma");
dotenv_1.default.config();
class CalendarSyncService {
    /**
     * Main entry point to process webhook events from Cal.com, Calendly, and Google Calendar
     */
    static async processWebhookEvent(payload) {
        console.log(`[Calendar Sync] Received webhook for provider: ${payload.provider}, event: ${payload.event}`);
        // 1. Map webhook events to lead statuses
        let targetStatus = 'BOOKED';
        const eventName = payload.event.toLowerCase();
        if (eventName.includes('created') || eventName.includes('booked')) {
            targetStatus = 'BOOKED';
        }
        else if (eventName.includes('cancel') || eventName.includes('rejected')) {
            targetStatus = 'CANCELLED';
        }
        else if (eventName.includes('reschedule') || eventName.includes('updated')) {
            targetStatus = 'RESCHEDULED';
        }
        else if (eventName.includes('completed') || eventName.includes('finished')) {
            targetStatus = 'COMPLETED';
        }
        else if (eventName.includes('no_show') || eventName.includes('noshow')) {
            targetStatus = 'NO_SHOW';
        }
        else if (eventName.includes('confirm')) {
            targetStatus = 'CONFIRMED';
        }
        // 2. Fetch Lead associated with the invitee email
        const lead = await prisma_1.prisma.lead.findFirst({
            where: {
                email: {
                    equals: payload.email,
                    mode: 'insensitive'
                }
            }
        });
        if (!lead) {
            console.warn(`[Calendar Sync] No matching Lead found for email: ${payload.email}. Logging event but skipping state updates.`);
            return { status: 'LEAD_NOT_FOUND', targetStatus };
        }
        console.log(`[Calendar Sync] Syncing event for Lead ID: ${lead.id}, Name: ${lead.name || 'Anonymous'}`);
        // 3. Upsert CalendarEvent record
        let eventRecord;
        try {
            eventRecord = await prisma_1.prisma.calendarEvent.upsert({
                where: { event_id: payload.eventId },
                update: {
                    status: targetStatus,
                    start_time: new Date(payload.startTime),
                    end_time: new Date(payload.endTime),
                    meeting_url: payload.meetingUrl || null
                },
                create: {
                    lead_id: lead.id,
                    provider: payload.provider.toUpperCase(),
                    event_id: payload.eventId,
                    status: targetStatus,
                    start_time: new Date(payload.startTime),
                    end_time: new Date(payload.endTime),
                    meeting_url: payload.meetingUrl || null
                }
            });
        }
        catch (dbErr) {
            console.warn('[Calendar Sync DB Warning] prisma.calendarEvent table not ready or DB expired:', dbErr.message);
        }
        // 4. Update Lead Outreach and LeadStatus fields
        const leadStatusMap = {
            'BOOKED': 'BOOKED',
            'CONFIRMED': 'BOOKED',
            'RESCHEDULED': 'RESCHEDULED',
            'CANCELLED': 'CANCELLED',
            'COMPLETED': 'COMPLETED',
            'NO_SHOW': 'NO_SHOW'
        };
        const mappedLeadStatus = leadStatusMap[targetStatus] || 'BOOKED';
        try {
            await prisma_1.prisma.lead.update({
                where: { id: lead.id },
                data: {
                    lead_status: mappedLeadStatus,
                    outreach_status: targetStatus
                }
            });
        }
        catch (e) {
            console.warn('[Calendar Sync DB Warning] Failed to update Lead status:', e.message);
        }
        // 5. Trigger Follow-Up Recovery Sequences
        if (targetStatus === 'CANCELLED') {
            await this.triggerRecoverySequence(lead.id, 'cancelled');
        }
        else if (targetStatus === 'NO_SHOW') {
            await this.triggerRecoverySequence(lead.id, 'no-show');
        }
        return {
            status: 'SUCCESS',
            leadId: lead.id,
            eventStatus: targetStatus,
            eventRecord
        };
    }
    /**
     * Generates a recovery follow-up sequence when a lead cancels or no-shows.
     */
    static async triggerRecoverySequence(leadId, type) {
        console.log(`[Calendar Sync] Triggering follow-up recovery sequence for Lead ID: ${leadId} (Type: ${type})`);
        const content = type === 'cancelled'
            ? "Hi there, I saw we had to cancel our upcoming meeting. No worries at all! Would you like to reschedule a better time here? Let me know what works for you."
            : "Hey, I hope you're doing well. I hopped on our scheduled call but think we might have missed each other. Would you like to pick a new time that suits you better?";
        try {
            // Create a pending FollowUp scheduled in 1 hour
            await prisma_1.prisma.followUp.create({
                data: {
                    lead_id: leadId,
                    content,
                    scheduled_for: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
                    status: 'PENDING'
                }
            });
            console.log(`[Calendar Sync] Scheduled recovery follow-up in 1 hour for Lead ID: ${leadId}`);
        }
        catch (e) {
            console.error('[Calendar Sync Error] Failed to create recovery follow-up:', e.message);
        }
    }
}
exports.CalendarSyncService = CalendarSyncService;
