'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  History,
  Bot,
  Search,
  LineChart,
  Lightbulb,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function HistoryPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const historyItems = [
    {
      action: isArabic ? 'توليد مخطط مقترح البحث الأكاديمي' : 'Generated Research Proposal Outline',
      agent: isArabic ? 'وكيل 1: المقترح والموضوع' : 'Agent 1: Topic & Proposal',
      model: 'Fanar',
      timestamp: '2026-11-23 12:15',
      tokens: 412,
      latency: '1.2s',
    },
    {
      action: isArabic ? 'استعلام OpenAlex عن أوراق شبكات الطاقة' : 'OpenAlex Academic Search for Microgrid Papers',
      agent: isArabic ? 'وكيل 2: مراجعة الأدبيات' : 'Agent 2: Literature Review',
      model: 'OpenAlex API',
      timestamp: '2026-11-23 11:42',
      tokens: 0,
      latency: '0.8s',
    },
    {
      action: isArabic ? 'تحليل إحصائي وصفي وتفسير بنموذج فنار' : 'Descriptive Statistics & Fanar Dataset Interpretation',
      agent: isArabic ? 'وكيل 3: المنهجية وتحليل البيانات' : 'Agent 3: Methodology & Data',
      model: 'Fanar',
      timestamp: '2026-11-23 10:30',
      tokens: 580,
      latency: '1.5s',
    },
    {
      action: isArabic ? 'محاكاة أسئلة لجنة مناقشة الأطروحة (Viva)' : 'Simulated Viva Examination Questions',
      agent: isArabic ? 'وكيل 4: مراجعة الأطروحة والدفاع' : 'Agent 4: Thesis Review & Defense',
      model: 'Fanar',
      timestamp: '2026-11-22 16:20',
      tokens: 720,
      latency: '1.9s',
    },
  ];

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-300">
            <History className="h-3.5 w-3.5 text-emerald-600" />
            <span>{isArabic ? 'سجل العمليات والذكاء' : 'AI Research History & Audit Trail'}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'سجل التفاعلات الأكاديمية' : 'Interaction History'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'سجل شفاف لكل طلب ذكاء اصطناعي بنموذج فنار، مع توثيق الأوقات ومصادر الاستعلام.'
              : 'Transparent audit logs of every Fanar model interaction and academic database query.'}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'العملية البحثية' : 'Action'}
              </th>
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'الوكيل' : 'Agent'}
              </th>
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'المزود' : 'Provider / Model'}
              </th>
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'التوقيت' : 'Timestamp'}
              </th>
              <th className="pb-3 text-end font-semibold">
                {isArabic ? 'زمن الاستجابة' : 'Latency'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {historyItems.map((item, i) => (
              <tr key={i} className="text-slate-700 dark:text-slate-300">
                <td className="py-3 font-semibold text-slate-900 dark:text-white">
                  {item.action}
                </td>
                <td className="py-3 text-slate-500">{item.agent}</td>
                <td className="py-3">
                  <span className="rounded bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    {item.model}
                  </span>
                </td>
                <td className="py-3 text-slate-500 font-mono">{item.timestamp}</td>
                <td className="py-3 text-end font-mono text-slate-500">{item.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
