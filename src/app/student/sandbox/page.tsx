'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import {
  Sparkles,
  Bot,
  Plus,
  Play,
  Send,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Settings2,
  UserCheck,
  Flame,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Code,
  Check,
  Lock,
  Layers,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface SandboxAgent {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'study' | 'research' | 'coding' | 'writing' | 'ethics';
  descriptionAr: string;
  descriptionEn: string;
  systemPromptAr: string;
  systemPromptEn: string;
  temperature: number;
  model: string;
  knowledgeSources: string[];
  tools: string[];
  accessLevel: 'personal_sandbox' | 'submitted_review' | 'faculty_approved';
  createdAt: string;
  createdBy: string;
  runsCount: number;
}

export default function StudentSandboxPage() {
  const { user } = useAuth();
  const { language } = useI18n();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState<'agents' | 'builder'>('agents');
  const [agents, setAgents] = useState<SandboxAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Builder State (6-Step Wizard)
  const [step, setStep] = useState<number>(1);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<'research' | 'study' | 'coding' | 'writing' | 'ethics'>('research');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [systemPromptAr, setSystemPromptAr] = useState('');
  const [temperature, setTemperature] = useState<number>(0.3);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([
    'دليل إعداد الأطروحة الجامعية - جامعة الواحة 2026',
  ]);
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'evidence_grounding',
    'arabic_citations',
  ]);
  const [submitForReview, setSubmitForReview] = useState<boolean>(false);

  // Playground Test inside Builder
  const [testPrompt, setTestPrompt] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string>('');
  const [testing, setTesting] = useState<boolean>(false);
  const [testMeta, setTestMeta] = useState<{ model?: string; latencyMs?: number; notes?: string[] } | null>(null);

  // Quick Chat Drawer / Modal for existing agents
  const [activeChatAgent, setActiveChatAgent] = useState<SandboxAgent | null>(null);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; meta?: any }>>([]);
  const [chatting, setChatting] = useState<boolean>(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/sandbox/agents');
      const data = await res.json();
      if (data.success && data.agents) {
        setAgents(data.agents);
      }
    } catch (err) {
      console.error('Failed to load sandbox agents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleTestAgent = async () => {
    if (!testPrompt.trim()) return;
    setTesting(true);
    setTestResponse('');
    setTestMeta(null);

    const tempConfig: Partial<SandboxAgent> = {
      nameAr: nameAr || 'وكيل تجريبي',
      nameEn: nameEn || 'Sandbox Agent',
      category,
      systemPromptAr: systemPromptAr || 'أنت وكيل أكاديمي مساعد في جامعة الواحة.',
      systemPromptEn: systemPromptAr,
      temperature,
      model: 'Fanar',
      knowledgeSources: selectedKnowledge,
      tools: selectedTools,
      accessLevel: submitForReview ? 'submitted_review' : 'personal_sandbox',
    };

    try {
      const res = await fetch('/api/student/sandbox/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentConfig: tempConfig,
          prompt: testPrompt,
          language: isArabic ? 'ar' : 'en',
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setTestResponse(data.result.reply);
        setTestMeta({
          model: data.result.model,
          latencyMs: data.result.latencyMs,
          notes: data.result.guardrailNotes,
        });
      } else {
        setTestResponse(data.error || 'Failed to test agent');
      }
    } catch (err) {
      setTestResponse('An error occurred during sandbox test.');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveAgent = async () => {
    if (!nameAr || !systemPromptAr) {
      alert(isArabic ? 'يرجى إدخال اسم الوكيل والتعليمات الأساسية أولاً.' : 'Please provide Agent Name and Instructions.');
      setStep(1);
      return;
    }

    try {
      const res = await fetch('/api/student/sandbox/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr,
          nameEn: nameEn || nameAr,
          category,
          descriptionAr,
          systemPromptAr,
          temperature,
          model: 'Fanar',
          knowledgeSources: selectedKnowledge,
          tools: selectedTools,
          submitForReview,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAgents();
        setActiveTab('agents');
        // Reset builder form
        setStep(1);
        setNameAr('');
        setNameEn('');
        setDescriptionAr('');
        setSystemPromptAr('');
        setTestPrompt('');
        setTestResponse('');
        setTestMeta(null);
      } else {
        alert(data.error || 'Error saving agent');
      }
    } catch (err) {
      alert('Network error while saving agent.');
    }
  };

  const handleSendChat = async () => {
    if (!activeChatAgent || !chatInput.trim()) return;
    const query = chatInput.trim();
    setChatInput('');

    const newHistory = [...chatHistory, { role: 'user' as const, text: query }];
    setChatHistory(newHistory);
    setChatting(true);

    try {
      const res = await fetch('/api/student/sandbox/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeChatAgent.id,
          prompt: query,
          language: isArabic ? 'ar' : 'en',
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setChatHistory([
          ...newHistory,
          {
            role: 'assistant',
            text: data.result.reply,
            meta: {
              model: data.result.model,
              latencyMs: data.result.latencyMs,
            },
          },
        ]);
      }
    } catch (err) {
      setChatHistory([
        ...newHistory,
        { role: 'assistant', text: 'Error executing agent query.' },
      ]);
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-medium text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'جامعة الواحة · مختبر الطالب الذكي (Sandbox)' : 'Al-Waha University · Student AI Sandbox'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isArabic ? 'مختبر بناء وكلاء الذكاء الاصطناعي (Agent Builder)' : 'Student AI Agent Builder & Sandbox'}
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base max-w-2xl leading-relaxed">
              {isArabic
                ? 'بناء واختبار وكلاء أكاديميين مخصصين داخل بيئة معزولة وآمنة (Sandbox) وفق معايير الحوكمة لجامعة الواحة، مع إمكانية الرفع للمشرف الأكاديمي للاعتماد.'
                : 'Build, configure, and safely test custom academic AI assistants in an isolated sandbox under Al-Waha University governance, with draft submission for supervisor review.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('builder');
                setStep(1);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              <span>{isArabic ? 'إنشاء وكيل جديد' : 'Build New Agent'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-emerald-700/40 mt-8 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('agents')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'agents'
                ? 'text-emerald-300 border-b-2 border-emerald-400'
                : 'text-emerald-100/60 hover:text-white'
            }`}
          >
            {isArabic ? `وكلائي في المختبر (${agents.length})` : `My Sandbox Agents (${agents.length})`}
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'builder'
                ? 'text-emerald-300 border-b-2 border-emerald-400'
                : 'text-emerald-100/60 hover:text-white'
            }`}
          >
            {isArabic ? 'منشئ الوكلاء (6-Step Wizard)' : 'Agent Builder Wizard'}
          </button>
        </div>
      </div>

      {/* VIEW 1: MY SANDBOX AGENTS */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          {/* Status Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{isArabic ? 'الوكلاء في مختبري' : 'Sandbox Agents'}</span>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{agents.length}</div>
              <span className="text-xs text-slate-700 dark:text-slate-300 mt-1 block">{isArabic ? 'بيئة تشغيل خاصة ومعزولة' : 'Private isolated environment'}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{isArabic ? 'إجمالي التجارب والتشغيل' : 'Total Executions'}</span>
              <div className="text-2xl font-bold text-teal-700 dark:text-teal-400 mt-1">
                {agents.reduce((acc, a) => acc + (a.runsCount || 0), 0)}
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300 mt-1 block">{isArabic ? 'نموذج Fanar السيادي المعتمد' : 'Sovereign Fanar LLM'}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{isArabic ? 'مرسل لمراجعة المشرف' : 'Under Faculty Review'}</span>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
                {agents.filter((a) => a.accessLevel === 'submitted_review').length}
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300 mt-1 block">{isArabic ? 'في انتظار موافقة د. فاطمة' : 'Pending supervisor approval'}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{isArabic ? 'حالة حوكمة الحماية' : 'Safety Harness Status'}</span>
              <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold mt-1 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{isArabic ? 'نشط وقيد التطبيق' : 'Active & Enforced'}</span>
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300 mt-1 block">{isArabic ? 'منع تسريب البيانات غير المنشورة' : 'Zero-leakage boundary'}</span>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      {agent.accessLevel === 'submitted_review' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <UserCheck className="w-3 h-3" />
                          <span>{isArabic ? 'بانتظار المشرف' : 'Review Pending'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <Lock className="w-3 h-3" />
                          <span>{isArabic ? 'مختبر خاص (Sandbox)' : 'Personal Sandbox'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {isArabic ? agent.nameAr : agent.nameEn}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">{agent.nameEn}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {isArabic ? agent.descriptionAr : agent.descriptionEn}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>{isArabic ? 'المصادر المربوطة:' : 'Knowledge:'}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{agent.knowledgeSources.length} مصادر</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>{isArabic ? 'النموذج ومعدل الحرارة:' : 'Model & Temp:'}</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-300 font-semibold">Fanar (T={agent.temperature})</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>{isArabic ? 'التشغيل والتجارب:' : 'Runs:'}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{agent.runsCount || 0} مرة</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveChatAgent(agent);
                      setChatHistory([
                        {
                          role: 'assistant',
                          text: isArabic
                            ? `مرحباً مريم! أنا وكيلك "${agent.nameAr}" داخل مختبر الذكاء الاصطناعي. كيف أساعدك في بحثك اليوم؟`
                            : `Hello Maryam! I am your sandbox assistant "${agent.nameEn}". How can I support your research today?`,
                        },
                      ]);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تشغيل واختبار الوكيل' : 'Run / Test'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: 6-STEP GUIDED BUILDER */}
      {activeTab === 'builder' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
          {/* Step Progress Indicator */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto overflow-x-auto pb-2 gap-2">
              {[
                { num: 1, title: isArabic ? 'الهدف والهوية' : 'Purpose' },
                { num: 2, title: isArabic ? 'مصادر المعرفة' : 'Knowledge' },
                { num: 3, title: isArabic ? 'الأدوات والنموذج' : 'Tools' },
                { num: 4, title: isArabic ? 'الحوكمة والأذونات' : 'Access' },
                { num: 5, title: isArabic ? 'الاختبار والمحاكاة' : 'Test' },
                { num: 6, title: isArabic ? 'الحفظ والاعتماد' : 'Save' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2 min-w-fit">
                  <button
                    onClick={() => setStep(s.num)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                      step === s.num
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                        : step > s.num
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </button>
                  <span className={`text-xs font-semibold ${step === s.num ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {s.title}
                  </span>
                  {s.num < 6 && <div className="w-6 h-0.5 bg-slate-200 dark:bg-slate-800 mx-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: PURPOSE */}
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الخطوة 1: تحديد هوية وهدف الوكيل' : 'Step 1: Agent Purpose & Identity'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isArabic
                    ? 'عرّف المهمة الأكاديمية التي سيقوم بها الوكيل وطبيعة الإجابات المستهدفة.'
                    : 'Define the academic task your custom assistant will perform.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {isArabic ? 'اسم الوكيل (بالعربية) *' : 'Agent Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder={isArabic ? 'مثال: مساعد تدقيق المنهجية البحثية' : 'e.g. Arabic Research Formatter'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {isArabic ? 'اسم الوكيل (بالإنجليزية)' : 'Agent Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Research Methodology Auditor"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {isArabic ? 'التصنيف الأكاديمي' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="research">{isArabic ? 'بحث علمي وأطروحات' : 'Academic Research'}</option>
                    <option value="study">{isArabic ? 'مرشد ومساعد دراسي' : 'Study Coach'}</option>
                    <option value="coding">{isArabic ? 'برمجة وتحليل بيانات' : 'Coding & Data Analytics'}</option>
                    <option value="ethics">{isArabic ? 'أخلاقيات البحث (IRB)' : 'Research Ethics & Compliance'}</option>
                    <option value="writing">{isArabic ? 'كتابة وترجمة أكاديمية' : 'Academic Writing'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {isArabic ? 'التعليمات الأساسية وسلوك الوكيل (System Prompt) *' : 'System Prompt & Instructions *'}
                  </label>
                  <textarea
                    rows={4}
                    value={systemPromptAr}
                    onChange={(e) => setSystemPromptAr(e.target.value)}
                    placeholder={
                      isArabic
                        ? 'أنت وكيل أكاديمي متخصص في جامعة الواحة. مهمتك فحص وتحليل...'
                        : 'You are an academic research assistant at Al-Waha University. Your goal is to...'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: KNOWLEDGE */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الخطوة 2: ربط مصادر المعرفة المعتمدة' : 'Step 2: Approved Knowledge Sources'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isArabic
                    ? 'اختر الوثائق والمقررات المعتمدة التي سيعتمد عليها الوكيل دون الخروج عنها.'
                    : 'Select approved university documents and syllabi for grounded answers.'}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  'دليل إعداد الأطروحة الجامعية - جامعة الواحة 2026',
                  'معايير لجنة أخلاقيات البحوث الطبية الحيوية (IRB)',
                  'منهجية تحليل البيانات في التعلم العميق الصحي',
                  'قواعد النشر والاقتباس وفق جمعية علم النفس الأمريكية (APA 7)',
                  'قانون حماية البيانات الصحية في دولة الإمارات العربية المتحدة',
                ].map((doc) => {
                  const isChecked = selectedKnowledge.includes(doc);
                  return (
                    <div
                      key={doc}
                      onClick={() => {
                        setSelectedKnowledge((prev) =>
                          isChecked ? prev.filter((d) => d !== doc) : [...prev, doc]
                        );
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border text-xs ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">{doc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: TOOLS & MODEL */}
          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الخطوة 3: الأدوات وبوابة النماذج' : 'Step 3: Tools & Model Selection'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isArabic
                    ? 'تحديد قدرات الوكيل والنموذج اللغوي الفعال عبر بوابة الذكاء لجامعة الواحة.'
                    : 'Configure model routing and integrated reasoning tools.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {isArabic ? 'نموذج فنار السيادي المعتمد (Fanar AI)' : 'Sovereign Fanar LLM'}
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      {isArabic ? 'معالجة عربية دقيقة عبر بوابة النماذج المركزية' : 'Arabic-first intelligence via University AI Gateway'}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active Default
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    <span>{isArabic ? 'درجة الحرارة والإبداع (Temperature):' : 'Creativity (Temperature):'}</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    <span>{isArabic ? 'أكاديمي صارم (0.1)' : 'Strict Academic (0.1)'}</span>
                    <span>{isArabic ? 'متوازن (0.5)' : 'Balanced (0.5)'}</span>
                    <span>{isArabic ? 'ابتكاري (0.9)' : 'Creative (0.9)'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'الأدوات والقدرات المتاحة للوكيل:' : 'Enabled Capabilities:'}
                </label>
                {[
                  { id: 'evidence_grounding', name: isArabic ? 'التحقق من الأدلة والمراجع الأكاديمية' : 'Evidence Grounding' },
                  { id: 'arabic_citations', name: isArabic ? 'صياغة الاستشهادات باللغة العربية والإنجليزية' : 'Arabic Citations' },
                  { id: 'irb_compliance_scanner', name: isArabic ? 'مدقق التوافق مع الأخلاقيات (IRB Guardrail)' : 'Ethics Scanner' },
                  { id: 'code_sandbox', name: isArabic ? 'مفسر الأكواد الإحصائية (Python / R Sandbox)' : 'Code Sandbox' },
                ].map((tool) => {
                  const isChecked = selectedTools.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        setSelectedTools((prev) =>
                          isChecked ? prev.filter((t) => t !== tool.id) : [...prev, tool.id]
                        );
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span>{tool.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: ACCESS & GOVERNANCE */}
          {step === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الخطوة 4: الحوكمة ونطاق الصلاحيات' : 'Step 4: Governance & Access Policy'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isArabic
                    ? 'يتم تشغيل وكلاء الطلاب تلقائياً داخل بيئة معزولة (Sandbox) لحماية البيانات غير المنشورة.'
                    : 'Student agents are created in an isolated sandbox with optional faculty review.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{isArabic ? 'بيئة مختبر الطالب المعزولة (Isolated Sandbox Mode)' : 'Isolated Sandbox Active'}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isArabic
                    ? 'يحق للطالب إنشاء واختبار عدد غير محدود من الوكلاء لأغراض الدراسة والبحث الشخصي. لن يتم نشر الوكيل للجمهور أو الزملاء إلا بعد مراجعة المشرف الأكاديمي.'
                    : 'Students can build and run unlimited personal assistants. Agents are restricted to your workspace unless approved by faculty.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={submitForReview}
                    onChange={(e) => setSubmitForReview(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 accent-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      {isArabic ? 'طلب مراجعة واعتماد الوكيل من المشرف الأكاديمي' : 'Submit for Faculty Supervisor Review'}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mt-0.5">
                      {isArabic
                        ? 'إرسال نسخة من الوكيل إلى د. فاطمة الزهراء لدراسة إتاحته كأداة معتمدة للدفعة.'
                        : 'Forward this agent configuration to Dr. Fatima Al-Zahra for course evaluation.'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: TEST PLAYGROUND */}
          {step === 5 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الخطوة 5: الاختبار والمحاكاة الحية (Live Sandbox Test)' : 'Step 5: Live Playground Test'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isArabic
                    ? 'جرب وكيلك الآن عبر نموذج Fanar للتأكد من جودة الردود والتزامه بالتعليمات قبل الحفظ.'
                    : 'Prompt your newly configured agent to test live responses with Fanar.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder={
                      isArabic
                        ? 'اطرح سؤالاً تجريبياً، مثلاً: "كيف أصيغ الفرضية لبحث التعلم العميق؟"'
                        : 'Enter a test prompt to test your agent...'
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleTestAgent}
                    disabled={testing || !testPrompt.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
                  >
                    {testing ? (
                      <span className="animate-pulse">{isArabic ? 'قيد المعالجة...' : 'Testing...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isArabic ? 'اختبار' : 'Run Test'}</span>
                      </>
                    )}
                  </button>
                </div>

                {testResponse && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {isArabic ? 'رد الوكيل التجريبي (استجابة Fanar):' : 'Agent Response:'}
                      </span>
                      {testMeta && (
                        <span className="font-mono text-xs">
                          {testMeta.model} · {testMeta.latencyMs}ms
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {testResponse}
                    </div>

                    {testMeta?.notes && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5">
                        {testMeta.notes.map((note, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: SAVE & REVIEW */}
          {step === 6 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الخطوة 6: مراجعة الإعدادات وحفظ الوكيل' : 'Step 6: Review & Finalize'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isArabic
                    ? 'راجع مواصفات الوكيل قبل إضافته إلى مختبرك الخاص.'
                    : 'Review agent specifications before adding it to your sandbox.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isArabic ? 'اسم الوكيل:' : 'Agent Name:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{nameAr || 'وكيل بدون اسم'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isArabic ? 'التصنيف:' : 'Category:'}</span>
                  <span className="font-semibold text-emerald-600">{category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isArabic ? 'نموذج الذكاء:' : 'Foundation Model:'}</span>
                  <span className="font-mono text-slate-900 dark:text-white">Fanar (QCRI) · T={temperature}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isArabic ? 'المصادر المربوطة:' : 'Sources:'}</span>
                  <span className="font-semibold">{selectedKnowledge.length} مصادر</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isArabic ? 'مستوى الصلاحية:' : 'Access Level:'}</span>
                  <span className="font-semibold text-amber-600">
                    {submitForReview
                      ? isArabic ? 'إرسال للمراجعة مع د. فاطمة' : 'Submitted for Supervisor Review'
                      : isArabic ? 'مختبر خاص (Personal Sandbox)' : 'Personal Sandbox Only'}
                  </span>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSaveAgent}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isArabic ? 'حفظ الوكيل وبدء الاستخدام' : 'Save Agent & Launch'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>{isArabic ? 'السابق' : 'Previous'}</span>
            </button>

            {step < 6 ? (
              <button
                onClick={() => setStep((s) => Math.min(6, s + 1))}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
              >
                <span>{isArabic ? 'التالي' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* QUICK CHAT MODAL FOR EXISTING AGENT */}
      {activeChatAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {isArabic ? activeChatAgent.nameAr : activeChatAgent.nameEn}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isArabic ? 'مختبر الطالب المعزول · نموذج Fanar' : 'Student Sandbox · Fanar Model'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatAgent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px]">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.meta && (
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.meta.model} ({msg.meta.latencyMs}ms)
                    </span>
                  )}
                </div>
              ))}
              {chatting && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{isArabic ? 'الوكيل يفكر ويكتب الرد عبر Fanar...' : 'Agent thinking via Fanar...'}</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder={isArabic ? 'اكتب استفسارك للوكيل...' : 'Ask your agent...'}
                className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendChat}
                disabled={chatting || !chatInput.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
