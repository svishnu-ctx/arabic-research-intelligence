'use client';

import React from 'react';
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
  FileText
} from 'lucide-react';

export default function SupervisorDashboardPage() {
  const { language, direction } = useI18n();
  const { user } = useAuth();
  const isArabic = language === 'ar';

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
      agents: [
        { name: 'Agent 1', href: '/supervisor/agents/proposal', label: isArabic ? 'تقييم المقترح' : 'Review Proposal' },
        { name: 'Agent 2', href: '/supervisor/agents/literature', label: isArabic ? 'تدقيق المراجع' : 'Audit Citations' },
        { name: 'Agent 3', href: '/supervisor/agents/methodology', label: isArabic ? 'فحص IRB' : 'IRB Check' },
        { name: 'Agent 4', href: '/supervisor/agents/viva', label: isArabic ? 'خطة المناقشة' : 'Viva Prep' },
      ]
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
      agents: [
        { name: 'Agent 1', href: '/supervisor/agents/proposal', label: isArabic ? 'تقييم المقترح' : 'Review Proposal' },
        { name: 'Agent 2', href: '/supervisor/agents/literature', label: isArabic ? 'تدقيق المراجع' : 'Audit Citations' },
        { name: 'Agent 3', href: '/supervisor/agents/methodology', label: isArabic ? 'فحص IRB' : 'IRB Check' },
        { name: 'Agent 4', href: '/supervisor/agents/viva', label: isArabic ? 'خطة المناقشة' : 'Viva Prep' },
      ]
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
      agents: [
        { name: 'Agent 1', href: '/supervisor/agents/proposal', label: isArabic ? 'تقييم المقترح' : 'Review Proposal' },
        { name: 'Agent 2', href: '/supervisor/agents/literature', label: isArabic ? 'تدقيق المراجع' : 'Audit Citations' },
        { name: 'Agent 3', href: '/supervisor/agents/methodology', label: isArabic ? 'فحص IRB' : 'IRB Check' },
        { name: 'Agent 4', href: '/supervisor/agents/viva', label: isArabic ? 'خطة المناقشة' : 'Viva Prep' },
      ]
    }
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
                {isArabic ? 'بوابة الإشراف الأكاديمي للدراسات العليا' : 'Graduate Faculty Supervisory Portal'}
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
                : 'Central supervisory console to track candidate progress, audit citations, validate research methodologies, and build viva defense rubrics via 4 autonomous Fanar AI agents.'}
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
            <div className="mt-2 text-2xl font-extrabold text-emerald-600">96%</div>
            <div className="mt-1 text-[11px] text-slate-400">{isArabic ? 'موثقة ومطابقة' : 'Zero Hallucinations'}</div>
          </div>
        </div>
      </div>

      {/* Cohort Candidates Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>{isArabic ? 'قائمة الباحثين وطلبة الدراسات العليا تحت إشرافك' : 'Supervised Graduate Cohort'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isArabic
                ? 'استخدم الوكلاء الذكاء الاصطناعي لمراجعة أعمال كل طالب مباشرة بنقرة واحدة.'
                : 'Directly launch autonomous AI supervisory agents for any student.'}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
            >
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

              {/* Quick Launch Buttons for all 4 Agents */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{cand.lastActive}</span>
                  <span>•</span>
                  <span className="font-semibold text-amber-600">{cand.status}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/supervisor/agents/proposal"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition"
                  >
                    <Lightbulb className="h-3 w-3" />
                    <span>{isArabic ? 'وكيل 1: تقييم المقترح' : 'Agent 1: Review'}</span>
                  </Link>

                  <Link
                    href="/supervisor/agents/literature"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>{isArabic ? 'وكيل 2: تدقيق المراجع' : 'Agent 2: Audit'}</span>
                  </Link>

                  <Link
                    href="/supervisor/agents/methodology"
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition"
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
    </div>
  );
}
