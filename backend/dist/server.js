"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const widget_routes_1 = __importDefault(require("./modules/widget/widget.routes"));
const server = (0, fastify_1.default)({ logger: true });
server.addHook('onRequest', async (req) => {
    console.log("➡️", req.method, req.url);
});
server.register(auth_routes_1.default, { prefix: '/auth' });
server.register(ai_routes_1.default, { prefix: '/ai' });
server.register(widget_routes_1.default, { prefix: '/widget' });
server.get('/', async () => {
    return { status: 'alive' };
});
const start = async () => {
    try {
        const PORT = process.env.PORT || 3000;
        console.log("🔥 STARTING FASTIFY ON", PORT);
        await server.listen({
            port: Number(PORT),
            host: '0.0.0.0',
        });
        console.log("🔥 FASTIFY RUNNING");
    }
    catch (err) {
        console.error("❌ ERROR:", err);
        process.exit(1);
    }
};
start();
