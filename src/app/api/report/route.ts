import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyId, commentId, reason } = body;
    if (!storyId && !commentId) {
      return NextResponse.json({ error: 'storyId or commentId required' }, { status: 400 });
    }
    await prisma.report.create({
      data: {
        storyId: storyId || null,
        commentId: commentId || null,
        reason: reason?.slice(0, 500) || null,
      },
    });
    return NextResponse.json({ ok: true, message: 'Report submitted. We will review.' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
