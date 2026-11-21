import { describe, it } from 'node:test';
import assert from 'node:assert';
import { authorizeDocumentAccess } from './authorize';
import { DocumentMetadata } from '@/types';

describe('Centralized Document Authorization Helper', () => {
  const publicCorpusDoc: DocumentMetadata = {
    id: 'P01',
    title: 'Arabic NLP Survey',
    filename: 'P01.pdf',
    mimeType: 'application/pdf',
    fileSize: 500000,
    pageCount: 18,
    totalCharacters: 45000,
    ownerId: 'system',
    ownerRole: 'admin',
    isPublicCorpus: true,
    isSupervisorShared: false,
    adminOversightConsent: true,
    aiConsentGranted: true,
    uploadedAt: Date.now(),
    pages: [],
  };

  const studentPrivateDoc: DocumentMetadata = {
    id: 'doc-student-1',
    title: 'Student Thesis Draft',
    filename: 'thesis.pdf',
    mimeType: 'application/pdf',
    fileSize: 300000,
    pageCount: 10,
    totalCharacters: 25000,
    ownerId: 'student-id-1',
    ownerRole: 'student',
    isPublicCorpus: false,
    isSupervisorShared: false,
    adminOversightConsent: false,
    aiConsentGranted: false,
    uploadedAt: Date.now(),
    pages: [],
  };

  it('allows all authenticated users to read public corpus documents', () => {
    const roles: Array<'admin' | 'supervisor' | 'scholar' | 'student'> = ['admin', 'supervisor', 'scholar', 'student'];
    for (const role of roles) {
      const res = authorizeDocumentAccess({ id: `user-${role}`, role }, publicCorpusDoc, 'read');
      assert.strictEqual(res.authorized, true);
    }
  });

  it('prohibits deletion or modification of public corpus documents', () => {
    const res = authorizeDocumentAccess({ id: 'admin-id', role: 'admin' }, publicCorpusDoc, 'delete');
    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes('Public academic corpus cannot be deleted or modified'));
  });

  it('blocks supervisor access if student has not shared the document', () => {
    const res = authorizeDocumentAccess({ id: 'supervisor-1', role: 'supervisor' }, studentPrivateDoc, 'read');
    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes('Document has not been shared with the research supervisor'));
  });

  it('allows supervisor access when isSupervisorShared is true', () => {
    const sharedDoc = { ...studentPrivateDoc, isSupervisorShared: true };
    const res = authorizeDocumentAccess({ id: 'supervisor-1', role: 'supervisor' }, sharedDoc, 'read');
    assert.strictEqual(res.authorized, true);
  });

  it('blocks admin access if adminOversightConsent is false even if shared with supervisor', () => {
    const sharedDoc = { ...studentPrivateDoc, isSupervisorShared: true, adminOversightConsent: false };
    const res = authorizeDocumentAccess({ id: 'admin-1', role: 'admin' }, sharedDoc, 'read');
    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes('institutional oversight consent'));
  });

  it('blocks AI analysis if user has not granted AI privacy consent', () => {
    const resOwner = authorizeDocumentAccess({ id: 'student-id-1', role: 'student' }, studentPrivateDoc, 'ai_analyze');
    assert.strictEqual(resOwner.authorized, false);
    assert.ok(resOwner.reason?.includes('AI privacy consent must be granted'));

    const sharedWithoutConsent = { ...studentPrivateDoc, isSupervisorShared: true, aiConsentGranted: false };
    const resSuper = authorizeDocumentAccess({ id: 'supervisor-1', role: 'supervisor' }, sharedWithoutConsent, 'ai_analyze');
    assert.strictEqual(resSuper.authorized, false);
    assert.ok(resSuper.reason?.includes('Student owner has not granted external AI privacy consent'));
  });
});

