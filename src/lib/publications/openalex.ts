/**
 * OpenAlex Academic Search Integration
 * OpenAlex is a free, open catalog of world research publications.
 * Endpoint: https://api.openalex.org/works
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

export async function searchOpenAlex(query: string, limit: number = 8): Promise<AcademicPaperResult[]> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://api.openalex.org/works?search=${encoded}&per_page=${limit}`, {
      headers: {
        'User-Agent': 'UniversityOfSharjah-StudentResearchAI/1.0 (mailto:student@sharjah.ac.ae)'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) return [];

    const data = await res.json();
    const results: AcademicPaperResult[] = [];

    for (const work of data.results || []) {
      const authors = (work.authorships || [])
        .map((a: any) => a.author?.display_name)
        .filter(Boolean)
        .slice(0, 4)
        .join(', ');

      // Reconstruct inverted abstract if provided
      let abstract = '';
      if (work.abstract_inverted_index) {
        const words: Array<[string, number]> = [];
        for (const [word, positions] of Object.entries(work.abstract_inverted_index)) {
          for (const pos of positions as number[]) {
            words.push([word, pos]);
          }
        }
        words.sort((a, b) => a[1] - b[1]);
        abstract = words.slice(0, 100).map(w => w[0]).join(' ') + '...';
      }

      results.push({
        id: work.id || `oa_${Math.random()}`,
        title: work.title || 'Untitled Academic Paper',
        authors: authors || 'Academic Researchers',
        year: work.publication_year || undefined,
        venue: work.primary_location?.source?.display_name || 'Academic Venue',
        doi: work.doi ? work.doi.replace('https://doi.org/', '') : undefined,
        abstract: abstract || undefined,
        url: work.doi || work.id,
        source: 'openalex'
      });
    }

    return results;
  } catch {
    return [];
  }
}
