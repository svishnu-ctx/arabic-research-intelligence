import { describe, it } from 'node:test';
import assert from 'node:assert';
import { hashPassword, timingSafeEqualHex } from './scrypt';
import {
  createSession,
  getSession,
  deleteSession,
  checkLoginLockout,
  recordLoginFailure,
  recordLoginSuccess,
  validateCsrfToken,
  validateOrigin,
} from './session';
import { User } from '@/types';

describe('Scrypt & Session Security Module', () => {
  const mockUser: User = {
    id: 'user-admin',
    username: 'admin_demo',
    role: 'admin',
    displayName: 'Admin User',
    email: 'admin@sharjah.ac.ae',
  };

  it('generates consistent scrypt hash for identical password and salt', async () => {
    const salt = '3e0728d60855f82efb11fbe7934cdd4c';
    const hash1 = await hashPassword('Admin@Sharjah2026!', salt);
    const hash2 = await hashPassword('Admin@Sharjah2026!', salt);
    assert.strictEqual(hash1, hash2);
    assert.strictEqual(timingSafeEqualHex(hash1, hash2), true);
  });

  it('manages sessions and validates CSRF tokens correctly', () => {
    const session = createSession(mockUser);
    assert.ok(session.id);
    assert.ok(session.csrfToken);

    // Retrieve active session
    const retrieved = getSession(session.id);
    assert.strictEqual(retrieved?.user.username, 'admin_demo');

    // Valid CSRF
    assert.strictEqual(validateCsrfToken(session, session.csrfToken), true);
    // Invalid CSRF
    assert.strictEqual(validateCsrfToken(session, 'wrong-token'), false);

    deleteSession(session.id);
    assert.strictEqual(getSession(session.id), null);
  });

  it('locks out composite user and IP after 5 failed attempts and resets on success', () => {
    const username = 'student_test';
    const ip = '192.168.1.100';

    // Attempts 1 to 4: not locked
    for (let i = 1; i <= 4; i++) {
      const result = recordLoginFailure(username, ip);
      assert.strictEqual(result.isLocked, false);
      assert.strictEqual(checkLoginLockout(username, ip).isLocked, false);
    }

    // Attempt 5: triggers lockout
    const attempt5 = recordLoginFailure(username, ip);
    assert.strictEqual(attempt5.isLocked, true);
    const status = checkLoginLockout(username, ip);
    assert.strictEqual(status.isLocked, true);
    assert.ok(status.retryAfterSeconds! > 500);

    // Reset on success
    recordLoginSuccess(username, ip);
    assert.strictEqual(checkLoginLockout(username, ip).isLocked, false);
  });

  it('validates Origin/Referer against APP_BASE_URL', () => {
    const appBase = 'http://localhost:3000';
    assert.strictEqual(validateOrigin('http://localhost:3000', appBase), true);
    assert.strictEqual(validateOrigin('http://localhost:3000/some/path', appBase), true);
    assert.strictEqual(validateOrigin('https://malicious.com', appBase), false);
    assert.strictEqual(validateOrigin(null, appBase), false);
  });
});
