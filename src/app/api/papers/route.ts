import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAllDocuments } from '@/lib/documents/store';
import { authorizeDocumentAccess } from '@/lib/auth/authorize';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const allDocs = getAllDocuments();
  const accessibleDocs = allDocs.filter(doc => {
    const auth = authorizeDocumentAccess(session.user, doc, 'read');
    return auth.authorized;
  });

  return NextResponse.json({
    success: true,
    papers: accessibleDocs
  });
}
