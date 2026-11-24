'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SupervisorProposalReview } from '@/lib/agents/supervisor';
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function SupervisorProposalAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [studentName, setStudentName] = useState('Maryam Al-Mazrouei (مريم المزروعي)');
  const [topic, setTopic] = useState('Optimizing Renewable Energy Microgrids in the UAE using Deep Reinforcement Learning');
  const [problemStatement, setProblemStatement] = useState(
    'Intermittent solar irradiance and extreme ambient temperatures exceeding 45°C in the UAE cause high-frequency battery cycling degradation. Existing models lack real-time degradation penalty matrices.'
  );
  const [noveltyScore, setNoveltyScore] = useState(88);
  const [targetLanguage, setTargetLanguage] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [review, setReview] = useState<SupervisorProposalReview | null>(null);

  React.useEffect(() => {
    setTargetLanguage(isArabic ? 'ar' : 'en');
  }, [isArabic]);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/supervisor/agents/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          topic,
          problemStatement,
          researchQuestions: [
            'How to formulate state-space matrices under temperatures exceeding 45°C?',
            'Can deep reinforcement learning minimize grid outage probability in Al-Waha campus microgrids?'
          ],
          noveltyScore,
          language: targetLanguage
        }),
      });
      const data = await res.json();
      if (data.evaluation) {
        setReview(data.evaluation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-300">
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Supervisor Agent 1 • Fanar AI Powered</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'تقييم واعتماد المقترح الأكاديمي' : 'Proposal Review & Evaluation Agent'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'تدقيق مقترح الطالب بواسطة الذكاء الاصطناعي، وتقييم الجدوى العلمية والتوافق مع الأولويات الوطنية لدولة الإمارات.'
              : 'Objective AI supervisory critique of graduate research proposals, feasibility benchmarking, and milestone roadmapping.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-indigo-600" />
              <span>{isArabic ? 'بيانات أطروحة الطالب قيد المراجعة' : 'Candidate Thesis Under Review'}</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {isArabic ? 'اسم الطالب / الباحث:' : 'Candidate Name:'}
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {isArabic ? 'موضوع الأطروحة المقترح:' : 'Proposed Thesis Topic:'}
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {isArabic ? 'بيان المشكلة (المستلم من الطالب):' : 'Candidate Problem Statement:'}
              </label>
              <textarea
                rows={4}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 leading-relaxed"
              />
            </div>

            {/* Language Selector */}
            <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-3">
              <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">
                {isArabic ? 'لغة الملاحظات والتقييم الإشرافي:' : 'Supervisor Evaluation Language:'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="targetLanguage"
                    checked={targetLanguage === 'ar'}
                    onChange={() => setTargetLanguage('ar')}
                    className="accent-indigo-600"
                  />
                  <span>العربية (Arabic)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="targetLanguage"
                    checked={targetLanguage === 'en'}
                    onChange={() => setTargetLanguage('en')}
                    className="accent-indigo-600"
                  />
                  <span>English</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3 text-xs font-bold text-white shadow hover:bg-indigo-800 disabled:opacity-50 transition"
            >
              {isEvaluating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{isArabic ? 'جاري التحليل والمراجعة بنموذج فنار...' : 'Fanar Evaluating Proposal...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{isArabic ? 'إصدار التقييم الإشرافي بنموذج فنار' : 'Evaluate Proposal with Fanar'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Screen */}
        <div className="lg:col-span-7 space-y-4">
          {review ? (
            <div className="space-y-4">
              {/* Verdict Banner */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {isArabic ? 'قرار المشرف الأكاديمي الموصى به' : 'Recommended Supervisor Verdict'}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                        {review.verdict === 'APPROVED' ? (isArabic ? 'اعتماد المقترح مبدئياً (APPROVED)' : 'PROPOSAL APPROVED') : review.verdict}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-slate-400">{isArabic ? 'درجة الجدوى' : 'Feasibility'}</div>
                      <div className="text-base font-extrabold text-indigo-600">{review.feasibilityScore}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-slate-400">{isArabic ? 'الدقة المنهجية' : 'Methodology'}</div>
                      <div className="text-base font-extrabold text-indigo-600">{review.methodologicalRigor}%</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'التوافق مع الأولويات الوطنية لدولة الإمارات' : 'Alignment with UAE National Priorities'}</span>
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {review.alignmentWithNationalPriorities}
                    </p>
                  </div>

                  {/* Blindspots */}
                  <div>
                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'الثغرات ونقاط الضعف المنهجية التي يجب تنبيه الطالب إليها' : 'Identified Blindspots to Flag'}</span>
                    </h3>
                    <ul className="mt-1.5 space-y-1.5">
                      {review.identifiedBlindspots.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actionable Feedback */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'ملاحظات المشرف الموجهة للطالب للاجتماع القادم' : 'Actionable Faculty Feedback for Candidate'}</span>
                    </h3>
                    <ul className="mt-1.5 space-y-1.5">
                      {review.actionableSupervisorFeedback.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Milestones */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{isArabic ? 'خارطة المراحل الموصى بها للفصل القادم' : 'Recommended Semester Milestones'}</span>
                    </h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {review.recommendedMilestones.map((m, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-850/50">
              <Lightbulb className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isArabic ? 'في انتظار تشغيل التقييم الإشرافي' : 'Ready for Supervisory Evaluation'}
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                {isArabic
                  ? 'انقر على الزر الأزرق لتكليف نموذج فنار بإجراء فحص شامل للمقترح وتحديد درجة الجدوى والتوافق الوطني.'
                  : 'Click the button to generate the faculty evaluation memo, national priority alignment, and milestone tracker.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
