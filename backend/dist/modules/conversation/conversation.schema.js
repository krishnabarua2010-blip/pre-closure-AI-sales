"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiMessageSchema = exports.initConversationSchema = void 0;
const zod_1 = require("zod");
exports.initConversationSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1)
});
exports.aiMessageSchema = zod_1.z.object({
    conversation_id: zod_1.z.number().int().positive(),
    public_token: zod_1.z.string().min(10),
    message: zod_1.z.string().min(1).max(2000)
});
