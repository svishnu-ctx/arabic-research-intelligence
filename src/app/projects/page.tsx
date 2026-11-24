'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import {
  FolderKanban,
  Plus,
  Calendar,
  BookOpen,
  LineChart,
  Lightbulb,
  GraduationCap,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Download,
  FileText,
  AlertTriangle,
  History,
  KeyRound,
  Check
} from 'lucide-react';

interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  status: 'Allowed' | 'Protected' | 'Flagged';
}

interface Project {
  id: string;
  title: string;
  titleAr?: string;
  researchField: string;
  academicLevel: string;
  completionProgress: number;
  dataClassification: 'Restricted' | 'Internal' | 'Public';
  encryptionAtRest: boolean;
  exportRestricted: boolean;
  auditLogs?: SecurityAuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsManagementPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // ALW-201: Export & Security Override Modal State
  const [exportModalProject, setExportModalProject] = useState<Project | null>(null);
  const [overrideCode, setOverrideCode] = useState<string>('');
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Security Audit Drawer
  const [activeAuditProject, setActiveAuditProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/research-projects');
      if (res.ok) {
        const data = await res.json();
        const list = data.projects || [];
        setProjects(list);
        if (list.length > 0 && !selectedProjectId) {
          setSelectedProjectId(list[0].id);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleUpdateClassification = async (projectId: string, newLevel: 'Restricted' | 'Internal' | 'Public') => {
    try {
      const res = await fetch(`/api/research-projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataClassification: newLevel,
          exportRestricted: newLevel !== 'Public',
        }),
      });
      if (res.ok) {
        await loadProjects();
      }
    } catch {
      alert('Failed to update classification');
    }
  };

  const handleExportRequest = async (projectId: string) => {
    setExportLoading(true);
    setExportMessage(null);

    try {
      const res = await fetch(`/api/research-projects/${projectId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supervisorOverrideCode: overrideCode.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setExportMessage({
          success: true,
          text: isArabic
            ? 'تم اعتماد التصدير بنجاح بموافقة المشرف الأكاديمي. تم تسجيل العملية في سجل التدقيق.'
            : 'Export approved under Al-Waha Data Boundary. Security audit entry recorded.',
        });
        await loadProjects();
      } else {
        setExportMessage({
          success: false,
          text: data.error || (isArabic
            ? 'ممنوع: يتطلب تصدير ملفات البحث المصنفة (Restricted) موافقة وتوقيع المشرف الأكاديمي (د. فاطمة الزهراء).'
            : 'Prohibited: Secondary supervisor authorization required for Restricted research files.'),
        });
        await loadProjects();
      }
    } catch {
      setExportMessage({
        success: false,
        text: 'Network error during export verification.',
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>{isArabic ? 'بيئة الأبحاث المحمية (Protected Research Workspace)' : 'Protected Research Workspace'}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'مشاريعي الأكاديمية ونطاق الحماية' : 'My Research Projects & Security Boundaries'}
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            {isArabic
              ? 'إدارة حدود أمان البيانات الأكاديمية (Public, Internal, Restricted)، مع تشفير تام أثناء السكون ومنع التسريب أو النسخ الخارجي دون موافقة المشرف.'
              : 'Classify research datasets, enforce AES-256 encryption-at-rest, and restrict unauthorized data leakage.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'مشروع بحثي جديد' : 'New Research Project'}</span>
          </Link>
        </div>
      </div>

      {/* Security Governance Indicator Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">{isArabic ? 'نطاق البحث المقيد (Restricted)' : 'Restricted Projects'}</span>
            <Lock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-900 dark:text-rose-200">
            {projects.filter((p) => p.dataClassification === 'Restricted').length} مشاريع
          </div>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
            {isArabic ? 'تشفير AES-256 · موافقة المشرف إلزامية للتصدير' : 'AES-256 Encrypted · Supervisor approval required'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">{isArabic ? 'نطاق داخلي (Campus Internal)' : 'Campus Internal'}</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-900 dark:text-amber-200">
            {projects.filter((p) => p.dataClassification === 'Internal').length} مشاريع
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
            {isArabic ? 'محصور داخل شبكة جامعة الواحة فقط' : 'Accessible strictly within Al-Waha University'}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{isArabic ? 'سجل التدقيق الأمني (Audit Logs)' : 'Security Audit Records'}</span>
            <History className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-900 dark:text-emerald-200">
            {projects.reduce((acc, p) => acc + (p.auditLogs?.length || 0), 0)} عمليات
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
            {isArabic ? 'توثيق فوري للقراءة، الاستعلام، والتصدير' : 'Immutable audit trail of reads, queries & exports'}
          </p>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isRestricted = proj.dataClassification === 'Restricted';
          const isInternal = proj.dataClassification === 'Internal';

          return (
            <div
              key={proj.id}
              className={`rounded-3xl border p-6 bg-white dark:bg-slate-850 shadow-sm transition flex flex-col justify-between ${
                isRestricted
                  ? 'border-rose-200 dark:border-rose-900/40'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Classification and Level Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {isRestricted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:text-rose-300">
                        <Lock className="w-3 h-3 text-rose-600" />
                        <span>Restricted</span>
                      </span>
                    ) : isInternal ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        <span>Internal</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Public</span>
                      </span>
                    )}

                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {proj.academicLevel}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    AES-256
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {proj.title}
                  </h3>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {proj.researchField}
                  </div>
                </div>

                {/* Classification Switcher Pill */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isArabic ? 'تعديل مستوى تصنيف الأمان:' : 'Data Classification:'}
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
                    {(['Restricted', 'Internal', 'Public'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => handleUpdateClassification(proj.id, level)}
                        className={`py-1 rounded-lg border text-center transition ${
                          proj.dataClassification === level
                            ? level === 'Restricted'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : level === 'Internal'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveAuditProject(proj)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                >
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isArabic ? 'سجل التدقيق' : 'Audit Logs'}</span>
                  {proj.auditLogs && proj.auditLogs.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">
                      {proj.auditLogs.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setExportModalProject(proj);
                    setOverrideCode('');
                    setExportMessage(null);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition shadow-sm ${
                    isRestricted
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تصدير الحزمة' : 'Export'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPORT AUTHORIZATION MODAL (ALW-201) */}
      {exportModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  exportModalProject.dataClassification === 'Restricted'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                }`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Al-Waha Data Boundary Guardrail
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isArabic ? 'فحص تخويل تصدير البيانات' : 'Data Export Governance Check'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setExportModalProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="text-slate-400">{isArabic ? 'المشروع المستهدف:' : 'Target Project:'}</div>
              <div className="font-bold text-slate-900 dark:text-white">{exportModalProject.title}</div>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="font-semibold text-rose-600">Classification: {exportModalProject.dataClassification}</span>
                <span>•</span>
                <span className="text-slate-500">AES-256 Encrypted</span>
              </div>
            </div>

            {exportModalProject.dataClassification === 'Restricted' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                  {isArabic
                    ? 'هذا المشروع مصنف "Restricted" (مقيد). وفق سياسة جامعة الواحة، يمنع تصدير مسودات الأطروحة أو البيانات غير المنشورة إلا برمز اعتماد المشرف الأكاديمي (د. فاطمة الزهراء).'
                    : 'This project is tagged Restricted. University policy prohibits external export of unpublished drafts without secondary supervisor signature.'}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {isArabic ? 'رمز اعتماد المشرف الأكاديمي (Supervisor Code) *' : 'Supervisor Override Signature *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={overrideCode}
                      onChange={(e) => setOverrideCode(e.target.value)}
                      placeholder="e.g. ALWAHA-SUP-2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => setOverrideCode('ALWAHA-SUP-2026')}
                      className="absolute end-2 top-2 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    >
                      {isArabic ? 'تعبئة تجريبية' : 'Quick Demo Code'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic
                  ? 'هذا المشروع غير مقيد، ويمكن تصدير حزمة المراجع والملخصات مباشرة.'
                  : 'This project is non-restricted. Exporting bundle is permitted.'}
              </p>
            )}

            {exportMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium ${
                exportMessage.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}>
                {exportMessage.text}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExportModalProject(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleExportRequest(exportModalProject.id)}
                disabled={exportLoading}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md disabled:opacity-50"
              >
                {exportLoading ? (isArabic ? 'جاري التحقق...' : 'Verifying...') : (isArabic ? 'تأكيد التصدير' : 'Verify & Export')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY AUDIT LOG DRAWER */}
      {activeAuditProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {isArabic ? 'سجل التدقيق الأمني ومراقبة النفاذ' : 'Security Audit Trail'}
                  </h3>
                  <p className="text-xs text-slate-500">{activeAuditProject.title}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveAuditProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {activeAuditProject.auditLogs && activeAuditProject.auditLogs.length > 0 ? (
                activeAuditProject.auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          log.status === 'Allowed' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        {log.action}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'Allowed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300">{log.details}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span>{log.actor}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  {isArabic ? 'لا توجد سجلات أمنية مسجلة بعد لهذا المشروع.' : 'No audit records yet.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
