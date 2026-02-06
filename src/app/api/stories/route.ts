import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const promptId = searchParams.get('promptId');
    const category = searchParams.get('category');
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
    const where: { promptId?: string; category?: string } = {};
    if (promptId && promptId.trim()) where.promptId = promptId.trim();
    if (category && category.trim()) where.category = category.trim().toUpperCase();
    const stories = await prisma.story.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        content: true,
        promptId: true,
        category: true,
        createdAt: true,
        prompt: { select: { id: true, text: true, slug: true } },
        _count: { select: { comments: true } },
      },
    });
    return NextResponse.json(stories);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = body?.content;
    const promptId = body?.promptId;
    const category = body?.category;
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    const validCategories = ['SAD', 'ROMANTIC', 'ANGER', 'HOPE', 'FEAR', 'LONELY', 'FAMILY', 'FRIENDSHIP'];
    const categoryValue =
      category && typeof category === 'string' && validCategories.includes(category.toUpperCase())
        ? category.toUpperCase()
        : null;
    const deleteToken = randomBytes(24).toString('hex');
    const story = await prisma.story.create({
      data: {
        content: content.trim().slice(0, 10000),
        promptId: promptId && String(promptId).trim() ? String(promptId).trim() : null,
        category: categoryValue,
        deleteToken,
      },
      select: {
        id: true,
        createdAt: true,
        deleteToken: true,
        prompt: { select: { text: true, slug: true } },
      },
    });
    return NextResponse.json(story);
  } catch (e) {
    const err = e as Error;
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
