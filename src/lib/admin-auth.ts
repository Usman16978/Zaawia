import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'zaawiya_admin';
const MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

function getSecret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s || s.length < 8) return '';
  return s;
}

function sign(payload: string): string {
  const secret = getSecret();
  if (!secret) return '';
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function createAdminCookie(): { value: string; maxAge: number } | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = JSON.stringify({ admin: true, exp: Date.now() + MAX_AGE * 1000 });
  const encoded = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = sign(encoded);
  return { value: `${encoded}.${signature}`, maxAge: MAX_AGE };
}

export function verifyAdminCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const secret = getSecret();
  if (!secret) return false;
  const dot = cookieValue.indexOf('.');
  if (dot === -1) return false;
  const encoded = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  const expected = sign(encoded);
  const expectedBuf = Buffer.from(expected, 'hex');
  const sigBuf = Buffer.from(sig, 'hex');
  if (expectedBuf.length !== sigBuf.length || expectedBuf.length === 0 || !timingSafeEqual(expectedBuf, sigBuf)) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload?.admin === true && typeof payload?.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin(request: Request): Promise<{ ok: true } | NextResponse> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifyAdminCookie(cookie)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }
  return { ok: true };
}

export { COOKIE_NAME };
