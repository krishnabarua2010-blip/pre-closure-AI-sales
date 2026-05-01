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
exports.WidgetController = void 0;
const prisma_1 = require("../../config/prisma");
class WidgetController {
    /**
     * POST /widget/init
     * Body: { slug: string }
     * Creates a conversation session for the widget visitor.
     */
    static async initSession(request, reply) {
        try {
            const { slug } = request.body;
            if (!slug || typeof slug !== 'string') {
                return reply.code(400).send({ error: 'slug is required' });
            }
            const businessProfile = await prisma_1.prisma.businessProfile.findUnique({
                where: { slug },
                include: { User: true }
            });
            if (!businessProfile) {
                return reply.code(404).send({ error: 'Business not found' });
            }
            if (businessProfile.User.messages_used >= businessProfile.User.message_limit) {
                return reply.code(402).send({ error: 'Assistant is temporarily unavailable.' });
            }
            const conversation = await prisma_1.prisma.conversation.create({
                data: {
                    business_profile_id: businessProfile.id,
                    user_id: businessProfile.user_id,
                    status: 'ACTIVE'
                }
            });
            return reply.send({
                conversationId: conversation.id,
                publicToken: businessProfile.public_token,
                assistantName: businessProfile.company_name
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
    /**
     * POST /widget/chat
     * Body: { conversationId: number, publicToken: string, message: string }
     * Sends a user message and returns the AI reply.
     */
    static async chat(request, reply) {
        try {
            const { conversationId, publicToken, message } = request.body;
            if (!conversationId || !publicToken || !message) {
                return reply.code(400).send({ error: 'conversationId, publicToken, and message are required' });
            }
            const conversation = await prisma_1.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: {
                    BusinessProfile: { include: { User: true } }
                }
            });
            if (!conversation || conversation.BusinessProfile.public_token !== publicToken) {
                return reply.code(401).send({ error: 'Unauthorized' });
            }
            const owner = conversation.BusinessProfile.User;
            if (owner.messages_used >= owner.message_limit) {
                return reply.code(402).send({ error: 'Message limit reached.' });
            }
            // Save user message
            await prisma_1.prisma.message.create({
                data: {
                    conversation_id: conversation.id,
                    sender: 'USER',
                    content: message
                }
            });
            // Increment usage
            await prisma_1.prisma.user.update({
                where: { id: owner.id },
                data: { messages_used: { increment: 1 } }
            });
            // Generate AI response
            const { AIService } = await Promise.resolve().then(() => __importStar(require('../ai/ai.service')));
            const aiReply = await AIService.generateResponse(conversation.id, message);
            // Save AI response
            await prisma_1.prisma.message.create({
                data: {
                    conversation_id: conversation.id,
                    sender: 'AI',
                    content: aiReply
                }
            });
            // Background scoring + lead capture
            setImmediate(async () => {
                try {
                    await AIService.analyzeAndScore(conversation.id, message);
                }
                catch (err) {
                    console.error('Widget background scoring error:', err);
                }
            });
            return reply.send({
                reply: aiReply,
                conversationId: conversation.id
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    }
}
exports.WidgetController = WidgetController;
