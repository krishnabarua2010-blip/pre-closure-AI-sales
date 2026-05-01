"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../config/prisma");
const auth_schema_1 = require("./auth.schema");
const crypto_1 = __importDefault(require("crypto"));
class AuthController {
    static async signup(request, reply) {
        try {
            const parsedBody = auth_schema_1.signupSchema.parse(request.body);
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email: parsedBody.email }
            });
            if (existingUser) {
                return reply.code(400).send({ error: 'Email already exists' });
            }
            const password_hash = await bcryptjs_1.default.hash(parsedBody.password, 10);
            // Auto-generate unique slug based on company name
            const baseSlug = parsedBody.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const uniqueSuffix = crypto_1.default.randomBytes(3).toString('hex');
            const slug = `${baseSlug}-${uniqueSuffix}`;
            const public_token = crypto_1.default.randomBytes(16).toString('hex');
            const user = await prisma_1.prisma.user.create({
                data: {
                    email: parsedBody.email,
                    password_hash,
                    BusinessProfiles: {
                        create: {
                            company_name: parsedBody.company_name,
                            industry: parsedBody.industry || null,
                            slug,
                            public_token
                        }
                    }
                },
                include: { BusinessProfiles: true }
            });
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is required");
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return reply.code(201).send({
                message: 'Account created successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    plan: user.plan,
                    businessProfile: user.BusinessProfiles[0]
                }
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return reply.code(400).send({ error: 'Validation failed', details: JSON.parse(error.message) });
            }
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    static async login(request, reply) {
        try {
            const parsedBody = auth_schema_1.loginSchema.parse(request.body);
            const user = await prisma_1.prisma.user.findUnique({
                where: { email: parsedBody.email },
                include: { BusinessProfiles: true }
            });
            if (!user) {
                return reply.code(401).send({ error: 'Invalid credentials' });
            }
            const isMatch = await bcryptjs_1.default.compare(parsedBody.password, user.password_hash);
            if (!isMatch) {
                return reply.code(401).send({ error: 'Invalid credentials' });
            }
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is required");
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return reply.send({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    plan: user.plan,
                    usage: { used: user.messages_used, limit: user.message_limit },
                    businessProfile: user.BusinessProfiles[0]
                }
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return reply.code(400).send({ error: 'Validation failed', details: JSON.parse(error.message) });
            }
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    static async guest(request, reply) {
        try {
            const guestId = crypto_1.default.randomBytes(4).toString('hex');
            const email = `guest_${guestId}@preview.local`;
            const password = crypto_1.default.randomBytes(8).toString('hex');
            const password_hash = await bcryptjs_1.default.hash(password, 10);
            const slug = `guest-preview-${guestId}`;
            const public_token = crypto_1.default.randomBytes(16).toString('hex');
            const user = await prisma_1.prisma.user.create({
                data: {
                    email,
                    password_hash,
                    message_limit: 15,
                    BusinessProfiles: {
                        create: {
                            company_name: 'Guest Business (Preview)',
                            industry: 'SaaS',
                            slug,
                            public_token
                        }
                    }
                },
                include: { BusinessProfiles: true }
            });
            if (!process.env.JWT_SECRET)
                throw new Error("JWT_SECRET is required");
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return reply.code(201).send({
                message: 'Guest session created',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    plan: user.plan,
                    usage: { used: user.messages_used, limit: user.message_limit },
                    businessProfile: user.BusinessProfiles[0]
                }
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to create guest session' });
        }
    }
}
exports.AuthController = AuthController;
