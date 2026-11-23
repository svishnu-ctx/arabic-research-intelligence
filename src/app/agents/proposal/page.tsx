'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Lightbulb,
  Sparkles,
  Send,
  Save,
  CheckCircle2,
  RefreshCw,
  FileText,
  AlertCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  ListOrdered,
  HelpCircle,
  Compass,
  BookmarkPlus
} from 'lucide-react';

interface ProposalData {
  title: string;
  background: string;
  problemStatement: string;
  objectives: string[];
  researchQuestions: string[];
  hypotheses?: string[];
  methodologyOverview?: string;
  scopeAndLimitations: string;
  potentialContributions: string[];
  suggestedNextSteps: string[];
}

export default function ProposalAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [field, setField] = useState('Computer Science & Artificial Intelligence');
  const [academicLevel, setAcademicLevel] = useState<'UNDERGRADUATE' | 'MASTERS' | 'PHD'>('MASTERS');
  const [researchInterests, setResearchInterests] = useState(
    'Machine Learning, Renewable Energy Grids, UAE Sustainability Vision 2031'
  );
  const [initialIdea, setInitialIdea] = useState(
    'Using deep reinforcement learning to balance intermittent solar power in smart microgrids within the UAE climate.'
  );
  const [targetLanguage, setTargetLanguage] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');

  React.useEffect(() => {
    setTargetLanguage(isArabic ? 'ar' : 'en');
  }, [isArabic]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Section refinement state
  const [refiningSection, setRefiningSection] = useState<string | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setProposal(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/agents/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          academicLevel,
          interests: researchInterests,
          initialIdea,
          language: targetLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
      }
    } catch (err) {
      console.error('Error generating proposal:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToProject = async () => {
    if (!proposal) return;
    try {
      const res = await fetch('/api/research-projects/proj_sharjah_01', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal,
          title: proposal.title,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      // Handle error
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Agent 1 • Fanar AI Powered</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'موضوع ومقترح البحث' : 'Research Topic & Proposal Agent'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'توليد وصياغة مقترح أكاديمي منهجي معتمد لجامعة الشارقة، مع فحص الجدوى وتحديد أهداف وأسئلة البحث.'
              : 'Brainstorm academic problems, formulate research objectives and questions, and structure complete research proposals.'}
          </p>
        </div>

        {proposal && (
          <button
            onClick={handleSaveToProject}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>{isArabic ? 'تم الحفظ في المشروع' : 'Saved to Project'}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isArabic ? 'حفظ المقترح في المشروع' : 'Save Proposal to Project'}</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form (Left Column) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Compass className="h-4 w-4 text-emerald-600" />
              <span>{isArabic ? 'محددات المقترح الأكاديمي' : 'Proposal Parameters'}</span>
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'المجال أو التخصص البحثي' : 'Research Field / Discipline'}
                </label>
                <input
                  type="text"
                  required
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'المستوى الأكاديمي للطالب' : 'Student Academic Level'}
                </label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as any)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="UNDERGRADUATE">Final-Year Undergraduate (تخرج بكالوريوس)</option>
                  <option value="MASTERS">Master’s Thesis (أطروحة ماجستير)</option>
                  <option value="PHD">Ph.D. Dissertation (أطروحة دكتوراه)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'الاهتمامات والكلمات المفتاحية' : 'Research Interests & Keywords'}
                </label>
                <input
                  type="text"
                  value={researchInterests}
                  onChange={(e) => setResearchInterests(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'الفكرة البحثية الأولية' : 'Initial Research Idea'}
                </label>
                <textarea
                  rows={4}
                  value={initialIdea}
                  onChange={(e) => setInitialIdea(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'ما المشكلة التي ترغب في معالجتها؟ ما السياق المقترح؟'
                      : 'Describe the problem you want to address...'
                  }
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'لغة المقترح' : 'Proposal Language'}
                </label>
                <div className="mt-1 flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="lang"
                      checked={targetLanguage === 'ar'}
                      onChange={() => setTargetLanguage('ar')}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>العربية (Arabic)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="lang"
                      checked={targetLanguage === 'en'}
                      onChange={() => setTargetLanguage('en')}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>English</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow hover:bg-emerald-800 disabled:opacity-50 transition"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isArabic ? 'جاري الصياغة بواسطة نموذج فنار...' : 'Synthesizing with Fanar...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{isArabic ? 'توليد المقترح الأكاديمي' : 'Generate Structured Proposal'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Structured Proposal Output (Right Column) */}
        <div className="lg:col-span-7">
          {isGenerating ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-12 text-center shadow-sm">
              <RefreshCw className="h-10 w-10 text-emerald-600 animate-spin mx-auto" />
              <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
                {isArabic ? 'نموذج Fanar يقوم بصياغة المقترح...' : 'Fanar Model is Structuring Your Academic Proposal...'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {isArabic
                  ? 'جاري صياغة مشكلة البحث، الأهداف، أسئلة البحث، والفرضيات الأكاديمية بدقة.'
                  : 'Synthesizing background, problem statement, research questions, and scope.'}
              </p>
            </div>
          ) : proposal ? (
            <div className="space-y-4">
              {/* Proposal Title Header */}
              <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-white dark:to-slate-850 p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {isArabic ? 'عنوان البحث المقترح' : 'Proposed Research Title'}
                </span>
                <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {proposal.title}
                </h2>
              </div>

              {/* Background and Context */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  1. {isArabic ? 'الخلفية والسياق الأكاديمي (Background)' : 'Background and Context'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {proposal.background}
                </p>
              </div>

              {/* Research Problem Statement */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  2. {isArabic ? 'مشكلة البحث (Problem Statement)' : 'Research Problem'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {proposal.problemStatement}
                </p>
              </div>

              {/* Objectives */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  3. {isArabic ? 'أهداف البحث (Research Objectives)' : 'Research Objectives'}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {proposal.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Questions */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  4. {isArabic ? 'أسئلة البحث (Research Questions)' : 'Research Questions'}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {proposal.researchQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        Q{i + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hypotheses */}
              {proposal.hypotheses && proposal.hypotheses.length > 0 && (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                    5. {isArabic ? 'الفرضيات البحثية (Hypotheses)' : 'Hypotheses'}
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {proposal.hypotheses.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                          H{i + 1}
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Scope & Potential Contribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {isArabic ? 'نطاق البحث ومحدداته' : 'Scope & Limitations'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proposal.scopeAndLimitations}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {isArabic ? 'المساهمة الأكاديمية المتوقعة' : 'Potential Contributions'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {proposal.potentialContributions.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-850/50 p-12 text-center">
              <FileText className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                {isArabic ? 'لم يتم توليد مقترح بعد' : 'No Proposal Generated Yet'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {isArabic
                  ? 'املأ محددات البحث واضغط على زر "توليد المقترح الأكاديمي" لبدء الصياغة الذكية بنموذج فنار.'
                  : 'Enter your research topic and idea, then click "Generate Structured Proposal" to run Fanar.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
