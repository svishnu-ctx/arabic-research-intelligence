import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (sessionId) {
    deleteSession(sessionId);
  }

  const res = NextResponse.json(
    { success: true },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );

  res.headers.set('Set-Cookie', 'ari_session_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
  return res;
}
