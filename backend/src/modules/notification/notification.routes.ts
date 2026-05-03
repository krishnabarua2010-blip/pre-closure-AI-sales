import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/auth';
import { NotificationController } from './notification.controller';

export default async function notificationRoutes(server: FastifyInstance) {
  server.addHook('preValidation', authenticate);

  // Get all notifications for the user
  server.get('/list', NotificationController.getNotifications);

  // Mark a notification as read
  server.post('/read', NotificationController.markRead);

  // Mark all as read
  server.post('/read-all', NotificationController.markAllRead);

  // Get unread count
  server.get('/unread-count', NotificationController.getUnreadCount);
}
