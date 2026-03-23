import { z } from 'zod';

export const initConversationSchema = z.object({
  slug: z.string().min(1)
});

export const aiMessageSchema = z.object({
  conversation_id: z.number().int().positive(),
  public_token: z.string().min(10),
  message: z.string().min(1).max(2000)
});

export type InitConversationInput = z.infer<typeof initConversationSchema>;
export type AiMessageInput = z.infer<typeof aiMessageSchema>;
