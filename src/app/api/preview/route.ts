import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName, businessInfo } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ValidationError', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // User exists — check if they already have an active preview
      const existingPreview = await prisma.previewSession.findFirst({
        where: { userId: user.id, isActive: true },
      });

      if (existingPreview) {
        return NextResponse.json({
          message: 'You already have an active preview session',
          previewToken: existingPreview.previewToken,
          dashboardLink: `/dashboard?preview=${existingPreview.previewToken}`,
          messagesRemaining: existingPreview.messageLimit - existingPreview.messagesUsed,
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: { email, password },
      });
    }

    // Create preview session
    const previewToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await prisma.previewSession.create({
      data: {
        userId: user.id,
        businessName: businessName || null,
        businessInfo: businessInfo || null,
        previewToken,
        messageLimit: 15,
        expiresAt,
      },
    });

    // Generate auth token for the preview user
    const auth_token = `preview_${previewToken}_${Date.now()}`;

    const { password: _, ...safe_user } = user;

    const response = NextResponse.json({
      message: 'Preview session created successfully',
      previewToken,
      dashboardLink: `/dashboard?preview=${previewToken}`,
      messagesRemaining: session.messageLimit,
      auth_token,
      safe_user,
    }, { status: 201 });

    // Set auth cookie for preview access
    response.cookies.set('auth_token', auth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Preview Error:', error);
    return NextResponse.json(
      { error: 'InternalServerError', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
