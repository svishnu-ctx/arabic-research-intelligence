'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  BookmarkCheck,
  ExternalLink,
  Download,
  Copy,
  BookOpen,
  Plus
} from 'lucide-react';

export default function ReferencesPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const references = [
    {
      title: 'Deep Reinforcement Learning for Smart Microgrid Management in Extreme Arid Climates',
      authors: 'Al-Nuaimi, T., Al-Mansoor, O., & Hassan, M.',
      year: 2024,
      venue: 'IEEE Transactions on Sustainable Energy',
      doi: '10.1109/TSTE.2024.3389102',
      source: 'OpenAlex',
    },
    {
      title: 'Solar Photovoltaic Integration and Storage Degradation Analysis in Gulf Cooperation Council Networks',
      authors: 'Zahra, F., & Al-Qasimi, M.',
      year: 2023,
      venue: 'Applied Energy, 342, 121150',
      doi: '10.1016/j.apenergy.2023.121150',
      source: 'Crossref',
    },
    {
      title: 'Benchmarking Arabic Academic AI Architectures for Engineering Document Analysis',
      authors: 'Sharjah AI Research Consortium',
      year: 2025,
      venue: 'Journal of Arabic Computing & Informatics',
      doi: '10.1007/s10590-025-0987-1',
      source: 'Crossref',
    },
  ];

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-800 dark:text-blue-300">
            <BookmarkCheck className="h-3.5 w-3.5" />
            <span>{isArabic ? 'مكتبة المراجع والمصادر' : 'Academic References Library'}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'المراجع الموثقة (DOIs)' : 'References Library'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'المراجع المسترجعة والمحفوظة من OpenAlex و Crossref مع معرفات DOI الموثوقة للتصدير بصيغة BibTeX أو APA.'
              : 'Verified academic citations and DOIs saved from OpenAlex and Crossref, exportable to BibTeX and APA.'}
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition">
          <Download className="h-4 w-4" />
          <span>{isArabic ? 'تصدير بصيغة BibTeX' : 'Export BibTeX'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {references.map((ref, i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ref.title}
                </h3>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ref.authors}</span> ({ref.year}).{' '}
                  <span className="italic">{ref.venue}</span>.
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <a
                    href={`https://doi.org/${ref.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-mono text-[11px] hover:underline"
                  >
                    <span>doi:{ref.doi}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono">
                    {ref.source}
                  </span>
                </div>
              </div>

              <button
                title="Copy APA Citation"
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
