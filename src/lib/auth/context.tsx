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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>('mock-csrf-token-2026');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          setUser(parsed);
          setCsrfToken('mock-csrf-token-2026');
          setIsLoading(false);
          return;
        }
      }

      // Try server session if available
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setCsrfToken(data.csrfToken || 'mock-csrf-token-2026');
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      // Mock fallback: if server not reachable, check localStorage or keep null
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (username: string = 'student@sharjah.ac.ae', password?: string) => {
    setIsLoading(true);

    const cleanUsername = username.trim() || 'student@sharjah.ac.ae';
    const isMockStudent =
      cleanUsername.toLowerCase() === 'student@sharjah.ac.ae' ||
      cleanUsername.toLowerCase() === 'student' ||
      cleanUsername === 'student_demo';

    const displayName = isMockStudent
      ? 'Maryam Al-Sharqi (مريم الشارقي)'
      : cleanUsername === 'researcher' || cleanUsername === 'scholar_demo'
      ? 'د. باحث أكاديمي / Academic Researcher'
      : cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);

    const mockUser: User = {
      id: isMockStudent ? 'usr_student_01' : `usr_${Date.now()}`,
      username: cleanUsername,
      role: 'student',
      displayName,
      email: isMockStudent ? 'student@sharjah.ac.ae' : `${cleanUsername.toLowerCase().replace(/\s+/g, '_')}@sharjah.ac.ae`,
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
