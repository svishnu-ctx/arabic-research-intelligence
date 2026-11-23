'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLab } from '@/lib/lab/context';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { DEMO_TESTING_RESPONSES } from '@/lib/lab/data';
import { ModelTestingResponse } from '@/lib/lab/types';

export default function ModelTestingWorkspacePage() {
  const { t, language } = useI18n();
  const { models } = useLab();

  const [question, setQuestion] = useState(
    'اشرح أهمية مراجعة الأدبيات في البحث العلمي، وكيف يمكن للباحث تحديد الفجوات البحثية من خلال الدراسات السابقة؟'
  );
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(['fanar', 'jais', 'allam', 'silma']);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModelTestingResponse[] | null>(DEMO_TESTING_RESPONSES.default);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  const toggleModel = (id: string) => {
    setSelectedModelIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleRunComparison = async () => {
    setIsRunning(true);
    setResults(null);
    setBackendStatus(null);

    try {
      const res = await fetch('/api/lab/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: question,
          modelIds: selectedModelIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.responses) && data.responses.length > 0) {
          setResults(data.responses);
          setBackendStatus(data.executionMode === 'live-api' ? 'Live Gemini/HF API' : 'Full-Stack Persona Engine');
          setIsRunning(false);
          return;
        }
      }

      // Fallback
      const filtered = DEMO_TESTING_RESPONSES.default.filter((r) => selectedModelIds.includes(r.modelId));
      setResults(filtered.length > 0 ? filtered : DEMO_TESTING_RESPONSES.default);
    } catch {
      const filtered = DEMO_TESTING_RESPONSES.default.filter((r) => selectedModelIds.includes(r.modelId));
      setResults(filtered.length > 0 ? filtered : DEMO_TESTING_RESPONSES.default);
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>{t.labNav.testing}</span>
            </div>
            <h1 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'مساحة اختبار ومقارنة استجابات النماذج المتزامنة' : 'Multi-Model Comparative Testing Workspace'}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'ar'
                ? 'إرسال نفس السؤال البحثي لعدة نماذج وتقييم الفصاحة والدقة والاستدلال جنباً إلى جنب'
                : 'Submit identical Arabic academic inquiries across models to evaluate fluency, reasoning, and costs side by side'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setQuestion('');
                setResults(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{language === 'ar' ? 'مسح' : 'Clear'}</span>
            </button>

            <button
              onClick={handleRunComparison}
              disabled={isRunning || selectedModelIds.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 px-5 py-2.5 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{isRunning ? t.common.loading : (language === 'ar' ? 'تشغيل المحاكاة' : 'Run Comparison')}</span>
            </button>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="mt-5 space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {language === 'ar' ? 'نص السؤال الأكاديمي (Arabic Research Question):' : 'Research Inquiry Prompt:'}
          </label>
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3.5 text-sm font-arabic text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 leading-relaxed"
            dir="rtl"
          />
        </div>

        {/* Candidate Model Selection Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">{language === 'ar' ? 'النماذج المختارة:' : 'Selected Models:'}</span>
          {models.filter(m => m.category === 'llm').map((m) => {
            const isChecked = selectedModelIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`rounded-xl px-3 py-1 font-semibold transition flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                {isChecked && <Check className="h-3 w-3" />}
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Demo Results Simulation Notice */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-300">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          {language === 'ar'
            ? 'تنبيه العرض: هذه نتائج محاكاة تجريبية مسبقة الفحص (DEMO RESULT). لا يتم استهلاك أرصدة واجهات برمجية حقيقية.'
            : 'Demonstration Result: Simulated preloaded evaluation responses. No external API keys or paid credits consumed.'}
        </span>
      </div>

      {/* Multi-Panel Response Columns */}
      {results && results.length > 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${results.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-5`}>
          {results.map((res) => (
            <div
              key={res.modelId}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {backendStatus ? `FULL-STACK EVAL (${backendStatus})` : 'EVALUATION RESULT'}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {res.modelName}
                    </h3>
                  </div>

                  <button
                    onClick={() => copyToClipboard(res.arabicResponse, res.modelId)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
                    title="Copy response"
                  >
                    {copiedId === res.modelId ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Metrics Bar */}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/40 p-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{res.responseTimeMs} ms</span>
                  </div>
                  <div>{res.tokenCount} tokens</div>
                  <div className="font-semibold text-emerald-600">{res.estimatedCostUSD}</div>
                </div>

                {/* Response Text */}
                <div className="mt-3 font-arabic text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line" dir="rtl">
                  {res.arabicResponse}
                </div>
              </div>

              {/* Quality Indicators */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'الفصاحة:' : 'Fluency:'}</span>
                  <span className="font-bold text-indigo-600">{res.fluencyScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'الاستدلال الأكاديمي:' : 'Reasoning:'}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{res.academicReasoningScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
