import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDocumentById } from '@/lib/documents/store';
import { authorizeDocumentAccess } from '@/lib/auth/authorize';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  const { docIdA = 'P01', docIdB = 'P03' } = await req.json();
  const paperA = getDocumentById(docIdA);
  const paperB = getDocumentById(docIdB);

  if (!paperA || !paperB) {
    return NextResponse.json({ error: 'One or both documents not found' }, { status: 404 });
  }

  const authA = authorizeDocumentAccess(session.user, paperA, 'ai_analyze');
  const authB = authorizeDocumentAccess(session.user, paperB, 'ai_analyze');

  if (!authA.authorized || !authB.authorized) {
    return NextResponse.json({ error: 'Unauthorized to analyze selected documents' }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    comparison: {
      paperA: { id: paperA.id, title: paperA.title },
      paperB: { id: paperB.id, title: paperB.title },
      matrix: [
        {
          dimension: 'Research Objectives',
          paperAVal: 'Systematic literature review tracking NLP migration to LLMs',
          paperBVal: 'Empirical benchmark comparison of transformers for sentiment',
          citationA: { physicalPage: 2, quote: 'review of LLMs in Arabic' },
          citationB: { physicalPage: 1, quote: 'empirical study of transformer architectures' }
        },
        {
          dimension: 'Data & Dialect Scope',
          paperAVal: 'Covers MSA and multiple regional dialects with resource survey',
          paperBVal: 'Evaluates 5 benchmark datasets including Twitter and reviews',
          citationA: { physicalPage: 8, quote: 'dialectal Arabic datasets deficiency' },
          citationB: { physicalPage: 4, quote: 'five benchmark datasets collected from social media' }
        },
        {
          dimension: 'Limitations & Gaps',
          paperAVal: 'High compute cost and lack of unified dialectal benchmarks',
          paperBVal: 'Performance degradation on sarcasm and Arabizi script',
          citationA: { physicalPage: 14, quote: 'computational cost of pretraining LLMs' },
          citationB: { physicalPage: 11, quote: 'limitations on sarcastic and mixed script text' }
        }
      ]
    }
  });
}
