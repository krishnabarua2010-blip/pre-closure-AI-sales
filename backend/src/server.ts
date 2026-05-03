import Fastify from 'fastify';
import cors from '@fastify/cors';
import path from 'path';
import fastifyStatic from '@fastify/static';

const server = Fastify({ logger: true });

server.register(cors, { origin: true });

// ✅ Serve frontend
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
});

// ✅ API routes under /api
import authRoutes from './modules/auth/auth.routes';
import aiRoutes from './modules/ai/ai.routes';
import widgetRoutes from './modules/widget/widget.routes';

server.register(authRoutes, { prefix: '/api/auth' });
server.register(aiRoutes, { prefix: '/api/ai' });
server.register(widgetRoutes, { prefix: '/api/widget' });

// ✅ Fallback to frontend for all other routes
server.setNotFoundHandler((req, reply) => {
  if (!req.url.startsWith('/api')) {
    return reply.sendFile('index.html');
  }
  reply.status(404).send({ error: 'Not found' });
});

// Health check
server.get('/api/health', async () => {
  return { status: 'alive' };
});

const start = async () => {
  const PORT = process.env.PORT || 3000;
  await server.listen({ port: Number(PORT), host: '0.0.0.0' });
  console.log("🔥 FULL APP LIVE ON", PORT);
};

start();
