import { NextRequest, NextResponse } from 'next/server';
import { getSession, validateCsrfToken } from '@/lib/auth/session';
import { saveDocument, getAllDocuments } from '@/lib/documents/store';
import { DocumentMetadata } from '@/types';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ari_session_token')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  // Upload permitted only for student and scholar
  if (session.user.role !== 'student' && session.user.role !== 'scholar') {
    return NextResponse.json({ error: 'Only scholars and students can upload research manuscripts' }, { status: 403 });
  }

  // Check upload quota (max 2 papers per account)
  const userDocs = getAllDocuments().filter(d => d.ownerId === session.user.id && !d.isPublicCorpus);
  if (userDocs.length >= 2) {
    return NextResponse.json({ error: 'Maximum limit of 2 uploaded papers reached for this demo account' }, { status: 422 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const aiConsent = formData.get('aiConsentGranted') === 'true';
    const isSupervisorShared = formData.get('isSupervisorShared') === 'true';
    const adminOversightConsent = formData.get('adminOversightConsent') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF documents are supported' }, { status: 422 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds maximum 10 MB limit' }, { status: 413 });
    }

    // In-memory document creation
    const docId = `doc_${crypto.randomUUID()}`;
    const newDoc: DocumentMetadata = {
      id: docId,
      title: file.name.replace(/\.pdf$/i, ''),
      filename: file.name,
      mimeType: 'application/pdf',
      fileSize: file.size,
      pageCount: 5,
      totalCharacters: 12000,
      ownerId: session.user.id,
      ownerRole: session.user.role,
      isPublicCorpus: false,
      isSupervisorShared,
      adminOversightConsent,
      aiConsentGranted: aiConsent,
      aiConsentTimestamp: aiConsent ? new Date().toISOString() : undefined,
      uploadedAt: Date.now(),
      pages: [
        {
          pageNumber: 1,
          text: `Extracted text from ${file.name}. Research Problem and Methodology Overview...`,
          characterCount: 2400,
          sha256Hash: crypto.createHash('sha256').update(file.name).digest('hex')
        }
      ]
    };

    saveDocument(newDoc);

    return NextResponse.json({
      success: true,
      document: newDoc
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process PDF upload: ' + err.message }, { status: 500 });
  }
}
