console.log("SERVER STARTING...");

import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { prisma } from './config/prisma';

dotenv.config();

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: true
});

// Rate limiting for widget endpoints
server.register(rateLimit, {
  max: 30,
  timeWindow: '1 minute',
  allowList: [],
  keyGenerator: (request) => request.ip
});

// Serve static files (widget.js) from backend/public/
server.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/static/',
  decorateReply: false
});

import authRoutes from './modules/auth/auth.routes';
import conversationRoutes from './modules/conversation/conversation.routes';
import aiRoutes from './modules/ai/ai.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import advisorRoutes from './modules/advisor/advisor.routes';
import paymentRoutes from './modules/payment/payment.routes';
import widgetRoutes from './modules/widget/widget.routes';
import setupRoutes from './modules/setup/setup.routes';
import discoveryRoutes from './modules/discovery/discovery.routes';

// Health check
server.get('/', async () => {
  return { status: 'ok' };
});

server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date() };
});

server.register(authRoutes, { prefix: '/auth' });
server.register(conversationRoutes, { prefix: '/conversation' });
server.register(aiRoutes, { prefix: '/ai' });
server.register(analyticsRoutes, { prefix: '/analytics' });
server.register(advisorRoutes, { prefix: '/advisor' });
server.register(paymentRoutes, { prefix: '/payment' });
server.register(widgetRoutes, { prefix: '/widget' });
server.register(setupRoutes, { prefix: '/setup' });
server.register(discoveryRoutes, { prefix: '/discovery' });

const start = async () => {
  try {
    console.log("🚀 START FUNCTION CALLED");

    const PORT = process.env.PORT || 8080;
    console.log("🔥 BACKEND STARTED");
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });

    console.log("🔥 SERVER RUNNING ON", PORT);
  } catch (err) {
    console.error("❌ SERVER CRASHED:", err);
    process.exit(1);
  }
};

start();
