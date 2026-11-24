'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  FileText,
  Download,
  Eye,
  Plus,
  Trash2,
  Calendar,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

export default function DocumentsPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const documents = [
    {
      name: 'Al_Waha_Solar_Microgrids_Proposal_v2.pdf',
      type: isArabic ? 'مقترح بحثي' : 'Research Proposal',
      size: '2.4 MB',
      updatedAt: '2026-11-22',
      status: isArabic ? 'معتمد من المشرف' : 'Approved by Supervisor',
    },
    {
      name: 'Methodology_Architecture_Diagram.png',
      type: isArabic ? 'مخطط معماري / رسم' : 'Figure / Diagram',
      size: '1.1 MB',
      updatedAt: '2026-11-21',
      status: isArabic ? 'مسودة أولية' : 'Draft',
    },
    {
      name: 'alwaha_solar_microgrid_dataset_2025.csv',
      type: isArabic ? 'مجموعة بيانات' : 'Dataset',
      size: '480 KB',
      updatedAt: '2026-11-20',
      status: isArabic ? 'تم التحليل' : 'Analyzed',
    },
    {
      name: 'Thesis_Chapter_1_and_2_Draft.docx',
      type: isArabic ? 'مسودة فصول الأطروحة' : 'Thesis Draft',
      size: '3.8 MB',
      updatedAt: '2026-11-19',
      status: isArabic ? 'قيد المراجعة' : 'In Review',
    },
  ];

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <FileText className="h-3.5 w-3.5" />
            <span>{isArabic ? 'المستودع الأكاديمي' : 'Academic Documents Repository'}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'المستندات البحثية' : 'Research Documents'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'إدارة وحفظ ملفات المقترح، المسودات، مجموعات البيانات، وفصول الأطروحة.'
              : 'Manage and archive research proposals, draft chapters, figures, and datasets.'}
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition">
          <Plus className="h-4 w-4" />
          <span>{isArabic ? 'رفع مستند بحثي' : 'Upload Document'}</span>
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'اسم المستند' : 'Document Name'}
              </th>
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'النوع' : 'Type'}
              </th>
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'الحجم' : 'Size'}
              </th>
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'تاريخ التحديث' : 'Last Modified'}
              </th>
              <th className="pb-3 text-start font-semibold">
                {isArabic ? 'الحالة' : 'Status'}
              </th>
              <th className="pb-3 text-end font-semibold">
                {isArabic ? 'إجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {documents.map((doc, i) => (
              <tr key={i} className="text-slate-700 dark:text-slate-300">
                <td className="py-3 font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-xs">{doc.name}</span>
                </td>
                <td className="py-3 text-slate-500">{doc.type}</td>
                <td className="py-3 text-slate-500 font-mono">{doc.size}</td>
                <td className="py-3 text-slate-500">{doc.updatedAt}</td>
                <td className="py-3">
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    {doc.status}
                  </span>
                </td>
                <td className="py-3 text-end">
                  <button className="rounded-lg p-1.5 text-slate-400 hover:text-emerald-600 transition">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
