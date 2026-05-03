"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("SERVER STARTING...");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const static_1 = __importDefault(require("@fastify/static"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const server = (0, fastify_1.default)({
    logger: true
});
server.register(cors_1.default, {
    origin: true
});
// Rate limiting for widget endpoints
server.register(rate_limit_1.default, {
    max: 30,
    timeWindow: '1 minute',
    allowList: [],
    keyGenerator: (request) => request.ip
});
// Serve static files (widget.js) from backend/public/
server.register(static_1.default, {
    root: path_1.default.join(__dirname, '..', 'public'),
    prefix: '/static/',
    decorateReply: false
});
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const conversation_routes_1 = __importDefault(require("./modules/conversation/conversation.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const advisor_routes_1 = __importDefault(require("./modules/advisor/advisor.routes"));
const payment_routes_1 = __importDefault(require("./modules/payment/payment.routes"));
const widget_routes_1 = __importDefault(require("./modules/widget/widget.routes"));
const setup_routes_1 = __importDefault(require("./modules/setup/setup.routes"));
const discovery_routes_1 = __importDefault(require("./modules/discovery/discovery.routes"));
// Health check
server.get('/', async () => {
    return { status: 'ok' };
});
server.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date() };
});
server.register(auth_routes_1.default, { prefix: '/auth' });
server.register(conversation_routes_1.default, { prefix: '/conversation' });
server.register(ai_routes_1.default, { prefix: '/ai' });
server.register(analytics_routes_1.default, { prefix: '/analytics' });
server.register(advisor_routes_1.default, { prefix: '/advisor' });
server.register(payment_routes_1.default, { prefix: '/payment' });
server.register(widget_routes_1.default, { prefix: '/widget' });
server.register(setup_routes_1.default, { prefix: '/setup' });
server.register(discovery_routes_1.default, { prefix: '/discovery' });
const start = async () => {
    try {
        console.log("🚀 START FUNCTION CALLED");
        const PORT = process.env.PORT || 8080;
        await server.listen({ port: Number(PORT), host: "0.0.0.0" });
        console.log("🔥 SERVER RUNNING ON", PORT);
    }
    catch (err) {
        console.error("❌ SERVER CRASHED:", err);
        process.exit(1);
    }
};
start();
