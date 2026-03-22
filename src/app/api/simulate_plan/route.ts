import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { plan: 'growth', planStatus: 'active' }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Simulate Plan Error:', error);
    return NextResponse.json(
      { error: 'InternalServerError', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
