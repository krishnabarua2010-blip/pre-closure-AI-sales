"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.safeQuery = safeQuery;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
async function safeQuery(fn) {
    try {
        return await fn();
    }
    catch (e) {
        console.error("Prisma error:", e);
        return null;
    }
}
