import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const auth = await requireAdmin({} as Request);
  if (auth && 'ok' in auth) {
    return NextResponse.json({ admin: true });
  }
  return auth as NextResponse;
}
