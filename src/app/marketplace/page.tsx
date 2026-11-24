'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { 
  MarketplaceAgent, 
  AgentLifecycleStage, 
  DepartmentKey, 
  LanguageSupport, 
  INITIAL_MARKETPLACE_AGENTS 
} from '@/lib/marketplace/data';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Play,
  ArrowRight,
  BookOpen,
  Building2,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  X,
  History,
  Info,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  const { language } = useI18n();
  const { user } = useAuth();
  const isArabic = language === 'ar';

  const [agents, setAgents] = useState<MarketplaceAgent[]>(INITIAL_MARKETPLACE_AGENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  
  // Modals & Action States
  const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState<MarketplaceAgent | null>(null);
  const [liveTestAgent, setLiveTestAgent] = useState<MarketplaceAgent | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Departments list for filter
  const departments = [
    { key: 'all', labelAr: 'كافة الكليات والأقسام', labelEn: 'All Departments' },
    { key: 'engineering', labelAr: 'كلية الحوسبة والهندسة', labelEn: 'Computing & Engineering' },
    { key: 'medicine', labelAr: 'كلية الطب والعلوم الصحية', labelEn: 'Medicine & Health Sciences' },
    { key: 'business', labelAr: 'كلية إدارة الأعمال', labelEn: 'Business Administration' },
    { key: 'humanities', labelAr: 'كلية العلوم الإنسانية', labelEn: 'Humanities & Social Sciences' },
  ];

  const languages = [
    { key: 'all', labelAr: 'جميع اللغات', labelEn: 'All Languages' },
    { key: 'arabic', labelAr: 'عربي فقط', labelEn: 'Arabic Only' },
    { key: 'bilingual', labelAr: 'ثنائي اللغة (عربي/إنجليزي)', labelEn: 'Bilingual (AR/EN)' },
    { key: 'english', labelAr: 'إنجليزي فقط', labelEn: 'English Only' },
  ];

  const stages: { key: string; labelAr: string; labelEn: string; color: string }[] = [
    { key: 'all', labelAr: 'جميع حالات الحوكمة', labelEn: 'All Lifecycle States', color: 'bg-slate-100 text-slate-700' },
    { key: 'Active Production', labelAr: 'معتمد للإنتاج الأكاديمي', labelEn: 'Active Production', color: 'bg-emerald-100 text-emerald-800' },
    { key: 'Under Review', labelAr: 'قيد المراجعة والاعتماد', labelEn: 'Under Review', color: 'bg-amber-100 text-amber-800' },
    { key: 'Draft', labelAr: 'مسودة قيد التطوير', labelEn: 'Draft Lab', color: 'bg-blue-100 text-blue-800' },
    { key: 'Deprecated', labelAr: 'إصدار قديم (مجدول للتقاعد)', labelEn: 'Deprecated (30-day notice)', color: 'bg-rose-100 text-rose-800' },
  ];

  // Fetch updated agents
  const refreshAgents = async () => {
    try {
      const res = await fetch('/api/marketplace');
      const data = await res.json();
      if (data.success && data.agents) {
        setAgents(data.agents);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshAgents();
  }, []);

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      if (selectedDept !== 'all' && agent.department !== selectedDept) return false;
      if (selectedLang !== 'all' && agent.language !== selectedLang) return false;
      if (selectedStage !== 'all' && agent.stage !== selectedStage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = agent.titleAr.toLowerCase().includes(q) || agent.titleEn.toLowerCase().includes(q);
        const matchDesc = agent.descriptionAr.toLowerCase().includes(q) || agent.descriptionEn.toLowerCase().includes(q);
        const matchTags = agent.tags.some(t => t.toLowerCase().includes(q));
        const matchOwner = agent.ownerNameAr.toLowerCase().includes(q) || agent.ownerNameEn.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTags && !matchOwner) return false;
      }
      return true;
    });
  }, [agents, selectedDept, selectedLang, selectedStage, searchQuery]);

  // Rollback version handler (ALW-502)
  const handleRollback = async (agentId: string, targetVersion: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback',
          agentId,
          targetVersion,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(
          isArabic 
            ? `تم بنجاح التراجع عن التحديث واستعادة الإصدار ${targetVersion} للوكيل!`
            : `Successfully rolled back to version ${targetVersion}!`
        );
        await refreshAgents();
        setShowVersionHistoryModal(null);
        if (selectedAgent && selectedAgent.id === agentId) {
          setSelectedAgent(data.agent);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    }
  };

  // Fork Agent to Sandbox handler
  const handleForkAgent = async (agent: MarketplaceAgent) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fork',
          agentId: agent.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(
          isArabic
            ? `تم استنساخ مخطط الوكيل '${agent.titleAr}' إلى مختبرك الشخصي بنجاح!`
            : `Successfully cloned '${agent.titleEn}' blueprint into your personal sandbox!`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    }
  };

  const getStageBadge = (stage: AgentLifecycleStage) => {
    switch (stage) {
      case 'Active Production':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isArabic ? 'إنتاج أكاديمي معتمد' : 'Active Production'}
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            {isArabic ? 'قيد المراجعة والاعتماد' : 'Under Review'}
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <GitBranch className="w-3.5 h-3.5" />
            {isArabic ? 'مسودة مختبر' : 'Draft Lab'}
          </span>
        );
      case 'Deprecated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            {isArabic ? 'إصدار قديم (إشعار 30 يوم)' : 'Deprecated (30d Notice)'}
          </span>
        );
      case 'Retired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {isArabic ? 'متقاعد' : 'Retired'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Hero Banner with University Identity */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white border-b border-emerald-900/50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isArabic ? 'مستودع الوكلاء الأكاديمي المعتمد - جامعة الواحة' : 'Al-Waha Institutional Agent Repository'}</span>
                <span className="bg-emerald-400/30 px-1.5 py-0.5 rounded text-[10px]">Epic 5</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isArabic ? 'سوق الوكلاء الذكية ومنظومة الحوكمة' : 'Enterprise Agent Marketplace & Governance'}
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                {isArabic
                  ? 'اكتشف، واختبر، واستنسخ الوكلاء الأكاديميين المعتمدين والمفحوصين أمنياً على مستوى الكليات. دورة حياة كاملة مع تحكم في الإصدارات وإمكانية التراجع الفوري.'
                  : 'Discover, test, and fork vetted institutional AI agents across departments. Strict version control, security audit badges, and 1-click rollback.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/student/sandbox"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white text-emerald-900 hover:bg-emerald-50 transition shadow-sm"
              >
                <GitBranch className="w-4 h-4 text-emerald-700" />
                <span>{isArabic ? 'بناء وكيل جديد في المختبر' : 'Build Agent in Sandbox'}</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-700/50">
            <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-700/40">
              <span className="text-xs text-emerald-200/80 block">{isArabic ? 'إجمالي الوكلاء المعتمدين' : 'Total Vetted Agents'}</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {agents.filter(a => a.stage === 'Active Production').length}
              </span>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-700/40">
              <span className="text-xs text-emerald-200/80 block">{isArabic ? 'إجمالي عمليات التنفيذ' : 'Total Invocations'}</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {agents.reduce((acc, curr) => acc + curr.totalExecutions, 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-700/40">
              <span className="text-xs text-emerald-200/80 block">{isArabic ? 'السيادة السحابية (Tier 1)' : 'Sovereign Sovereign Tier'}</span>
              <span className="text-2xl font-bold text-emerald-300 mt-1 block">100% QCRI Fanar</span>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-700/40">
              <span className="text-xs text-emerald-200/80 block">{isArabic ? 'متوسط تقييم الباحثين' : 'Avg Academic Rating'}</span>
              <span className="text-2xl font-bold text-amber-300 mt-1 block">4.92 / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Success Alert Banner */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-sm font-semibold">{actionSuccessMsg}</p>
            </div>
            <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Deprecation Warning Banner if any deprecated agents are visible */}
        {agents.some(a => a.stage === 'Deprecated') && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold">
                {isArabic ? 'تنبيه حوكمة: توجد وكلاء مجدولة للإحالة إلى التقاعد خلال 30 يوماً' : 'Governance Notice: Legacy agents scheduled for retirement within 30 days'}
              </p>
              <p className="text-amber-800/90 dark:text-amber-300/80 text-xs leading-relaxed">
                {isArabic
                  ? 'وفق متطلبات ALW-502، يتم إشعار الباحثين قبل إيقاف أي وكيل رسمي برابط مباشر للبديل المعتمد لضمان استمرارية المشاريع دون انقطاع.'
                  : 'In compliance with ALW-502, researchers receive a 30-day notice with direct migration paths to verified alternatives before agent deactivation.'}
              </p>
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar (ALW-501) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className={`absolute top-3 ${isArabic ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isArabic
                    ? 'ابحث باسم الوكيل، الكلية، اسم المشرف، الكلمات المفتاحية...'
                    : 'Search by agent title, faculty creator, keywords, tags...'
                }
                className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition ${
                  isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-3 ${isArabic ? 'left-3' : 'right-3'} text-slate-400 hover:text-slate-600`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="w-full md:w-64">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-2.5 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              >
                {departments.map((d) => (
                  <option key={d.key} value={d.key}>
                    {isArabic ? d.labelAr : d.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="w-full md:w-56">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-2.5 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              >
                {languages.map((l) => (
                  <option key={l.key} value={l.key}>
                    {isArabic ? l.labelAr : l.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Lifecycle Stage Filter */}
            <div className="w-full md:w-56">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-2.5 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              >
                {stages.map((s) => (
                  <option key={s.key} value={s.key}>
                    {isArabic ? s.labelAr : s.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{isArabic ? 'النتائج المتطابقة:' : 'Matching Agents:'} <strong className="text-slate-800 dark:text-slate-200">{filteredAgents.length}</strong></span>
            {(selectedDept !== 'all' || selectedLang !== 'all' || selectedStage !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDept('all');
                  setSelectedLang('all');
                  setSelectedStage('all');
                  setSearchQuery('');
                }}
                className="text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium ms-2"
              >
                <X className="w-3 h-3" />
                {isArabic ? 'إعادة ضبط التصفية' : 'Reset all filters'}
              </button>
            )}
          </div>
        </div>

        {/* Agents Grid (ALW-501) */}
        {filteredAgents.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {isArabic ? 'لا توجد نتائج مطابقة' : 'No matching agents found'}
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {isArabic
                ? 'جرّب تعديل معايير البحث أو اختيار كلية ولغة مختلفة لاستكشاف الوكلاء.'
                : 'Try adjusting your search query or removing department and language filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border transition hover:shadow-lg flex flex-col justify-between overflow-hidden relative ${
                  agent.stage === 'Deprecated'
                    ? 'border-rose-200 dark:border-rose-900/60 ring-1 ring-rose-500/20'
                    : 'border-slate-200/90 dark:border-slate-700/80 hover:border-emerald-500/50'
                }`}
              >
                {/* Deprecation Top Banner if applicable */}
                {agent.stage === 'Deprecated' && (
                  <div className="bg-rose-500 text-white text-[11px] font-semibold py-1 px-4 text-center flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      {isArabic
                        ? `مجدول للإحالة للتقاعد: ${agent.deprecationNotice?.retiredAfterDate}`
                        : `Retiring on: ${agent.deprecationNotice?.retiredAfterDate}`}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Department & Lifecycle Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/50 truncate max-w-[180px]">
                      {isArabic ? agent.departmentAr : agent.departmentEn}
                    </span>
                    {getStageBadge(agent.stage)}
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition leading-snug">
                      {isArabic ? agent.titleAr : agent.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {isArabic ? agent.taglineAr : agent.taglineEn}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    {agent.tags.length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded text-slate-400">
                        +{agent.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Creator & Version */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {isArabic ? agent.ownerNameAr : agent.ownerNameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                        {isArabic ? agent.ownerRoleAr : agent.ownerRoleEn}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[11px] font-bold">
                        {agent.currentVersion}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {agent.versionHistory.length} {isArabic ? 'إصدارات' : 'versions'}
                      </span>
                    </div>
                  </div>

                  {/* Rating & Stats Bar */}
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{agent.rating}</span>
                      <span className="text-slate-400 font-normal text-[11px]">({agent.reviewCount})</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>{agent.totalExecutions.toLocaleString()} {isArabic ? 'عملية' : 'runs'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'مفحوص أمنياً' : 'Audited'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition"
                  >
                    {isArabic ? 'التفاصيل والحوكمة' : 'Details & Audit'}
                  </button>

                  <button
                    onClick={() => setLiveTestAgent(agent)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تجربة سريعة' : 'Test Run'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL & GOVERNANCE MODAL (ALW-501 & ALW-502) */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedAgent(null)}
                className="absolute top-5 end-5 text-white/70 hover:text-white p-1 rounded-lg bg-black/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-emerald-500/30 border border-emerald-400/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-medium">
                  {isArabic ? selectedAgent.departmentAr : selectedAgent.departmentEn}
                </span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  {selectedAgent.currentVersion}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold">
                {isArabic ? selectedAgent.titleAr : selectedAgent.titleEn}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                {isArabic ? selectedAgent.taglineAr : selectedAgent.taglineEn}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-sm text-slate-700 dark:text-slate-300">
              {/* Deprecation alert inside modal */}
              {selectedAgent.stage === 'Deprecated' && selectedAgent.deprecationNotice && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>{isArabic ? 'إشعار إحالة إلى التقاعد' : 'Deprecation Notice'}</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {isArabic ? selectedAgent.deprecationNotice.reasonAr : selectedAgent.deprecationNotice.reasonEn}
                  </p>
                  <div className="text-xs font-semibold pt-1">
                    {isArabic ? 'البديل الموصى به:' : 'Recommended Alternative:'}{' '}
                    <span className="underline">{selectedAgent.deprecationNotice.recommendedAlternativeTitle}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  {isArabic ? 'نبذة عن الوكيل والمهام الأكاديمية' : 'Agent Overview & Scope'}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {isArabic ? selectedAgent.descriptionAr : selectedAgent.descriptionEn}
                </p>
              </div>

              {/* Governance & Compliance Metadata Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{isArabic ? 'المشرف المسؤول' : 'Principal Creator'}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                    {isArabic ? selectedAgent.ownerNameAr : selectedAgent.ownerNameEn}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isArabic ? selectedAgent.ownerRoleAr : selectedAgent.ownerRoleEn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isArabic ? 'حالة الحوكمة' : 'Governance Stage'}</span>
                  <div className="mt-1">{getStageBadge(selectedAgent.stage)}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isArabic ? 'آخر تدقيق أمني' : 'Security Audit'}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 mt-1 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {selectedAgent.securityAuditDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isArabic ? 'السيادة والامتثال' : 'Sovereignty'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                    {selectedAgent.complianceLevel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isArabic ? 'دعم اللغات' : 'Language Support'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block capitalize">
                    {selectedAgent.language}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isArabic ? 'التقييم الأكاديمي' : 'Rating & Runs'}</span>
                  <span className="font-semibold text-amber-600 mt-1 block">
                    ★ {selectedAgent.rating} ({selectedAgent.totalExecutions} {isArabic ? 'تشغيل' : 'runs'})
                  </span>
                </div>
              </div>

              {/* Sample Prompts */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {isArabic ? 'أمثلة مطالبات سريعة جاهزة للاختبار' : 'Sample Prompts'}
                </h4>
                <div className="space-y-2">
                  {(isArabic ? selectedAgent.samplePromptsAr : selectedAgent.samplePromptsEn).map((prompt, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShowVersionHistoryModal(selectedAgent);
                }}
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 transition"
              >
                <History className="w-4 h-4" />
                <span>{isArabic ? 'سجل الإصدارات والتراجع (Rollback)' : 'Version History & Rollback'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleForkAgent(selectedAgent)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition"
                >
                  <GitBranch className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'استنساخ إلى مختبري' : 'Fork to Sandbox'}</span>
                </button>

                <button
                  onClick={() => {
                    const agent = selectedAgent;
                    setSelectedAgent(null);
                    setLiveTestAgent(agent);
                  }}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition"
                >
                  <Play className="w-4 h-4" />
                  <span>{isArabic ? 'تشغيل واختبار الوكيل' : 'Run Live Agent'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERSION HISTORY & 1-CLICK ROLLBACK MODAL (ALW-502) */}
      {showVersionHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-base">
                    {isArabic ? 'حوكمة الإصدارات وخاصية التراجع الفوري' : 'Agent Versioning & 1-Click Rollback'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {isArabic ? showVersionHistoryModal.titleAr : showVersionHistoryModal.titleEn}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowVersionHistoryModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isArabic
                  ? 'يتيح نظام الحوكمة في جامعة الواحة مقارنة نتائج اختبارات الانحدار (Regression Tests) واستعادة أي إصدار سابق بضغطة زر واحدة لحماية أبحاث الطلبة من التراجع غير المقصود.'
                  : 'Enables instant 1-click rollback to any vetted earlier version with historical regression test scores.'}
              </p>

              <div className="space-y-3">
                {showVersionHistoryModal.versionHistory.map((ver, idx) => (
                  <div
                    key={ver.version}
                    className={`p-4 rounded-xl border transition ${
                      ver.isCurrent
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                          {ver.version}
                        </span>
                        {ver.isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                            {isArabic ? 'الإصدار النشط حالياً' : 'Current Active'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{ver.releaseDate}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                      {isArabic ? ver.changelogAr : ver.changelogEn}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {isArabic ? 'اختبار الانحدار:' : 'Regression Score:'}{' '}
                          <strong className="text-emerald-700 dark:text-emerald-400">{ver.regressionTestScore}%</strong>
                        </span>
                      </div>

                      {!ver.isCurrent && (
                        <button
                          onClick={() => handleRollback(showVersionHistoryModal.id, ver.version)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isArabic ? `تراجع إلى ${ver.version}` : `Rollback to ${ver.version}`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-end">
              <button
                onClick={() => setShowVersionHistoryModal(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE TEST AGENT MODAL (Interactive Chatbot Powered by Fanar) */}
      {liveTestAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
          <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-4xl w-full h-[85vh] border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base">
                      {isArabic ? liveTestAgent.titleAr : liveTestAgent.titleEn}
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/20">
                      {liveTestAgent.currentVersion}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100">
                    {isArabic ? 'بيئة تشغيل واختبار مباشرة مدعومة بنموذج Fanar-C-2-27B السيادي' : 'Live interactive execution powered by sovereign Fanar AI'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLiveTestAgent(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg bg-black/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chatbot Interface Body */}
            <div className="flex-1 p-4 overflow-hidden">
              <AgentChatInterface
                agentType="custom"
                agentId={liveTestAgent.id}
                agentNameAr={liveTestAgent.titleAr}
                agentNameEn={liveTestAgent.titleEn}
                agentRoleAr={liveTestAgent.ownerRoleAr}
                agentRoleEn={liveTestAgent.ownerRoleEn}
                initialGreetingAr={`مرحباً بك! أنا ${liveTestAgent.titleAr}، جاهز لمساعدتك في أبحاثك الأكاديمية تحت معايير جامعة الواحة.`}
                initialGreetingEn={`Welcome! I am ${liveTestAgent.titleEn}, ready to assist your academic research under Al-Waha governance standards.`}
                suggestedPromptsAr={liveTestAgent.samplePromptsAr}
                suggestedPromptsEn={liveTestAgent.samplePromptsEn}
                accentColor="emerald"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
