import { normalizeArabic } from '@/lib/ai/arabic/normalize';
import { PhysicalQuoteStatus, ClaimSupportStatus } from '@/types';
import { DocumentMetadata } from '@/types';

export function verifyQuote(
  doc: DocumentMetadata,
  physicalPage: number,
  quotedSnippet: string
): PhysicalQuoteStatus {
  const page = doc.pages.find((p) => p.pageNumber === physicalPage);
  if (!page) return 'PAGE_NOT_FOUND';

  const normalizedPage = normalizeArabic(page.text).toLowerCase();
  const normalizedQuote = normalizeArabic(quotedSnippet).toLowerCase();

  if (normalizedPage.includes(normalizedQuote)) {
    return 'QUOTE_VERIFIED';
  }

  // Check word overlap ratio
  const quoteWords = normalizedQuote.split(/\s+/).filter((w: string) => w.length > 2);
  if (quoteWords.length === 0) return 'QUOTE_MISMATCH';

  let found = 0;
  for (const word of quoteWords) {
    if (normalizedPage.includes(word)) found++;
  }

  return (found / quoteWords.length) >= 0.8 ? 'QUOTE_VERIFIED' : 'QUOTE_MISMATCH';
}

export function evaluateClaimSupport(
  quoteStatus: PhysicalQuoteStatus,
  claimStatement: string,
  supportingText: string
): ClaimSupportStatus {
  if (quoteStatus !== 'QUOTE_VERIFIED') return 'CLAIM_UNSUPPORTED';
  return 'CLAIM_SUPPORTED';
}
