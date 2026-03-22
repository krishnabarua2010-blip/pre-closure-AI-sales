import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // In production, you'd verify an admin JWT token here
    // For now, we'll return aggregate stats from the local user table

    const total_users = await prisma.user.count();

    // Mock paid users and revenue (in production these come from Stripe/payment DB)
    const paid_users = Math.floor(total_users * 0.23); // ~23% conversion
    const mrr = paid_users * 190; // Average plan price
    const qualified_leads = Math.floor(total_users * 1.2); // 1.2 qualified leads per user

    return NextResponse.json({
      total_users,
      paid_users,
      mrr,
      qualified_leads,
      total_conversations: total_users * 8, // avg 8 conversations per user
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return NextResponse.json(
      { error: 'InternalServerError', message: 'Failed to fetch admin metrics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
