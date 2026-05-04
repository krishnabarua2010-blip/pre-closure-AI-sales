"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../../config/prisma");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
class PaymentController {
    static async createSubscription(request, reply) {
        const { plan } = request.body;
        const user = request.user;
        // 1. Map plan to Razorpay plan_id
        const planMap = {
            'growth': process.env.RAZORPAY_PLAN_GROWTH || 'plan_growth_id',
            'pro': process.env.RAZORPAY_PLAN_PRO || 'plan_pro_id',
        };
        const planId = planMap[plan?.toLowerCase()];
        if (!planId)
            return reply.code(400).send({ error: 'Invalid plan selected' });
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
        }
        catch (error) {
            console.error(error);
            return reply.code(500).send({ error: 'Failed to create subscription' });
        }
    }
    static async verifySubscription(request, reply) {
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = request.body;
        const user = request.user;
        const body = razorpay_payment_id + "|" + razorpay_subscription_id;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');
        if (expectedSignature === razorpay_signature) {
            let newPlan = "GROWTH";
            try {
                const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
                if (subscription?.notes?.plan) {
                    newPlan = String(subscription.notes.plan);
                }
            }
            catch (e) {
                console.error("Could not fetch subscription notes", e);
            }
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    plan: newPlan,
                    subscriptionId: razorpay_subscription_id,
                    subscriptionStatus: 'ACTIVE',
                }
            });
            return reply.send({ success: true, message: `Subscription active. Upgraded to ${newPlan}.` });
        }
        else {
            return reply.code(400).send({ success: false, error: 'Payment verification failed' });
        }
    }
    static async webhook(request, reply) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || ''; // Often the same as key secret or unique webhook secret
        const signature = request.headers['x-razorpay-signature'];
        if (!signature) {
            return reply.code(400).send({ error: 'Missing signature' });
        }
        const expectedSignature = crypto_1.default
            .createHmac('sha256', secret)
            .update(JSON.stringify(request.body))
            .digest('hex');
        if (expectedSignature === signature) {
            const payload = request.body;
            const event = payload.event;
            const entity = payload.payload?.subscription?.entity || payload.payload?.payment?.entity;
            if (!entity)
                return reply.send({ status: 'ignored' });
            // Identify user by notes or subscription ID
            const subscriptionId = entity.id || entity.subscription_id;
            const userId = entity.notes?.userId ? parseInt(entity.notes.userId, 10) : null;
            let user = null;
            if (userId) {
                user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
            }
            else if (subscriptionId) {
                user = await prisma_1.prisma.user.findFirst({ where: { subscriptionId } });
            }
            if (!user)
                return reply.send({ status: 'user_not_found' });
            if (event === 'subscription.activated' || event === 'subscription.charged') {
                const plan = entity.notes?.plan || 'GROWTH';
                await prisma_1.prisma.user.update({
                    where: { id: user.id },
                    data: { plan: plan, subscriptionStatus: 'ACTIVE', subscriptionId }
                });
            }
            else if (event === 'payment.failed') {
                await prisma_1.prisma.user.update({
                    where: { id: user.id },
                    data: { subscriptionStatus: 'PAST_DUE' }
                });
            }
            else if (event === 'subscription.cancelled') {
                await prisma_1.prisma.user.update({
                    where: { id: user.id },
                    data: { plan: 'FREE', subscriptionStatus: 'CANCELLED' }
                });
            }
            return reply.send({ status: 'ok' });
        }
        else {
            return reply.code(400).send({ error: 'Invalid signature' });
        }
    }
}
exports.PaymentController = PaymentController;
