import Fastify from 'fastify';
import cors from '@fastify/cors';
import path from 'path';
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({ logger: true });

server.register(cors, { origin: true });

// ✅ Serve frontend static files
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
});

// ✅ API Routes
import authRoutes from './modules/auth/auth.routes';
import conversationRoutes from './modules/conversation/conversation.routes';
import aiRoutes from './modules/ai/ai.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import advisorRoutes from './modules/advisor/advisor.routes';
import paymentRoutes from './modules/payment/payment.routes';
import widgetRoutes from './modules/widget/widget.routes';
import setupRoutes from './modules/setup/setup.routes';
import discoveryRoutes from './modules/discovery/discovery.routes';
import notificationRoutes from './modules/notification/notification.routes';

// API routes under /api prefix
server.register(authRoutes, { prefix: '/api/auth' });
server.register(conversationRoutes, { prefix: '/api/conversation' });
server.register(aiRoutes, { prefix: '/api/ai' });
server.register(analyticsRoutes, { prefix: '/api/analytics' });
server.register(advisorRoutes, { prefix: '/api/advisor' });
server.register(paymentRoutes, { prefix: '/api/payment' });
server.register(widgetRoutes, { prefix: '/api/widget' });
server.register(setupRoutes, { prefix: '/api/setup' });
server.register(discoveryRoutes, { prefix: '/api/discovery' });
server.register(notificationRoutes, { prefix: '/api/notifications' });

// Health check
server.get('/api/health', async () => {
  return { status: 'alive', timestamp: new Date().toISOString() };
});

// ✅ STEP 3 — GLOBAL ERROR SHIELD (CRITICAL)
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
});

// ✅ STEP 4 — Wrap all routes with Fastify Global Error Handler
server.setErrorHandler((error, request, reply) => {
  console.error("Route error:", error);
  reply.status(500).send({ error: "Something failed" });
});

// ✅ Fallback to frontend for all other routes (SPA support)
server.setNotFoundHandler((req, reply) => {
  if (!req.url.startsWith('/api')) {
    return reply.sendFile('index.html');
  }
  reply.status(404).send({ error: 'Not found' });
});

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    console.log("🚀 Booting server...");
    await server.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log("🔥 Server started on port", PORT);
  } catch (err) {
    console.error("❌ SERVER CRASHED:", err);
    process.exit(1);
  }
};

start();
