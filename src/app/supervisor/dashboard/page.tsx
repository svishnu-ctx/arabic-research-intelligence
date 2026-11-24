'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import {
  Users,
  Lightbulb,
  BookOpen,
  LineChart,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Download
} from 'lucide-react';

export default function SupervisorDashboardPage() {
  const { language, direction } = useI18n();
  const { user } = useAuth();
  const isArabic = language === 'ar';

  const [selectedAuditCandidate, setSelectedAuditCandidate] = useState<any | null>(null);

  const candidates = [
    {
      id: 'c1',
      name: isArabic ? 'مريم المزروعي' : 'Maryam Al-Mazrouei',
      degree: isArabic ? 'ماجستير علوم وهندسة الحاسوب' : 'M.Sc. Computer Science',
      topic: isArabic
        ? 'تحسين شبكات الطاقة الشمسية المصغرة باستخدام التعلم المعزز'
        : 'Deep Reinforcement Learning for Solar Microgrids Optimization',
      status: isArabic ? 'المقترح قيد الاعتماد' : 'Proposal Review Pending',
      statusColor: 'amber',
      progress: 68,
      lastActive: isArabic ? 'منذ ساعتين' : '2 hours ago',
      phases: [
        { name: isArabic ? '1. المقترح الأكاديمي' : '1. Proposal', status: 'completed' },
        { name: isArabic ? '2. مراجعة الأدبيات' : '2. Lit Review', status: 'completed' },
        { name: isArabic ? '3. المنهجية والبيانات' : '3. Methodology', status: 'in_progress' },
        { name: isArabic ? '4. المناقشة العلنية' : '4. Viva Defense', status: 'pending' },
      ],
      aiAuditSummary: {
        totalQueries: 34,
        groundingScore: '98%',
        zeroLeakageVerified: true,
        lastToolUsed: 'Literature Scout & OpenAlex Synthesis',
        auditLogs: [
          { time: '10:42 AM', action: 'RAG Crossref search on solar irradiance prediction', status: 'Verified' },
          { time: '09:15 AM', action: 'Dataset schema normality test (ANOVA recommendation)', status: 'Verified' },
          { time: 'Yesterday', action: 'Restricted draft export attempted - intercepted by supervisor guardrail', status: 'Blocked (Secured)' },
        ],
      },
    },
    {
      id: 'c2',
      name: isArabic ? 'عمر المنصور' : 'Omar Al-Mansoor',
      degree: isArabic ? 'دكتوراه في الذكاء الاصطناعي ومعالجة اللغات' : 'Ph.D. in AI & Natural Language Processing',
      topic: isArabic
        ? 'معالجة اللهجات الخليجية ونماذج اللغة التوليدية الكبيرة'
        : 'Evaluating LLMs on Colloquial Gulf Dialect Acoustic and Text Processing',
      status: isArabic ? 'الفصل الرابع قيد الكتابة' : 'Chapter 4 In Progress',
      statusColor: 'emerald',
      progress: 84,
      lastActive: isArabic ? 'أمس' : 'Yesterday',
      phases: [
        { name: isArabic ? '1. المقترح الأكاديمي' : '1. Proposal', status: 'completed' },
        { name: isArabic ? '2. مراجعة الأدبيات' : '2. Lit Review', status: 'completed' },
        { name: isArabic ? '3. المنهجية والبيانات' : '3. Methodology', status: 'completed' },
        { name: isArabic ? '4. المناقشة العلنية' : '4. Viva Defense', status: 'in_progress' },
      ],
      aiAuditSummary: {
        totalQueries: 62,
        groundingScore: '99%',
        zeroLeakageVerified: true,
        lastToolUsed: 'Viva Defense Prep Simulator',
        auditLogs: [
          { time: 'Yesterday', action: 'Simulated 5 viva committee defense questions', status: 'Verified' },
          { time: '2 days ago', action: 'Acoustic dialect corpus tokenization analysis', status: 'Verified' },
        ],
      },
    },
    {
      id: 'c3',
      name: isArabic ? 'راشد النعيمي' : 'Rashid Al-Nuaimi',
      degree: isArabic ? 'ماجستير النظم الذكية والروبوتات' : 'M.Sc. Intelligent Systems & Robotics',
      topic: isArabic
        ? 'الملاحة الذاتية للطائرات بدون طيار في البيئات الصحراوية المعقدة'
        : 'Autonomous UAV Navigation in GPS-Denied Desert Environments',
      status: isArabic ? 'جمع البيانات الميدانية' : 'Field Data Collection',
      statusColor: 'blue',
      progress: 42,
      lastActive: isArabic ? 'منذ 3 أيام' : '3 days ago',
      phases: [
        { name: isArabic ? '1. المقترح الأكاديمي' : '1. Proposal', status: 'completed' },
        { name: isArabic ? '2. مراجعة الأدبيات' : '2. Lit Review', status: 'in_progress' },
        { name: isArabic ? '3. المنهجية والبيانات' : '3. Methodology', status: 'pending' },
        { name: isArabic ? '4. المناقشة العلنية' : '4. Viva Defense', status: 'pending' },
      ],
      aiAuditSummary: {
        totalQueries: 18,
        groundingScore: '96%',
        zeroLeakageVerified: true,
        lastToolUsed: 'IRB Ethics & Protocol Screener',
        auditLogs: [
          { time: '3 days ago', action: 'Screened drone flight telemetry for campus safety boundaries', status: 'Verified' },
        ],
      },
    },
  ];

  return (
    <div className="space-y-8" dir={direction}>
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>جامعة الواحة • Al-Waha University</span>
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isArabic ? 'بوابة الإشراف الأكاديمي للدراسات العليا (ALW-EP4)' : 'Graduate Supervisory Console'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isArabic
                ? `أهلاً بك، ${user?.displayName || 'د. فاطمة الزهراء'}`
                : `Welcome, ${user?.displayName || 'Dr. Fatima Al-Zahra'}`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {isArabic
                ? 'متابعة وإشراف متكامل على طلبة الدراسات العليا، وتدقيق مقترحات الأطروحات والمراجع والمنهجيات باستخدام وكلاء الذكاء الاصطناعي الأربعة المدعومة بنموذج فنار.'
                : 'Central supervisory console to track candidate progress across 4 thesis milestones, audit citations, validate research methodologies, and build viva defense rubrics via Fanar AI.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/supervisor/agents/proposal"
              className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-800 transition"
            >
              <Lightbulb className="h-4 w-4" />
              <span>{isArabic ? 'تقييم مقترح طالب جديد' : 'Review Candidate Proposal'}</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Telemetry Cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>{isArabic ? 'طلبة تحت الإشراف' : 'Active Supervisees'}</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">3</div>
            <div className="mt-1 text-[11px] text-slate-400">2 Masters • 1 Ph.D.</div>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>{isArabic ? 'طلبات اعتماد المقترح' : 'Pending Proposals'}</span>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-amber-600">1</div>
            <div className="mt-1 text-[11px] text-slate-400">{isArabic ? 'مريم المزروعي قيد المراجعة' : 'Maryam Al-Mazrouei'}</div>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>{isArabic ? 'جلسات مناقشة قادمة' : 'Upcoming Vivas'}</span>
              <GraduationCap className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">1</div>
            <div className="mt-1 text-[11px] text-slate-400">{isArabic ? 'الفصل الدراسي الحالي' : 'Scheduled in 14 days'}</div>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>{isArabic ? 'نزاهة المراجع والأبحاث' : 'Avg. Citation Integrity'}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-emerald-600">98%</div>
            <div className="mt-1 text-[11px] text-slate-400">{isArabic ? 'موثقة ومطابقة (Zero Hallucinations)' : 'Zero Hallucinations'}</div>
          </div>
        </div>
      </div>

      {/* Cohort Candidates Table (ALW-401) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>{isArabic ? 'قائمة الباحثين وطلبة الدراسات العليا تحت إشرافك (Cohort Tracker)' : 'Supervised Graduate Cohort Tracker'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isArabic
                ? 'متابعة المراحل الأربع للأطروحة، فحص سجلات تدقيق الذكاء الاصطناعي، وتشغيل الوكلاء المتخصصين.'
                : 'Monitor 4-phase dissertation progression, inspect AI safety audits, and launch supervisory tools.'}
            </p>
          </div>
        </div>

        <div className="space-y-5 pt-2">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{cand.name}</h3>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:text-indigo-300">
                      {cand.degree}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">{cand.topic}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isArabic ? 'نسبة إنجاز الأطروحة' : 'Thesis Progress'}
                    </div>
                    <div className="text-sm font-extrabold text-indigo-600">{cand.progress}%</div>
                  </div>
                  <div className="w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${cand.progress}%` }} />
                  </div>
                </div>
              </div>

              {/* 4-Phase Dissertation Milestone Stepper (ALW-401) */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {isArabic ? 'المراحل الأكاديمية الأربع للأطروحة:' : '4-Phase Dissertation Milestones:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cand.phases.map((ph, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        ph.status === 'completed'
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                          : ph.status === 'in_progress'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{ph.name}</span>
                      {ph.status === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : ph.status === 'in_progress' ? (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Launch Buttons & AI Audits */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{cand.lastActive}</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-amber-600">{cand.status}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedAuditCandidate(cand)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isArabic ? 'فحص سجلات التدقيق (AI Audits)' : 'Inspect AI Audits'}</span>
                  </button>

                  <Link
                    href="/supervisor/agents/proposal"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition"
                  >
                    <Lightbulb className="h-3 w-3" />
                    <span>{isArabic ? 'وكيل 1: تقييم المقترح' : 'Agent 1: Review'}</span>
                  </Link>

                  <Link
                    href="/supervisor/agents/literature"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>{isArabic ? 'وكيل 2: تدقيق المراجع' : 'Agent 2: Audit'}</span>
                  </Link>

                  <Link
                    href="/supervisor/agents/methodology"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition"
                  >
                    <LineChart className="h-3 w-3" />
                    <span>{isArabic ? 'وكيل 3: فحص IRB' : 'Agent 3: IRB'}</span>
                  </Link>

                  <Link
                    href="/supervisor/agents/viva"
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-800 transition shadow-sm"
                  >
                    <GraduationCap className="h-3 w-3" />
                    <span>{isArabic ? 'وكيل 4: خطة المناقشة' : 'Agent 4: Viva'}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSPECT AI AUDITS MODAL (ALW-401) */}
      {selectedAuditCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {isArabic ? `سجل تدقيق الذكاء الاصطناعي الأكاديمي: ${selectedAuditCandidate.name}` : `Academic AI Audit Trail: ${selectedAuditCandidate.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedAuditCandidate.topic}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditCandidate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Telemetry Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[11px] text-slate-500 block">{isArabic ? 'إجمالي الاستفسارات' : 'Total AI Queries'}</span>
                  <span className="text-lg font-bold text-indigo-600 mt-1 block">
                    {selectedAuditCandidate.aiAuditSummary.totalQueries}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[11px] text-slate-500 block">{isArabic ? 'دقة التوثيق بالمصادر' : 'Grounding Score'}</span>
                  <span className="text-lg font-bold text-emerald-600 mt-1 block">
                    {selectedAuditCandidate.aiAuditSummary.groundingScore}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[11px] text-slate-500 block">{isArabic ? 'حدود عدم التسريب' : 'Data Boundary'}</span>
                  <span className="text-xs font-bold text-emerald-600 mt-1.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isArabic ? 'معزول ومؤمن' : 'Protected'}
                  </span>
                </div>
              </div>

              {/* Audit Event Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isArabic ? 'سجل الأنشطة وتفاعلات الذكاء الاصطناعي الأخيرة' : 'Recent AI Interactions & Security Events'}
                </h4>
                <div className="space-y-2">
                  {selectedAuditCandidate.aiAuditSummary.auditLogs.map((log: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 dark:text-white block">{log.action}</span>
                        <span className="text-[10px] text-slate-400">{log.time}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status.includes('Blocked')
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="leading-relaxed">
                  {isArabic
                    ? 'شهادة إشرافية: تؤكد منصة جامعة الواحة خلو تفاعلات هذا الباحث من أي انتهاكات لسياسة النزاهة الأكاديمية أو تسريب للبيانات الحساسة، مع توثيق كافة المراجع بنموذج Fanar.'
                    : 'Supervisory Certification: Al-Waha platform verifies that this candidate has strictly adhered to academic integrity and zero-leakage research boundaries.'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setSelectedAuditCandidate(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 text-xs font-bold transition"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

