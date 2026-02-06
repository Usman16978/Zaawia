import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, text: true, slug: true },
    });
    return NextResponse.json(prompts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}
