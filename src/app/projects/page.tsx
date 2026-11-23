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
  Layers
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  field: string;
  academicLevel: string;
  preferredLanguage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsManagementPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/research-projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects && data.projects.length > 0) {
          setSelectedProjectId(data.projects[0].id);
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

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>{isArabic ? 'إدارة المشاريع البحثية' : 'Research Projects Workspace'}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'مشاريعي الأكاديمية' : 'My Research Projects'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'مستودع المشاريع البحثية المشتركة التي تربط الوكلاء الأربعة والمستندات والتحليلات.'
              : 'Unified project workspace shared across the 4 research AI agents, datasets, and thesis drafts.'}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>{isArabic ? 'مشروع جديد' : 'New Project'}</span>
        </Link>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`rounded-3xl border p-6 bg-white dark:bg-slate-850 shadow-sm cursor-pointer transition ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                  {proj.academicLevel}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(proj.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                {proj.title}
              </h3>

              <div className="mt-2 text-xs text-slate-500 line-clamp-1">
                {proj.field}
              </div>

              {/* Agents Shortcuts */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700 dark:text-emerald-400">
                  {isArabic ? 'الوكلاء الأربعة متصلين' : '4 Agents Connected'}
                </span>
                <Link
                  href="/agents/proposal"
                  className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-emerald-600"
                >
                  <span>{isArabic ? 'دخول' : 'Open'}</span>
                  <ChevronRight className={`h-3.5 w-3.5 ${isArabic ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
