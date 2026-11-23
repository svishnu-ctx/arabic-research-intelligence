'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLab } from '@/lib/lab/context';
import {
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  Calendar,
  Layers
} from 'lucide-react';

export default function EvaluationReportsPage() {
  const { t, language } = useI18n();
  const { models } = useLab();
  const [downloadNotice, setDownloadNotice] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Model', 'Developer', 'Country', 'Category', 'OverallScore', 'ArabicFluency', 'AcademicWriting', 'LatencyMs'];
    const rows = models.map(m => [
      `"${m.name}"`,
      `"${m.developer}"`,
      `"${m.country}"`,
      `"${m.category}"`,
      m.overallScore,
      m.arabicFluency,
      m.academicWriting,
      m.latencyMs
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'arabic_ai_evaluation_report_demo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
            <span>{t.labNav.reports}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'توليد وتصدير التقرير التنفيذي الشامل لصناع القرار وإدارة الجامعة'
              : 'Institutional executive evaluation summary & technical recommendation report'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            <span>{language === 'ar' ? 'تصدير البيانات (CSV)' : 'Export CSV'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <Printer className="h-4 w-4" />
            <span>{language === 'ar' ? 'طباعة التقرير (PDF)' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950 p-3 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{language === 'ar' ? 'تم تنزيل ملف CSV التجريبي بنجاح.' : 'Demonstration CSV exported successfully.'}</span>
        </div>
      )}

      {/* Report Document Paper Layout */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-12 shadow-sm space-y-8 max-w-4xl mx-auto">
        {/* Report Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-indigo-700 dark:text-indigo-400">{t.common.universityName}</span>
            <span>{language === 'ar' ? 'تاريخ التقرير: 2026-11-23' : 'Date: November 23, 2026'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {language === 'ar'
              ? 'التقرير التنفيذي: تقييم واختيار نماذج الذكاء الاصطناعي وتقنيات الصوت للغة العربية'
              : 'Executive Evaluation Report: Arabic AI Language Models & Speech Technologies Selection'}
          </h2>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-indigo-600" />
              <span>إدارة البحث العلمي والابتكار</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>6 نماذج خاضعة للتقييم المعياري</span>
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600">
            1. {language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary'}
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            {language === 'ar'
              ? 'أجرت اللجنة الأكاديمية المختصة في جامعة الشارقة دراسة تقييمية مقارنة شملت 4 نماذج لغوية عربية رائدة (Fanar, Jais, ALLaM, AceGPT) ونموذجين للتعرف الصوتي (Whisper v3, SeamlessM4T) عبر 84 اختباراً قياسياً و62 مراجعة لغوية بشرية عمياء.'
              : 'The Academic Evaluation Committee at the University of Sharjah conducted a comprehensive benchmark across 4 prominent Arabic LLMs and 2 speech recognition technologies, covering 84 standardized test cases and 62 blind linguistic reviews.'}
          </p>
        </div>

        {/* Section 2: Core Recommendations */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600">
            2. {language === 'ar' ? 'التوصيات الأكاديمية والتقنية' : 'Key Recommendations by Academic Domain'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'أبحاث اللغة العربية والكتابة الأكاديمية:' : 'Arabic Academic Writing:'}
              </div>
              <div className="text-indigo-600 font-extrabold">Fanar (QCRI) — 91/100</div>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'يوصى به للمراجعة اللغوية للأطروحات وصياغة الملخصات العلمية.' : 'Recommended for thesis writing assistance and formal MSA literature review.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'العلوم التطبيقية والبحث ثنائي اللغة:' : 'Bilingual Scientific Inquiry:'}
              </div>
              <div className="text-indigo-600 font-extrabold">Jais 30B (Inception) — 87/100</div>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'أداء ممتاز في ترجمة وفهم الأوراق المنشورة بالإنجليزية والتبديل اللغوي.' : 'Optimal for science & engineering research requiring seamless Arabic-English code-switching.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Governance & Next Steps */}
        <div className="space-y-3 text-xs leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600">
            3. {language === 'ar' ? 'حوكمة النشر والخطوات التالية' : 'Governance & Next Deployment Steps'}
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>{language === 'ar' ? 'استكمال الفحص القانوني والتراخيص المؤسسية للنماذج المعتمدة.' : 'Complete institutional software licensing and academic usage verification.'}</li>
            <li>{language === 'ar' ? 'اعتماد بيئة استضافة محلية مغلقة لحماية سرية الأبحاث غير المنشورة.' : 'Establish on-premise or sovereign cloud hosting to maintain research confidentiality.'}</li>
            <li>{language === 'ar' ? 'ربط نموذج Whisper بنظام إدارة التعلم الجامعي لتفريغ المحاضرات تلقائياً.' : 'Pilot LMS audio integration for automated Arabic lecture transcription.'}</li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">أ.د. طارق النعيمي</div>
            <div>عميد البحث العلمي — جامعة الشارقة</div>
          </div>
          <div className="text-end">
            <div className="font-bold text-slate-900 dark:text-white">د. فاطمة الزهراء</div>
            <div>رئيسة لجنة تقييم التقنيات اللغوية</div>
          </div>
        </div>
      </div>
    </div>
  );
}
