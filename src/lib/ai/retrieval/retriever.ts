import { tokenizeText } from '@/lib/ai/arabic/normalize';
import { DocumentMetadata } from '@/types';

export interface RetrievedPassage {
  documentId: string;
  documentTitle: string;
  physicalPage: number;
  text: string;
  score: number;
}

export function retrievePassages(
  docs: DocumentMetadata[],
  query: string,
  topK = 5
): RetrievedPassage[] {
  const queryTokens = tokenizeText(query);
  if (queryTokens.length === 0) return [];

  const results: RetrievedPassage[] = [];

  for (const doc of docs) {
    for (const page of doc.pages) {
      const pageTokens = tokenizeText(page.text);
      if (pageTokens.length === 0) continue;

      let matchCount = 0;
      for (const qToken of queryTokens) {
        if (pageTokens.includes(qToken)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        const score = matchCount / (queryTokens.length + 0.1);
        results.push({
          documentId: doc.id,
          documentTitle: doc.title,
          physicalPage: page.pageNumber,
          text: page.text,
          score
        });
      }
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}
