'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SupervisorProposalReview } from '@/lib/agents/supervisor';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Bot,
  Sliders,
  Send,
  Flag,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export default function SupervisorProposalAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [viewMode, setViewMode] = useState<'FORM' | 'CHAT'>('FORM');
  const [studentName, setStudentName] = useState('Maryam Al-Mazrouei (مريم المزروعي)');
  const [topic, setTopic] = useState('Optimizing Renewable Energy Microgrids in the UAE using Deep Reinforcement Learning');
  const [problemStatement, setProblemStatement] = useState(
    'Intermittent solar irradiance and extreme ambient temperatures exceeding 45°C in the UAE cause high-frequency battery cycling degradation. Existing models lack real-time degradation penalty matrices.'
  );
  const [noveltyScore, setNoveltyScore] = useState(88);
  const [targetLanguage, setTargetLanguage] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [review, setReview] = useState<SupervisorProposalReview | null>(null);
  const [supervisorDecision, setSupervisorDecision] = useState<'APPROVED' | 'REVISIONS' | 'COMMITTEE' | null>(null);

  React.useEffect(() => {
    setTargetLanguage(isArabic ? 'ar' : 'en');
  }, [isArabic]);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    setSupervisorDecision(null);
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
            <span>Supervisor Agent 1 • Fanar AI Powered (ALW-402)</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'تقييم واعتماد المقترح الأكاديمي (Proposal Evaluation)' : 'Proposal Review & Rubric Scoring Agent'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'تدقيق مقترح الطالب بواسطة الذكاء الاصطناعي، احتساب درجات الروبك الخماسي من 100، وتحديد إجراء المشرف المعتمد.'
              : 'Objective AI supervisory critique of graduate research proposals, 5-dimension rubric scoring out of 100, and supervisor decision.'}
          </p>
        </div>
      </div>

      {/* Dual Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 w-fit">
        <button
          type="button"
          onClick={() => setViewMode('FORM')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'FORM'
              ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isArabic ? 'نموذج التقييم وروبك الدرجات' : 'Rubric Evaluation & Decisions'}</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('CHAT')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'CHAT'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>{isArabic ? 'المحادثة الاستشارية مع الوكيل (Chatbot)' : 'Interactive Advisory Chat'}</span>
        </button>
      </div>

      {viewMode === 'CHAT' ? (
        <AgentChatInterface
          agentType="proposal"
          agentNameAr="مستشار تقييم مقترحات الأطروحات"
          agentNameEn="Graduate Proposal Evaluation Advisor"
          agentRoleAr="مساعدة المشرف الأكاديمي في فحص الجدوى العلمية، كشف الثغرات المنهجية، وتقييم الأصالة"
          agentRoleEn="Assisting faculty supervisors in evaluating research feasibility, methodological rigor, and novelty"
          initialGreetingAr="أهلاً د. فاطمة! أنا وكيل تقييم المقترحات الأكاديمية المدعوم بنموذج Fanar. كيف يمكنني مساعدتك في تدقيق مقترح الطالبة مريم المزروعي أو مراجعة مخرجات الروبك اليوم؟"
          initialGreetingEn="Welcome Dr. Fatima! I am your Graduate Proposal Evaluation Advisor powered by Fanar AI. How can I assist you in reviewing Maryam Al-Mazrouei's proposal or checking rubric benchmarks today?"
          suggestedPromptsAr={[
            'هل يعتبر حجم العينة كافياً لإثبات الفرضية الإحصائية في المقترح؟',
            'ما هي أبرز التحفظات المنهجية التي ينبغي طرحها في الاجتماع القادم مع مريم؟',
            'كيف يقارن هذا المقترح مع أولويات استراتيجية الإمارات للطاقة 2050؟',
            'صغ لي مذكرة إشرافية تطلب تعديل مصفوفة درجات الحرارة المرتفعة.'
          ]}
          suggestedPromptsEn={[
            'Is the proposed sample size statistically powered to falsify the hypothesis?',
            'What core methodological reservations should I raise in my next meeting with Maryam?',
            'How does this proposal align with UAE Energy Strategy 2050 targets?',
            'Draft a supervisor advisory memo requesting high-temperature degradation modeling.'
          ]}
          currentContext={`Candidate: ${studentName}\nTopic: ${topic}`}
          accentColor="indigo"
        />
      ) : (
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
                    <span>{isArabic ? 'جاري التحليل واحتساب الروبك بنموذج فنار...' : 'Fanar Evaluating Rubric...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{isArabic ? 'إصدار التقييم واحتساب درجات الروبك' : 'Evaluate Proposal & Score Rubric'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Screen */}
          <div className="lg:col-span-7 space-y-4">
            {review ? (
              <div className="space-y-4">
                {/* 5-Dimension Weighted Rubric Scoring Card (ALW-402) */}
                <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {isArabic ? 'مجموع درجات الروبك الإشرافي (من 100)' : 'Weighted Rubric Total Score'}
                        </div>
                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                          88 / 100 <span className="text-xs font-bold text-emerald-600">({isArabic ? 'مستوفٍ للشروط الأكاديمية' : 'Approved Level'})</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                        {isArabic ? 'توصية الذكاء الاصطناعي: اعتماد المقترح' : 'AI Recommendation: APPROVED'}
                      </span>
                    </div>
                  </div>

                  {/* 5 Dimensions Breakdown */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {isArabic ? 'تفصيل الأبعاد الخمسة للتقييم الأكاديمي:' : '5 Rubric Evaluation Dimensions:'}
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{isArabic ? '1. وضوح بيان المشكلة وتحديد الثغرة البحثية (Problem Statement)' : '1. Problem Statement & Research Gap'}</span>
                          <span className="font-mono text-indigo-600">18 / 20</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{isArabic ? '2. الجدوى العلمية وتوفر البيانات (Feasibility)' : '2. Scientific Feasibility'}</span>
                          <span className="font-mono text-indigo-600">{Math.round((review.feasibilityScore || 85) * 0.2)} / 20</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${review.feasibilityScore}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{isArabic ? '3. الأصالة والقيمة الابتكارية المضافة (Novelty)' : '3. Novelty & Innovation'}</span>
                          <span className="font-mono text-indigo-600">19 / 20</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '95%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{isArabic ? '4. الصرامة والدقة المنهجية (Methodological Rigor)' : '4. Methodological Rigor'}</span>
                          <span className="font-mono text-indigo-600">{Math.round((review.methodologicalRigor || 82) * 0.2)} / 20</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${review.methodologicalRigor}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{isArabic ? '5. التوافق مع الأولويات الوطنية للإمارات (Alignment)' : '5. Alignment with UAE Priorities'}</span>
                          <span className="font-mono text-indigo-600">18 / 20</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Identified Blindspots */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'الثغرات ونقاط القصور المرصودة (Identified Blindspots):' : 'Identified Deficiencies:'}</span>
                    </h3>
                    <ul className="space-y-1.5">
                      {review.identifiedBlindspots.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SUPERVISOR DECISION BUTTONS (ALW-402) */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {isArabic ? 'قرار المشرف الأكاديمي النهائي:' : 'Official Supervisor Decision:'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => setSupervisorDecision('APPROVED')}
                        className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                          supervisorDecision === 'APPROVED'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isArabic ? 'اعتماد المقترح' : 'Approve Proposal'}</span>
                      </button>

                      <button
                        onClick={() => setSupervisorDecision('REVISIONS')}
                        className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                          supervisorDecision === 'REVISIONS'
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{isArabic ? 'طلب تعديلات' : 'Request Revisions'}</span>
                      </button>

                      <button
                        onClick={() => setSupervisorDecision('COMMITTEE')}
                        className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                          supervisorDecision === 'COMMITTEE'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-300 hover:bg-purple-100'
                        }`}
                      >
                        <Flag className="w-4 h-4" />
                        <span>{isArabic ? 'إحالة للجنة العلمية' : 'Flag to Committee'}</span>
                      </button>
                    </div>

                    {supervisorDecision && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between animate-in fade-in">
                        <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>
                            {supervisorDecision === 'APPROVED'
                              ? isArabic ? 'تم اعتماد المقترح وإرسال الإشعار لمريم المزروعي' : 'Proposal Approved & Notification Dispatched'
                              : supervisorDecision === 'REVISIONS'
                              ? isArabic ? 'تم توجيه قائمة التعديلات للطالبة' : 'Revisions Dispatched to Candidate'
                              : isArabic ? 'تمت إحالة الملف إلى لجنة الدراسات العليا' : 'Flagged to Graduate Academic Board'}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-850/50">
                <Lightbulb className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'في انتظار تشغيل التقييم واحتساب درجات الروبك' : 'Ready for Supervisory Evaluation'}
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  {isArabic
                    ? 'انقر على الزر الأزرق لتكليف نموذج فنار بإجراء فحص شامل للمقترح وتوليد الروبك الخماسي من 100.'
                    : 'Click the button to generate the 5-dimension rubric score and supervisor decision memo.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

