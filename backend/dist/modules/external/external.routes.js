"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = externalRoutes;
const calendar_sync_service_1 = require("./calendar-sync.service");
async function externalRoutes(fastify) {
    /**
     * POST /api/external/webhooks/calendar
     * Unified webhook receiver endpoint for Cal.com, Calendly, and Google Calendar events.
     */
    fastify.post('/webhooks/calendar', async (request, reply) => {
        try {
            const body = request.body;
            console.log('[Calendar Webhook] Received request body:', JSON.stringify(body, null, 2));
            // Parse payload based on provider characteristics
            let provider = 'unknown';
            let event = 'unknown';
            let eventId = '';
            let email = '';
            let startTime = '';
            let endTime = '';
            let meetingUrl = '';
            // 1. Detect Cal.com
            if (body && body.triggerEvent && body.payload) {
                provider = 'cal_com';
                event = body.triggerEvent; // e.g. "BOOKING_CREATED", "BOOKING_CANCELLED"
                eventId = body.payload.uid || '';
                email = body.payload.attendees?.[0]?.email || body.payload.invitee?.email || '';
                startTime = body.payload.startTime || '';
                endTime = body.payload.endTime || '';
                meetingUrl = body.payload.videoCallData?.url || '';
            }
            // 2. Detect Calendly
            else if (body && body.event && body.payload && body.payload.invitee) {
                provider = 'calendly';
                event = body.event; // e.g. "invitee.created", "invitee.canceled"
                eventId = body.payload.event?.uuid || body.payload.uri || '';
                email = body.payload.invitee.email || '';
                startTime = body.payload.event?.start_time || '';
                endTime = body.payload.event?.end_time || '';
                meetingUrl = body.payload.event?.location?.join_url || '';
            }
            // 3. Detect Google Calendar
            else if (request.headers['x-goog-resource-id']) {
                provider = 'google';
                event = 'google.sync';
                eventId = request.headers['x-goog-resource-id'] || '';
                // Google push notifications do not contain the event details directly in the body.
                // In a live system, we would query the Google Calendar API using the resource ID to get the event changes.
                // For local simulation/stubs, we allow custom test payload variables:
                email = body.email || '';
                startTime = body.startTime || new Date().toISOString();
                endTime = body.endTime || new Date(Date.now() + 30 * 60 * 1000).toISOString();
                event = body.event || 'booking.created';
            }
            // 4. Default / Simulation Payload
            else if (body && body.email && body.event && body.provider) {
                provider = body.provider;
                event = body.event;
                eventId = body.eventId || 'sim_' + Date.now();
                email = body.email;
                startTime = body.startTime || new Date().toISOString();
                endTime = body.endTime || new Date(Date.now() + 30 * 60 * 1000).toISOString();
                meetingUrl = body.meetingUrl || '';
            }
            if (!email || !eventId) {
                return reply.code(400).send({
                    error: 'Missing required webhook fields (email, eventId). Make sure to send a compatible Cal.com, Calendly, or Google watch payload.'
                });
            }
            const syncPayload = {
                event,
                provider,
                eventId,
                email,
                startTime,
                endTime,
                meetingUrl
            };
            const result = await calendar_sync_service_1.CalendarSyncService.processWebhookEvent(syncPayload);
            return reply.send(result);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({ error: 'Internal server error: ' + error.message });
        }
    });
}
