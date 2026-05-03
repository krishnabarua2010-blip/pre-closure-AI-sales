"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const path_1 = __importDefault(require("path"));
const static_1 = __importDefault(require("@fastify/static"));
const server = (0, fastify_1.default)({ logger: true });
server.register(cors_1.default, { origin: true });
// ✅ Serve frontend
server.register(static_1.default, {
    root: path_1.default.join(__dirname, '../public'),
});
// ✅ API routes under /api
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const widget_routes_1 = __importDefault(require("./modules/widget/widget.routes"));
server.register(auth_routes_1.default, { prefix: '/api/auth' });
server.register(ai_routes_1.default, { prefix: '/api/ai' });
server.register(widget_routes_1.default, { prefix: '/api/widget' });
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
