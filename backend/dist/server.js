"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)({ logger: true });
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
