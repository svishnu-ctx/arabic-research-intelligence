'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import {
  Sparkles,
  FileText,
  ArrowLeftRight,
  Search,
  GraduationCap,
  FileCheck2,
  Lightbulb,
  FlaskConical,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function UnifiedDashboardPage() {
  const { user } = useAuth();
  const { t, language, direction } = useI18n();

  const isArabic = language === 'ar';

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.common.universityName}</span>
              <span className="text-emerald-400">•</span>
              <span>{isArabic ? 'بوابة الباحث الموحدة' : 'Unified Academic Workspace'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              {isArabic ? `أهلاً بك، ${user?.displayName || 'الباحث الأكاديمي'}` : `Welcome, ${user?.displayName || 'Academic Researcher'}`}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {isArabic
                ? 'المنصة الأكاديمية المتكاملة للبحث الذكي، التحقق من الاستشهادات بالصفحات المادية، ومختبر تقييم نماذج الذكاء الاصطناعي العربية.'
                : 'The unified academic portal for research intelligence, physical-page citation verification, and Arabic AI evaluation.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/lab/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 transition"
            >
              <FlaskConical className="h-4 w-4" />
              <span>{isArabic ? 'مختبر تقييم النماذج' : 'AI Evaluation Lab'}</span>
              <ChevronRight className={`h-4 w-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              href="/dashboard/scholar/papers"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
            >
              <FileText className="h-4 w-4" />
              <span>{t.nav.myPapers}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured AI Lab Spotlight */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-900">
              <Cpu className="h-3.5 w-3.5" />
              <span>{isArabic ? 'قسم جديد: مختبر التقييم الأكاديمي' : 'New Feature: AI Evaluation Lab'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {isArabic ? 'تقييم ومقارنة نماذج الذكاء الاصطناعي العربي والتقنيات الصوتية' : 'Evaluate & Compare Arabic LLMs & Speech Technologies'}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {isArabic
                ? 'استكشف واختبر أداء النماذج (Jais, Fanar, ALLaM, AceGPT, Whisper) عبر 10 معايير لغوية وأكاديمية متقدمة مع محاكاة مقارنة فورية.'
                : 'Benchmark and test Jais, Fanar, ALLaM, AceGPT, and Whisper across 10 academic linguistic criteria with side-by-side prompt testing.'}
            </p>
          </div>
          <Link
            href="/lab/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-900 px-6 py-3 text-sm font-bold text-white shadow hover:bg-indigo-950 transition shrink-0"
          >
            <span>{isArabic ? 'دخول المختبر (Evaluation Lab)' : 'Enter Evaluation Lab'}</span>
            <ChevronRight className={`h-4 w-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>

      {/* Unified Research Modules Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">
          {isArabic ? 'أدوات البحث والذكاء الأكاديمي' : 'Academic Research Tools'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Papers */}
          <Link
            href="/dashboard/scholar/papers"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition text-start"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <FileText className="h-6 w-6" />
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-300 group-hover:text-emerald-700 transition ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
            <div className="mt-4 text-base font-bold text-slate-900">{t.nav.myPapers}</div>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {isArabic
                ? 'رفع مستندات PDF الأكاديمية، استخراج النصوص، وضبط خصوصية الذكاء الاصطناعي.'
                : 'Upload research PDFs, extract verified page text, and configure AI privacy consent.'}
            </p>
          </Link>

          {/* Card 2: Compare */}
          <Link
            href="/dashboard/scholar/compare"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition text-start"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <ArrowLeftRight className="h-6 w-6" />
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-300 group-hover:text-blue-700 transition ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
            <div className="mt-4 text-base font-bold text-slate-900">{t.nav.comparePapers}</div>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {isArabic
                ? 'مقارنة منهجية متقدمة بين ورقتين بحثيتين مع الاستشهاد بالصفحات المادية الحقيقية.'
                : 'Methodological side-by-side comparison matrix with verified physical page citations.'}
            </p>
          </Link>

          {/* Card 3: Literature */}
          <Link
            href="/dashboard/scholar/literature"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-purple-300 hover:shadow-md transition text-start"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
                <Search className="h-6 w-6" />
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-300 group-hover:text-purple-700 transition ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
            <div className="mt-4 text-base font-bold text-slate-900">{t.nav.literatureResearch}</div>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {isArabic
                ? 'استعلام ذكي موثق بالأدلة المادية، واقتباسات حرفية مطابقة تمنع التوليد الخاطئ.'
                : 'Grounded academic conversation with verbatim quote matching and hallucination prevention.'}
            </p>
          </Link>

          {/* Card 4: Assistant */}
          <Link
            href="/dashboard/student/assistant"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-amber-300 hover:shadow-md transition text-start"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                <GraduationCap className="h-6 w-6" />
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-300 group-hover:text-amber-700 transition ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
            <div className="mt-4 text-base font-bold text-slate-900">{t.nav.academicAssistant}</div>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {isArabic
                ? 'صياغة المنهجيات العلمية، تلخيص الأدبيات، وتنقيح الأسئلة البحثية لطلاب الدراسات العليا.'
                : 'Formulate research methodologies, summarize literature, and refine thesis questions.'}
            </p>
          </Link>

          {/* Card 5: Review */}
          <Link
            href="/dashboard/supervisor/review"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition text-start"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-300 group-hover:text-teal-700 transition ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
            <div className="mt-4 text-base font-bold text-slate-900">{t.nav.aiReview}</div>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {isArabic
                ? 'فحص الادعاءات الأكاديمية والتحقق المادي من الاقتباسات للمشرفين والباحثين.'
                : 'Rigorous claim verification and verbatim quote checking for academic review.'}
            </p>
          </Link>

          {/* Card 6: Insights */}
          <Link
            href="/dashboard/admin/insights"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-400 hover:shadow-md transition text-start"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                <Lightbulb className="h-6 w-6" />
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-300 group-hover:text-slate-700 transition ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
            <div className="mt-4 text-base font-bold text-slate-900">{t.nav.researchInsights}</div>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {isArabic
                ? 'إحصاءات استهلاك النماذج، شفافية الخصوصية، ومؤشرات الأداء المؤسسية.'
                : 'Institutional AI usage statistics, privacy audit logs, and performance metrics.'}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}