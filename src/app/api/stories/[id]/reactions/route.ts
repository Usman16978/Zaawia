import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TYPES = ['LIKE', 'MERE_SATH_BIHI'] as const;

async function getCounts(storyId: string) {
  const [like, mereSathBhi] = await Promise.all([
    prisma.reaction.count({ where: { storyId, type: 'LIKE' } }),
    prisma.reaction.count({ where: { storyId, type: 'MERE_SATH_BIHI' } }),
  ]);
  return { like, mereSathBhi };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const counts = await getCounts(id);
    return NextResponse.json(counts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const type = body?.type?.toUpperCase?.();
    if (!type || !TYPES.includes(type as (typeof TYPES)[number])) {
      return NextResponse.json({ error: 'Invalid type: LIKE or MERE_SATH_BIHI' }, { status: 400 });
    }
    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    const clientToken = typeof body?.clientToken === 'string' && body.clientToken.trim() ? body.clientToken.trim() : null;
    if (clientToken) {
      const existing = await prisma.reaction.findFirst({
        where: { storyId: id, type, clientToken },
      });
      if (existing) {
        const counts = await getCounts(id);
        return NextResponse.json(counts);
      }
    }
    await prisma.reaction.create({
      data: { storyId: id, type, clientToken },
    });
    const counts = await getCounts(id);
    return NextResponse.json(counts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const type = body?.type?.toUpperCase?.();
    if (!type || !TYPES.includes(type as (typeof TYPES)[number])) {
      return NextResponse.json({ error: 'Invalid type: LIKE or MERE_SATH_BIHI' }, { status: 400 });
    }
    const clientToken = typeof body?.clientToken === 'string' && body.clientToken.trim() ? body.clientToken.trim() : null;
    if (!clientToken) {
      return NextResponse.json({ error: 'clientToken required to remove reaction' }, { status: 400 });
    }
    const toDelete = await prisma.reaction.findFirst({
      where: { storyId: id, type, clientToken },
    });
    if (toDelete) {
      await prisma.reaction.delete({ where: { id: toDelete.id } });
    }
    const counts = await getCounts(id);
    return NextResponse.json(counts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to remove reaction' }, { status: 500 });
  }
}
