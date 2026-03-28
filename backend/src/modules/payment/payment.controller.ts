import { FastifyRequest, FastifyReply } from 'fastify';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SWITmU11YHcu9g',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'Bq290KFHJKi7dNsY0IS4nZFz',
});

export class PaymentController {
  
  static async createSubscription(request: FastifyRequest, reply: FastifyReply) {
    const { plan } = request.body as any;
    const user = request.user as any;
    
    // 1. Map plan to Razorpay plan_id
    const planMap: Record<string, string> = {
      'growth': process.env.RAZORPAY_PLAN_GROWTH || 'plan_growth_id',
      'pro': process.env.RAZORPAY_PLAN_PRO || 'plan_pro_id',
    };
    
    const planId = planMap[plan?.toLowerCase()];
    if (!planId) return reply.code(400).send({ error: 'Invalid plan selected' });

    try {
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 120, // Example 10 years duration
        notes: {
          userId: user.id.toString(),
          plan: plan.toUpperCase()
        }
      });
      
      return reply.send({
        subscription_id: subscription.id,
        checkout_url: subscription.short_url,
        plan: plan.toUpperCase()
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Failed to create subscription' });
    }
  }

  static async verifySubscription(request: FastifyRequest, reply: FastifyReply) {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = request.body as any;
    const user = request.user as any;

    const body = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'Bq290KFHJKi7dNsY0IS4nZFz')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      
      let newPlan = "GROWTH"; 
      try {
         const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
         if (subscription?.notes?.plan) {
            newPlan = subscription.notes.plan;
         }
      } catch(e) { console.error("Could not fetch subscription notes", e); }

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: newPlan as any, 
          subscriptionId: razorpay_subscription_id, 
          subscriptionStatus: 'ACTIVE',
        }
      });
      
      return reply.send({ success: true, message: `Subscription active. Upgraded to ${newPlan}.` });
    } else {
      return reply.code(400).send({ success: false, error: 'Payment verification failed' });
    }
  }

  static async webhook(request: FastifyRequest, reply: FastifyReply) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'Bq290KFHJKi7dNsY0IS4nZFz'; // Often the same as key secret or unique webhook secret
    const signature = request.headers['x-razorpay-signature'] as string;

    if (!signature) {
      return reply.code(400).send({ error: 'Missing signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(request.body))
      .digest('hex');

    if (expectedSignature === signature) {
      const payload = request.body as any;
      const event = payload.event;
      const entity = payload.payload?.subscription?.entity || payload.payload?.payment?.entity;
      
      if (!entity) return reply.send({ status: 'ignored' });

      // Identify user by notes or subscription ID
      const subscriptionId = entity.id || entity.subscription_id; 
      const userId = entity.notes?.userId ? parseInt(entity.notes.userId, 10) : null;
      
      let user = null;
      if (userId) {
         user = await prisma.user.findUnique({ where: { id: userId } });
      } else if (subscriptionId) {
         user = await prisma.user.findFirst({ where: { subscriptionId } });
      }

      if (!user) return reply.send({ status: 'user_not_found' });

      if (event === 'subscription.activated' || event === 'subscription.charged') {
          const plan = entity.notes?.plan || 'GROWTH';
          await prisma.user.update({
             where: { id: user.id },
             data: { plan: plan as any, subscriptionStatus: 'ACTIVE', subscriptionId }
          });
      } else if (event === 'payment.failed') {
          await prisma.user.update({
             where: { id: user.id },
             data: { subscriptionStatus: 'PAST_DUE' }
          });
      } else if (event === 'subscription.cancelled') {
          await prisma.user.update({
             where: { id: user.id },
             data: { plan: 'FREE', subscriptionStatus: 'CANCELLED' }
          });
      }

      return reply.send({ status: 'ok' });
    } else {
      return reply.code(400).send({ error: 'Invalid signature' });
    }
  }
}
