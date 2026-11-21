import crypto from 'node:crypto';
import { Session, User } from '@/types';

// In-Memory Session Store with sliding 30-minute expiration
const sessions = new Map<string, Session>();
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Rate Limiting & Account Lockout
// Composite key: `login_fail:${username}:${clientIp}`
interface FailureRecord {
  attempts: number;
  lockedUntil?: number;
}
const loginFailures = new Map<string, FailureRecord>();

export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const now = Date.now();
  if (now - session.lastAccessedAt > INACTIVITY_TIMEOUT_MS) {
    sessions.delete(sessionId);
    return null;
  }

  // Refresh sliding expiration
  session.lastAccessedAt = now;
  return session;
}

export function createSession(user: User): Session {
  const sessionId = crypto.randomUUID();
  const csrfToken = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  const session: Session = {
    id: sessionId,
    user,
    csrfToken,
    createdAt: now,
    lastAccessedAt: now,
  };

  sessions.set(sessionId, session);
  return session;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function checkLoginLockout(username: string, clientIp: string): { isLocked: boolean; retryAfterSeconds?: number } {
  const key = `login_fail:${username}:${clientIp}`;
  const record = loginFailures.get(key);
  if (!record || !record.lockedUntil) return { isLocked: false };

  const now = Date.now();
  if (now < record.lockedUntil) {
    const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, retryAfterSeconds: retryAfter };
  }

  // Lockout expired
  loginFailures.delete(key);
  return { isLocked: false };
}

export function recordLoginFailure(username: string, clientIp: string): { isLocked: boolean; attempts: number } {
  const key = `login_fail:${username}:${clientIp}`;
  const record = loginFailures.get(key) || { attempts: 0 };
  record.attempts += 1;

  if (record.attempts >= 5) {
    record.lockedUntil = Date.now() + 10 * 60 * 1000; // 10 minute lockout
    loginFailures.set(key, record);
    return { isLocked: true, attempts: record.attempts };
  }

  loginFailures.set(key, record);
  return { isLocked: false, attempts: record.attempts };
}

export function recordLoginSuccess(username: string, clientIp: string): void {
  const key = `login_fail:${username}:${clientIp}`;
  loginFailures.delete(key);
}

export function validateCsrfToken(session: Session, headerToken: string | null): boolean {
  if (!headerToken) return false;
  const bufA = Buffer.from(session.csrfToken, 'hex');
  const bufB = Buffer.from(headerToken, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function validateOrigin(originOrReferer: string | null, appBaseUrl: string): boolean {
  if (!originOrReferer) return false;
  try {
    const originHost = new URL(originOrReferer).host;
    const baseHost = new URL(appBaseUrl).host;
    return originHost === baseHost;
  } catch {
    return false;
  }
}
