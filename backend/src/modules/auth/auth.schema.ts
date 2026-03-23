import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  company_name: z.string().min(2),
  industry: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
