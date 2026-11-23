'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  LineChart,
  Upload,
  FileSpreadsheet,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Table,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface MethodologyAdvice {
  researchDesign: string;
  justification: string;
  dataCollectionApproach: string;
  samplingStrategy: string;
  instruments: string[];
  dataAnalysisPlan: string[];
  limitations: string[];
  ethicalConsiderations: string[];
}

interface DatasetStats {
  rowCount: number;
  columnCount: number;
  columns: { name: string; type: string; missingCount: number }[];
  summary: {
    column: string;
    mean: number;
    min: number;
    max: number;
    stdDev: number;
  }[];
}

export default function MethodologyAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  // Methodology form state
  const [topic, setTopic] = useState('Deep Reinforcement Learning for Solar Microgrids');
  const [researchType, setResearchType] = useState<'QUANTITATIVE' | 'QUALITATIVE' | 'MIXED'>('QUANTITATIVE');
  const [researchObjectives, setResearchObjectives] = useState(
    '1. Evaluate battery storage efficiency under intermittent solar radiation in Sharjah.\n2. Minimize grid outage frequency using reinforcement learning.'
  );

  const [isAdvising, setIsAdvising] = useState(false);
  const [methodologyAdvice, setMethodologyAdvice] = useState<MethodologyAdvice | null>(null);

  // Dataset upload & analysis state
  const [csvText, setCsvText] = useState(
    `timestamp,solar_generation_kw,battery_storage_kwh,grid_load_kw,ambient_temp_c\n2025-01-01 10:00,120.4,85.2,110.0,24.5\n2025-01-01 11:00,145.8,92.0,115.3,26.2\n2025-01-01 12:00,158.2,98.5,125.7,28.0\n2025-01-01 13:00,150.1,96.0,122.4,28.4\n2025-01-01 14:00,132.0,88.4,118.2,27.1\n2025-01-01 15:00,95.5,75.1,105.0,25.8`
  );
  const [isAnalyzingDataset, setIsAnalyzingDataset] = useState(false);
  const [datasetStats, setDatasetStats] = useState<DatasetStats | null>(null);
  const [fanarExplanation, setFanarExplanation] = useState<string | null>(null);

  // Generate Methodology Advice via Fanar
  const handleGetMethodologyAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdvising(true);
    setMethodologyAdvice(null);

    try {
      const res = await fetch('/api/agents/methodology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          researchType,
          objectives: researchObjectives.split('\n').filter(Boolean),
          academicLevel: 'MASTERS',
          level: 'Masters',
          language: isArabic ? 'ar' : 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMethodologyAdvice(data.methodology);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdvising(false);
    }
  };

  // Upload & Analyze Dataset
  const handleAnalyzeDataset = async () => {
    if (!csvText.trim()) return;

    setIsAnalyzingDataset(true);
    setDatasetStats(null);
    setFanarExplanation(null);

    try {
      const res = await fetch('/api/datasets/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'sharjah_solar_microgrid_sample.csv',
          content: csvText,
          researchTopic: topic,
          language: isArabic ? 'ar' : 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDatasetStats(data.stats);
        setFanarExplanation(data.fanarExplanation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingDataset(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCsvText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8" dir={direction}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 dark:bg-purple-950 px-3 py-1 text-xs font-bold text-purple-800 dark:text-purple-300">
          <LineChart className="h-3.5 w-3.5" />
          <span>Agent 3 • Fanar Methodology Advisor & Statistical Analyzer</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          {isArabic ? 'المنهجية العلمية وتحليل البيانات' : 'Research Methodology & Data Analysis Advisor'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {isArabic
            ? 'توجيه تصميم المنهجية البحثية (كمية، نوعية، مختلطة)، فحص عينات البيانات الإحصائية الحقيقية، وتفسيرها أكاديمياً بنموذج فنار.'
            : 'Formulate rigorous research designs, upload CSV datasets for real statistical summarization, and obtain Fanar interpretations.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: Methodology Advisor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Layers className="h-4 w-4 text-purple-600" />
              <span>{isArabic ? '1. تصميم المنهجية وخطة التحليل' : '1. Methodology Design & Strategy'}</span>
            </h2>

            <form onSubmit={handleGetMethodologyAdvice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'موضوع أو سؤال البحث' : 'Research Topic / Problem'}
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'النمط المنهجي للدراسة' : 'Methodological Approach'}
                </label>
                <select
                  value={researchType}
                  onChange={(e) => setResearchType(e.target.value as any)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
                >
                  <option value="QUANTITATIVE">Quantitative (كمي - تجريبي / بيانات إحصائية)</option>
                  <option value="QUALITATIVE">Qualitative (نوعي - مقابلات / تحليل مضمون)</option>
                  <option value="MIXED">Mixed Methods (مختلط - كمي ونوعي معاً)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'الأهداف البحثية المراد تحقيقها' : 'Research Objectives'}
                </label>
                <textarea
                  rows={3}
                  value={researchObjectives}
                  onChange={(e) => setResearchObjectives(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isAdvising}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-700 py-3 text-xs font-bold text-white shadow hover:bg-purple-800 disabled:opacity-50 transition"
              >
                {isAdvising ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isArabic ? 'جاري تخطيط المنهجية بنموذج فنار...' : 'Fanar Generating Advice...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{isArabic ? 'طلب استشارة المنهجية' : 'Generate Methodology Architecture'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Methodology Output */}
          {methodologyAdvice && (
            <div className="rounded-3xl border border-purple-200 dark:border-purple-900/40 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                  {isArabic ? 'التصميم المنهجي المقترح' : 'Suggested Research Design'}
                </span>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {methodologyAdvice.researchDesign}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {methodologyAdvice.justification}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {isArabic ? 'خطة جمع البيانات وأسلوب العينات' : 'Data Collection & Sampling Strategy'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {methodologyAdvice.samplingStrategy}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {isArabic ? 'أدوات التحليل الإحصائي الموصى بها' : 'Recommended Analysis Steps'}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {((Array.isArray(methodologyAdvice.dataAnalysisPlan)
                    ? methodologyAdvice.dataAnalysisPlan
                    : [methodologyAdvice.dataAnalysisPlan].filter(Boolean)
                  ) as string[]).map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Real Dataset Analyzer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>{isArabic ? '2. محلل مجموعات البيانات (CSV Analyzer)' : '2. Real CSV Dataset Analyzer'}</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'بيانات CSV التجريبية أو رفع ملف' : 'CSV Data or Upload File'}
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 cursor-pointer hover:underline">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{isArabic ? 'رفع ملف CSV' : 'Upload CSV'}</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                rows={7}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="block w-full font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-[11px] text-slate-800 dark:text-slate-200 focus:border-emerald-600 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleAnalyzeDataset}
                disabled={isAnalyzingDataset}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow hover:bg-emerald-800 disabled:opacity-50 transition"
              >
                {isAnalyzingDataset ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isArabic ? 'جاري احتساب الإحصاءات وتفسير فنار...' : 'Computing Stats & Fanar Interpretation...'}</span>
                  </>
                ) : (
                  <>
                    <BarChart2 className="h-4 w-4" />
                    <span>{isArabic ? 'تحليل وصفي وتفسير إحصائي' : 'Compute Statistics & Fanar Interpretation'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dataset Statistical Summary */}
          {datasetStats && (
            <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'المؤشرات الوصفية المحسوبة' : 'Calculated Descriptive Statistics'}
                </span>
                <span className="text-[10px] rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 font-bold text-emerald-800 dark:text-emerald-300">
                  {datasetStats.rowCount} Rows • {datasetStats.columnCount} Columns
                </span>
              </div>

              {/* Statistics Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-start text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                      <th className="pb-2 text-start font-semibold">Column</th>
                      <th className="pb-2 text-end font-semibold">Mean</th>
                      <th className="pb-2 text-end font-semibold">Min</th>
                      <th className="pb-2 text-end font-semibold">Max</th>
                      <th className="pb-2 text-end font-semibold">StdDev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {datasetStats.summary.map((s, i) => (
                      <tr key={i} className="text-slate-700 dark:text-slate-300">
                        <td className="py-1.5 font-medium">{s.column}</td>
                        <td className="py-1.5 text-end font-mono">{s.mean}</td>
                        <td className="py-1.5 text-end font-mono">{s.min}</td>
                        <td className="py-1.5 text-end font-mono">{s.max}</td>
                        <td className="py-1.5 text-end font-mono">{s.stdDev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fanar Interpretation */}
              {fanarExplanation && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isArabic ? 'تفسير الذكاء الاصطناعي (Fanar AI Explanation)' : 'Fanar Academic Interpretation'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {fanarExplanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
