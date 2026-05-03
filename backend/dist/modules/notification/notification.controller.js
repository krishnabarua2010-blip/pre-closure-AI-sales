"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const prisma_1 = require("../../config/prisma");
class NotificationController {
    /**
     * Get notifications for the authenticated user
     */
    static async getNotifications(request, reply) {
        try {
            const user = request.user;
            const notifications = await prisma_1.prisma.notification.findMany({
                where: { user_id: user.id },
                orderBy: { created_at: 'desc' },
                take: 50,
            });
            return reply.send({ notifications });
        }
        catch (e) {
            return reply.code(500).send({ error: 'Failed to fetch notifications' });
        }
    }
    /**
     * Mark a notification as read
     */
    static async markRead(request, reply) {
        try {
            const user = request.user;
            const { notificationId } = request.body;
            await prisma_1.prisma.notification.updateMany({
                where: { id: notificationId, user_id: user.id },
                data: { is_read: true },
            });
            return reply.send({ success: true });
        }
        catch (e) {
            return reply.code(500).send({ error: 'Failed to mark as read' });
        }
    }
    /**
     * Mark all notifications as read
     */
    static async markAllRead(request, reply) {
        try {
            const user = request.user;
            await prisma_1.prisma.notification.updateMany({
                where: { user_id: user.id, is_read: false },
                data: { is_read: true },
            });
            return reply.send({ success: true });
        }
        catch (e) {
            return reply.code(500).send({ error: 'Failed to mark all as read' });
        }
    }
    /**
     * Get unread count
     */
    static async getUnreadCount(request, reply) {
        try {
            const user = request.user;
            const count = await prisma_1.prisma.notification.count({
                where: { user_id: user.id, is_read: false },
            });
            return reply.send({ unread: count });
        }
        catch (e) {
            return reply.code(500).send({ error: 'Failed to get count' });
        }
    }
    /**
     * Create a notification (called internally, not via API)
     */
    static async createNotification(userId, type, title, message, metadata) {
        try {
            await prisma_1.prisma.notification.create({
                data: {
                    user_id: userId,
                    type,
                    title,
                    message,
                    metadata: metadata || {},
                    is_read: false,
                }
            });
        }
        catch (e) {
            console.error('[NotificationController] Failed to create notification:', e);
        }
    }
    /**
     * Trigger hot lead alert: score > 70 AND reply received
     */
    static async triggerHotLeadAlert(userId, leadName, score, leadId) {
        if (score >= 70) {
            await this.createNotification(userId, 'HOT_LEAD', `🔥 Hot Lead: ${leadName}`, `${leadName} scored ${score}/100 and has replied. Take action now!`, { leadId, score });
        }
    }
    /**
     * Trigger follow-up reminder
     */
    static async triggerFollowUpReminder(userId, leadName, followUpId) {
        await this.createNotification(userId, 'FOLLOW_UP_DUE', `📧 Follow-up Due: ${leadName}`, `Time to send your next follow-up to ${leadName}.`, { followUpId });
    }
    /**
     * Trigger inactivity alert (no action in 48h on hot leads)
     */
    static async triggerInactivityAlert(userId, leadName, leadId) {
        await this.createNotification(userId, 'INACTIVITY', `⚠️ No action on ${leadName}`, `It's been 48+ hours since you last engaged with ${leadName}. Don't lose this lead!`, { leadId });
    }
}
exports.NotificationController = NotificationController;
