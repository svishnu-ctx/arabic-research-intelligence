'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { BookOpen, FileCheck2, UserCheck, Shield } from 'lucide-react';
import Link from 'next/link';

export default function SupervisorDashboardPage() {
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
              {t.nav.sharedPapers}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              متابعة وتقييم مسودات أبحاث طلبة الدراسات العليا والباحثين
            </p>
          </div>

          <Link
            href="/dashboard/supervisor/review"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>{t.nav.aiReview}</span>
          </Link>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">صلاحيات الإشراف الأكاديمي</div>
              <div className="text-base font-bold text-slate-900">الوصول الحصري للأوراق المشتركة</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600 leading-relaxed">
            يتاح للمشرف الأكاديمي الاطلاع حصرياً على الأبحاث التي شاركها الطالب صراحة عبر خيار (مشاركة مع المشرف). لا تظهر أي مسودات خاصة لم يمنح الطالب الإذن بمشاركتها.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">تقييم المنهجية (AI Review)</div>
              <div className="text-base font-bold text-slate-900">نقد أكاديمي مدعوم بالصفحات</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600 leading-relaxed">
            يقوم المساعد الذكي بفحص المنهجية، وتقييم حجم العينات ومقاييس الأداء، واقتراح 4 إلى 5 أسئلة جوهرية لمناقشة الأطروحة مع ربط كل ملاحظة بالصفحة المادية للورقة.
          </p>
        </div>
      </div>
    </div>
  );
}
