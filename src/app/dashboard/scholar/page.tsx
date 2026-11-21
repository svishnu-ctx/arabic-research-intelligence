'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { FileText, ArrowLeftRight, Search, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function ScholarDashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                {t.roles.scholar}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {t.nav.myPapers} & {t.nav.literatureResearch}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              مساعد متقدم لأبحاث الدكتوراه والمقارنة المنهجية بين الأوراق
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard/scholar/compare"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>{t.nav.comparePapers} (P0)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/dashboard/scholar/papers"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition text-start"
        >
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700 w-fit">
            <FileText className="h-5 w-5" />
          </div>
          <div className="mt-3 text-base font-bold text-slate-900">{t.nav.myPapers}</div>
          <p className="mt-1 text-xs text-slate-500">
            رفع وإدارة أوراق PDF، استخراج النصوص، وضبط خصوصية الذكاء الاصطناعي
          </p>
        </Link>

        <Link
          href="/dashboard/scholar/compare"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition text-start"
        >
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 w-fit">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div className="mt-3 text-base font-bold text-slate-900">{t.nav.comparePapers}</div>
          <p className="mt-1 text-xs text-slate-500">
            توليد مصفوفة مقارنة منهجية متكاملة بين ورقتين مع استشهادات الصفحات المادية
          </p>
        </Link>

        <Link
          href="/dashboard/scholar/literature"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition text-start"
        >
          <div className="rounded-xl bg-purple-50 p-2.5 text-purple-700 w-fit">
            <Search className="h-5 w-5" />
          </div>
          <div className="mt-3 text-base font-bold text-slate-900">{t.nav.literatureResearch}</div>
          <p className="mt-1 text-xs text-slate-500">
            حوار أكاديمي متعمق مع توثيق الأدلة المادية والاقتباسات المطابقة
          </p>
        </Link>
      </div>
    </div>
  );
}
