'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SupervisorCitationAudit } from '@/lib/agents/supervisor';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import {
  BookOpen,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
  BookmarkCheck,
  FileSearch,
  ExternalLink,
  Bot,
  Sliders
} from 'lucide-react';

export default function SupervisorLiteratureAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [viewMode, setViewMode] = useState<'FORM' | 'CHAT'>('FORM');
  const [studentName, setStudentName] = useState('Maryam Al-Mazrouei (مريم المزروعي)');
  const [topic, setTopic] = useState('Deep Reinforcement Learning for Solar Microgrids');
  const [citationsText, setCitationsText] = useState(
    '1. Al-Maktoum et al. (2023) - High temperature microgrid operations in the GCC.\n2. Zhang & Patel (2024) - Reinforcement learning in distributed renewable energy systems.\n3. IEEE Taskforce on Clean Energy Infrastructure (2022) - Smart inverter reliability.'
  );
  const [gapsText, setGapsText] = useState(
    '1. Lack of empirical battery degradation modeling under sustained Gulf heat (>45°C).\n2. Unresolved economic lifecycle trade-offs.'
  );
  const [targetLanguage, setTargetLanguage] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');
  const [isAuditing, setIsAuditing] = useState(false);
  const [audit, setAudit] = useState<SupervisorCitationAudit | null>(null);

  React.useEffect(() => {
    setTargetLanguage(isArabic ? 'ar' : 'en');
  }, [isArabic]);

  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/supervisor/agents/literature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          topic,
          citationsText,
          gapsText,
          language: targetLanguage
        }),
      });
      const data = await res.json();
      if (data.audit) {
        setAudit(data.audit);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-300">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Supervisor Agent 2 • Fanar AI Powered</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          {isArabic ? 'تدقيق المراجع ونزاهة الأدبيات العلمية (Citation Integrity)' : 'Citation & Literature Integrity Auditor'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {isArabic
            ? 'التحقق التلقائي من مصداقية مراجع الطالب، ورصد التحيز أو الاستشهاد بمصادر غير محكمة، واقتراح أوراق بحثية جوهرية مفقودة.'
            : 'Audit candidate bibliography integrity, flag hallucinated or predatory citations, and benchmark literature diversity.'}
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
          <span>{isArabic ? 'نموذج تدقيق المراجع التلقائي' : 'Structured Citation Audit'}</span>
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
          <span>{isArabic ? 'المحادثة الاستشارية الببليومترية (Chatbot)' : 'Bibliometric Audit Chatbot'}</span>
        </button>
      </div>

      {viewMode === 'CHAT' ? (
        <AgentChatInterface
          agentType="literature"
          agentNameAr="مدقق المراجع ونزاهة الأدبيات (Bibliometric Auditor)"
          agentNameEn="Citation & Literature Integrity Auditor"
          agentRoleAr="رصد المراجع الوهمية، تدقيق مطابقة معايير APA 7th، واقتراح أوراق بحثية محكمة"
          agentRoleEn="Detecting hallucinated citations, checking APA 7th standards, and suggesting seminal papers"
          initialGreetingAr="أهلاً د. فاطمة! بصفتي وكيل تدقيق المراجع ونزاهة الأدبيات، أنا مستعد لمراجعة قائمة مراجع مريم المزروعي والتأكد من مطابقتها لفهارس OpenAlex وCrossref الموثقة."
          initialGreetingEn="Welcome Dr. Fatima! As your Citation Integrity Auditor, I am ready to cross-verify candidate citations against verified OpenAlex and Crossref repositories."
          suggestedPromptsAr={[
            'هل توجد أي مراجع مشبوهة أو غير محكمة في مسودة الطالبة؟',
            'ما هي أبرز الأوراق البحثية المنشورة في 2025-2026 التي أغفلتها الطالبة؟',
            'كيف نتحقق من دقة التوثيق بأسلوب APA الإصدار السابع في قائمة المراجع؟',
            'صغ لي ملاحظات توجيهية للطالبة لتوسيع نطاق المراجعة المنهجية.'
          ]}
          suggestedPromptsEn={[
            'Are there predatory or unverified citations in the candidate bibliography?',
            'What seminal 2025-2026 papers on microgrids are missing from this draft?',
            'How do we ensure flawless APA 7th Edition compliance across all entries?',
            'Draft supervisory guidelines for expanding the systematic literature review.'
          ]}
          currentContext={`Candidate: ${studentName}\nTopic: ${topic}`}
          accentColor="indigo"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm space-y-4">
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
                  {isArabic ? 'موضوع الأطروحة:' : 'Thesis Topic:'}
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
                  {isArabic ? 'قائمة المراجع المستلمة من الطالب للتدقيق:' : 'Candidate Citation Draft to Audit:'}
                </label>
                <textarea
                  rows={4}
                  value={citationsText}
                  onChange={(e) => setCitationsText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 leading-relaxed font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isArabic ? 'الثغرات البحثية التي يزعم الطالب وجودها:' : 'Claimed Research Gaps:'}
                </label>
                <textarea
                  rows={3}
                  value={gapsText}
                  onChange={(e) => setGapsText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 leading-relaxed text-[11px]"
                />
              </div>

              {/* Language Selector */}
              <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-3">
                <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">
                  {isArabic ? 'لغة تقرير تدقيق المراجع:' : 'Audit Report Language:'}
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
                onClick={handleAudit}
                disabled={isAuditing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3 text-xs font-bold text-white shadow hover:bg-indigo-800 disabled:opacity-50 transition"
              >
                {isAuditing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{isArabic ? 'جاري مطابقة المراجع مع الفهارس العالمية...' : 'Auditing Citations with Fanar...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{isArabic ? 'تشغيل تدقيق المراجع والأدبيات بنموذج فنار' : 'Audit Citations & Literature Integrity'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-4">
            {audit ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                        <BookmarkCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {isArabic ? 'نزاهة الاستشهادات وتنوع المراجع' : 'Citation Integrity & Balance'}
                        </div>
                        <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                          {audit.citationIntegrityScore}% {isArabic ? 'خالية من الاختلاق' : 'Zero Hallucinations'}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      OpenAlex / Crossref Verified
                    </span>
                  </div>

                  {/* Flagged Predatory Citations */}
                  <div>
                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertOctagon className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'المراجع التي تتطلب مراجعة أو إعادة تحقق' : 'Flagged Inconsistencies or Predatory Sources'}</span>
                    </h3>
                    <div className="mt-2 space-y-1.5">
                      {audit.flaggedCitations?.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
                          <span className="font-bold">{item.citation}</span>: {item.issue}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seminal Missing Papers */}
                  <div>
                    <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileSearch className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'أوراق علمية جوهرية مفقودة يوصى بإضافتها للأطروحة' : 'Seminal Missing Literature to Recommend'}</span>
                    </h3>
                    <div className="mt-2 space-y-2">
                      {audit.recommendedSeminalPapers?.map((paper, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                            <span>{paper.title}</span>
                          </div>
                          <div className="text-slate-500 mt-1">{paper.whyRequired}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-850/50">
                <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'في انتظار تشغيل فحص المراجع' : 'Ready for Citation Audit'}
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  {isArabic
                    ? 'انقر على الزر لتكليف نموذج فنار بفحص المراجع ورصد أي انحياز أو أوراق مفقودة.'
                    : 'Click the button to audit citations, flag bias, and assign missing seminal papers.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
