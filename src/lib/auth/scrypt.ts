import crypto from 'node:crypto';
import { User, UserRole, Session } from '@/types';

export const SCRYPT_CONFIG = {
  N: 16384,
  r: 8,
  p: 1,
  keylen: 64,
  maxmem: 32 * 1024 * 1024,
};

class ScryptSemaphore {
  private active = 0;
  private readonly max = 2;
  private queue: Array<() => void> = [];

  async acquire(): Promise<void> {
    if (this.active < this.max) {
      this.active++;
      return;
    }
    return new Promise((resolve) => this.queue.push(resolve));
  }

  release(): void {
    this.active--;
    const next = this.queue.shift();
    if (next) {
      this.active++;
      next();
    }
  }
}

const scryptSemaphore = new ScryptSemaphore();

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  await scryptSemaphore.acquire();
  try {
    return await new Promise<string>((resolve, reject) => {
      crypto.scrypt(
        password,
        Buffer.from(saltHex, 'hex'),
        SCRYPT_CONFIG.keylen,
        { N: SCRYPT_CONFIG.N, r: SCRYPT_CONFIG.r, p: SCRYPT_CONFIG.p, maxmem: SCRYPT_CONFIG.maxmem },
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey.toString('hex'));
        }
      );
    });
  } finally {
    scryptSemaphore.release();
  }
}

export function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const bufA = Buffer.from(aHex, 'hex');
  const bufB = Buffer.from(bHex, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export interface DemoAccountConfig {
  username: string;
  role: UserRole;
  displayName: string;
  email: string;
  saltEnvVar: string;
  hashEnvVar: string;
}

export const DEMO_ACCOUNTS: Record<string, DemoAccountConfig> = {
  'student@sharjah.ac.ae': {
    username: 'student@sharjah.ac.ae',
    role: 'student',
    displayName: 'Maryam Al-Sharqi (مريم الشارقي)',
    email: 'student@sharjah.ac.ae',
    saltEnvVar: 'DEMO_SALT_STUDENT',
    hashEnvVar: 'DEMO_HASH_STUDENT',
  },
  student: {
    username: 'student',
    role: 'student',
    displayName: 'Maryam Al-Sharqi (مريم الشارقي)',
    email: 'student@sharjah.ac.ae',
    saltEnvVar: 'DEMO_SALT_STUDENT',
    hashEnvVar: 'DEMO_HASH_STUDENT',
  },
  student_demo: {
    username: 'student_demo',
    role: 'student',
    displayName: 'Maryam Al-Sharqi (مريم الشارقي)',
    email: 'student@sharjah.ac.ae',
    saltEnvVar: 'DEMO_SALT_STUDENT',
    hashEnvVar: 'DEMO_HASH_STUDENT',
  },
  admin_demo: {
    username: 'admin_demo',
    role: 'admin',
    displayName: 'Prof. Dr. Tariq Al-Nuaimi (Dean of Research)',
    email: 'admin.research@sharjah.ac.ae',
    saltEnvVar: 'DEMO_SALT_ADMIN',
    hashEnvVar: 'DEMO_HASH_ADMIN',
  },
  supervisor_demo: {
    username: 'supervisor_demo',
    role: 'supervisor',
    displayName: 'Dr. Fatima Al-Zahra (Research Supervisor)',
    email: 'falzahra@sharjah.ac.ae',
    saltEnvVar: 'DEMO_SALT_SUPERVISOR',
    hashEnvVar: 'DEMO_HASH_SUPERVISOR',
  },
  scholar_demo: {
    username: 'scholar_demo',
    role: 'scholar',
    displayName: 'Omar Al-Mansoor (Ph.D. Candidate)',
    email: 'o.mansoor@sharjah.ac.ae',
    saltEnvVar: 'DEMO_SALT_SCHOLAR',
    hashEnvVar: 'DEMO_HASH_SCHOLAR',
  },
};
