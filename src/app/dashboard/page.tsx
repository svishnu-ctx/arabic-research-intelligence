'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import {
  Sparkles,
  GraduationCap,
  Lightbulb,
  BookOpen,
  LineChart,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Layers,
  FolderOpen,
  BarChart3,
  Bot,
  AlertCircle,
  X
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  field: string;
  academicLevel: string;
  preferredLanguage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  proposal?: any;
  methodology?: any;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New project modal form state
  const [newTitle, setNewTitle] = useState('');
  const [newField, setNewField] = useState('Computer Science & AI');
  const [newLevel, setNewLevel] = useState<'UNDERGRADUATE' | 'MASTERS' | 'PHD'>('MASTERS');
  const [newLang, setNewLang] = useState<'ar' | 'en'>('ar');
  const [newIdea, setNewIdea] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Load projects from backend
  const loadProjects = async () => {
    try {
      const res = await fetch('/api/research-projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/research-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          field: newField,
          academicLevel: newLevel,
          preferredLanguage: newLang,
          initialIdea: newIdea,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewIdea('');
        await loadProjects();
      }
    } catch {
      // Handle error
    } finally {
      setIsCreating(false);
    }
  };

  const activeProject = projects[0] || {
    id: 'proj_alwaha_01',
    title: isArabic
      ? 'تحسين كفاءة شبكات الطاقة المتجددة في دولة الإمارات باستخدام الذكاء الاصطناعي'
      : 'Optimizing Renewable Energy Microgrids in the UAE using Deep Reinforcement Learning',
    field: 'Computer Science & Sustainable Engineering',
    academicLevel: 'MASTERS',
    preferredLanguage: 'ar',
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-8" dir={direction}>
      {/* Top Welcome & Academic Profile Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>جامعة الواحة • Al-Waha University</span>
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isArabic ? 'مستوى البحث: ماجستير (Master’s Thesis)' : 'Research Level: Master’s Thesis'}
              </span>
              <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                {isArabic ? 'البرنامج: علوم وهندسة الحاسوب' : 'Program: M.Sc. Computer Science'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isArabic
                ? `أهلاً بك، ${user?.displayName || 'مريم المزروعي'}`
                : `Welcome, ${user?.displayName || 'Maryam Al-Mazrouei'}`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {isArabic
                ? 'جناح الذكاء البحثي للطلبة يدعم مسارك الأكاديمي عبر وكلاء الذكاء الاصطناعي الأربعة المدعومين بنموذج فنار (Fanar API) مع اكتشاف الأوراق العلمية الحقيقية وتحليل البيانات.'
                : 'Your Academic Research Suite guides your lifecycle through four specialized AI agents powered by Fanar API, real OpenAlex/Crossref publication discovery, and statistical dataset analysis.'}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? 'إنشاء مشروع بحثي جديد' : 'Create New Research Project'}</span>
            </button>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
            >
              <FolderOpen className="h-4 w-4 text-emerald-600" />
              <span>{isArabic ? 'إدارة المشاريع' : 'Manage Projects'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Research Project Progress Card */}
      <div className="rounded-3xl border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/70 via-white dark:via-slate-850 to-teal-50/40 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100 dark:border-emerald-900/30">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              {isArabic ? 'المشروع البحثي النشط حالياً' : 'Current Active Research Project'}
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {activeProject.title}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{activeProject.field}</span>
              <span>•</span>
              <span>{isArabic ? 'المستوى الأكاديمي:' : 'Level:'} {activeProject.academicLevel}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                {isArabic ? 'الحالة: قيد البحث والتطوير' : 'Status: In Progress'}
              </span>
            </div>
          </div>

          <div className="text-start md:text-end shrink-0">
            <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300">
              68%
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              {isArabic ? 'نسبة الإنجاز الأكاديمي' : 'Research Milestone Completion'}
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-4 space-y-2">
          <div className="h-2.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: '68%' }}></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isArabic ? '1. المقترح (100%)' : '1. Proposal (100%)'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isArabic ? '2. الأدبيات (85%)' : '2. Literature (85%)'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{isArabic ? '3. المنهجية (60%)' : '3. Methodology (60%)'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{isArabic ? '4. الأطروحة (30%)' : '4. Thesis (30%)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student AI Agent Factory / Sandbox Callout Banner */}
      <div className="rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs text-emerald-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? 'مصنع الوكلاء · الطلبة كمبتكرين للذكاء' : 'Agent Factory · Students as AI Creators'}</span>
          </div>
          <h3 className="text-lg font-bold">
            {isArabic ? 'مختبر بناء الوكلاء الخاص بك (Student AI Sandbox)' : 'Build Your Own Academic AI Assistant in the Sandbox'}
          </h3>
          <p className="text-xs text-emerald-100/80 max-w-xl leading-relaxed">
            {isArabic
              ? 'صمّم واختبر وكلاء أكاديميين مخصصين لأبحاثك في بيئة آمنة ومعزولة، مع إمكانية إرسالها للمشرف لاعتمادها.'
              : 'Create, ground, and test personal AI assistants in a protected sandbox, or submit drafts for supervisor approval.'}
          </p>
        </div>
        <Link
          href="/student/sandbox"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg hover:scale-105 shrink-0"
        >
          <Bot className="w-4 h-4" />
          <span>{isArabic ? 'فتح مختبر بناء الوكلاء' : 'Launch Agent Builder'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>

      {/* Four AI Agents Quick Access Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {isArabic ? 'وكلاء الذكاء الاصطناعي الأربعة (Four AI Agents)' : 'Four Academic Research AI Agents'}
            </h3>
            <p className="text-xs text-slate-500">
              {isArabic
                ? 'مدعومة بنموذج Fanar API المعتمد للجامعة مع سياق أكاديمي موحد'
                : 'Direct access to your dedicated academic research agents powered by Fanar API'}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <Bot className="h-3.5 w-3.5 text-emerald-600" />
            <span>Fanar Model Active</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Agent 1 Card */}
          <Link
            href="/agents/proposal"
            className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-md transition text-start"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                <Lightbulb className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200">
                Agent 1
              </span>
            </div>
            <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 transition">
              {isArabic ? 'موضوع ومقترح البحث' : 'Research Topic & Proposal'}
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'توليد وصياغة المشكلة البحثية، الأهداف، الأسئلة والفرضيات، وخطة مقترح أكاديمي متكاملة وحفظها بالمشروع.'
                : 'Brainstorm research problems, generate objectives, hypotheses, scope, and export formal academic proposals.'}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span>{isArabic ? 'فتح بيئة إعداد المقترح' : 'Launch Proposal Agent'}</span>
              <ChevronRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </div>
          </Link>

          {/* Agent 2 Card */}
          <Link
            href="/agents/literature"
            className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm hover:border-blue-500 dark:hover:border-blue-600 hover:shadow-md transition text-start"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 text-[10px] font-extrabold text-blue-800 dark:text-blue-200">
                Agent 2
              </span>
            </div>
            <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-700 transition">
              {isArabic ? 'مراجعة الأدبيات واستكشاف الأبحاث' : 'Literature Review & Discovery'}
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'استعلام مباشر عن أوراق حقيقية عبر OpenAlex و Crossref، جدول مقارنة علمي، واستخلاص الفجوات وتوليد المراجعة بنموذج فنار.'
                : 'Search live OpenAlex and Crossref academic databases, compare studies in a matrix, and synthesize literature themes.'}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
              <span>{isArabic ? 'فتح بيئة مراجعة الأدبيات' : 'Launch Literature Agent'}</span>
              <ChevronRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </div>
          </Link>

          {/* Agent 3 Card */}
          <Link
            href="/agents/methodology"
            className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm hover:border-purple-500 dark:hover:border-purple-600 hover:shadow-md transition text-start"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                <LineChart className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-purple-100 dark:bg-purple-900/60 px-2.5 py-1 text-[10px] font-extrabold text-purple-800 dark:text-purple-200">
                Agent 3
              </span>
            </div>
            <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-700 transition">
              {isArabic ? 'المنهجية وتحليل البيانات' : 'Methodology & Data Analysis Advisor'}
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'تصميم المنهجية العلمية (كمية/نوعية/مختلطة)، رفع مجموعات بيانات CSV/XLSX، واستخراج إحصاءات حقيقية وتفسيرها بفنار.'
                : 'Formulate quantitative/qualitative designs, upload CSV datasets, calculate descriptive statistics, and interpret results.'}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400">
              <span>{isArabic ? 'فتح بيئة تحليل المنهجية' : 'Launch Methodology Agent'}</span>
              <ChevronRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </div>
          </Link>

          {/* Agent 4 Card */}
          <Link
            href="/agents/thesis"
            className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm hover:border-amber-500 dark:hover:border-amber-600 hover:shadow-md transition text-start"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-amber-100 dark:bg-amber-900/60 px-2.5 py-1 text-[10px] font-extrabold text-amber-800 dark:text-amber-200">
                Agent 4
              </span>
            </div>
            <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-700 transition">
              {isArabic ? 'مراجعة الأطروحة ومحاكاة الدفاع (Viva)' : 'Thesis Review & Defense Preparation'}
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'تقييم فصول الأطروحة نقدياً، فحص التماسك الأكاديمي والاستشهادات، وتوليد أسئلة مناقشة حية لاختبار جاهزية الطالب.'
                : 'Critique dissertation chapters for coherence and academic rigor, and simulate challenging viva defense questions.'}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <span>{isArabic ? 'فتح بيئة الأطروحة والمناقشة' : 'Launch Thesis Agent'}</span>
              <ChevronRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent AI Activity & Pending Research Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AI Activity */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isArabic ? 'النشاط البحثي الأخير بالذكاء الاصطناعي' : 'Recent AI Research Activity'}
            </h3>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              {isArabic ? 'بيانات نموذجية موثقة' : 'Sample Activity Data'}
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            <div className="flex items-start gap-3 text-xs">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-2 text-emerald-700 shrink-0">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'توليد أسئلة وفرضيات البحث' : 'Generated Research Questions & Hypotheses'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {isArabic ? 'بواسطة وكيل مقترح البحث • نموذج فنار Fanar' : 'Agent 1: Proposal Agent • Fanar API'}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {isArabic ? 'منذ ساعتين' : '2h ago'}
              </span>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950 p-2 text-blue-700 shrink-0">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'استرداد 8 أوراق من OpenAlex و Crossref' : 'Retrieved 8 Papers from OpenAlex & Crossref'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {isArabic ? 'مراجعة الأدبيات حول: Energy Optimization in GCC' : 'Literature Review on GCC Energy Optimization'}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {isArabic ? 'اليوم 09:30' : 'Today 09:30'}
              </span>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="rounded-xl bg-purple-50 dark:bg-purple-950 p-2 text-purple-700 shrink-0">
                <LineChart className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'تحليل إحصائي لمجموعة بيانات الطاقة' : 'Dataset Descriptive Statistics Analyzed'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {isArabic ? 'ملف CSV: alwaha_solar_grid_2025.csv' : 'CSV: alwaha_solar_grid_2025.csv (1,240 rows)'}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {isArabic ? 'أمس' : 'Yesterday'}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Research Tasks */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isArabic ? 'المهام البحثية المستمرة' : 'Pending Research Milestones'}
            </h3>
            <span className="rounded-md bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              3 Pending
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200 line-through text-slate-400">
                  {isArabic ? 'صياغة مشكلة البحث وأهداف الدراسة الأولية' : 'Draft Research Problem & Objectives'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700">
                {isArabic ? 'مكتمل' : 'Done'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 text-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'مقارنة 4 دراسات إماراتية في مصفوفة الأدبيات' : 'Compare 4 regional studies in Literature Matrix'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-700">
                {isArabic ? 'مستحق غداً' : 'Due Tomorrow'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'تشغيل فحص نقد الأطروحة لفصل المنهجية' : 'Run Viva simulation for Chapter 3 Methodology'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {isArabic ? 'الأسبوع القادم' : 'Next Week'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Research Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-850 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-2 text-emerald-700">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'إنشاء مشروع بحثي جديد' : 'Create New Research Project'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'عنوان البحث المقترح' : 'Proposed Research Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'مثال: تطبيق خوارزميات التعلم المعزز لتحسين شبكات الطاقة في جامعة الواحة'
                      : 'e.g., Deep Reinforcement Learning for Smart Grid Optimization at Al-Waha University'
                  }
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'المجال الأكاديمي' : 'Research Field'}
                  </label>
                  <input
                    type="text"
                    value={newField}
                    onChange={(e) => setNewField(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'المستوى الدراسي' : 'Academic Level'}
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="UNDERGRADUATE">Undergraduate / تخرج بكالوريوس</option>
                    <option value="MASTERS">Master’s Thesis / ماجستير</option>
                    <option value="PHD">Ph.D. Dissertation / دكتوراه</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'الفكرة البحثية الأولية أو الملاحظات' : 'Initial Research Idea / Notes'}
                </label>
                <textarea
                  rows={3}
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'صف الفكرة باختصار، ما هي المشكلة التي تريد حلها؟'
                      : 'Briefly describe the research problem or motivation...'
                  }
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {isCreating
                    ? (isArabic ? 'جاري الإنشاء...' : 'Creating...')
                    : (isArabic ? 'حفظ وبدء المشروع' : 'Save & Launch Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
