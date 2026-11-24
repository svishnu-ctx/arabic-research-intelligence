'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Dictionary, dictionaries } from './dictionary';

interface I18nContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  t: Dictionary;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    // Check alwaha_lang cookie first, fallback to localStorage
    const cookieLang = getCookie('alwaha_lang') as Language | null;
    const localLang = localStorage.getItem('alwaha_lang') as Language | null ||
      localStorage.getItem('ari_preferred_lang') as Language | null;

    const initialLang = cookieLang || localLang;
    if (initialLang === 'ar' || initialLang === 'en') {
      setLanguageState(initialLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setCookie('alwaha_lang', lang, 365);
    localStorage.setItem('alwaha_lang', lang);
    localStorage.setItem('ari_preferred_lang', lang);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  const value: I18nContextType = {
    language,
    direction: language === 'ar' ? 'rtl' : 'ltr',
    t: dictionaries[language],
    setLanguage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
