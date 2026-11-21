import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDocumentById, updateDocumentPermissions } from '@/lib/documents/store';

export const runtime = 'nodejs';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = getSession(sessionId);
  if (!session) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  const doc = getDocumentById(id);
  if (!doc || doc.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized or document not found' }, { status: 403 });
  }

  const updated = updateDocumentPermissions(id, { isSupervisorShared: false });
  return NextResponse.json({ success: true, document: updated });
}
