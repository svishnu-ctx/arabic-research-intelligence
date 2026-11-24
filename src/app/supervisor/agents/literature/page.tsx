'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SupervisorCitationAudit } from '@/lib/agents/supervisor';
import {
  BookOpen,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
  BookmarkCheck,
  FileSearch,
  ExternalLink
} from 'lucide-react';

export default function SupervisorLiteratureAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

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
          citations: citationsText.split('\n').filter(Boolean),
          identifiedGaps: gapsText.split('\n').filter(Boolean),
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
          {isArabic ? 'تدقيق المراجع ونزاهة الأدبيات العلمية' : 'Citation & Literature Integrity Auditor'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {isArabic
            ? 'التحقق التلقائي من مصداقية مراجع الطالب، ورصد التحيز أو الاستشهاد بمصادر غير محكمة، واقتراح أوراق بحثية جوهرية مفقودة.'
            : 'Audit candidate bibliography integrity, flag hallucinated or predatory citations, and benchmark literature diversity.'}
        </p>
      </div>

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
                {isArabic ? 'قائمة المراجع قيد التدقيق (من مراجعة الطالب):' : 'Candidate Bibliography Sample:'}
              </label>
              <textarea
                rows={4}
                value={citationsText}
                onChange={(e) => setCitationsText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {isArabic ? 'الفجوات البحثية التي زعم الطالب اكتشافها:' : 'Claimed Research Gaps:'}
              </label>
              <textarea
                rows={3}
                value={gapsText}
                onChange={(e) => setGapsText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 leading-relaxed"
              />
            </div>

            {/* Language Selector */}
            <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-3">
              <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">
                {isArabic ? 'لغة تقرير التدقيق الأكاديمي:' : 'Audit Report Language:'}
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
                  <span>{isArabic ? 'جاري مطابقة المراجع وتدقيق النزاهة...' : 'Auditing Citations via Fanar...'}</span>
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4" />
                  <span>{isArabic ? 'بدء تدقيق المراجع بنموذج فنار' : 'Audit Bibliography with Fanar'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-4">
          {audit ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {isArabic ? 'مؤشر نزاهة وموثوقية المراجع' : 'Citation Integrity Score'}
                      </div>
                      <div className="text-xl font-extrabold text-indigo-600">
                        {audit.citationIntegrityScore} / 100
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {isArabic ? 'موثقة ومحكمة' : 'Verified Scholarly Rigor'}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Flagged */}
                  <div>
                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertOctagon className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'التنبيهات المنهجية على استشهادات الطالب' : 'Flagged Citations & Concerns'}</span>
                    </h3>
                    <div className="mt-2 space-y-2">
                      {audit.flaggedCitations.map((flag, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white">{flag.citation}</div>
                          <div className="text-slate-600 dark:text-slate-400 mt-0.5">{flag.issue}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diversity */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600">
                      {isArabic ? 'تقييم تنوع المصادر (إقليمياً وعالمياً)' : 'Literature Diversity Assessment'}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {audit.literatureDiversityAssessment}
                    </p>
                  </div>

                  {/* Seminal Papers */}
                  <div>
                    <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookmarkCheck className="h-3.5 w-3.5" />
                      <span>{isArabic ? 'أوراق علمية رائدة مفقودة يلزم تكليف الطالب بقراءتها' : 'Seminal Missing Papers to Assign'}</span>
                    </h3>
                    <div className="mt-2 space-y-2">
                      {audit.recommendedSeminalPapers.map((paper, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs">
                          <div className="font-bold text-emerald-900 dark:text-emerald-300">{paper.title}</div>
                          <div className="text-slate-500 mt-1">{paper.whyRequired}</div>
                        </div>
                      ))}
                    </div>
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
    </div>
  );
}
