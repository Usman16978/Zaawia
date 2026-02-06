import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: { storyId: id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, content: true, createdAt: true },
    });
    return NextResponse.json(comments);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const content = body?.content?.trim?.();
    if (!content || content.length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    const deleteToken = randomBytes(24).toString('hex');
    const comment = await prisma.comment.create({
      data: { storyId: id, content: content.slice(0, 2000), deleteToken },
      select: { id: true, content: true, createdAt: true, deleteToken: true },
    });
    return NextResponse.json(comment);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
