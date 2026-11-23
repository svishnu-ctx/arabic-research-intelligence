'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useLab } from '@/lib/lab/context';
import {
  LayoutDashboard,
  Cpu,
  BookOpen,
  FlaskConical,
  Award,
  Mic,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Globe,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

export function LabShell({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage, direction } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { selectedComparisonIds } = useLab();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { href: '/lab/dashboard', label: t.labNav.dashboard, icon: LayoutDashboard },
    { href: '/lab/models', label: t.labNav.models, icon: Cpu },
    { href: '/lab/benchmarks', label: t.labNav.benchmarks, icon: BookOpen },
    { href: '/lab/testing', label: t.labNav.testing, icon: FlaskConical },
    { href: '/lab/expert-review', label: t.labNav.expertReview, icon: Award },
    { href: '/lab/speech', label: t.labNav.speech, icon: Mic },
    { href: '/lab/comparison', label: t.labNav.comparison, icon: BarChart3 },
    { href: '/lab/reports', label: t.labNav.reports, icon: FileSpreadsheet },
    { href: '/lab/settings', label: t.labNav.settings, icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans" dir={direction}>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm md:flex">
        <div className="flex h-16 items-center border-b border-slate-100 dark:border-slate-800 px-6">
          <Link href="/lab/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-md shadow-indigo-700/20">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                {t.common.universityName}
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {t.lab.appTitle}
              </div>
            </div>
          </Link>
        </div>

        {/* Comparison Bar Indicator */}
        <div className="p-4">
          <Link
            href="/lab/comparison"
            className="flex items-center justify-between rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/40 p-3 hover:bg-indigo-100/70 transition"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                {language === 'ar' ? 'النماذج المختارة للمقارنة' : 'Comparison Selection'}
              </span>
            </div>
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
              {selectedComparisonIds.length}
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className={`h-4 w-4 text-indigo-600 dark:text-indigo-400 ${direction === 'rtl' ? 'rotate-180' : ''}`} />}
              </Link>
            );
          })}
        </nav>

        {/* Demo Disclaimer Badge */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 p-3 text-[11px] text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>{t.lab.demoBadge}</span>
            </div>
            <p className="leading-relaxed opacity-90">
              {language === 'ar'
                ? 'جميع الدرجات والنتائج المعروضة استرشادية لغايات العرض والمحاكاة.'
                : 'All scores and responses are illustrative demo metrics for evaluation simulation.'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                {language === 'ar' ? 'منصة التقييم المعتمدة' : 'Verified Evaluation Platform'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 end-1 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {showNotifications && (
                <div className="absolute end-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {language === 'ar' ? 'التنبيهات الأكاديمية' : 'Evaluation Alerts'}
                    </span>
                    <span className="text-[10px] text-slate-400">2 {language === 'ar' ? 'جديد' : 'new'}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5">
                      <div className="font-semibold text-indigo-900 dark:text-indigo-300">
                        {language === 'ar' ? 'اكتمال تقييم نموذج Fanar' : 'Fanar Evaluation Completed'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'ar' ? 'حقق درجة 91/100 في معايير الفصاحة المعاصرة.' : 'Scored 91/100 across Modern Standard Arabic tests.'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'تمت إضافة اختبار جديد' : 'New Benchmark AR-010'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'ar' ? 'تفريغ محاضرات الحوسبة العربية باستخدام Whisper.' : 'Arabic Lecture Transcription added.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              title="Toggle Theme / تبديل المظهر"
            >
              {theme === 'light' ? <Moon className="h-3.5 w-3.5 text-slate-500" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              title="Toggle Language / تغيير اللغة"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
