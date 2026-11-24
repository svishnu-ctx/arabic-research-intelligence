'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SupervisorVivaCommitteePrep } from '@/lib/agents/supervisor';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import {
  GraduationCap,
  Sparkles,
  Award,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  Users,
  Bot,
  Sliders,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';

export default function SupervisorVivaAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [viewMode, setViewMode] = useState<'FORM' | 'CHAT'>('FORM');
  const [studentName, setStudentName] = useState('Maryam Al-Mazrouei (مريم المزروعي)');
  const [thesisTitle, setThesisTitle] = useState(
    'Optimizing Renewable Energy Microgrids in the UAE using Deep Reinforcement Learning'
  );
  const [methodologySummary, setMethodologySummary] = useState(
    'Deep Reinforcement Learning trained on Al-Waha campus solar weather telemetry with Markov decision process formulations.'
  );
  const [identifiedLimitations, setIdentifiedLimitations] = useState(
    '1. High ambient temperature sensor degradation modeling.\n2. Over-reliance on local campus diurnal summer cycles.'
  );
  const [targetLanguage, setTargetLanguage] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');
  const [isPreparing, setIsPreparing] = useState(false);
  const [vivaStrategy, setVivaStrategy] = useState<SupervisorVivaCommitteePrep | null>(null);

  React.useEffect(() => {
    setTargetLanguage(isArabic ? 'ar' : 'en');
  }, [isArabic]);

  const handlePrepare = async () => {
    setIsPreparing(true);
    try {
      const res = await fetch('/api/supervisor/agents/viva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          thesisTitle,
          methodologySummary,
          identifiedLimitations,
          language: targetLanguage
        }),
      });
      const data = await res.json();
      if (data.vivaPrep) {
        setVivaStrategy(data.vivaPrep);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-300">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Supervisor Agent 4 • Fanar AI Powered (ALW-404)</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          {isArabic ? 'محاكاة وإعداد لجنة مناقشة التخرج (Viva Committee Chair Agent)' : 'Viva Committee Chair & Rubric Builder'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {isArabic
            ? 'تجهيز خطة لجنة المناقشة، توليد 5 أسئلة مصنفة للأعضاء والممتحن الخارجي، وتحديد مكامن ضعف المرشح وروبك الدرجات.'
            : 'Formulate 5 categorized examination questions (Theoretical, Statistical, Edge Cases, Impact, Future Work), identify vulnerabilities, and set rubrics.'}
        </p>
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
          <span>{isArabic ? 'نموذج إعداد اللجنة وروبك المناقشة' : 'Viva Questions & Rubrics'}</span>
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
          <span>{isArabic ? 'المحادثة التفاعلية مع رئيس اللجنة (Chatbot)' : 'Viva Chair Chatbot'}</span>
        </button>
      </div>

      {viewMode === 'CHAT' ? (
        <AgentChatInterface
          agentType="thesis"
          agentNameAr="رئيس لجنة المناقشة والتحكيم (Viva Chair Agent)"
          agentNameEn="Viva Committee Defense Chair Agent"
          agentRoleAr="صياغة أسئلة المناقشة الحرجة، تقييم دفاع الطالب، ووضع روبك درجات الاجتياز"
          agentRoleEn="Formulating critical examination challenges, evaluating defenses, and establishing pass thresholds"
          initialGreetingAr="أهلاً د. فاطمة! بصفتي وكيل إعداد لجنة المناقشة (Viva Chair)، أنا مستعد لتجهيز جلسة مناقشة مريم المزروعي، صياغة أسئلة الممتحنين الداخليين والخارجيين، وفحص متانة الدفاع الأكاديمي."
          initialGreetingEn="Welcome Dr. Fatima! As your Viva Committee Chair Agent, I am ready to prepare Maryam Al-Mazrouei's defense docket, formulate internal/external examiner challenges, and establish passing thresholds."
          suggestedPromptsAr={[
            'صغ لي أصعب سؤال قد يطرحه الممتحن الخارجي بخصوص تعميم النتائج خارج الإمارات.',
            'ما هي معايير الفصل بين "اجتياز بتعديلات طفيفة" و"تعديلات جوهرية" في هذه الرسالة؟',
            'كيف نختبر فهم الطالبة لمعادلات التعلم المعزز الرياضية عند درجات الحرارة العالية؟',
            'اقترح توزيع الأدوار بين الممتحن الداخلي والممتحن الخارجي في جلسة المناقشة.'
          ]}
          suggestedPromptsEn={[
            'Draft the most difficult external examiner question regarding model generalizability.',
            'What exact criteria distinguish minor from major revisions for this thesis?',
            'How do we probe the candidate’s mathematical grasp of state-space penalty matrices?',
            'Suggest role division between internal and external examiners during the 90-minute defense.'
          ]}
          currentContext={`Candidate: ${studentName}\nThesis: ${thesisTitle}`}
          accentColor="indigo"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isArabic ? 'اسم المرشح للمناقشة:' : 'Candidate Defending:'}
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
                  {isArabic ? 'عنوان الأطروحة المعتمد:' : 'Final Thesis Title:'}
                </label>
                <input
                  type="text"
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isArabic ? 'المحددات المنهجية المعروفة للمشرف:' : 'Known Methodological Limitations:'}
                </label>
                <textarea
                  rows={3}
                  value={identifiedLimitations}
                  onChange={(e) => setIdentifiedLimitations(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              {/* Language Selector */}
              <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-3">
                <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">
                  {isArabic ? 'لغة إعداد خطة وروبك المناقشة:' : 'Committee Strategy Language:'}
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
                onClick={handlePrepare}
                disabled={isPreparing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3 text-xs font-bold text-white shadow hover:bg-indigo-800 disabled:opacity-50 transition"
              >
                {isPreparing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{isArabic ? 'جاري بناء استراتيجية وروبك لجنة المناقشة بنموذج فنار...' : 'Building Viva Strategy...'}</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>{isArabic ? 'إعداد خطة لجنة المناقشة بنموذج فنار' : 'Generate Committee Strategy with Fanar'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-4">
            {vivaStrategy ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="h-4 w-4 text-indigo-600" />
                      <span>{isArabic ? 'الأسئلة الخمسة المصنفة لأعضاء لجنة المناقشة (ALW-404)' : '5 Categorized Committee Examination Questions'}</span>
                    </h3>
                    <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:text-indigo-300">
                      Al-Waha Defense Protocol
                    </span>
                  </div>

                  {/* 5 Categorized Questions (ALW-404) */}
                  <div className="space-y-3">
                    {vivaStrategy.anticipatedCommitteeQuestions.map((q, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-extrabold text-indigo-800 dark:text-indigo-300">
                            {q.examinerRole} • {q.targetDomain}
                          </span>
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                          &quot;{q.question}&quot;
                        </div>
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 pt-1">
                          <span className="font-bold">{isArabic ? 'مكمن ضعف الطالب:' : 'Candidate Vulnerability:'} </span>
                          {q.candidateVulnerability}
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          <span className="font-bold">{isArabic ? 'معيار الإجابة الناجحة المقبولة من اللجنة:' : 'Passing Threshold Answer:'} </span>
                          {q.passingThresholdAnswer}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Red Flag Traps */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'أفخاخ شائعة قد تسقط الطالب أثناء المرافعة' : 'Red-Flag Defense Traps'}</span>
                    </h3>
                    <ul className="mt-1.5 space-y-1">
                      {vivaStrategy.redFlagTraps.map((trap, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{trap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rubric */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{isArabic ? 'روبك تقييم درجات قرار اللجنة النهائي' : 'Official Committee Grading Rubric'}</span>
                    </h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-[11px]">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                          {isArabic ? 'اجتياز غير مشروط' : 'Unconditional Pass'}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">{vivaStrategy.recommendedGradingRubric.unconditionalPass}</div>
                      </div>
                      <div className="p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 text-[11px]">
                        <div className="font-bold text-blue-800 dark:text-blue-300 mb-1">
                          {isArabic ? 'اجتياز بتعديلات طفيفة' : 'Minor Revisions'}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">{vivaStrategy.recommendedGradingRubric.minorRevisions}</div>
                      </div>
                      <div className="p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-[11px]">
                        <div className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                          {isArabic ? 'تعديلات جوهرية' : 'Major Revisions'}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">{vivaStrategy.recommendedGradingRubric.majorRevisions}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-850/50">
                <GraduationCap className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'في انتظار توليد خطة لجنة المناقشة' : 'Ready for Viva Strategy Formulation'}
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  {isArabic
                    ? 'انقر على الزر لتكليف نموذج فنار بصياغة أسئلة اللجنة وتحديد مكامن ضعف المرشح وروبك الدرجات.'
                    : 'Click the button to generate targeted examiner questions, candidate defense traps, and committee rubrics.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

