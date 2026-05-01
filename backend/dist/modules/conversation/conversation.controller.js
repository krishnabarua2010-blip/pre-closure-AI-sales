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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const prisma_1 = require("../../config/prisma");
const conversation_schema_1 = require("./conversation.schema");
class ConversationController {
    static async initPublicConversation(request, reply) {
        try {
            const { slug } = conversation_schema_1.initConversationSchema.parse(request.params);
            const businessProfile = await prisma_1.prisma.businessProfile.findUnique({
                where: { slug },
                include: { User: true }
            });
            if (!businessProfile) {
                return reply.code(404).send({ error: 'Business profile not found' });
            }
            // Check if user has active limits
            if (businessProfile.User.messages_used >= businessProfile.User.message_limit) {
                return reply.code(402).send({ error: 'Assistant is temporarily unavailable.' });
            }
            // Create a fresh conversation bounded to this anonymous user session
            const conversation = await prisma_1.prisma.conversation.create({
                data: {
                    business_profile_id: businessProfile.id,
                    user_id: businessProfile.user_id, // Owner's user_id
                    status: 'ACTIVE'
                }
            });
            return reply.send({
                conversation_id: conversation.id,
                public_token: businessProfile.public_token,
                assistant_name: businessProfile.company_name
            });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return reply.code(400).send({ error: 'Validation failed', details: error.errors });
            }
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    static async handleAiMessage(request, reply) {
        try {
            const parsedBody = conversation_schema_1.aiMessageSchema.parse(request.body);
            // 1. Strict validation of conversation AND public_token
            const conversation = await prisma_1.prisma.conversation.findUnique({
                where: { id: parsedBody.conversation_id },
                include: {
                    BusinessProfile: { include: { User: true } }
                }
            });
            if (!conversation || conversation.BusinessProfile.public_token !== parsedBody.public_token) {
                return reply.code(401).send({ error: 'Unauthorized conversation access' });
            }
            const owner = conversation.BusinessProfile.User;
            // 2. Enforce limits on the Owner account
            if (owner.messages_used >= owner.message_limit) {
                return reply.code(402).send({ error: 'Assistant limits reached.' });
            }
            // Save user message
            await prisma_1.prisma.message.create({
                data: {
                    conversation_id: conversation.id,
                    sender: 'USER',
                    content: parsedBody.message
                }
            });
            // Increment owner's usage counter
            await prisma_1.prisma.user.update({
                where: { id: owner.id },
                data: { messages_used: { increment: 1 } }
            });
            // --- DELEGATING TO AI LOGIC (Agent 3) ---
            const { AIService } = await Promise.resolve().then(() => __importStar(require('../ai/ai.service')));
            const aiResponseContent = await AIService.generateResponse(conversation.id, parsedBody.message);
            // Save AI Response
            await prisma_1.prisma.message.create({
                data: {
                    conversation_id: conversation.id,
                    sender: 'AI',
                    content: aiResponseContent
                }
            });
            // Execute deep AI scoring and intent extraction in the background
            setImmediate(async () => {
                try {
                    await AIService.analyzeAndScore(conversation.id, parsedBody.message);
                }
                catch (bgError) {
                    console.error("Background AI Job Failed: ", bgError);
                }
            });
            return reply.send({
                reply: aiResponseContent,
                conversation_id: conversation.id
            });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return reply.code(400).send({ error: 'Validation failed', details: error.errors });
            }
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
}
exports.ConversationController = ConversationController;
