/**
 * Crossref Academic Metadata Search Integration
 * Endpoint: https://api.crossref.org/works
 */

export interface AcademicPaperResult {
  id: string;
  title: string;
  authors: string;
  year?: number;
  venue?: string;
  doi?: string;
  abstract?: string;
  url?: string;
  source: 'openalex' | 'crossref';
}

export async function searchCrossref(query: string, limit: number = 6): Promise<AcademicPaperResult[]> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://api.crossref.org/works?query=${encoded}&rows=${limit}`, {
      headers: {
        'User-Agent': 'AlWahaUniversity-AI/1.0 (mailto:student@alwaha.ac.ae)'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items = data.message?.items || [];
    const results: AcademicPaperResult[] = [];

    for (const item of items) {
      const authors = (item.author || [])
        .map((a: any) => `${a.given || ''} ${a.family || ''}`.trim())
        .filter(Boolean)
        .slice(0, 4)
        .join(', ');

      const year = item.issued?.['date-parts']?.[0]?.[0];

      results.push({
        id: item.DOI ? `cr_${item.DOI}` : `cr_${Math.random()}`,
        title: Array.isArray(item.title) ? item.title[0] : item.title || 'Academic Paper',
        authors: authors || 'Researchers',
        year: typeof year === 'number' ? year : undefined,
        venue: Array.isArray(item['container-title']) ? item['container-title'][0] : item['container-title'],
        doi: item.DOI || undefined,
        abstract: item.abstract ? item.abstract.replace(/<[^>]*>/g, '').slice(0, 300) + '...' : undefined,
        url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : undefined),
        source: 'crossref'
      });
    }

    return results;
  } catch {
    return [];
  }
}
