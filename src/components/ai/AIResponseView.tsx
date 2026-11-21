'use client';

import React, { useState } from 'react';
import { Sparkles, Shield, Send, RotateCcw, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { CitationBadge } from './CitationBadge';

interface AIResponseViewProps {
  title: string;
  subtitle?: string;
  isStreaming?: boolean;
  onSendQuery?: (query: string) => void;
  disclaimerNotice?: string;
}

export function AIResponseView({
  title,
  subtitle,
  isStreaming = false,
  onSendQuery,
  disclaimerNotice,
}: AIResponseViewProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [mockOutput, setMockOutput] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSendQuery) onSendQuery(query);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-700" />
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
            <Shield className="h-3 w-3 text-emerald-600" />
            {t.ai.evidenceBased}
          </span>
        </div>
      </div>

      {disclaimerNotice && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
          <AlertCircle className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
          <span>{disclaimerNotice}</span>
        </div>
      )}

      {/* Query Bar */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.ai.placeholderQuestion}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
        />
        <button
          type="submit"
          disabled={isStreaming || !query.trim()}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" />
          <span>{t.common.submit}</span>
        </button>
      </form>
    </div>
  );
}
