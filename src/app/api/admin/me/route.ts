import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
};

export async function GET() {
  const auth = await requireAdmin({} as Request);
  if (auth && 'ok' in auth) {
    return NextResponse.json({ admin: true }, { headers: noCacheHeaders });
  }
  const response = auth as NextResponse;
  const body = await response.json().catch(() => ({ error: 'Admin access required' }));
  return NextResponse.json(body, { status: response.status, headers: noCacheHeaders });
}
