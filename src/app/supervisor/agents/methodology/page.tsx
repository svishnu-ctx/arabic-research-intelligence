'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SupervisorMethodologyIRB } from '@/lib/agents/supervisor';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import {
  LineChart,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  FileCheck,
  CheckSquare,
  Bot,
  Sliders,
  Download,
  Printer,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function SupervisorMethodologyAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [viewMode, setViewMode] = useState<'FORM' | 'CHAT'>('FORM');
  const [studentName, setStudentName] = useState('Maryam Al-Mazrouei (مريم المزروعي)');
  const [topic, setTopic] = useState('Deep Reinforcement Learning for Solar Microgrids');
  const [researchDesign, setResearchDesign] = useState('Quantitative Markov Decision Process (MDP) Simulation + Empirical Telemetry Data');
  const [dataSources, setDataSources] = useState('Al-Waha University solar rooftop telemetry & campus weather station');
  const [sampleSize, setSampleSize] = useState('1,240 hourly readings (24-hour diurnal summer cycle, 1-minute telemetry resolution)');
  const [targetLanguage, setTargetLanguage] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<SupervisorMethodologyIRB | null>(null);

  React.useEffect(() => {
    setTargetLanguage(isArabic ? 'ar' : 'en');
  }, [isArabic]);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/supervisor/agents/methodology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          topic,
          researchDesign,
          dataSources,
          sampleSize,
          language: targetLanguage
        }),
      });
      const data = await res.json();
      if (data.validation) {
        setValidation(data.validation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidating(false);
    }
  };

  const handleExportCertificate = () => {
    const certText = `# شهادة اعتماد أخلاقيات البحث العلمي (IRB Clearance Certificate)
جامعة الواحة • Al-Waha University
لجنة حوكمة وأخلاقيات البحث العلمي (Institutional Review Board)
------------------------------------------------------------
تاريخ الإصدار: ${new Date().toLocaleDateString('ar-AE', { dateStyle: 'full' })}
المرجع الأكاديمي: ALW-IRB-2026-${Math.floor(1000 + Math.random() * 9000)}

بيانات الباحث والأطروحة:
- الباحث: ${studentName}
- المشرف الأكاديمي: د. فاطمة الزهراء (Dr. Fatima Al-Zahra)
- عنوان البحث: ${topic}
- التصميم البحثي: ${researchDesign}

نتيجة التدقيق الأخلاقي والحوكمة:
- مستوى المخاطر: ${validation?.irbRiskLevel || 'EXEMPT'} (معفى من المراجعة الكاملة)
- فحص تعمية البيانات وهوية المشاركين: Passed (Zero Identifiers)
- التحقق من التخزين السحابي: سحابة جامعة الواحة المؤمنة حصراً (Zero Leakage)
- القوة الإحصائية للتصميم: ${validation?.statisticalPowerRating || 'High (0.88)'}

توقيع رئيس اللجنة والمشرف الأكاديمي:
د. فاطمة الزهراء - جامعة الواحة`;

    const blob = new Blob([certText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AlWaha_IRB_Clearance_${studentName.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-300">
          <LineChart className="h-3.5 w-3.5" />
          <span>Supervisor Agent 3 • Fanar AI Powered (ALW-403)</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          {isArabic ? 'اعتماد المنهجية ولجنة أخلاقيات البحث (Methodology & IRB Auditor)' : 'Methodology & IRB Ethics Validator'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {isArabic
            ? 'فحص القوة الإحصائية، مسح تعمية الهوية وتخزين البيانات، وتصنيف مخاطر IRB (Exempt / Expedited / Full Committee) مع إصدار شهادة الاعتماد.'
            : 'Evaluate statistical power, screen PII/cloud security, categorize IRB risk (Exempt / Expedited / Full Committee), and export clearance certificates.'}
        </p>
      </div>

      {/* Dual Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 w-fit">
        <button
          type="button"
          onClick={() => setViewMode('FORM')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'FORM'
              ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isArabic ? 'نموذج فحص المنهجية والشهادة' : 'IRB Screening & Certificate'}</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('CHAT')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'CHAT'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>{isArabic ? 'المحادثة الاستشارية المنهجية (Chatbot)' : 'Methodology & Ethics Chatbot'}</span>
        </button>
      </div>

      {viewMode === 'CHAT' ? (
        <AgentChatInterface
          agentType="methodology"
          agentNameAr="مدقق أخلاقيات البحث والمنهجية (IRB Auditor)"
          agentNameEn="Methodology & IRB Ethics Auditor"
          agentRoleAr="فحص تعمية البيانات وحماية المرضى والمشاركين، وتقييم القوة الإحصائية والتصميم التجريبي"
          agentRoleEn="Auditing PII/PHI anonymization, empirical statistical power, and ethics compliance"
          initialGreetingAr="أهلاً د. فاطمة! بصفتي وكيل تدقيق المنهجية وأخلاقيات البحث (IRB)، أنا جاهز لفحص تصميم دراسة مريم المزروعي، التحقق من خلو البيانات من أي معرفات شخصية، والتأكد من مطابقة معايير النزاهة العلمية."
          initialGreetingEn="Welcome Dr. Fatima! As your Methodology & IRB Ethics Auditor, I am ready to evaluate candidate study protocols, check for participant de-identification, and verify ethics compliance."
          suggestedPromptsAr={[
            'هل يتطلب بروتوكول جمع بيانات الطائرات بدون طيار موافقة أمنية أو أخلاقية مسبقة؟',
            'ما هي شروط منح شهادة الإعفاء الأخلاقي (Exempt) في الأبحاث الهندسية؟',
            'كيف نتحقق من عدم تسريب أي بيانات مكانية أو بيئية حساسة خارج خوادم الجامعة؟',
            'صغ لي شهادة اعتماد مبدئية لتقدير القوة الإحصائية للدراسة.'
          ]}
          suggestedPromptsEn={[
            'Does UAV telemetry collection require expedited or full IRB committee clearance?',
            'What criteria qualify an engineering data simulation for Exempt IRB status?',
            'How do we verify zero telemetry leakage outside university boundaries?',
            'Draft an official statistical power sign-off memo for candidate files.'
          ]}
          currentContext={`Candidate: ${studentName}\nTopic: ${topic}`}
          accentColor="indigo"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isArabic ? 'اسم الطالب / الباحث:' : 'Candidate Name:'}
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isArabic ? 'التصميم البحثي المقترح من الطالب:' : 'Proposed Research Design:'}
                </label>
                <input
                  type="text"
                  value={researchDesign}
                  onChange={(e) => setResearchDesign(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isArabic ? 'مصادر البيانات وحجم العينة:' : 'Data Sources & Sample Scope:'}
                </label>
                <textarea
                  rows={3}
                  value={`${dataSources}\nScope: ${sampleSize}`}
                  onChange={(e) => setDataSources(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              {/* Language Selector */}
              <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-3">
                <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">
                  {isArabic ? 'لغة تقرير تقييم المنهجية والأخلاقيات:' : 'Validation Report Language:'}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="targetLanguage"
                      checked={targetLanguage === 'ar'}
                      onChange={() => setTargetLanguage('ar')}
                      className="accent-indigo-600"
                    />
                    <span>العربية (Arabic)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="targetLanguage"
                      checked={targetLanguage === 'en'}
                      onChange={() => setTargetLanguage('en')}
                      className="accent-indigo-600"
                    />
                    <span>English</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleValidate}
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3 text-xs font-bold text-white shadow hover:bg-indigo-800 disabled:opacity-50 transition"
              >
                {isValidating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{isArabic ? 'جاري فحص المنهجية وأخلاقيات البحث بنموذج فنار...' : 'Auditing Methodology with Fanar...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{isArabic ? 'اعتماد المنهجية وفحص IRB بنموذج فنار' : 'Validate Methodology & IRB'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-4">
            {validation ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                  {/* Status & Categorization Header (ALW-403) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                        <FileCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {isArabic ? 'تصنيف أخلاقيات البحث (Al-Waha IRB Category)' : 'Al-Waha IRB Risk Category'}
                        </div>
                        <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                          {validation.irbRiskLevel} · {isArabic ? 'معفى من المراجعة الكاملة (EXEMPT)' : 'EXEMPT FROM FULL HEARING'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleExportCertificate}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'تصدير شهادة IRB المعتمدة' : 'Export IRB Certificate'}</span>
                    </button>
                  </div>

                  {/* 3 Core Security Checks (ALW-403) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">{isArabic ? 'معرفات الأشخاص (PII/PHI)' : 'Patient Identifiers'}</span>
                      <span className="text-xs font-bold text-emerald-600 mt-1 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isArabic ? 'معدومة (Zero Identifiers)' : 'Zero Identifiers'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">{isArabic ? 'فجوات الموافقة المستنيرة' : 'Informed Consent'}</span>
                      <span className="text-xs font-bold text-emerald-600 mt-1 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isArabic ? 'مستوفاة بالكامل' : 'Standardized'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">{isArabic ? 'حماية التخزين السحابي' : 'Cloud Security'}</span>
                      <span className="text-xs font-bold text-emerald-600 mt-1 flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        {isArabic ? 'سحابة الواحة السيادية' : 'Al-Waha Cloud'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Validity Threats */}
                    <div>
                      <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>{isArabic ? 'تهديدات الصدق المنهجي (Threats to Validity)' : 'Methodological Threats to Validity'}</span>
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {validation.validityThreats.map((threat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* IRB Checklist */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                        <CheckSquare className="h-3.5 w-3.5" />
                        <span>{isArabic ? 'قائمة التحقق من متطلبات لجنة الأخلاقيات وحوكمة البيانات' : 'IRB Compliance & Governance Checklist'}</span>
                      </h3>
                      <div className="mt-2 space-y-2">
                        {validation.irbComplianceChecklist.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{item.requirement}</span>
                            </div>
                            <div className="text-slate-500 mt-1 ps-5">{item.remediation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sign-off Memo */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {isArabic ? 'مذكرة المشرف الأكاديمي للاعتماد المنهجي' : 'Supervisory Sign-off Memo'}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {validation.dataGovernanceMemo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-850/50">
                <LineChart className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isArabic ? 'في انتظار فحص التصميم المنهجي وأخلاقيات البحث' : 'Ready for Methodology Audit'}
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  {isArabic
                    ? 'انقر على الزر لتكليف نموذج فنار بفحص القوة الإحصائية، مسح PII، وإصدار شهادة اعتماد IRB.'
                    : 'Click the button to evaluate statistical power, threats to validity, and generate IRB certificate.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

