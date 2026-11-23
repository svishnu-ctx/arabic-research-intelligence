'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  GraduationCap,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck2,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send,
  Download,
  BookOpen
} from 'lucide-react';

interface ThesisReviewResult {
  overallAssessment: string;
  academicTone: string;
  structuralCompleteness: string;
  coherenceAndFlow: string;
  citationRigor: string;
  actionableRevisions: string[];
}

interface DefenseQuestion {
  question: string;
  category: 'METHODOLOGY' | 'LITERATURE' | 'FINDINGS' | 'LIMITATIONS';
  examinerIntent: string;
  suggestedDefense: string;
}

export default function ThesisAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState<'REVIEW' | 'DEFENSE'>('REVIEW');

  // Chapter Review Form
  const [chapterTitle, setChapterTitle] = useState('Chapter 3: Methodology and Microgrid Architecture');
  const [chapterType, setChapterType] = useState('METHODOLOGY');
  const [chapterText, setChapterText] = useState(
    `This research presents an adaptive deep reinforcement learning framework for energy management in UAE microgrids. The system models solar irradiance from Sharjah weather stations using an ensemble Markov decision process. Battery storage constraints are evaluated under ambient temperatures exceeding 45°C. However, previous studies (Al-Maktoum et al., 2023) lacked empirical high-temperature degradation modeling, which our simulation addresses through state-space temperature penalty matrices.`
  );
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ThesisReviewResult | null>(null);

  // Viva Defense Form
  const [thesisTitle, setThesisTitle] = useState(
    'Optimizing Renewable Energy Microgrids in the UAE using Deep Reinforcement Learning'
  );
  const [isSimulatingDefense, setIsSimulatingDefense] = useState(false);
  const [defenseQuestions, setDefenseQuestions] = useState<DefenseQuestion[]>([]);

  // Run Chapter Review with Fanar
  const handleReviewChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterText.trim()) return;

    setIsReviewing(true);
    setReviewResult(null);

    try {
      const res = await fetch('/api/agents/thesis-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle,
          chapterType,
          content: chapterText,
          chapterContent: chapterText,
          academicLevel: 'MASTERS',
          language: isArabic ? 'ar' : 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewResult(data.review);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReviewing(false);
    }
  };

  // Run Viva Defense Simulation with Fanar
  const handleSimulateDefense = async () => {
    setIsSimulatingDefense(true);
    setDefenseQuestions([]);

    try {
      const res = await fetch('/api/agents/thesis-defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thesisTitle,
          methodologySummary: 'Deep Reinforcement Learning trained on Sharjah meteorological dataset',
          academicLevel: 'MASTERS',
          language: isArabic ? 'ar' : 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDefenseQuestions(data.questions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulatingDefense(false);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Agent 4 • Fanar Thesis Review & Viva Defense Simulator</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'مراجعة الأطروحة ومحاكاة المناقشة' : 'Thesis Review & Defense Preparation'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'تقييم نقدي لفصول الأطروحة، فحص النبرة العلمية والاستشهادات، واختبار الطالب عبر محاكاة أسئلة لجان المناقشة الصعبة.'
              : 'Critique thesis drafts, verify citations and coherence, and prepare for viva defense with simulated examiner questions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('REVIEW')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'REVIEW'
                ? 'bg-amber-700 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {isArabic ? 'مراجعة فصول الأطروحة' : 'Chapter Review'}
          </button>
          <button
            onClick={() => setActiveTab('DEFENSE')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'DEFENSE'
                ? 'bg-amber-700 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {isArabic ? 'محاكاة لجنة الدفاع (Viva)' : 'Viva Defense Simulator'}
          </button>
        </div>
      </div>

      {activeTab === 'REVIEW' ? (
        /* Chapter Review Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <FileCheck2 className="h-4 w-4 text-amber-600" />
                <span>{isArabic ? 'فحص ونقد مسودة الفصل' : 'Input Chapter Draft'}</span>
              </h2>

              <form onSubmit={handleReviewChapter} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'عنوان الفصل' : 'Chapter Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'نوع الفصل' : 'Chapter Type'}
                  </label>
                  <select
                    value={chapterType}
                    onChange={(e) => setChapterType(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-600 focus:outline-none"
                  >
                    <option value="INTRODUCTION">Introduction (المقدمة والخلفية)</option>
                    <option value="LITERATURE_REVIEW">Literature Review (مراجعة الأدبيات)</option>
                    <option value="METHODOLOGY">Methodology (المنهجية العلمية)</option>
                    <option value="RESULTS">Results & Findings (النتائج والتحليل)</option>
                    <option value="DISCUSSION">Discussion & Limitations (المناقشة والمحددات)</option>
                    <option value="CONCLUSION">Conclusion (الخاتمة والتوصيات)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'نص الفصل الأكاديمي' : 'Chapter Draft Text'}
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={chapterText}
                    onChange={(e) => setChapterText(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-white focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isReviewing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-700 py-3 text-xs font-bold text-white shadow hover:bg-amber-800 disabled:opacity-50 transition"
                >
                  {isReviewing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{isArabic ? 'جاري الفحص الأكاديمي بواسطة نموذج فنار...' : 'Fanar Critiquing Draft...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>{isArabic ? 'بدء الفحص والمراجعة النقدية' : 'Critique Chapter with Fanar'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Chapter Review Output */}
          <div className="lg:col-span-6 space-y-4">
            {reviewResult ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/50 to-white dark:to-slate-850 p-6 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    {isArabic ? 'التقييم الأكاديمي الإجمالي' : 'Overall Academic Critique'}
                  </span>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {reviewResult.overallAssessment}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'النبرة العلمية' : 'Academic Tone'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {reviewResult.academicTone}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'الترابط والتدفق المنطقي' : 'Coherence & Flow'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {reviewResult.coherenceAndFlow}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 p-6 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isArabic ? 'توصيات التعديل الإجرائية' : 'Actionable Revision Recommendations'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {reviewResult.actionableRevisions.map((rev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{rev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-850/50 p-12 text-center">
                <FileCheck2 className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'بانتظار مسودة الفصل' : 'No Chapter Critiqued Yet'}
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  {isArabic
                    ? 'أدخل نص الفصل واضغط على "بدء الفحص والمراجعة النقدية" لتحليله بدقة.'
                    : 'Paste your draft text and run the critique engine.'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Viva Defense Simulator Mode */
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'محاكي مناقشة الأطروحة (Viva Defense Simulator)' : 'Simulated Viva Examination'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isArabic
                    ? 'يقوم نموذج فنار بمحاكاة أسئلة ممتحن خارجي صارم لاختبار متانة منهجيتك، استشهاداتك، وتفسيرك للنتائج.'
                    : 'Simulates rigorous viva defense questions with examiner intent and model defense answers.'}
                </p>
              </div>

              <button
                onClick={handleSimulateDefense}
                disabled={isSimulatingDefense}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow hover:bg-amber-800 disabled:opacity-50 transition shrink-0"
              >
                {isSimulatingDefense ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isArabic ? 'جاري توليد أسئلة اللجنة...' : 'Generating Questions...'}</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4" />
                    <span>{isArabic ? 'توليد أسئلة المناقشة الحية' : 'Simulate Viva Questions'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Defense Questions Grid */}
          {defenseQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isArabic ? `تم إعداد ${defenseQuestions.length} أسئلة تحدي` : `${defenseQuestions.length} Challenging Questions Prepared`}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defenseQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        {q.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Q{i + 1}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      "{q.question}"
                    </h4>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        {isArabic ? 'هدف الممتحن من السؤال:' : 'Examiner Intent:'}
                      </div>
                      <div>{q.examinerIntent}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300">
                      <div className="font-bold text-emerald-800 dark:text-emerald-200 mb-1">
                        {isArabic ? 'استراتيجية الإجابة المقترحة للطالب:' : 'Suggested Defense Argument:'}
                      </div>
                      <div>{q.suggestedDefense}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
