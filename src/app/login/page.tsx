'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, Lock, User, Eye, EyeOff, ShieldAlert, Globe } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t, language, setLanguage, direction } = useI18n();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await login(username, password);

    if (res.success) {
      if (username === 'admin_demo') router.push('/dashboard/admin');
      else if (username === 'supervisor_demo') router.push('/dashboard/supervisor');
      else if (username === 'scholar_demo') router.push('/dashboard/scholar');
      else if (username === 'student_demo') router.push('/dashboard/student');
      else router.push('/dashboard');
    } else {
      setIsLoading(false);
      setErrorMsg(res.error || t.auth.invalidCreds);
    }
  };

  const fillQuickDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
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
          {t.auth.loginSubtitle}
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
          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

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
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
                  placeholder="e.g. scholar_demo"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 ps-10 pe-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
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
              className="flex w-full justify-center rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 transition"
            >
              {isLoading ? t.auth.signingIn : t.auth.signIn}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="text-center text-xs font-medium text-slate-500 mb-3">
              {t.auth.demoNotice}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickDemo('admin_demo', 'Admin@Sharjah2026!')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition"
              >
                1. {t.roles.admin}
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('supervisor_demo', 'Supervisor@Sharjah2026!')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition"
              >
                2. {t.roles.supervisor}
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('scholar_demo', 'Scholar@Sharjah2026!')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition"
              >
                3. {t.roles.scholar}
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('student_demo', 'Student@Sharjah2026!')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition"
              >
                4. {t.roles.student}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
