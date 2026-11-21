import React from 'react';
import { ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { PhysicalQuoteStatus, ClaimSupportStatus } from '@/types';
import { useI18n } from '@/lib/i18n/context';

interface CitationBadgeProps {
  pageNumber: number;
  quotedSnippet?: string;
  quoteStatus?: PhysicalQuoteStatus;
  claimStatus?: ClaimSupportStatus;
  onClick?: () => void;
}

export function CitationBadge({
  pageNumber,
  quotedSnippet,
  quoteStatus = 'QUOTE_VERIFIED',
  claimStatus = 'CLAIM_SUPPORTED',
  onClick,
}: CitationBadgeProps) {
  const { t } = useI18n();

  const isQuoteMatch = quoteStatus === 'QUOTE_VERIFIED';
  const isClaimSupported = claimStatus === 'CLAIM_SUPPORTED';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-pointer transition ${
        isQuoteMatch && isClaimSupported
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          : isQuoteMatch
          ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
          : 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100'
      }`}
      title={quotedSnippet ? `"${quotedSnippet}"` : undefined}
    >
      {isQuoteMatch && isClaimSupported ? (
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
      ) : isQuoteMatch ? (
        <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
      )}
      <span>
        {t.ai.physicalCitation}: {pageNumber}
      </span>
      {isQuoteMatch && (
        <span className="ms-1 rounded bg-white/70 px-1 py-0.2 text-[10px] font-semibold">
          {t.ai.verifiedQuote}
        </span>
      )}
    </div>
  );
}
