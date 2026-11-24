'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  FileSearch,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';

export default function SafetyGuardrailsDashboard() {
  const { language } = useI18n();
  const isArabic = language === 'ar';

  const [inputText, setInputText] = useState(
    'الباحثة مريم المزروعي رقم الهوية 784-1998-1234567-1 ورقم الهاتف +971 50 123 4567 قامت بفحص الملف الطبي رقم MRN-98214.'
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorBlocked, setErrorBlocked] = useState<any>(null);

  const runScan = async (overrideText?: string) => {
    setLoading(true);
    setErrorBlocked(null);
    setResult(null);
    try {
      const res = await fetch('/api/safety/guardrails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scan',
          text: overrideText !== undefined ? overrideText : inputText,
        }),
      });

      const data = await res.json();
      if (res.status === 403 && data.exception === 'GuardrailViolationException') {
        setErrorBlocked(data);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testTriggerLeak = () => {
    const leakPrompt = 'Confidential patent draft for Al-Waha sovereign model and unreleased clinical trial raw patient records';
    setInputText(leakPrompt);
    runScan(leakPrompt);
  };

  const testGroundingVerification = () => {
    const groundingPrompt = 'This study on Fanar LLM demonstrates high Arabic comprehension. However, another unverified study claims 99% accuracy across all dialects without benchmarks.';
    setInputText(groundingPrompt);
    runScan(groundingPrompt);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                <span>{isArabic ? 'منظومة الأمان والامتثال المؤسسي - جامعة الواحة' : 'Al-Waha Institutional AI Safety Harness'}</span>
                <span className="bg-indigo-400/30 px-1.5 py-0.5 rounded text-[10px]">Epic 6</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isArabic ? 'بوابة الأمان والرقابة على المحتوى والبيانات' : 'Safety Harness & Content Guardrails'}
              </h1>
              <p className="text-indigo-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                {isArabic
                  ? 'حماية استباقية عند بوابة الذكاء الاصطناعي: تنقيح الهويات الوطنية وأرقام الهواتف والسجلات الطبية، حظر تسريب الملكية الفكرية، وتدقيق الإسناد المرجعي بنسبة تشابه > 0.78.'
                  : 'Proactive AI gateway protection: UAE Emirates ID and clinical redaction, zero-leakage trade secret enforcement, and cosine evidence grounding (>0.78).'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={testTriggerLeak}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-rose-600/90 hover:bg-rose-600 text-white transition shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isArabic ? 'محاكاة تسريب براءة اختراع (HTTP 403)' : 'Simulate IP Exfiltration (403)'}</span>
              </button>
              <button
                onClick={testGroundingVerification}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
              >
                <FileSearch className="w-4 h-4" />
                <span>{isArabic ? 'محاكاة فحص الهلوسة والإسناد' : 'Simulate Grounding Check'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-indigo-800/50">
            <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
              <span className="text-xs text-indigo-200/80 block">{isArabic ? 'معيار حجب الهوية الإماراتي' : 'Emirates ID Rule'}</span>
              <span className="text-xl font-bold text-white mt-1 block">784-XXXX-XXXXXXX-X</span>
            </div>
            <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
              <span className="text-xs text-indigo-200/80 block">{isArabic ? 'حد التشابه الدلالي (Cosine)' : 'Evidence Grounding'}</span>
              <span className="text-xl font-bold text-emerald-300 mt-1 block">&gt; 0.78 Match</span>
            </div>
            <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
              <span className="text-xs text-indigo-200/80 block">{isArabic ? 'استجابة حظر التسريب' : 'Leakage Exception'}</span>
              <span className="text-xl font-bold text-rose-300 mt-1 block">HTTP 403 Blocker</span>
            </div>
            <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
              <span className="text-xs text-indigo-200/80 block">{isArabic ? 'حالة السلسلة الأمنية' : 'Harness Status'}</span>
              <span className="text-xl font-bold text-indigo-300 mt-1 block">Active &amp; Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Testing Playground Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Guardrail Violation Alert Card */}
        {errorBlocked && (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-900 dark:text-rose-200 shadow-lg space-y-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {isArabic ? 'تم تفعيل درع الحظر الأمني: GuardrailViolationException' : 'Security Shield Intercept: GuardrailViolationException'}
                </h3>
                <span className="text-xs font-mono bg-rose-200 dark:bg-rose-900/60 px-2 py-0.5 rounded text-rose-800 dark:text-rose-200 font-bold">
                  HTTP 403 · {errorBlocked.violationType}
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold leading-relaxed">
              {isArabic ? errorBlocked.messageAr : errorBlocked.messageEn}
            </p>

            <div className="text-xs font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-rose-200 dark:border-rose-900 text-slate-800 dark:text-slate-200">
              Pattern Triggered: {errorBlocked.detectedPattern}
            </div>
          </div>
        )}

        {/* Interactive Prompt Scanner */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <span>{isArabic ? 'مختبر اختبار دروع الأمان التفاعلي' : 'Live Guardrail Testing Sandbox'}</span>
            </h2>
            <span className="text-xs text-slate-400">ALW-601 &amp; ALW-602</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {isArabic
              ? 'جرّب إدخال نصوص تحتوي على بيانات شخصية إماراتية (هوية وطنية، هواتف، ملفات طبية) أو مطالبات بحثية لفحص نسبة الإسناد المرجعي والتشابه الدلالي.'
              : 'Test prompts containing UAE personal identifiers or empirical claims to inspect automated redaction and evidence grounding.'}
          </p>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-sans"
            placeholder={isArabic ? 'اكتب أو الصق النص هنا لاختباره...' : 'Type or paste research text to scan...'}
          />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'المعالجة تجري محلياً وبسيادة تامة' : 'Processed securely with sovereign compliance'}</span>
            </div>

            <button
              onClick={() => runScan()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-700 hover:bg-indigo-800 shadow-sm transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? (isArabic ? 'جارِ الفحص...' : 'Scanning...') : (isArabic ? 'بدء الفحص الأمني' : 'Execute Safety Scan')}</span>
            </button>
          </div>
        </div>

        {/* Scan Results */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* ALW-601 PII Redaction Outcome */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {isArabic ? 'نتائج تنقيح المعرفات (ALW-601)' : 'PII Redaction Results (ALW-601)'}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                  {result.redactedEntities?.length || 0} {isArabic ? 'معرفات محجوبة' : 'redactions'}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">{isArabic ? 'النص بعد التنقيح والحجب الآمن:' : 'Sanitized Gateway Payload:'}</span>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                  {result.sanitizedText}
                </div>
              </div>

              {result.redactedEntities && result.redactedEntities.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isArabic ? 'قائمة المعرفات التي تم رصدها وحجبها:' : 'Detected Sensitive Entities:'}
                  </span>
                  <div className="space-y-1.5">
                    {result.redactedEntities.map((ent: any, i: number) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-mono text-[10px] font-bold">
                            {ent.type}
                          </span>
                          <span className="font-mono text-slate-600 dark:text-slate-400">{ent.raw}</span>
                        </div>
                        <span className="text-emerald-600 font-bold font-mono text-[11px]">➔ {ent.replacement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ALW-602 Grounding & Hallucination Defense */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {isArabic ? 'تدقيق الإسناد ودفاع الهلوسة (ALW-602)' : 'Evidence Grounding & Defense (ALW-602)'}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded">
                  Score: {result.groundingAudit?.overallGroundingScore}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isArabic ? 'المزاعم المفحوصة' : 'Assertions'}</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {result.groundingAudit?.totalAssertions}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">{isArabic ? 'مثبتة (> 0.78)' : 'Grounded'}</span>
                  <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                    {result.groundingAudit?.groundedCount}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 block">{isArabic ? 'غير موثقة' : 'Flagged'}</span>
                  <span className="text-base font-bold text-rose-700 dark:text-rose-300">
                    {result.groundingAudit?.unverifiedCount}
                  </span>
                </div>
              </div>

              {/* Assertions Breakup */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'تفاصيل الإسناد المرجعي للمزاعم:' : 'Claim Grounding Matrix:'}
                </span>

                {result.groundingAudit?.assertions?.map((assertion: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      assertion.isGrounded
                        ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                        {assertion.citationSource}
                      </span>
                      <span
                        className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                          assertion.isGrounded
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                        }`}
                      >
                        {(assertion.cosineSimilarity * 100).toFixed(0)}% Match
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      &quot;{assertion.statement}&quot;
                    </p>

                    {!assertion.isGrounded && (
                      <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'يتطلب تدقيق الاستشهاد الأكاديمي' : 'Citation verification needed'}</span>
                      </div>
                    )}

                    {assertion.doi && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        DOI: {assertion.doi} {assertion.pageOrParagraph && `· ${assertion.pageOrParagraph}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
