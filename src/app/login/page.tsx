'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
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
  Sparkles,
  CheckCircle2,
  X,
  Sun,
  Moon,
  Building2,
  KeyRound,
  UserCheck,
  ChevronRight
} from 'lucide-react';

export default function StudentLoginPage() {
  const { login } = useAuth();
  const { language, setLanguage, direction } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const isArabic = language === 'ar';

  const [email, setEmail] = useState('student@alwaha.ac.ae');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // University SSO (SAML 2.0 / IdP) Simulation Modal State
  const [showSsoModal, setShowSsoModal] = useState(false);
  const [ssoAuthenticating, setSsoAuthenticating] = useState(false);
  const [ssoTargetName, setSsoTargetName] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (email.includes('falzahra') || email.includes('supervisor')) {
          router.push('/supervisor/dashboard');
        } else if (email.includes('admin')) {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard');
        }
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
    setEmail('student@alwaha.ac.ae');
    setPassword('Student@123');
  };

  const handleSsoLogin = async (ssoUser: string, targetPath: string, personaName: string) => {
    setSsoTargetName(personaName);
    setSsoAuthenticating(true);
    setError(null);

    // Simulate SAML 2.0 token assertion exchange with Al-Waha IdP
    await new Promise((r) => setTimeout(r, 600));

    try {
      const result = await login(ssoUser, 'Student@123');
      if (result.success) {
        setShowSsoModal(false);
        router.push(targetPath);
      } else {
        setError(result.error || 'SAML assertion failed');
      }
    } catch {
      setError('SAML SSO connection failed');
    } finally {
      setSsoAuthenticating(false);
    }
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
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative" dir={direction}>
      {/* Top Controls: Theme & Language */}
      <div className="absolute top-6 end-6 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          title="Toggle Theme / تبديل المظهر"
        >
          {theme === 'light' ? <Moon className="h-3.5 w-3.5 text-slate-500" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        <button
          onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
          className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <Globe className="h-4 w-4 text-emerald-600" />
          <span>{isArabic ? 'English (EN)' : 'العربية (AR)'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* University Logo */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-700 text-white shadow-xl shadow-emerald-700/20 ring-4 ring-emerald-100 dark:ring-emerald-950">
            <GraduationCap className="h-10 w-10 text-emerald-100" />
          </div>
        </div>

        {/* University Header Branding */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>جامعة الواحة • AL-WAHA UNIVERSITY</span>
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isArabic ? 'بوابة الذكاء الاصطناعي الجامعي' : 'University AI Platform Hub'}
          </h1>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
            {isArabic
              ? 'تسجيل الدخول الموحد للطلبة وأعضاء هيئة التدريس والباحثين'
              : 'Single Sign-On for Students, Faculty Researchers & Administrators'}
          </p>
        </div>
      </div>

      {/* Main Login Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 px-6 py-8 shadow-md sm:px-10 space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ALW-101: Primary University Single Sign-On (SSO) Button */}
          <button
            type="button"
            onClick={() => setShowSsoModal(true)}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.99] transition border border-emerald-600/40"
          >
            <Building2 className="h-4 w-4 text-emerald-300" />
            <span>{isArabic ? 'الدخول الموحد لجامعة الواحة (SAML 2.0 SSO)' : 'Sign in with Al-Waha University SSO'}</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400 ms-auto" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
            <span className="bg-white dark:bg-slate-800 px-3 text-[11px] font-semibold text-slate-400 shrink-0">
              {isArabic ? 'أو عبر البريد الأكاديمي المباشر' : 'or direct academic login'}
            </span>
            <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email / ID Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isArabic ? 'البريد الجامعي أو المعرف الطلابي' : 'University Email or ID'}
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
                  placeholder="student@alwaha.ac.ae"
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

            {/* Remember Me */}
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
                <span>HttpOnly JWT</span>
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

          {/* 1-Click Persona Demos */}
          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              {isArabic ? 'حسابات المعاينة السريعة (1-Click Demo)' : '1-Click Persona Access'}
            </div>

            {/* Student Persona */}
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                await login('student@alwaha.ac.ae', 'Student@123');
                router.push('/dashboard');
              }}
              disabled={isLoading}
              className="flex w-full items-center justify-between rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 p-2.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 transition shadow-sm text-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <div className="font-bold">{isArabic ? 'مريم المزروعي' : 'Maryam Al-Mazrouei'}</div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'طالبة ماجستير (Role: Student)' : 'M.Sc. Candidate (Student Role)'}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-emerald-600 ${isArabic ? 'rotate-180' : ''}`} />
            </button>

            {/* Faculty Supervisor Persona */}
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                await login('falzahra@alwaha.ac.ae', 'Supervisor@123');
                router.push('/supervisor/dashboard');
              }}
              disabled={isLoading}
              className="flex w-full items-center justify-between rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 p-2.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 transition shadow-sm text-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div>
                  <div className="font-bold">{isArabic ? 'د. فاطمة الزهراء' : 'Dr. Fatima Al-Zahra'}</div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'مشرف أكاديمي (Role: Supervisor)' : 'Faculty Supervisor (Associate Professor)'}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-indigo-600 ${isArabic ? 'rotate-180' : ''}`} />
            </button>

            {/* Admin Persona */}
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                await login('admin_demo', 'Student@123');
                router.push('/dashboard/admin');
              }}
              disabled={isLoading}
              className="flex w-full items-center justify-between rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 p-2.5 text-xs font-semibold text-purple-900 dark:text-purple-200 hover:bg-purple-100 transition shadow-sm text-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div>
                  <div className="font-bold">{isArabic ? 'أ.د. طارق النعيمي' : 'Prof. Dr. Tariq Al-Nuaimi'}</div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'عميد البحث وحوكمة الذكاء (Role: Admin)' : 'Dean of Research / AI Governance'}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-purple-600 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ALW-101: SAML 2.0 University SSO Federated Identity Modal */}
      {showSsoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* IdP Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md shadow-emerald-700/20">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    Al-Waha Identity Provider (IdP)
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {isArabic ? 'بوابة الدخول الموحد (SAML 2.0 Assertion)' : 'University SSO Federation'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => !ssoAuthenticating && setShowSsoModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {ssoAuthenticating ? (
              <div className="py-8 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-200 dark:border-emerald-950 border-t-emerald-600 animate-spin" />
                  <KeyRound className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-base">
                    {isArabic ? 'جاري تأكيد التخويل الرقمي عبر SAML 2.0...' : 'Exchanging SAML 2.0 Assertion...'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {ssoTargetName} • auth.alwaha.ac.ae
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Identity Claims Attached</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isArabic
                    ? 'اختر هويتك الأكاديمية المصرح بها للمتابعة عبر نظام التحقق الموحد لجامعة الواحة (Azure AD / Shibboleth Federated IdP):'
                    : 'Select your institutional identity to complete federated SAML 2.0 sign-in via Al-Waha University IdP:'}
                </p>

                <div className="space-y-2.5">
                  {/* Option 1: Maryam Al-Mazrouei */}
                  <button
                    type="button"
                    onClick={() => handleSsoLogin('student@alwaha.ac.ae', '/dashboard', 'Maryam Al-Mazrouei')}
                    className="flex w-full items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition text-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                        MA
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          Maryam Al-Mazrouei (مريم المزروعي)
                        </div>
                        <div className="text-xs text-slate-500">student@alwaha.ac.ae • M.Sc. Student</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Student Claim
                    </span>
                  </button>

                  {/* Option 2: Dr. Fatima Al-Zahra */}
                  <button
                    type="button"
                    onClick={() => handleSsoLogin('falzahra@alwaha.ac.ae', '/supervisor/dashboard', 'Dr. Fatima Al-Zahra')}
                    className="flex w-full items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition text-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                        FZ
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          Dr. Fatima Al-Zahra (د. فاطمة الزهراء)
                        </div>
                        <div className="text-xs text-slate-500">falzahra@alwaha.ac.ae • Faculty Supervisor</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      Supervisor Claim
                    </span>
                  </button>

                  {/* Option 3: Prof. Dr. Tariq Al-Nuaimi */}
                  <button
                    type="button"
                    onClick={() => handleSsoLogin('admin_demo', '/dashboard/admin', 'Prof. Dr. Tariq Al-Nuaimi')}
                    className="flex w-full items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition text-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                        TN
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          Prof. Dr. Tariq Al-Nuaimi (أ.د. طارق النعيمي)
                        </div>
                        <div className="text-xs text-slate-500">admin.research@alwaha.ac.ae • Dean / Admin</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Admin Claim
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                ✕
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
                  {isArabic ? 'يرجى مراجعة البريد الوارد أو الاتصال بمركز تقنية المعلومات بجامعة الواحة' : 'Please check your inbox or contact Al-Waha University IT Helpdesk'}
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
                    placeholder="student@alwaha.ac.ae"
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
