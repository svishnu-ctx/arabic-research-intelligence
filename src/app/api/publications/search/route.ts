import { NextRequest, NextResponse } from 'next/server';
import { searchOpenAlex } from '@/lib/publications/openalex';
import { searchCrossref } from '@/lib/publications/crossref';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'artificial intelligence arabic higher education';
    const source = searchParams.get('source') || 'all';
    const limit = Number(searchParams.get('limit') || 10);

    let results = [];

    if (source === 'openalex') {
      results = await searchOpenAlex(query, limit);
    } else if (source === 'crossref') {
      results = await searchCrossref(query, limit);
    } else {
      const [oa, cr] = await Promise.all([
        searchOpenAlex(query, Math.ceil(limit / 2)),
        searchCrossref(query, Math.ceil(limit / 2)),
      ]);
      results = [...oa, ...cr];
    }

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
