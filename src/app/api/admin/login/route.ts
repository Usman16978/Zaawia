import { NextRequest, NextResponse } from 'next/server';
import { createAdminCookie, COOKIE_NAME } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body?.password === 'string' ? body.password : '';
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || expected.length < 8) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 503 });
    }
    if (password !== expected) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    const cookie = createAdminCookie();
    if (!cookie) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 503 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, cookie.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookie.maxAge,
      path: '/',
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
