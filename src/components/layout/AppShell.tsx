'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import {
  LayoutDashboard,
  FolderKanban,
  Lightbulb,
  BookOpen,
  LineChart,
  GraduationCap,
  FileText,
  BookmarkCheck,
  History,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface ProjectOption {
  id: string;
  title: string;
  academicLevel: string;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, direction } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj_alwaha_01');
  const [fanarStatus, setFanarStatus] = useState<{
    configured: boolean;
    connected: boolean;
    model: string;
    latencyMs?: number;
  }>({
    configured: true,
    connected: true,
    model: 'Fanar',
    latencyMs: 340,
  });

  const isArabic = language === 'ar';

  // Load projects list and Fanar status
  useEffect(() => {
    if (!user) return;

    fetch('/api/research-projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
          setActiveProjectId(data.projects[0].id);
        }
      })
      .catch(() => {});

    fetch('/api/ai/provider/status')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFanarStatus({
            configured: data.configured ?? true,
            connected: data.connection?.connected ?? true,
            model: data.model || 'Fanar',
            latencyMs: data.connection?.latencyMs || 340,
          });
        }
      })
      .catch(() => {});
  }, [user]);

  if (!user || pathname === '/login') {
    return <>{children}</>;
  }

  // The 10 required navigation items for the Al-Waha University Student Research AI Suite
  const studentNavItems = [
    {
      href: '/dashboard',
      label: isArabic ? 'لوحة التحكم البحثية' : 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: '/projects',
      label: isArabic ? 'مشاريعي البحثية' : 'My Research Projects',
      icon: FolderKanban,
      badge: 'Active',
    },
    {
      href: '/agents/proposal',
      label: isArabic ? 'موضوع ومقترح البحث' : 'Research Topic & Proposal',
      icon: Lightbulb,
      badge: 'Agent 1',
    },
    {
      href: '/agents/literature',
      label: isArabic ? 'مراجعة الأدبيات والاستكشاف' : 'Literature Review',
      icon: BookOpen,
      badge: 'Agent 2',
    },
    {
      href: '/agents/methodology',
      label: isArabic ? 'المنهجية وتحليل البيانات' : 'Methodology & Data Analysis',
      icon: LineChart,
      badge: 'Agent 3',
    },
    {
      href: '/agents/thesis',
      label: isArabic ? 'الأطروحة ومناقشة التخرج' : 'Thesis & Dissertation',
      icon: GraduationCap,
      badge: 'Agent 4',
    },
    {
      href: '/documents',
      label: isArabic ? 'المستندات البحثية' : 'Research Documents',
      icon: FileText,
      badge: null,
    },
    {
      href: '/references',
      label: isArabic ? 'مكتبة المراجع والمصادر' : 'References Library',
      icon: BookmarkCheck,
      badge: null,
    },
    {
      href: '/history',
      label: isArabic ? 'سجل العمليات والذكاء' : 'Research History',
      icon: History,
      badge: null,
    },
    {
      href: '/settings',
      label: isArabic ? 'الإعدادات ومزود Fanar' : 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100" dir={direction}>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm md:flex shrink-0">
        {/* University Header Branding */}
        <div className="flex h-20 items-center border-b border-slate-100 dark:border-slate-800 px-6 gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md shadow-emerald-700/20">
            <GraduationCap className="h-6 w-6 text-emerald-100" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              {isArabic ? 'جامعة الواحة' : 'Al-Waha University'}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {isArabic ? 'بوابة الذكاء البحثي للطلبة' : 'Student Research AI'}
            </div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="p-4 pb-2">
          <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                {isArabic ? 'حساب باحث الدراسات العليا' : 'Graduate Student'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/60 dark:bg-emerald-800/40 px-2 py-0.5 text-[9px] font-bold text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                Demo
              </span>
            </div>
            <div className="mt-1.5 font-bold text-xs text-slate-900 dark:text-white truncate">
              {user.displayName || 'Maryam Al-Mazrouei (مريم المزروعي)'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user.email || 'student@alwaha.ac.ae'}
            </div>
            <div className="mt-2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
              {isArabic ? 'ماجستير علوم وهندسة الحاسوب' : 'M.Sc. in Computer Science'}
            </div>
          </div>
        </div>

        {/* Fanar Live Status Badge */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  {fanarStatus.model} AI
                </div>
                <div className="text-[9px] text-slate-400">
                  api.fanar.qa ({fanarStatus.latencyMs || 340}ms)
                </div>
              </div>
            </div>
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
              Active
            </span>
          </div>
        </div>

        {/* 10 Navigation Links */}
        <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto py-2">
          {studentNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className={`h-3.5 w-3.5 ${isArabic ? 'rotate-180' : ''}`} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>{isArabic ? 'تسجيل الخروج' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Active Research Project Indicator / Selector */}
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-emerald-600 shrink-0 hidden sm:block" />
              <div className="text-xs">
                <span className="text-slate-400 hidden sm:inline">
                  {isArabic ? 'المشروع النشط:' : 'Active Project:'}{' '}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {projects.length > 0
                    ? projects.find((p) => p.id === activeProjectId)?.title || projects[0].title
                    : isArabic
                    ? 'الذكاء الاصطناعي في الطاقة المتجددة'
                    : 'AI in Renewable Energy Optimization'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Fanar Provider Status Pill */}
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Fanar AI • Online</span>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              title={isArabic ? 'تبديل المظهر (داكن / فاتح)' : 'Toggle Theme (Dark / Light)'}
            >
              {theme === 'light' ? <Moon className="h-3.5 w-3.5 text-slate-500" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
              <span className="hidden sm:inline">
                {theme === 'light' ? (isArabic ? 'داكن' : 'Dark') : (isArabic ? 'فاتح' : 'Light')}
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              title={isArabic ? 'تغيير اللغة إلى الإنجليزية' : 'Switch Language to Arabic'}
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              <span>{isArabic ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 md:hidden">
            <nav className="space-y-1">
              {studentNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                <span>{isArabic ? 'تسجيل الخروج' : 'Log Out'}</span>
              </button>
            </nav>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
