'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Globe,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export default function StudentLoginPage() {
  const { login } = useAuth();
  const { t, language, setLanguage, direction } = useI18n();
  const router = useRouter();

  const isArabic = language === 'ar';

  const [email, setEmail] = useState('student@sharjah.ac.ae');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || (isArabic ? 'بيانات الاعتماد غير صالحة' : 'Invalid student credentials'));
      }
    } catch {
      setError(isArabic ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('student@sharjah.ac.ae');
    setPassword('Student@123');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotPassword(false);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8" dir={direction}>
      {/* Language Switcher Bar */}
      <div className="absolute top-6 end-6">
        <button
          onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
          className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 transition"
        >
          <Globe className="h-4 w-4 text-emerald-600" />
          <span>{isArabic ? 'English (EN)' : 'العربية (AR)'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* University Logo Placeholder */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-700 text-white shadow-xl shadow-emerald-700/20 ring-4 ring-emerald-100 dark:ring-emerald-950">
            <GraduationCap className="h-10 w-10 text-emerald-100" />
          </div>
        </div>

        {/* University Header Branding */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>جامعة الشارقة • UNIVERSITY OF SHARJAH</span>
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isArabic ? 'بوابة الذكاء البحثي للطلبة' : 'Student Research AI Suite'}
          </h1>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
            {isArabic
              ? 'تسجيل الدخول الأكاديمي لطلبة التخرج والدراسات العليا والماجستير والدكتوراه'
              : 'Academic Portal for Graduation, Master’s and Ph.D. Researchers'}
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="mt-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/40 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">
              {isArabic ? 'بيئة تجريبية معتمدة (Development Demo):' : 'Demo Authentication Mode:'}
            </span>{' '}
            {isArabic
              ? 'هذا حساب تجريبي مخصص للمعاينة الأكاديمية وليس بوابة SSO الرسمية للجامعة.'
              : 'This is a development mock account for evaluation, not official university SSO.'}
            <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-amber-200 dark:border-amber-900/50">
              <span className="text-[11px] font-mono text-amber-800 dark:text-amber-300">
                student@sharjah.ac.ae / Student@123
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {isArabic ? 'تعبئة تلقائية' : 'Quick Fill'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 px-6 py-8 shadow-md sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email / Student ID Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isArabic ? 'البريد الجامعي أو المعرف الطلابي' : 'University Email or Student ID'}
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 py-2.5 ps-10 pe-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
                  placeholder="student@sharjah.ac.ae"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'كلمة المرور' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 py-2.5 ps-10 pe-11 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {isArabic ? 'تذكر بيانات الجلسة' : 'Remember me'}
                </span>
              </label>

              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {isArabic ? 'جلسة مشفرة' : 'HttpOnly Session'}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 transition"
            >
              {isLoading ? (
                <span>{isArabic ? 'جاري التحقق والدخول...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>{isArabic ? 'تسجيل الدخول إلى البوابة البحثية' : 'Sign in to Research Suite'}</span>
                  <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Launch */}
          <div className="mt-5 border-t border-slate-100 dark:border-slate-700/60 pt-5">
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                await login('student@sharjah.ac.ae', 'Student@123');
                router.push('/dashboard');
              }}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>
                {isArabic
                  ? 'دخول فوري مباشر بحساب الطالب التجريبي'
                  : 'Instant 1-Click Access as Student Researcher'}
              </span>
            </button>

            <div className="mt-3 text-center text-[11px] text-slate-400">
              {isArabic
                ? 'مدعوم بالذكاء الاصطناعي العربي عبر واجهة فنار (Fanar API)'
                : 'Powered by Arabic Academic Intelligence via Fanar API'}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? 'استعادة كلمة المرور' : 'Reset Student Password'}
              </h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {isArabic
                    ? 'تم إرسال رابط إعادة التعيين إلى بريدك الجامعي'
                    : 'A reset link has been dispatched to your university email'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {isArabic ? 'يرجى مراجعة البريد الوارد أو الاتصال بمركز تقنية المعلومات' : 'Please check your inbox or contact Sharjah IT Helpdesk'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isArabic
                    ? 'أدخل عنوان بريدك الجامعي المسجل لإرسال تعليمات إعادة تعيين الحساب.'
                    : 'Enter your registered university email to receive password reset instructions.'}
                </p>
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@sharjah.ac.ae"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                  >
                    {isArabic ? 'إرسال الرابط' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
