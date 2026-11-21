'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import {
  LayoutDashboard,
  Sparkles,
  Library,
  BookOpen,
  FileCheck2,
  FileText,
  Search,
  ArrowLeftRight,
  Lightbulb,
  FileCode,
  GraduationCap,
  LogOut,
  Globe,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, direction } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const roleNavItems = {
    admin: [
      { href: '/dashboard/admin', label: t.nav.dashboard, icon: LayoutDashboard },
      { href: '/dashboard/admin/insights', label: t.nav.researchInsights, icon: Sparkles },
      { href: '/dashboard/admin/corpus', label: t.nav.researchCorpus, icon: Library },
    ],
    supervisor: [
      { href: '/dashboard/supervisor', label: t.nav.dashboard, icon: LayoutDashboard },
      { href: '/dashboard/supervisor/shared', label: t.nav.sharedPapers, icon: BookOpen },
      { href: '/dashboard/supervisor/review', label: t.nav.aiReview, icon: FileCheck2 },
    ],
    scholar: [
      { href: '/dashboard/scholar', label: t.nav.dashboard, icon: LayoutDashboard },
      { href: '/dashboard/scholar/papers', label: t.nav.myPapers, icon: FileText },
      { href: '/dashboard/scholar/literature', label: t.nav.literatureResearch, icon: Search },
      { href: '/dashboard/scholar/compare', label: t.nav.comparePapers, icon: ArrowLeftRight },
      { href: '/dashboard/scholar/opportunities', label: t.nav.researchOpportunities, icon: Lightbulb },
    ],
    student: [
      { href: '/dashboard/student', label: t.nav.dashboard, icon: LayoutDashboard },
      { href: '/dashboard/student/documents', label: t.nav.myDocuments, icon: FileCode },
      { href: '/dashboard/student/intelligence', label: t.nav.documentIntelligence, icon: Sparkles },
      { href: '/dashboard/student/assistant', label: t.nav.academicAssistant, icon: GraduationCap },
    ],
  };

  const navItems = roleNavItems[user.role] || [];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900" dir={direction}>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-e border-slate-200 bg-white shadow-sm md:flex">
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                {t.common.universityName}
              </div>
              <div className="text-sm font-bold text-slate-800">
                {t.common.appName}
              </div>
            </div>
          </div>
        </div>

        {/* User Role Card */}
        <div className="p-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-start">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-500">
                {t.roles[user.role]}
              </span>
            </div>
            <div className="mt-1 truncate text-sm font-semibold text-slate-800">
              {user.displayName}
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-400">
              {user.email}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className={`h-4 w-4 text-emerald-700 ${direction === 'rtl' ? 'rotate-180' : ''}`} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>{t.common.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t.roles[user.role]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Toggle Language / تغيير اللغة"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white p-4 md:hidden">
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
                      isActive ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.common.logout}</span>
              </button>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
