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
  Check,
  X,
  Sparkles
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
  academicLevel: 'Undergraduate' | 'Masters' | 'PhD' | string;
  description?: string;
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

  // Create Project Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newField, setNewField] = useState('Artificial Intelligence & Computing');
  const [newLevel, setNewLevel] = useState<'Masters' | 'PhD' | 'Undergraduate'>('Masters');
  const [newClassification, setNewClassification] = useState<'Restricted' | 'Internal' | 'Public'>('Restricted');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Edit Project Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editField, setEditField] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/research-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          titleAr: newTitleAr.trim() || newTitle.trim(),
          researchField: newField,
          academicLevel: newLevel,
          dataClassification: newClassification,
          description: newDescription.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionSuccessMsg(
          isArabic
            ? `تم إنشاء المشروع البحثي "${data.project.title}" بنجاح!`
            : `Project "${data.project.title}" created successfully!`
        );
        setShowCreateModal(false);
        setNewTitle('');
        setNewTitleAr('');
        setNewDescription('');
        await loadProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!confirm(isArabic ? `هل أنت متأكد من حذف المشروع "${projectTitle}"؟` : `Delete project "${projectTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/research-projects/${projectId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActionSuccessMsg(
          isArabic
            ? `تم حذف المشروع بنجاح.`
            : `Project deleted successfully.`
        );
        await loadProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/research-projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          researchField: editField,
        }),
      });
      if (res.ok) {
        setActionSuccessMsg(isArabic ? 'تم تحديث بيانات المشروع بنجاح!' : 'Project updated successfully!');
        setEditingProject(null);
        await loadProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingEdit(false);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleUpdateClassification = async (projectId: string, newLevel: 'Restricted' | 'Internal' | 'Public') => {
    try {
      const res = await fetch(`/api/research-projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataClassification: newLevel,
        }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  dataClassification: newLevel,
                  exportRestricted: newLevel !== 'Public',
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Update classification error:', err);
    }
  };

  const handleExportWithOverride = async () => {
    if (!exportModalProject) return;

    setExportLoading(true);
    setExportMessage(null);

    try {
      const res = await fetch(`/api/research-projects/${exportModalProject.id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overrideCode: overrideCode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setExportMessage({
          success: true,
          text: isArabic
            ? `تم الاعتماد وتنزيل الحزمة الأكاديمية المشفرة بنجاح (Hash: ${data.exportHash?.slice(0, 10)}...).`
            : `Authorized! Encrypted research bundle downloaded successfully (Hash: ${data.exportHash?.slice(0, 10)}...).`,
        });

        const blob = new Blob([JSON.stringify(data.bundle, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AlWaha_${exportModalProject.title.replace(/\s+/g, '_')}_Bundle.json`;
        a.click();
        URL.revokeObjectURL(url);

        loadProjects();
      } else {
        setExportMessage({
          success: false,
          text: data.error || (isArabic ? 'رمز المشرف غير صالح. تم تسجيل محاولة غير مصرح بها في سجل الأمان.' : 'Invalid supervisor override code.'),
        });
      }
    } catch {
      setExportMessage({
        success: false,
        text: isArabic ? 'حدث خطأ في الاتصال بالخادم.' : 'Connection error during export.',
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
              ? 'إنشاء وإدارة حدود أمان المشاريع البحثية (Public, Internal, Restricted)، مع تشفير تام أثناء السكون ومنع التسريب دون موافقة المشرف.'
              : 'Create, edit, classify datasets, enforce AES-256 encryption-at-rest, and prevent data leakage.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? 'مشروع بحثي جديد' : 'New Research Project'}</span>
          </button>
        </div>
      </div>

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

      {/* Security Governance Indicator Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">{isArabic ? 'نطاق البحث المقيد (Restricted)' : 'Restricted Projects'}</span>
            <Lock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-900 dark:text-rose-200">
            {projects.filter((p) => p.dataClassification === 'Restricted').length} {isArabic ? 'مشاريع' : 'projects'}
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
            {projects.filter((p) => p.dataClassification === 'Internal').length} {isArabic ? 'مشاريع' : 'projects'}
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
            {projects.reduce((acc, p) => acc + (p.auditLogs?.length || 0), 0)} {isArabic ? 'عمليات' : 'events'}
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
            {isArabic ? 'توثيق فوري للقراءة، الاستعلام، والتصدير' : 'Immutable audit trail of reads, queries & exports'}
          </p>
        </div>
      </div>

      {/* Projects List Grid */}
      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {isArabic ? 'لا توجد مشاريع بحثية حالياً' : 'No research projects found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {isArabic ? 'ابدأ بإنشاء أول مشروع بحثي في بيئة أمان جامعة الواحة.' : 'Start by creating your first academic project.'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إنشاء مشروع جديد' : 'Create Project'}</span>
          </button>
        </div>
      ) : (
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

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setEditTitle(proj.title);
                          setEditField(proj.researchField);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                        title={isArabic ? 'تعديل بيانات المشروع' : 'Edit Project'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600"
                        title={isArabic ? 'حذف المشروع' : 'Delete Project'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {isArabic ? 'إنشاء مشروع بحثي جديد في جامعة الواحة' : 'Create New Research Project'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'عنوان المشروع (الإنجليزية أو العربية):' : 'Project Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sovereign Arabic Speech Recognition using Conformer Architectures"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'العنوان بالعربية (اختياري):' : 'Arabic Title (Optional):'}
                </label>
                <input
                  type="text"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  placeholder="مثال: التعرف الآلي على الكلام العربي السيادي باستخدام معمارية الكونفورمر"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'مجال البحث:' : 'Research Field:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newField}
                    onChange={(e) => setNewField(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'المرحلة الأكاديمية:' : 'Degree Level:'}
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e: any) => setNewLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-emerald-500"
                  >
                    <option value="Masters">Masters (ماجستير)</option>
                    <option value="PhD">PhD (دكتوراه)</option>
                    <option value="Undergraduate">Undergraduate (بكالوريوس)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'مستوى تصنيف أمان البيانات:' : 'Initial Data Classification:'}
                </label>
                <select
                  value={newClassification}
                  onChange={(e: any) => setNewClassification(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-emerald-500"
                >
                  <option value="Restricted">Restricted (مقيد - تشفير تام وإذن تصدير مشدد)</option>
                  <option value="Internal">Internal (داخلي - محصور في شبكة جامعة الواحة)</option>
                  <option value="Public">Public (عام - متاح للتبادل الأكاديمي المفتوح)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm disabled:opacity-50"
                >
                  {isCreating ? (isArabic ? 'جارِ الحفظ...' : 'Saving...') : (isArabic ? 'حفظ وإنشاء المشروع' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isArabic ? 'تعديل بيانات المشروع البحثي' : 'Edit Project Details'}
              </h3>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'عنوان المشروع:' : 'Project Title:'}
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'مجال البحث الأكاديمي:' : 'Research Field:'}
                </label>
                <input
                  type="text"
                  value={editField}
                  onChange={(e) => setEditField(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-3 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="px-4 py-1.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm"
              >
                {isSavingEdit ? (isArabic ? 'جارِ الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التعديل' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT OVERRIDE MODAL */}
      {exportModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {isArabic ? 'تصريح تصدير البيانات المقيدة' : 'Supervisor Export Authorization'}
                </h3>
              </div>
              <button
                onClick={() => setExportModalProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isArabic
                  ? `مشروع "${exportModalProject.title}" خاضع لتصنيف الأمان (${exportModalProject.dataClassification}). لتصدير الحزمة الأكاديمية خارج بيئة جامعة الواحة، يجب إدخال رمز اعتماد المشرف الأكاديمي.`
                  : `Project "${exportModalProject.title}" is classified as ${exportModalProject.dataClassification}. To export this research bundle, enter the authorized supervisor override code.`}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isArabic ? 'رمز المشرف التجريبي للاختبار:' : 'Demo Supervisor Code:'}
                </span>
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ALWAHA-SUP-2026
                  </code>
                  <button
                    onClick={() => setOverrideCode('ALWAHA-SUP-2026')}
                    className="text-[11px] text-emerald-600 hover:underline font-bold"
                  >
                    {isArabic ? 'إدراج الرمز تلقائياً' : 'Auto-fill Code'}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'أدخل رمز تفويض المشرف:' : 'Supervisor Authorization Code:'}
                </label>
                <input
                  type="text"
                  value={overrideCode}
                  onChange={(e) => setOverrideCode(e.target.value)}
                  placeholder="e.g. ALWAHA-SUP-2026"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono text-xs outline-none focus:border-emerald-500 uppercase"
                />
              </div>

              {exportMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    exportMessage.success
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
                  }`}
                >
                  {exportMessage.text}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setExportModalProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleExportWithOverride}
                disabled={exportLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {exportLoading
                    ? (isArabic ? 'جارِ التحقق...' : 'Verifying...')
                    : (isArabic ? 'اعتماد وتصدير' : 'Authorize & Export')}
                </span>
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
