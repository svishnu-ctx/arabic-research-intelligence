'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t.common.universityName}</span>
        </div>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t.common.appName}
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {t.common.tagline}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          {user ? (
            <Link
              href={`/dashboard/${user.role}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition"
            >
              <span>الانتقال إلى {t.nav.dashboard}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition"
            >
              <span>{t.auth.signIn}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-xs text-slate-400 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            نظام التحقق والاستشهاد بالصفحات المادية
          </span>
          <span className="text-slate-300">•</span>
          <span>دعم كامل للعربية والإنجليزية (RTL/LTR)</span>
        </div>
      </div>
    </main>
  );
}
