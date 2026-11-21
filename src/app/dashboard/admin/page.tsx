'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { Sparkles, Library, FileCheck2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { t, direction } = useI18n();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                {t.roles.admin}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {t.nav.researchInsights}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {t.common.universityName} — {t.common.tagline}
            </p>
          </div>

          <Link
            href="/dashboard/admin/insights"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t.nav.researchInsights}</span>
          </Link>
        </div>
      </div>

      {/* Scope Disclaimer Notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3 text-start">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">
              نطاق التحليل المؤسسي المعتمد (Evidence Base Notice)
            </div>
            <div>
              التحليلات المؤسسية مستمدة حصرياً من الأوراق البحثية المعتمدة في القاعدة المرجعية التجريبية (3 أوراق مفتوحة المصدر من MDPI و arXiv) بالإضافة إلى مسودات الطلاب التي حصلت على موافقة إشرافية ومؤسسية صريحة. النظام لا يتصل بقواعد بيانات خارجية للجامعة.
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">{t.nav.researchCorpus}</div>
              <div className="text-xl font-bold text-slate-900">3 أوراق معتمدة</div>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            أبحاث مفتوحة المصدر (CC-BY 4.0) مدققة
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">الأوراق الخاضعة للإشراف</div>
              <div className="text-xl font-bold text-slate-900">بانتظار موافقة الطالب</div>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            تتطلب موافقة رقابية منفصلة (Oversight Consent)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">محرك التحليل الذكي</div>
              <div className="text-xl font-bold text-slate-900">Gemini 3.8 Flash</div>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            محددات استشهاد بالصفحات المادية الموثقة
          </div>
        </div>
      </div>
    </div>
  );
}
