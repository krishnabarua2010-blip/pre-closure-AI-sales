"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = paymentRoutes;
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../middlewares/auth");
async function paymentRoutes(fastify) {
    fastify.post('/create-subscription', { preHandler: [auth_1.authenticate] }, payment_controller_1.PaymentController.createSubscription);
    fastify.post('/verify-subscription', { preHandler: [auth_1.authenticate] }, payment_controller_1.PaymentController.verifySubscription);
    fastify.post('/beta', { preHandler: [auth_1.authenticate] }, payment_controller_1.PaymentController.activateBeta);
    fastify.post('/razorpay-webhook', payment_controller_1.PaymentController.webhook);
}
