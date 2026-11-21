'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, Sparkles, FileText } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { CitationBadge } from '@/components/ai/CitationBadge';

export default function ComparePapersPage() {
  const { t } = useI18n();
  const [docA, setDocA] = useState('P01');
  const [docB, setDocB] = useState('P03');
  const [isComparing, setIsComparing] = useState(false);
  const [hasCompared, setHasCompared] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-emerald-700" />
          {t.ai.comparativeMatrix} (P0 Core)
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          المقارنة المنهجية المباشرة بين ورقتين أكاديميتين مع استشهادات الصفحات المادية
        </p>

        {/* Paper Selection Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-xs font-semibold text-slate-500">الورقة الأولى (Paper A)</span>
            <div className="mt-1 text-sm font-bold text-slate-900">
              P01: Arabic NLP in the Age of LLMs (Al-Thubaity et al., MDPI 2023)
            </div>
            <div className="mt-1 text-xs text-slate-500">18 صفحة — ترخيص CC-BY 4.0</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-xs font-semibold text-slate-500">الورقة الثانية (Paper B)</span>
            <div className="mt-1 text-sm font-bold text-slate-900">
              P03: Arabic Sentiment Analysis Transformers (Ghanem et al., arXiv 2021)
            </div>
            <div className="mt-1 text-xs text-slate-500">14 صفحة — ترخيص CC-BY 4.0</div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setIsComparing(true);
              setTimeout(() => setIsComparing(false), 800);
            }}
            disabled={isComparing}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 disabled:opacity-50 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isComparing ? t.common.loading : t.ai.compareButton}</span>
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {hasCompared && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-3 font-semibold text-slate-700 w-1/4">محور المقارنة المنهجي</th>
                <th className="p-3 font-semibold text-emerald-900 w-3/8">P01: Arabic NLP Survey</th>
                <th className="p-3 font-semibold text-blue-900 w-3/8">P03: Transformer Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-medium text-slate-800">أهداف البحث ونطاق الدراسة</td>
                <td className="p-3 text-slate-600">
                  مراجعة شاملة لتطور معالجة اللغة العربية الكلاسيكية وانتقالها لنماذج LLMs الحديثة.
                  <div className="mt-1">
                    <CitationBadge pageNumber={2} quotedSnippet="review of LLMs in Arabic" />
                  </div>
                </td>
                <td className="p-3 text-slate-600">
                  دراسة تجريبية تطبيقية لمقارنة أداء نماذج المحولات في تحليل المشاعر باللغة العربية.
                  <div className="mt-1">
                    <CitationBadge pageNumber={1} quotedSnippet="empirical study of transformer architectures" />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-800">البيانات واللهجات المشمولة</td>
                <td className="p-3 text-slate-600">
                  تغطية واسعة تشمل الفصحى الحديثة (MSA) واللهجات الإقليمية مع التركيز على نقص موارد اللهجات.
                  <div className="mt-1">
                    <CitationBadge pageNumber={8} quotedSnippet="dialectal Arabic datasets deficiency" />
                  </div>
                </td>
                <td className="p-3 text-slate-600">
                  تقييم تجريبي على 5 مجموعات بيانات لمواقع التواصل الاجتماعي (تويتر العربي ومراجعات المنتجات).
                  <div className="mt-1">
                    <CitationBadge pageNumber={4} quotedSnippet="five benchmark datasets collected from social media" />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-medium text-slate-800">المحددات والفجوات المفتوحة</td>
                <td className="p-3 text-slate-600">
                  ارتفاع تكلفة التدريب المسبق وصعوبة التقييم الموضوعي لتوليد النصوص العربية.
                  <div className="mt-1">
                    <CitationBadge pageNumber={14} quotedSnippet="computational cost of pretraining LLMs" />
                  </div>
                </td>
                <td className="p-3 text-slate-600">
                  تفاوت الأداء بشكل ملحوظ في التغريدات ذات التهكم والازدواج اللغوي (Arabizi).
                  <div className="mt-1">
                    <CitationBadge pageNumber={11} quotedSnippet="limitations on sarcastic and mixed script text" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
