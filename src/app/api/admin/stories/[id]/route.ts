import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(_request);
  if (auth && 'ok' in auth) {
    try {
      const { id } = await params;
      await prisma.story.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
    }
  }
  return auth as NextResponse;
}
