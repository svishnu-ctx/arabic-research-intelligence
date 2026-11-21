import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;

  if (!sessionId) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const session = getSession(sessionId);
  if (!session) {
    const res = NextResponse.json(
      { authenticated: false, error: 'Session expired or invalid.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
    res.headers.set('Set-Cookie', 'ari_session_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    return res;
  }

  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = [
    `ari_session_token=${session.id}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=1800',
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  return NextResponse.json(
    {
      authenticated: true,
      user: session.user,
      csrfToken: session.csrfToken,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': cookieOptions,
      },
    }
  );
}
