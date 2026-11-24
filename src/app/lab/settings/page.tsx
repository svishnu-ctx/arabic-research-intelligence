'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useLab } from '@/lib/lab/context';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  User,
  Info
} from 'lucide-react';

export default function LabSettingsPage() {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { resetDemoData } = useLab();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-indigo-600" />
          <span>{t.labNav.settings}</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {language === 'ar'
            ? 'تخصيص تفضيلات المنصة، اللغة، مظهر العرض، وإدارة بيانات المحاكاة التجريبية'
            : 'Configure workspace preferences, interface language, theme, and demonstration state'}
        </p>
      </div>

      {resetSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{language === 'ar' ? 'تمت إعادة ضبط بيانات المحاكاة التجريبية إلى الإعدادات الأولية!' : 'Demonstration state reset successfully to initial factory values!'}</span>
        </div>
      )}

      {/* Settings Cards Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {/* Language Selection */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-2 text-indigo-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'لغة الواجهة الرئيسية' : 'Interface Language'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ar' ? 'التبديل بين العربية الفصحى المعاصرة والإنجليزية الأكاديمية' : 'Toggle between Modern Standard Arabic and Academic English'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('ar')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                language === 'ar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              العربية (AR)
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* Theme Preference */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950 p-2 text-amber-600">
              {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'مظهر العرض والتباين' : 'Appearance Theme'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ar' ? 'التبديل بين النمط الفاتح الهادئ والنمط الليلي الداكن' : 'Switch between clean light and deep dark visual modes'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            {theme === 'light' ? 'Light Theme (النمط الفاتح)' : 'Dark Theme (النمط الداكن)'}
          </button>
        </div>

        {/* Reviewer Profile */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 dark:bg-purple-950 p-2 text-purple-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'ملف المحكم اللغوي المعتمد' : 'Reviewer Profile'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                د. فاطمة الزهراء (رئيسة لجنة تقييم التقنيات اللغوية - جامعة الواحة)
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {language === 'ar' ? 'محكم معتمد' : 'Verified Reviewer'}
          </span>
        </div>

        {/* Reset Demo Data */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-2 text-rose-600">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'إعادة تعيين بيانات العرض' : 'Reset Demonstration Data'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ar' ? 'استعادة السجلات الأولية للاختبارات والمراجعات وحذف المدخلات المؤقتة' : 'Restore initial benchmark models, scores, and reviews'}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="rounded-xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 px-4 py-2 text-xs font-bold transition"
          >
            {language === 'ar' ? 'إعادة التعيين' : 'Reset Demo'}
          </button>
        </div>
      </div>
    </div>
  );
}
