import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/admin-auth';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
};

export async function POST() {
  const res = NextResponse.json({ ok: true }, { headers: noCacheHeaders });
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return res;
}
