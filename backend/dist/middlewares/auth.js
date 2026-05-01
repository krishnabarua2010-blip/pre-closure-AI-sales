"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const authenticate = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.code(401).send({ error: 'Unauthorized: Missing or invalid token format' });
        }
        const token = authHeader.split(' ')[1];
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is required");
        }
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id },
            include: { BusinessProfiles: true }
        });
        if (!user) {
            return reply.code(401).send({ error: 'Unauthorized: User not found' });
        }
        request.user = user;
    }
    catch (error) {
        return reply.code(401).send({ error: 'Unauthorized: Token is invalid or expired' });
    }
};
exports.authenticate = authenticate;
