import 'dotenv/config';
import Fastify from "fastify";
import cors from '@fastify/cors';
import path from 'path';
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv';

dotenv.config();

// 🔥 TEMPORARY HARDCODE FOR DEBUGGING
process.env.DATABASE_URL = "postgresql://postgres.sjezasjszvtrlpplxuuu:W7ZLLgOZSJley0UN@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require";

const server = Fastify({ logger: true });

// ✅ Base plugins
server.register(cors, { origin: true });
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
});

// ✅ Health route
server.get("/api/health", async () => {
  return { status: "alive", timestamp: new Date().toISOString() };
});

// ✅ Crash shields (VERY IMPORTANT)
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
});

// ✅ Wrap all routes with Fastify Global Error Handler
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

// ✅ Safe route loader
async function safeRegister(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`✅ Loaded: ${name}`);
  } catch (e) {
    console.error(`❌ Failed loading ${name}:`, e);
  }
}

// ✅ START SERVER LAST
const start = async () => {
  try {
    console.log("🚀 Starting server...");

    // ✅ Register modules SAFELY inside start to allow async/await without top-level await issues
    await safeRegister("auth", async () => {
      const routes = await import("./modules/auth/auth.routes");
      server.register(routes.default, { prefix: "/api/auth" });
    });

    await safeRegister("conversation", async () => {
      const routes = await import("./modules/conversation/conversation.routes");
      server.register(routes.default, { prefix: "/api/conversation" });
    });

    await safeRegister("ai", async () => {
      const routes = await import("./modules/ai/ai.routes");
      server.register(routes.default, { prefix: "/api/ai" });
    });

    await safeRegister("analytics", async () => {
      const routes = await import("./modules/analytics/analytics.routes");
      server.register(routes.default, { prefix: "/api/analytics" });
    });

    await safeRegister("advisor", async () => {
      const routes = await import("./modules/advisor/advisor.routes");
      server.register(routes.default, { prefix: "/api/advisor" });
    });

    await safeRegister("payment", async () => {
      const routes = await import("./modules/payment/payment.routes");
      server.register(routes.default, { prefix: "/api/payment" });
    });

    await safeRegister("widget", async () => {
      const routes = await import("./modules/widget/widget.routes");
      server.register(routes.default, { prefix: "/api/widget" });
    });

    await safeRegister("setup", async () => {
      const routes = await import("./modules/setup/setup.routes");
      server.register(routes.default, { prefix: "/api/setup" });
    });

    await safeRegister("discovery", async () => {
      const routes = await import("./modules/discovery/discovery.routes");
      server.register(routes.default, { prefix: "/api/discovery" });
    });

    await safeRegister("notifications", async () => {
      const routes = await import("./modules/notification/notification.routes");
      server.register(routes.default, { prefix: "/api/notifications" });
    });

    console.log("ENV PORT:", process.env.PORT);
    const PORT = process.env.PORT || 3000;
    console.log("USING PORT:", PORT);

    await server.listen({
      port: Number(PORT),
      host: "0.0.0.0",
    });

    console.log("🔥 SERVER RUNNING ON", PORT);
  } catch (err) {
    console.error("💥 START FAILED:", err);
    process.exit(1);
  }
};

start();
