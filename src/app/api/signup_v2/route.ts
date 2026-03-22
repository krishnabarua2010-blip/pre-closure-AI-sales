import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'ValidationError', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'UserExists', message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user (plaintext password for demo — use bcrypt in production)
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    // Return success (no token — user should login after signup)
    const { password: _, ...safe_user } = user;

    return NextResponse.json({
      message: 'Account created successfully',
      user: safe_user,
    }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { error: 'InternalServerError', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
