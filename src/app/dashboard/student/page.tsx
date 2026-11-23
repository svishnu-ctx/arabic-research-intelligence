'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { FileCode, Sparkles, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboardPage() {
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
                {t.common.universityName}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {t.nav.myDocuments} & {t.nav.academicAssistant}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              تبسيط واستيعاب الأبحاث الأكاديمية باللغتين العربية والإنجليزية
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard/student/documents"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition"
            >
              <FileCode className="h-4 w-4" />
              <span>{t.nav.myDocuments}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Learning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/dashboard/student/intelligence"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition text-start"
        >
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700 w-fit">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="mt-3 text-base font-bold text-slate-900">{t.nav.documentIntelligence}</div>
          <p className="mt-1 text-xs text-slate-500">
            تلخيص هيكلي دقيق: أهداف البحث، المنهجية، النتائج، والمحددات الموثقة
          </p>
        </Link>

        <Link
          href="/dashboard/student/assistant"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition text-start"
        >
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 w-fit">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="mt-3 text-base font-bold text-slate-900">{t.nav.academicAssistant}</div>
          <p className="mt-1 text-xs text-slate-500">
            مساعد أكاديمي ثنائي اللغة يشرح المفاهيم والمعادلات الصعبة بأسلوب مبسط
          </p>
        </Link>
      </div>
    </div>
  );
}
