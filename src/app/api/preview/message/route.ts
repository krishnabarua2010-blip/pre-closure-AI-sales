import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { previewToken, message } = await request.json();

    if (!previewToken || !message) {
      return NextResponse.json(
        { error: 'ValidationError', message: 'previewToken and message are required' },
        { status: 400 }
      );
    }

    // Find the preview session
    const session = await prisma.previewSession.findUnique({
      where: { previewToken },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'NotFound', message: 'Preview session not found' },
        { status: 404 }
      );
    }

    // Check if session is still active
    if (!session.isActive) {
      return NextResponse.json(
        { error: 'SessionExpired', message: 'Your preview session has expired. Please upgrade to continue.' },
        { status: 403 }
      );
    }

    // Check expiration
    if (new Date() > session.expiresAt) {
      await prisma.previewSession.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      return NextResponse.json(
        { error: 'SessionExpired', message: 'Your preview session has expired. Please upgrade to continue.' },
        { status: 403 }
      );
    }

    // Check message limit
    if (session.messagesUsed >= session.messageLimit) {
      await prisma.previewSession.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      return NextResponse.json({
        error: 'LimitReached',
        message: `You've used all ${session.messageLimit} preview messages. Upgrade to keep using Pre-Closer AI.`,
        messagesUsed: session.messagesUsed,
        messageLimit: session.messageLimit,
        upgradeLink: '/pricing',
      }, { status: 403 });
    }

    // Increment message count
    const updatedSession = await prisma.previewSession.update({
      where: { id: session.id },
      data: { messagesUsed: session.messagesUsed + 1 },
    });

    // TODO: Forward message to AI/Xano for actual response
    // For now, return a placeholder response
    const aiResponse = generatePreviewResponse(message, updatedSession.messagesUsed);

    return NextResponse.json({
      response: aiResponse,
      messagesUsed: updatedSession.messagesUsed,
      messagesRemaining: updatedSession.messageLimit - updatedSession.messagesUsed,
      messageLimit: updatedSession.messageLimit,
    });
  } catch (error) {
    console.error('Preview Message Error:', error);
    return NextResponse.json(
      { error: 'InternalServerError', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function generatePreviewResponse(message: string, messageNumber: number): string {
  // Placeholder AI responses for preview mode
  const responses = [
    "Thanks for reaching out! I'm your AI pre-closer. Tell me — what's your current monthly revenue and what are you looking to achieve?",
    "Got it. That's helpful context. What's the biggest challenge your sales team faces right now when it comes to qualifying leads?",
    "Interesting. How many leads does your team handle per week, and what percentage would you say are actually qualified?",
    "I see the opportunity here. Based on what you've shared, Pre-Closer AI could help you filter 60-80% of unqualified leads automatically. What's your current sales team size?",
    "Great. With a team of that size, our AI would essentially act as an additional SDR — pre-qualifying every lead 24/7. Would you like to see how the lead scoring works?",
    "The lead scoring uses 12 different buying signals including authority level, budget indicators, and urgency markers. Each lead gets a score from 0-100. Want me to walk you through a real scenario?",
    "Perfect! Here's an example: When a lead mentions a specific budget range and a timeline under 30 days, that's immediately scored 75+. Combined with authority signals like 'I'm the CEO', it jumps to 85+. Those leads get auto-booked for a call.",
    "Would you like to discuss pricing plans? We have a Starter plan and a Growth plan, both with a 50% beta discount right now.",
    "I'd recommend the Growth plan for your team size. It includes unlimited messages, AI revenue advisor, and all the automation features. Should I help you get started?",
    "Great chatting with you! To get full access to all features, check out our pricing at /pricing. You're close to the end of your free preview — make the most of it!",
  ];

  const idx = Math.min(messageNumber - 1, responses.length - 1);
  return responses[idx];
}
