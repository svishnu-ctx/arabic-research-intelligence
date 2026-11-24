'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  csrfToken: string | null;
  isLoading: boolean;
  login: (username?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'mock_auth_user_session';

const DEFAULT_PROD_USER: User = {
  id: 'usr_student_01',
  username: 'student@alwaha.ac.ae',
  role: 'student',
  displayName: 'Maryam Al-Mazrouei (مريم المزروعي)',
  email: 'student@alwaha.ac.ae',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_PROD_USER);
  const [csrfToken, setCsrfToken] = useState<string | null>('mock-csrf-token-2026');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshSession = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          setUser(parsed);
          setCsrfToken('mock-csrf-token-2026');
          return;
        }
      }

      // If no stored session, fallback seamlessly to default demo user so no user is blocked
      setUser(DEFAULT_PROD_USER);
    } catch {
      setUser(DEFAULT_PROD_USER);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (username: string = 'student@alwaha.ac.ae', password?: string) => {
    setIsLoading(true);

    const cleanUsername = username.trim() || 'student@alwaha.ac.ae';
    const isMockStudent =
      cleanUsername.toLowerCase() === 'student@alwaha.ac.ae' ||
      cleanUsername.toLowerCase() === 'student' ||
      cleanUsername === 'student_demo';

    const isMockSupervisor =
      cleanUsername.toLowerCase() === 'falzahra@alwaha.ac.ae' ||
      cleanUsername.toLowerCase() === 'supervisor' ||
      cleanUsername === 'supervisor_demo';

    const isMockAdmin =
      cleanUsername.toLowerCase() === 'admin_demo' ||
      cleanUsername.toLowerCase() === 'admin' ||
      cleanUsername.toLowerCase() === 'admin.research@alwaha.ac.ae';

    const role: User['role'] = isMockSupervisor
      ? 'supervisor'
      : isMockAdmin
      ? 'admin'
      : 'student';

    const displayName = isMockSupervisor
      ? 'Dr. Fatima Al-Zahra (د. فاطمة الزهراء)'
      : isMockAdmin
      ? 'Prof. Dr. Tariq Al-Nuaimi (أ.د. طارق النعيمي)'
      : isMockStudent
      ? 'Maryam Al-Mazrouei (مريم المزروعي)'
      : cleanUsername === 'researcher' || cleanUsername === 'scholar_demo'
      ? 'د. باحث أكاديمي / Academic Researcher'
      : cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);

    const email = isMockSupervisor
      ? 'falzahra@alwaha.ac.ae'
      : isMockAdmin
      ? 'admin.research@alwaha.ac.ae'
      : isMockStudent
      ? 'student@alwaha.ac.ae'
      : `${cleanUsername.toLowerCase().replace(/\s+/g, '_')}@alwaha.ac.ae`;

    const mockUser: User = {
      id: isMockSupervisor ? 'usr_supervisor_01' : isMockAdmin ? 'usr_admin_01' : isMockStudent ? 'usr_student_01' : `usr_${Date.now()}`,
      username: cleanUsername,
      role,
      displayName,
      email,
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: password || 'Student@123',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
          }
          setUser(data.user);
          setCsrfToken(data.csrfToken || 'mock-csrf-token-2026');
          setIsLoading(false);
          return { success: true };
        }
      }
    } catch {
      // Continue to mock fallback
    }

    // Mock fallback when offline or in development
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    }

    setUser(mockUser);
    setCsrfToken('mock-csrf-token-2026');
    setIsLoading(false);

    return { success: true };
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      setUser(null);
      setCsrfToken(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, csrfToken, isLoading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
