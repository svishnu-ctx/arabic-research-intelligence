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

  const { documentId = 'P01' } = await req.json();
  const doc = getDocumentById(documentId);

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const auth = authorizeDocumentAccess(session.user, doc, 'ai_analyze');
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.reason || 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    opportunities: [
      {
        area: 'Dialectal Morphological Augmentation',
        description: 'Integrating morphological analyzers into multilingual LLM fine-tuning to mitigate the reported 35% dialectal error rate.',
        evidenceCitation: { physicalPage: 8, quoteSnippet: 'performance drops by 35% on Levantine and Gulf social media text' },
        type: 'AI_HYPOTHESIS'
      },
      {
        area: 'Multimodal Arabic Sentiment Detection',
        description: 'Combining textual transformer representations with acoustic cues to resolve sarcasm ambiguity.',
        evidenceCitation: { physicalPage: 11, quoteSnippet: 'Pretrained transformer models struggle significantly with sarcastic comments' },
        type: 'AI_HYPOTHESIS'
      }
    ]
  });
}
