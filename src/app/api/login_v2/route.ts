import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Fetch User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Check if User Exists
    if (!user) {
      return NextResponse.json(
        { error: 'AccessDenied', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Validate Password
    // In production, use bcrypt.compare here
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'AccessDenied', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 4. Generate Token
    const auth_token = `local_token_${Buffer.from(user.email).toString('base64')}_${Date.now()}`;

    // 5. Remove Password From Response
    const { password: _, ...safe_user } = user;

    // 6. Create response with cookie
    const response = NextResponse.json({
      auth_token,
      safe_user,
    });

    // Set HTTP-only cookie for middleware auth
    response.cookies.set('auth_token', auth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'InternalServerError', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
