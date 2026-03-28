import { FastifyInstance } from 'fastify';
import { PaymentController } from './payment.controller';
import { authenticate } from '../../middlewares/auth';

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.post('/create-subscription', { preHandler: [authenticate] }, PaymentController.createSubscription);
  fastify.post('/verify-subscription', { preHandler: [authenticate] }, PaymentController.verifySubscription);
  fastify.post('/razorpay-webhook', PaymentController.webhook);
}
