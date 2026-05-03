import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function safeQuery(fn: any) {
  try {
    return await fn();
  } catch (e) {
    console.error("Prisma error:", e);
    return null;
  }
}
