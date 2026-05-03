"use strict";
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
server.register(cors_1.default, { origin: true });
// ✅ Serve frontend static files
server.register(static_1.default, {
    root: path_1.default.join(__dirname, '../public'),
});
// ✅ API Routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const conversation_routes_1 = __importDefault(require("./modules/conversation/conversation.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const advisor_routes_1 = __importDefault(require("./modules/advisor/advisor.routes"));
const payment_routes_1 = __importDefault(require("./modules/payment/payment.routes"));
const widget_routes_1 = __importDefault(require("./modules/widget/widget.routes"));
const setup_routes_1 = __importDefault(require("./modules/setup/setup.routes"));
const discovery_routes_1 = __importDefault(require("./modules/discovery/discovery.routes"));
const notification_routes_1 = __importDefault(require("./modules/notification/notification.routes"));
// API routes under /api prefix
server.register(auth_routes_1.default, { prefix: '/api/auth' });
server.register(conversation_routes_1.default, { prefix: '/api/conversation' });
server.register(ai_routes_1.default, { prefix: '/api/ai' });
server.register(analytics_routes_1.default, { prefix: '/api/analytics' });
server.register(advisor_routes_1.default, { prefix: '/api/advisor' });
server.register(payment_routes_1.default, { prefix: '/api/payment' });
server.register(widget_routes_1.default, { prefix: '/api/widget' });
server.register(setup_routes_1.default, { prefix: '/api/setup' });
server.register(discovery_routes_1.default, { prefix: '/api/discovery' });
server.register(notification_routes_1.default, { prefix: '/api/notifications' });
// Health check
server.get('/api/health', async () => {
    return { status: 'alive', timestamp: new Date().toISOString() };
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
        console.log("🔥 STARTING PRE-CLOSER AI SERVER");
        await server.listen({ port: Number(PORT), host: '0.0.0.0' });
        console.log("🔥 FULL APP LIVE ON PORT", PORT);
    }
    catch (err) {
        console.error("❌ SERVER CRASHED:", err);
        process.exit(1);
    }
};
start();
