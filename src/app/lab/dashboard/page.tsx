'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useLab } from '@/lib/lab/context';
import {
  Cpu,
  BookOpen,
  Award,
  Crown,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function LabDashboardPage() {
  const { t, language } = useI18n();
  const { models, benchmarks, reviews } = useLab();

  const leadingModel = [...models].sort((a, b) => b.overallScore - a.overallScore)[0] || { name: 'Fanar', overallScore: 91 };
  const avgScore = (models.reduce((acc, m) => acc + m.overallScore, 0) / models.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.common.universityName}</span>
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.lab.appTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {t.lab.appSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/lab/testing"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition"
            >
              <span>{t.lab.runTest}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lab/comparison"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <span>{t.lab.compareModels}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Models Evaluated */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.lab.modelsEvaluated}
            </span>
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950 p-2 text-indigo-600">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
            {models.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'ar' ? '5 لغوية عربية + 2 صوتية' : '5 Arabic LLMs + 2 Speech models'}
          </div>
        </div>

        {/* Card 2: Benchmark Tests */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.lab.benchmarkTests}
            </span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-2 text-emerald-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
            84
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'ar' ? 'عبر 10 محاور أكاديمية' : 'Across 10 academic axes'}
          </div>
        </div>

        {/* Card 3: Expert Reviews */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.lab.expertReviews}
            </span>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-2 text-blue-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
            {62 + reviews.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'ar' ? 'تقييم لغوي بشري أعمى' : 'Blind human expert evaluations'}
          </div>
        </div>

        {/* Card 4: Leading Model */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.lab.leadingModel}
            </span>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-2 text-amber-600">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">
            {leadingModel.name}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'ar' ? `المعدل الإجمالي: ${leadingModel.overallScore}/100` : `Overall score: ${leadingModel.overallScore}/100`}
          </div>
        </div>

        {/* Card 5: Average Score */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.lab.averageScore}
            </span>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950 p-2 text-purple-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
            {avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'ar' ? 'مؤشر الجودة المركب' : 'Composite quality index'}
          </div>
        </div>
      </div>

      {/* Grid: Model Performance Overview & Recommendation Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Model Performance Overview */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.lab.modelOverview}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ar' ? 'مقارنة الدرجات الإجمالية للنماذج اللغوية والصوتية' : 'Overall benchmark scores across candidate models'}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              {t.lab.demoBadge}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {models.map((model) => (
              <div key={model.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{model.name} ({model.developer})</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{model.overallScore} / 100</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 transition-all duration-500"
                    style={{ width: `${model.overallScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>{language === 'ar' ? 'الحد الأدنى للاعتماد الأكاديمي: 80 نقطة' : 'Minimum academic threshold: 80 points'}</span>
            <Link href="/lab/comparison" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              {language === 'ar' ? 'عرض مصفوفة المقارنة التفصيلية ←' : 'View detailed matrix →'}
            </Link>
          </div>
        </div>

        {/* Section D: Model Recommendation Preview */}
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
              <Crown className="h-4 w-4" />
              <span>{t.lab.recommendationPreview}</span>
            </div>
            <div className="mt-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{leadingModel.name}</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'يتصدر نموذج Fanar حالياً المعايير التجريبية في فصاحة اللغة العربية والكتابة الأكاديمية (91%). يظل الاختيار النهائي خاضعاً لاعتبارات التراخيص والتدقيق الأمني وتكلفة الاستضافة المؤسسية.'
                  : 'Fanar currently leads illustrative benchmarks in Arabic language quality (91%). Final selection remains subject to expert validation, licensing review, and institutional deployment assessment.'}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'فصاحة الفصحى:' : 'MSA Fluency:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">Fanar (93%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'الترجمة الثنائية:' : 'Bilingual Tasks:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">Jais (90%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'تفريغ المحاضرات:' : 'Speech Transcription:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">Whisper v3 (88%)</span>
              </div>
            </div>
          </div>

          <Link
            href="/lab/reports"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 py-2.5 text-xs font-semibold text-white shadow-sm transition"
          >
            <FileText className="h-4 w-4" />
            <span>{t.lab.exportReport}</span>
          </Link>
        </div>
      </div>

      {/* Section B & C: Evaluation Coverage & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evaluation Coverage */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            {t.lab.evaluationCoverage}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'ar' ? 'جودة اللغة العربية الفصحى' : 'Arabic Language Quality'}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">24 {language === 'ar' ? 'اختباراً' : 'tests'} (92% {language === 'ar' ? 'مكتمل' : 'completed'})</div>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'ar' ? 'فهم الأوراق الأكاديمية' : 'Research Paper Reasoning'}
              </div>
              <div className="text-[11px] text-indigo-600 font-bold mt-1">18 {language === 'ar' ? 'اختباراً' : 'tests'} (88% {language === 'ar' ? 'مكتمل' : 'completed'})</div>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'ar' ? 'الترجمة الأكاديمية الثنائية' : 'Academic Translation'}
              </div>
              <div className="text-[11px] text-blue-600 font-bold mt-1">16 {language === 'ar' ? 'اختباراً' : 'tests'} (85% {language === 'ar' ? 'مكتمل' : 'completed'})</div>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'ar' ? 'تفريغ المحاضرات الصوتية' : 'Speech Recognition (ASR)'}
              </div>
              <div className="text-[11px] text-purple-600 font-bold mt-1">14 {language === 'ar' ? 'اختباراً' : 'tests'} (82% {language === 'ar' ? 'مكتمل' : 'completed'})</div>
            </div>
          </div>
        </div>

        {/* Recent Evaluation Activity */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            {t.lab.recentActivity}
          </h2>
          <div className="mt-4 space-y-3">
            {[
              { model: 'Fanar', category: 'Academic Arabic Writing', reviewer: 'Dr. Fatima Al-Zahra', date: '2026-11-20', status: 'Completed', score: '94/100' },
              { model: 'Jais 30B', category: 'Methodology Reasoning', reviewer: 'Prof. Tariq Al-Nuaimi', date: '2026-11-19', status: 'Completed', score: '88/100' },
              { model: 'OpenAI Whisper v3', category: 'Arabic Lecture ASR', reviewer: 'Audio Lab Team', date: '2026-11-18', status: 'Completed', score: '96/100' },
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between text-xs rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{act.model}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{act.category} • {act.reviewer}</div>
                </div>
                <div className="text-end">
                  <span className="inline-block rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {act.score}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{act.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
