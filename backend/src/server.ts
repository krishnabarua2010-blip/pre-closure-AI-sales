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

// Health check
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

const start = async () => {
  try {
    const PORT = process.env.PORT || 8080;

    console.log("PORT:", PORT);

    await server.listen({
      port: Number(PORT),
      host: "0.0.0.0",
    });

    server.log.info(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("ERROR STARTING SERVER:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();
