'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, Lock, User, Eye, EyeOff, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t, language, setLanguage, direction } = useI18n();
  const router = useRouter();

  const [username, setUsername] = useState('researcher');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await login(username, password);
    router.push('/dashboard');
  };

  const handleInstantLogin = async () => {
    setIsLoading(true);
    await login('researcher', 'demo123');
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8" dir={direction}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/20">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-emerald-800">
          {t.common.universityName}
        </h2>
        <h1 className="mt-1 text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {t.common.appName}
        </h1>
        <p className="mt-2 text-center text-xs text-slate-600">
          {language === 'ar'
            ? 'تسجيل الدخول التجريبي الموحد للمنصة الأكاديمية ومختبر التقييم'
            : 'Unified Mock Login for Academic Research Intelligence & AI Evaluation Lab'}
        </p>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {t.auth.username}
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
                  placeholder="e.g. researcher"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {t.auth.password}
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 ps-10 pe-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
                  placeholder="demo password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 transition"
            >
              <span>{isLoading ? t.auth.signingIn : (language === 'ar' ? 'تسجيل الدخول التجريبي' : 'Mock Sign In')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Instant 1-Click Access */}
          <div className="mt-5 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleInstantLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/70 transition"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{language === 'ar' ? 'دخول مباشر فوري (نقرة واحدة)' : 'Instant 1-Click Access (No credentials needed)'}</span>
            </button>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center text-[11px] text-slate-500">
              {language === 'ar'
                ? 'تم إلغاء قيود الأدوار؛ جميع خدمات المنصة ومختبر التقييم متاحة بالكامل ومفتوحة لجميع المستخدمين.'
                : 'All role restrictions have been removed. All research modules and the AI Evaluation Lab are unlocked.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
