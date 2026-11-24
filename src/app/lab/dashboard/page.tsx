'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import {
  Cpu,
  BookOpen,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  Server,
  Shuffle,
  RefreshCw,
  GitFork,
  Radio,
  Layers,
  Zap,
  Globe
} from 'lucide-react';

export default function LabDashboardPage() {
  const { t, language } = useI18n();
  const isArabic = language === 'ar';

  const [healthData, setHealthData] = useState<any>(null);
  const [loadingProbe, setLoadingProbe] = useState(false);
  const [selectedDept, setSelectedDept] = useState('engineering');
  const [simulateFailover, setSimulateFailover] = useState(false);
  const [routingDecision, setRoutingDecision] = useState<any>(null);

  const fetchHealthProbe = async () => {
    setLoadingProbe(true);
    try {
      const res = await fetch('/api/ai/gateway');
      const data = await res.json();
      setHealthData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProbe(false);
    }
  };

  const testRouting = async (dept: string, failover: boolean) => {
    try {
      const res = await fetch('/api/ai/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: dept,
          simulateFailure: failover,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRoutingDecision(data.decision);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHealthProbe();
    testRouting('engineering', false);
  }, []);

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept);
    testRouting(dept, simulateFailover);
  };

  const toggleFailover = () => {
    const nextVal = !simulateFailover;
    setSimulateFailover(nextVal);
    testRouting(selectedDept, nextVal);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Hero Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>{isArabic ? 'بوابة الذكاء الاصطناعي السيادي - جامعة الواحة' : 'Al-Waha Central AI Gateway'}</span>
              <span className="bg-indigo-400/30 px-1.5 py-0.5 rounded text-[10px]">Epic 7</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isArabic ? 'بوابة التوجيه متعدد النماذج والمسبار السيادي' : 'Multi-Model Gateway & Sovereign Health Probe'}
            </h1>
            <p className="text-xs md:text-sm text-indigo-100/80 max-w-2xl leading-relaxed">
              {isArabic
                ? 'إدارة التدفق الذكي للاستفسارات البحثية: التوجيه الأساسي إلى نموذج Fanar-C-2-27B السيادي (QCRI) مع مسار تراجع متسلسل إلى السحابة الأكاديمية (Gemini/Claude) في حالات الانقطاع.'
                : 'Intelligent request orchestration: Primary routing to sovereign QCRI Fanar model with zero-downtime cascade failover to Academic Cloud federated tiers.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchHealthProbe}
              disabled={loadingProbe}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingProbe ? 'animate-spin' : ''}`} />
              <span>{isArabic ? 'تحديث مسبار الحالة' : 'Probe Sovereign Health'}</span>
            </button>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-700/60 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold text-white transition backdrop-blur-sm"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-300" />
              <span>{isArabic ? 'سوق الوكلاء' : 'Agent Marketplace'}</span>
            </Link>
          </div>
        </div>

        {/* Live Sovereign Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-indigo-800/50">
          <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
            <span className="text-xs text-indigo-200/80 block">{isArabic ? 'المزود السيادي الأساسي' : 'Sovereign Provider'}</span>
            <span className="text-sm font-bold text-white mt-1 block">QCRI Fanar AI</span>
          </div>
          <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
            <span className="text-xs text-indigo-200/80 block">{isArabic ? 'زمن الاستجابة اللحظي' : 'Probe Latency'}</span>
            <span className="text-xl font-bold text-emerald-300 mt-1 block">
              {healthData?.sovereignPrimary?.latencyMs || 240} ms
            </span>
          </div>
          <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
            <span className="text-xs text-indigo-200/80 block">{isArabic ? 'نسبة الجاهزية (Uptime)' : 'Sovereign Uptime'}</span>
            <span className="text-xl font-bold text-white mt-1 block">99.98%</span>
          </div>
          <div className="bg-indigo-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-indigo-700/40">
            <span className="text-xs text-indigo-200/80 block">{isArabic ? 'قاطع الدائرة (Circuit Breaker)' : 'Circuit Breaker'}</span>
            <span className="text-sm font-bold text-emerald-300 mt-1 block">CLOSED (Healthy)</span>
          </div>
        </div>
      </div>

      {/* Dynamic Fallback Router Simulator (ALW-702) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-indigo-600" />
              <span>{isArabic ? 'محاكي التوجيه والتراجع الذكي' : 'Router & Failover Simulator'}</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
              ALW-702
            </span>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {isArabic ? 'الكلية / القسم الأكاديمي الموجه:' : 'Academic Department Policy:'}
            </label>
            <select
              value={selectedDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 px-3 text-xs outline-none focus:border-indigo-500 font-sans"
            >
              <option value="engineering">{isArabic ? 'كلية الحوسبة والهندسة' : 'Computing & Engineering'}</option>
              <option value="humanities">{isArabic ? 'كلية العلوم الإنسانية والاجتماعية' : 'Humanities & Social Sciences'}</option>
              <option value="medicine">{isArabic ? 'كلية الطب والعلوم الصحية' : 'Medicine & Health Sciences'}</option>
              <option value="business">{isArabic ? 'كلية إدارة الأعمال' : 'Business Administration'}</option>
            </select>
          </div>

          {/* Failover Simulation Switch */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isArabic ? 'محاكاة انقطاع المزود السيادي:' : 'Simulate Primary 5xx Outage:'}
              </span>
              <button
                onClick={toggleFailover}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  simulateFailover ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    simulateFailover ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isArabic
                ? 'عند تفعيل المحاكاة، تسقط بوابة الذكاء تلقائياً إلى نموذج السحابة الأكاديمية الثانوي لضمان استمرارية أبحاث الطلبة.'
                : 'Triggers instant failover cascade to secondary federated research cloud models.'}
            </p>
          </div>

          {/* Active Model Badges */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {isArabic ? 'هرمية التراجع المعتمدة (Hierarchy):' : 'Active Routing Cascade Hierarchy:'}
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="font-semibold">1. Fanar-C-2-27B (Primary)</span>
                <span className="text-[10px] font-mono font-bold">SOVEREIGN</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span className="font-semibold">2. Gemini 1.5 Pro / Claude 3.5</span>
                <span className="text-[10px] font-mono font-bold">FEDERATED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold">3. Al-Waha Offline Cache</span>
                <span className="text-[10px] font-mono font-bold">LOCAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Decision Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{isArabic ? 'قرار التوجيه المعتمد لحظياً' : 'Live Gateway Dispatch Decision'}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {routingDecision?.departmentRuleApplied || 'Rule_ENGINEERING_SOVEREIGN_PRIORITY'}
            </span>
          </div>

          {/* Active Model Selected Card */}
          {routingDecision && (
            <div
              className={`p-5 rounded-2xl border-2 transition ${
                routingDecision.isFallback
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                      routingDecision.isFallback ? 'bg-amber-600' : 'bg-emerald-600'
                    }`}
                  >
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {routingDecision.selectedModel.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Provider: {routingDecision.selectedModel.provider} · Tier: {routingDecision.selectedModel.tier}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      routingDecision.isFallback
                        ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                        : 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                    }`}
                  >
                    {routingDecision.isFallback ? 'FAILOVER ACTIVE' : 'OPTIMAL SOVEREIGN'}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {isArabic ? routingDecision.routingReasonAr : routingDecision.routingReasonEn}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">{isArabic ? 'السيادة والبيانات' : 'Sovereignty'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {routingDecision.selectedModel.sovereigntyTier}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isArabic ? 'نافذة السياق' : 'Context Window'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {routingDecision.selectedModel.contextWindow.toLocaleString()} tokens
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isArabic ? 'متوسط الكمون' : 'Avg Latency'}</span>
                  <span className="font-bold text-emerald-600 font-mono">
                    {routingDecision.selectedModel.latencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isArabic ? 'تكلفة التوكن' : 'Cost Allocation'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {routingDecision.selectedModel.costPer1kTokens === 0 ? 'Sovereign Grant' : '$' + routingDecision.selectedModel.costPer1kTokens}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Chain Inspection */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-indigo-600" />
              <span>{isArabic ? 'سلسلة التراجع الاحتياطية المتبقية (Remaining Chain):' : 'Remaining Failover Chain:'}</span>
            </h4>

            <div className="space-y-2">
              {routingDecision?.fallbackChain?.map((fb: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{fb.name}</span>
                    <span className="text-[10px] text-slate-400">({fb.provider})</span>
                  </div>
                  <span className="font-mono text-emerald-600 text-[11px] font-bold">READY · {fb.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
