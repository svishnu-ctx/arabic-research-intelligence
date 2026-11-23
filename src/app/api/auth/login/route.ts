import { NextRequest, NextResponse } from 'next/server';
import {
  DEMO_ACCOUNTS,
  hashPassword,
  timingSafeEqualHex,
} from '@/lib/auth/scrypt';
import {
  createSession,
  checkLoginLockout,
  recordLoginFailure,
  recordLoginSuccess,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim());
    return parts[parts.length - 1] || 'unknown';
  }
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const clientIp = getClientIp(req);
    const lockout = checkLoginLockout(username, clientIp);
    if (lockout.isLocked) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(lockout.retryAfterSeconds || 600),
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Special support for required mock student credentials
    const isMockStudent =
      (username.toLowerCase() === 'student@sharjah.ac.ae' || username.toLowerCase() === 'student') &&
      password === 'Student@123';

    let account = DEMO_ACCOUNTS[username] || DEMO_ACCOUNTS[username.toLowerCase()];
    if (!account && isMockStudent) {
      account = DEMO_ACCOUNTS['student@sharjah.ac.ae'];
    }

    if (!account) {
      recordLoginFailure(username, clientIp);
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    let isValid = false;
    if (isMockStudent) {
      isValid = true;
    } else {
      const salt = process.env[account.saltEnvVar];
      const expectedHash = process.env[account.hashEnvVar];

      if (salt && expectedHash) {
        const computedHash = await hashPassword(password, salt);
        isValid = timingSafeEqualHex(computedHash, expectedHash);
      } else {
        // Fallback for demo environments if salt/hash not set
        isValid = password === 'Student@123' || password === 'demo123';
      }
    }

    if (!isValid) {
      const failStatus = recordLoginFailure(username, clientIp);
      if (failStatus.isLocked) {
        return NextResponse.json(
          { error: 'Account temporarily locked due to multiple failed attempts.' },
          { status: 429, headers: { 'Retry-After': '600', 'Cache-Control': 'no-store' } }
        );
      }
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Success
    recordLoginSuccess(username, clientIp);

    const user = {
      id: `usr_${account.role}`,
      username: account.username,
      role: account.role,
      displayName: account.displayName,
      email: account.email,
    };

    const session = createSession(user);

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

    const res = NextResponse.json(
      {
        success: true,
        user,
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

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal authentication error.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
