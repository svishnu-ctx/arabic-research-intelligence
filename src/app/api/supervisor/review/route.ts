import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDocumentById } from '@/lib/documents/store';
import { authorizeDocumentAccess } from '@/lib/auth/authorize';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = getSession(sessionId);
  if (!session || (session.user.role !== 'supervisor' && session.user.role !== 'admin')) {
    return NextResponse.json({ error: 'Supervisor or Admin access required' }, { status: 403 });
  }

  const { documentId } = await req.json();
  const doc = getDocumentById(documentId || 'P01');

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const auth = authorizeDocumentAccess(session.user, doc, 'read');
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized to review this manuscript' }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    critique: {
      documentTitle: doc.title,
      overallAssessment: 'The manuscript presents a structured academic inquiry with clear objectives.',
      methodologyCritique: 'The empirical evaluation uses standard benchmarks but lacks cross-validation on dialectal variants.',
      strengths: [
        'Rigorous baseline benchmarking against established transformer architectures',
        'Clear problem formulation in the context of Arabic computational linguistics'
      ],
      weaknesses: [
        'Limited evaluation on informal and mixed-script Arabizi text',
        'Absence of ablation study for attention heads'
      ],
      defenseQuestions: [
        'How does your model handle code-switching between Modern Standard Arabic and regional dialects?',
        'What mitigation strategies were adopted to address out-of-vocabulary terms in morphology?',
        'How would the computational overhead scale when deployed in live low-latency environments?',
        'Why was BLEU prioritized over human semantic evaluation for generated Arabic summaries?'
      ],
      citations: [
        { physicalPage: 8, quoteSnippet: 'Dialectal Arabic datasets deficiency' },
        { physicalPage: 14, quoteSnippet: 'Computational cost of pretraining LLMs' }
      ]
    }
  });
}
