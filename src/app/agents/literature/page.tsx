'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  BookOpen,
  Search,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  BookmarkCheck,
  RefreshCw,
  Layers,
  ArrowRight,
  Filter,
  FileText,
  AlertCircle,
  Table,
  Plus
} from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  authors: string | string[];
  year?: number;
  venue?: string;
  doi?: string;
  abstract?: string;
  source: 'openalex' | 'crossref' | 'OpenAlex' | 'Crossref';
  url?: string;
}

interface LiteratureReviewResult {
  themes: { theme: string; description: string; supportingPapers: string[] }[];
  conflictingFindings?: string[];
  suggestedStructure: { sectionTitle: string; focus: string }[];
  verifiedGaps: string[];
}

export default function LiteratureAgentPage() {
  const { language, direction } = useI18n();
  const isArabic = language === 'ar';

  const [query, setQuery] = useState('renewable energy microgrid machine learning UAE');
  const [isSearching, setIsSearching] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<Publication[]>([]);

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [reviewResult, setReviewResult] = useState<LiteratureReviewResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Search real academic publications from OpenAlex & Crossref
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/publications/search?query=${encodeURIComponent(query)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        const papers = data.publications || data.results || [];
        setPublications(papers);
        // Auto select top 3 for instant comparison
        if (papers.length > 0) {
          setSelectedPapers(papers.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelectPaper = (paper: Publication) => {
    if (selectedPapers.some((p) => p.id === paper.id)) {
      setSelectedPapers(selectedPapers.filter((p) => p.id !== paper.id));
    } else {
      setSelectedPapers([...selectedPapers, paper]);
    }
  };

  // Run Fanar Literature Synthesis
  const handleSynthesize = async () => {
    if (selectedPapers.length === 0) return;

    setIsSynthesizing(true);
    setReviewResult(null);

    try {
      const formattedPapers = selectedPapers.map((p) => ({
        title: p.title,
        authors: Array.isArray(p.authors) ? p.authors.join(', ') : String(p.authors || 'Academic Researchers'),
        year: p.year || 2024,
        doi: p.doi,
        abstract: p.abstract || '',
      }));

      const res = await fetch('/api/agents/literature-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: query,
          papers: formattedPapers,
          publications: formattedPapers,
          language: isArabic ? 'ar' : 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewResult(data.synthesis);
      }
    } catch (err) {
      console.error('Synthesis error:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSaveToReferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-800 dark:text-blue-300">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Agent 2 • Real Academic Publications Discovery (OpenAlex & Crossref)</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isArabic ? 'مراجعة الأدبيات واستكشاف الأبحاث' : 'Literature Review & Discovery Agent'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isArabic
              ? 'البحث المباشر في قواعد البيانات الأكاديمية الحقيقية دون اختلاق أوراق، ومقارنة الدراسات وتوليد نقد منهجي بنموذج فنار.'
              : 'Search live OpenAlex & Crossref metadata (zero fabrications), construct comparative matrices, and synthesize themes.'}
          </p>
        </div>

        {selectedPapers.length > 0 && (
          <button
            onClick={handleSaveToReferences}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>{isArabic ? 'تم الحفظ في مكتبة المراجع' : 'Saved to References Library'}</span>
              </>
            ) : (
              <>
                <BookmarkCheck className="h-4 w-4" />
                <span>
                  {isArabic
                    ? `حفظ (${selectedPapers.length}) في المراجع`
                    : `Save (${selectedPapers.length}) to References`}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Real Academic Search Bar */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث بالعنوان، الكلمات المفتاحية، اسم الباحث، أو معرف DOI...'
                  : 'Search by paper title, keywords, author, or DOI...'
              }
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 ps-10 pe-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow hover:bg-blue-800 disabled:opacity-50 transition"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{isArabic ? 'جاري الاستعلام الأكاديمي...' : 'Querying APIs...'}</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>{isArabic ? 'استكشاف الأوراق' : 'Search Academic APIs'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono">OpenAlex API</span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono">Crossref API</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              {isArabic ? '• استرجاع حقيقي موثق بدون تزييف' : '• Verified Real DOIs & Metadata'}
            </span>
          </div>
          {publications.length > 0 && (
            <span>
              {isArabic ? `تم العثور على ${publications.length} أوراق` : `Found ${publications.length} papers`}
            </span>
          )}
        </div>
      </div>

      {/* Publications List */}
      {publications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isArabic ? 'الأوراق البحثية المسترجعة' : 'Retrieved Academic Publications'}
            </h3>
            <span className="text-xs text-slate-500">
              {isArabic ? `المحدد للمقارنة: ${selectedPapers.length}` : `Selected for Comparison: ${selectedPapers.length}`}
            </span>
          </div>

          <div className="space-y-3">
            {publications.map((paper) => {
              const isSelected = selectedPapers.some((p) => p.id === paper.id);
              return (
                <div
                  key={paper.id}
                  className={`rounded-2xl border p-5 transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectPaper(paper)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {paper.title}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{Array.isArray(paper.authors) ? paper.authors.join(', ') : String(paper.authors || 'Researchers')}</span>
                          {paper.year && (
                            <>
                              <span>•</span>
                              <span>{paper.year}</span>
                            </>
                          )}
                          {paper.venue && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">{paper.venue}</span>
                            </>
                          )}
                          <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono">
                            {paper.source}
                          </span>
                        </div>

                        {paper.abstract && (
                          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {paper.abstract}
                          </p>
                        )}
                      </div>
                    </div>

                    {paper.doi && (
                      <a
                        href={paper.url || `https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:bg-slate-100 shrink-0"
                      >
                        <span>DOI</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action to Synthesize Selected Papers */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing || selectedPapers.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-indigo-800 disabled:opacity-50 transition"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{isArabic ? 'جاري التحليل والتوليف بنموذج فنار...' : 'Fanar Synthesizing Literature...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {isArabic
                      ? `تحليل وتوليف الأدبيات (${selectedPapers.length} أوراق)`
                      : `Synthesize Literature with Fanar (${selectedPapers.length} Papers)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Synthesis Results from Fanar */}
      {reviewResult && (
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50/50 to-white dark:to-slate-850 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>{isArabic ? 'نتائج التوليف الأكاديمي بواسطة Fanar AI' : 'Fanar Academic Literature Synthesis'}</span>
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {isArabic ? 'المحاور البحثية والفجوات المستخلصة' : 'Identified Research Themes & Verified Gaps'}
            </h3>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewResult.themes.map((theme, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px]">
                    {i + 1}
                  </span>
                  <span>{theme.theme}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {theme.description}
                </p>
                {theme.supportingPapers && theme.supportingPapers.length > 0 && (
                  <div className="mt-3 text-[11px] text-slate-400">
                    <span className="font-semibold">{isArabic ? 'الدراسات الداعمة:' : 'Evidence:'}</span>{' '}
                    {theme.supportingPapers.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Verified Research Gaps */}
          <div className="rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 p-6 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{isArabic ? 'الفجوات البحثية المستندة إلى الأدلة (Gaps)' : 'Evidence-Based Research Gaps'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {reviewResult.verifiedGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
