"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const path_1 = __importDefault(require("path"));
const static_1 = __importDefault(require("@fastify/static"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = (0, fastify_1.default)({ logger: true });
// ✅ Base plugins
server.register(cors_1.default, { origin: true });
server.register(static_1.default, {
    root: path_1.default.join(__dirname, '../public'),
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
async function safeRegister(name, fn) {
    try {
        await fn();
        console.log(`✅ Loaded: ${name}`);
    }
    catch (e) {
        console.error(`❌ Failed loading ${name}:`, e);
    }
}
// ✅ START SERVER LAST
const start = async () => {
    try {
        console.log("🚀 Starting server...");
        // ✅ Register modules SAFELY inside start to allow async/await without top-level await issues
        await safeRegister("auth", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/auth/auth.routes")));
            server.register(routes.default, { prefix: "/api/auth" });
        });
        await safeRegister("conversation", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/conversation/conversation.routes")));
            server.register(routes.default, { prefix: "/api/conversation" });
        });
        await safeRegister("ai", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/ai/ai.routes")));
            server.register(routes.default, { prefix: "/api/ai" });
        });
        await safeRegister("analytics", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/analytics/analytics.routes")));
            server.register(routes.default, { prefix: "/api/analytics" });
        });
        await safeRegister("advisor", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/advisor/advisor.routes")));
            server.register(routes.default, { prefix: "/api/advisor" });
        });
        await safeRegister("payment", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/payment/payment.routes")));
            server.register(routes.default, { prefix: "/api/payment" });
        });
        await safeRegister("widget", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/widget/widget.routes")));
            server.register(routes.default, { prefix: "/api/widget" });
        });
        await safeRegister("setup", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/setup/setup.routes")));
            server.register(routes.default, { prefix: "/api/setup" });
        });
        await safeRegister("discovery", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/discovery/discovery.routes")));
            server.register(routes.default, { prefix: "/api/discovery" });
        });
        await safeRegister("notifications", async () => {
            const routes = await Promise.resolve().then(() => __importStar(require("./modules/notification/notification.routes")));
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
    }
    catch (err) {
        console.error("💥 START FAILED:", err);
        process.exit(1);
    }
};
start();
