"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = notificationRoutes;
const auth_1 = require("../../middlewares/auth");
const notification_controller_1 = require("./notification.controller");
async function notificationRoutes(server) {
    server.addHook('preValidation', auth_1.authenticate);
    // Get all notifications for the user
    server.get('/list', notification_controller_1.NotificationController.getNotifications);
    // Mark a notification as read
    server.post('/read', notification_controller_1.NotificationController.markRead);
    // Mark all as read
    server.post('/read-all', notification_controller_1.NotificationController.markAllRead);
    // Get unread count
    server.get('/unread-count', notification_controller_1.NotificationController.getUnreadCount);
}
