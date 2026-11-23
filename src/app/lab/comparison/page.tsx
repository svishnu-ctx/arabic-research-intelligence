'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLab } from '@/lib/lab/context';
import {
  BarChart3,
  SlidersHorizontal,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function PerformanceComparisonPage() {
  const { t, language } = useI18n();
  const { models } = useLab();

  const [filterCategory, setFilterCategory] = useState<'all' | 'llm' | 'speech'>('all');

  const displayedModels = models.filter((m) => {
    if (filterCategory === 'all') return true;
    return m.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <span>{t.labNav.comparison}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'مصفوفة التقييم المعياري الشامل للمقارنة بين أداء النماذج اللغوية والصوتية'
              : 'Cross-model benchmark evaluation matrix across academic, linguistic, and operational dimensions'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`rounded-lg px-3 py-1 font-semibold transition ${
              filterCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {language === 'ar' ? 'جميع النماذج' : 'All Models'}
          </button>
          <button
            onClick={() => setFilterCategory('llm')}
            className={`rounded-lg px-3 py-1 font-semibold transition ${
              filterCategory === 'llm' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {language === 'ar' ? 'النماذج اللغوية' : 'LLMs'}
          </button>
          <button
            onClick={() => setFilterCategory('speech')}
            className={`rounded-lg px-3 py-1 font-semibold transition ${
              filterCategory === 'speech' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {language === 'ar' ? 'تقنيات الصوت' : 'Speech Models'}
          </button>
        </div>
      </div>

      {/* Main Comparison Data Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {language === 'ar' ? 'جدول المقارنة الأكاديمية (درجات استرشادية من 100)' : 'Academic Comparison Matrix (Illustrative Scores / 100)'}
          </span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
            {t.lab.demoBadge}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500">
                <th className="p-3.5 font-bold">{language === 'ar' ? 'النموذج' : 'Model'}</th>
                <th className="p-3.5 font-bold">{language === 'ar' ? 'المطور والدولة' : 'Developer & Origin'}</th>
                <th className="p-3.5 font-bold text-center">{language === 'ar' ? 'فصاحة الفصحى' : 'Arabic Fluency'}</th>
                <th className="p-3.5 font-bold text-center">{language === 'ar' ? 'الكتابة الأكاديمية' : 'Academic Writing'}</th>
                <th className="p-3.5 font-bold text-center">{language === 'ar' ? 'الاستدلال البحثي' : 'Research Reasoning'}</th>
                <th className="p-3.5 font-bold text-center">{language === 'ar' ? 'الأداء الثنائي' : 'Bilingual Perf.'}</th>
                <th className="p-3.5 font-bold text-center">{language === 'ar' ? 'المعدل الإجمالي' : 'Overall Score'}</th>
                <th className="p-3.5 font-bold">{language === 'ar' ? 'التكلفة لكل 1k رمز' : 'Est. Cost/1k'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedModels.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">{m.name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{m.developer} ({m.country})</td>
                  <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">{m.arabicFluency}%</td>
                  <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">{m.academicWriting}%</td>
                  <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">{m.researchUnderstanding}%</td>
                  <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">{m.bilingualPerformance}%</td>
                  <td className="p-3.5 text-center">
                    <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 font-extrabold text-indigo-700 dark:text-indigo-300">
                      {m.overallScore} / 100
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-600">{m.estimatedCostPer1kTokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Use Cases Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {language === 'ar' ? 'أفضل نموذج للصياغة العربية' : 'Best for Arabic Academic Writing'}
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Fanar (QCRI)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'ar'
              ? 'الأعلى دقة في ضبط علامات الإعراب وتوليد تراكيب الفصحى الأكاديمية الرصينة ومراعاة الخصوصية الإقليمية.'
              : 'Highest score in syntactic precision, academic MSA phrasing, and regional linguistic nuance.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {language === 'ar' ? 'أفضل نموذج للأبحاث الثنائية' : 'Best for Bilingual Academic Research'}
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Jais 30B (Inception)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'ar'
              ? 'أداء متفوق في التبديل السلس بين الإنجليزية والعربية في المصطلحات العلمية والمعادلات الرياضية.'
              : 'Superior performance in cross-lingual literature retrieval and scientific code-switching.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {language === 'ar' ? 'أفضل نموذج لاسترجاع المستندات' : 'Best for Document Q&A (RAG)'}
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">SILMA 9B (SILMA AI)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'ar'
              ? 'زمن استجابة فائق السرعة (290ms) مع استيعاب دقيق للوثائق واستخلاص الإجابات البحثية المركزة.'
              : 'Ultra-low latency (290ms) optimized for retrieval-augmented generation and document summaries.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {language === 'ar' ? 'أفضل تقنية لتفريغ المحاضرات' : 'Best for Lecture Transcription'}
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">OpenAI Whisper v3</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'ar'
              ? 'أدنى معدل خطأ في الكلمات (WER: 2.1%) مع قدرة عالية على محاذاة التوقيت الزمني في التسجيلات الصوتية.'
              : 'Lowest Word Error Rate (WER: 2.1%) with resilient timestamp alignment under classroom acoustics.'}
          </p>
        </div>
      </div>
    </div>
  );
}
