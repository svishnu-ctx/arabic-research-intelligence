'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Activity,
  ShieldCheck,
  Download,
  AlertTriangle,
  Lock,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  FileCode,
  DollarSign,
  Building2,
  User,
  Cpu
} from 'lucide-react';

export default function AdminAuditObservabilityDashboard() {
  const { language } = useI18n();
  const isArabic = language === 'ar';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/observability/audit?department=${selectedDept}&role=${selectedRole}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, [selectedDept, selectedRole]);

  const handleExport = (format: 'csv' | 'json_download') => {
    window.open(`/api/observability/audit?format=${format}&department=${selectedDept}&role=${selectedRole}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            {isArabic ? 'استهلاك طبيعي' : 'Healthy Quota'}
          </span>
        );
      case 'WARNING_80':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="w-3 h-3" />
            {isArabic ? 'تنبيه (80% من الحصة)' : '80% Warning Threshold'}
          </span>
        );
      case 'CRITICAL_95':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            {isArabic ? 'حرج (95% من الحصة)' : '95% Critical Alert'}
          </span>
        );
      case 'EXHAUSTED_LOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <Lock className="w-3 h-3" />
            {isArabic ? 'مستنفد (إيقاف تلقائي)' : 'Locked Hard-Stop'}
          </span>
        );
    }
  };

  const filteredTransactions = data?.transactions?.filter((t: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.transactionId.toLowerCase().includes(q) ||
      t.userEmail.toLowerCase().includes(q) ||
      t.agentName.toLowerCase().includes(q) ||
      t.model.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Hero Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>{isArabic ? 'الرقابة وحصص الميزانية - جامعة الواحة' : 'Al-Waha Observability & Budget Engine'}</span>
              <span className="bg-purple-400/30 px-1.5 py-0.5 rounded text-[10px]">Epic 8</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isArabic ? 'سجل المعاملات الرقابي غير القابل للتعديل وحصص الكليات' : 'AI Transaction Audit Log & Token Quotas'}
            </h1>
            <p className="text-xs md:text-sm text-purple-100/80 max-w-2xl leading-relaxed">
              {isArabic
                ? 'سجل غير قابل للتعديل يوثق جميع العمليات، المستخدمين، نماذج الذكاء، واستهلاك التوكن لـ 7 سنوات التزاماً بلوائح الاعتماد الأكاديمي، مع نظام تحذير استباقي عند 80% و95% من ميزانية الكلية.'
                : 'Immutable regulatory audit log retained for 7 years per UAE higher ed compliance. Real-time departmental token quotas with proactive 80% & 95% threshold alerts.'}
            </p>
          </div>

          {/* Export Action Buttons (ALW-801) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 text-xs font-bold shadow-sm transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'تصدير السجل (CSV)' : 'Export Audit (CSV)'}</span>
            </button>
            <button
              onClick={() => handleExport('json_download')}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-700/60 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold text-white transition backdrop-blur-sm"
            >
              <FileCode className="w-4 h-4 text-purple-300" />
              <span>{isArabic ? 'تصدير السجل (JSON)' : 'Export Audit (JSON)'}</span>
            </button>
          </div>
        </div>

        {/* Global Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-purple-800/50">
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-purple-700/40">
            <span className="text-xs text-purple-200/80 block">{isArabic ? 'إجمالي التوكن المستهلك' : 'Total Tokens Consumed'}</span>
            <span className="text-xl font-bold text-white mt-1 block">
              {data?.summary?.totalTokensConsumed ? (data.summary.totalTokensConsumed / 1000000).toFixed(2) + ' M' : '29.47 M'}
            </span>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-purple-700/40">
            <span className="text-xs text-purple-200/80 block">{isArabic ? 'نسبة استهلاك الحصة الكلية' : 'Budget Utilization'}</span>
            <span className="text-xl font-bold text-amber-300 mt-1 block">
              {data?.summary?.utilizationPercentage || 75.6}%
            </span>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-purple-700/40">
            <span className="text-xs text-purple-200/80 block">{isArabic ? 'سياسة الحفظ والأرشفة' : 'Audit Retention'}</span>
            <span className="text-xl font-bold text-emerald-300 mt-1 block">7 Years (2033)</span>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-purple-700/40">
            <span className="text-xs text-purple-200/80 block">{isArabic ? 'تنبيهات الميزانية النشطة' : 'Active Threshold Alerts'}</span>
            <span className="text-xl font-bold text-rose-300 mt-1 block">
              {data?.summary?.activeAlertsCount || 2} {isArabic ? 'كليات' : 'Colleges'}
            </span>
          </div>
        </div>
      </div>

      {/* ALW-802: Department Token Quotas Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <span>{isArabic ? 'حصص الميزانية واستهلاك الكليات (ALW-802)' : 'Departmental Token Quotas & Utilization (ALW-802)'}</span>
          </h2>
          <span className="text-xs text-slate-400">Monthly Allocations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.quotas?.map((quota: any) => (
            <div
              key={quota.departmentKey}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border shadow-sm space-y-3.5 transition hover:shadow-md ${
                quota.status === 'CRITICAL_95'
                  ? 'border-rose-400 dark:border-rose-800'
                  : quota.status === 'WARNING_80'
                  ? 'border-amber-400 dark:border-amber-800'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[170px]">
                  {isArabic ? quota.departmentAr : quota.departmentEn}
                </span>
                {getStatusBadge(quota.status)}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    {(quota.tokensConsumed / 1000000).toFixed(2)}M / {(quota.monthlyTokenAllocation / 1000000).toFixed(0)}M
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono">
                    {quota.utilizationPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      quota.utilizationPercentage >= 95
                        ? 'bg-rose-500'
                        : quota.utilizationPercentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(quota.utilizationPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
                <span>{quota.activeResearchers} {isArabic ? 'باحث نشط' : 'Researchers'}</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  ${quota.monthlyCostEstimateUsd}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALW-801: Immutable Audit Transactions Log Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {isArabic ? 'سجل العمليات المؤسسي غير القابل للتعديل (ALW-801)' : 'Immutable AI Audit Trail (7-Year Retained)'}
            </h3>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className={`absolute top-2.5 ${isArabic ? 'right-3' : 'left-3'} w-3.5 h-3.5 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'بحث بالمعاملة، المستخدم، الوكيل...' : 'Search transaction ID, user, agent...'}
                className={`text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2 outline-none focus:border-purple-500 ${
                  isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'
                }`}
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2 px-3 outline-none focus:border-purple-500"
            >
              <option value="all">{isArabic ? 'كافة الكليات' : 'All Departments'}</option>
              <option value="engineering">{isArabic ? 'الهندسة والحوسبة' : 'Engineering'}</option>
              <option value="medicine">{isArabic ? 'الطب والعلوم الصحية' : 'Medicine'}</option>
              <option value="business">{isArabic ? 'إدارة الأعمال' : 'Business'}</option>
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2 px-3 outline-none focus:border-purple-500"
            >
              <option value="all">{isArabic ? 'كافة الأدوار' : 'All Roles'}</option>
              <option value="student">{isArabic ? 'طلاب' : 'Students'}</option>
              <option value="supervisor">{isArabic ? 'مشرفين' : 'Supervisors'}</option>
              <option value="admin">{isArabic ? 'إدارة المنصة' : 'Admins'}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4 text-start">{isArabic ? 'المعاملة والوقت' : 'Transaction & Time'}</th>
                <th className="py-3 px-4 text-start">{isArabic ? 'المستخدم والدور' : 'User & Role'}</th>
                <th className="py-3 px-4 text-start">{isArabic ? 'الوكيل والنموذج' : 'Agent & Model'}</th>
                <th className="py-3 px-4 text-start">{isArabic ? 'التوكن المستهلك' : 'Tokens Used'}</th>
                <th className="py-3 px-4 text-start">{isArabic ? 'الكمون' : 'Latency'}</th>
                <th className="py-3 px-4 text-start">{isArabic ? 'حالة درع الأمان' : 'Guardrail'}</th>
                <th className="py-3 px-4 text-start">{isArabic ? 'انتهاء الحفظ' : 'Retained Until'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {filteredTransactions?.map((tx: any) => (
                <tr key={tx.transactionId} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                      {tx.transactionId}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {tx.timestamp}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {tx.userEmail}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize block">
                      {tx.role} · {tx.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-900 dark:text-slate-100 block">
                      {tx.agentName}
                    </span>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 block">
                      {tx.model}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {tx.totalTokens.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ({tx.promptTokens} in / {tx.completionTokens} out)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                    {tx.latencyMs} ms
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.guardrailStatus === 'PASSED' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        PASSED
                      </span>
                    ) : tx.guardrailStatus === 'MASKED_PII' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        MASKED PII
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        BLOCKED 403
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {tx.retentionUntil?.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
