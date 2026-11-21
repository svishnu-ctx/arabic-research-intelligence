import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = getSession(sessionId);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      status: 'BLOCKED',
      reason: 'GEMINI_API_KEY is not set in server environment'
    });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Verify Gemini API' }] }]
      })
    });

    if (res.ok) {
      return NextResponse.json({
        configured: true,
        status: 'VERIFIED_ACTIVE',
        model: 'gemini-2.5-flash'
      });
    } else {
      const err = await res.text();
      return NextResponse.json({
        configured: true,
        status: 'ERROR',
        statusCode: res.status,
        error: err
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      status: 'NETWORK_ERROR',
      error: err.message
    });
  }
}
