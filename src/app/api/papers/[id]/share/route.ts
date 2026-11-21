import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDocumentById, updateDocumentPermissions } from '@/lib/documents/store';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const doc = getDocumentById(id);
  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if (doc.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Only the document owner can modify sharing' }, { status: 403 });
  }

  const body = await req.json();
  const updated = updateDocumentPermissions(id, {
    isSupervisorShared: body.shareSupervisor !== undefined ? body.shareSupervisor : true,
    adminOversightConsent: body.adminConsent !== undefined ? body.adminConsent : false
  });

  return NextResponse.json({ success: true, document: updated });
}
