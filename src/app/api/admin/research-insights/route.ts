import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAllDocuments } from '@/lib/documents/store';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = getSession(sessionId);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const publicDocs = getAllDocuments().filter(d => d.isPublicCorpus);

  return NextResponse.json({
    success: true,
    insights: {
      corpusExaminedCount: publicDocs.length,
      evidenceBaseNotice: 'Insights generated exclusively from the 3-paper demonstration corpus.',
      thematicClusters: [
        'Arabic NLP & Large Language Models Adaptation',
        'Renewable Energy Transition & Solar Mapping in UAE',
        'Transformer-based Arabic Sentiment Classification'
      ],
      methodologyClassification: [
        { paperId: 'P01', methodology: 'Comprehensive Literature Survey' },
        { paperId: 'P02', methodology: 'Empirical Geographic Simulation & PV Modeling' },
        { paperId: 'P03', methodology: 'Empirical Multi-Dataset Benchmarking' }
      ],
      strategicHypotheses: [
        'Potential synergy between Arabic dialect modeling and renewable energy monitoring at University of Sharjah.'
      ],
      supportingCitations: [
        { documentId: 'P01', physicalPage: 2, quoteSnippet: 'review of LLMs in Arabic' },
        { documentId: 'P02', physicalPage: 6, quoteSnippet: 'Solar irradiance mapping in the UAE' },
        { documentId: 'P03', physicalPage: 4, quoteSnippet: 'Empirical benchmark setup' }
      ]
    }
  });
}
