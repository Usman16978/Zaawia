import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Delete token required' }, { status: 400 });
    }
    const story = await prisma.story.findFirst({
      where: { id, deleteToken: token },
    });
    if (!story) {
      return NextResponse.json({ error: 'Story not found or invalid token' }, { status: 404 });
    }
    await prisma.story.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
