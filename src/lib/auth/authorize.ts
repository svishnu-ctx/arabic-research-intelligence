import { User, DocumentMetadata } from '@/types';

export function authorizeDocumentAccess(
  user: Pick<User, 'id' | 'role'>,
  doc: DocumentMetadata,
  action: 'read' | 'write' | 'delete' | 'ai_analyze'
): { authorized: boolean; reason?: string } {
  // 1. Deletion & Modification: Strictly document owner. Public corpus protected.
  if (action === 'delete' || action === 'write') {
    if (doc.isPublicCorpus) {
      return { authorized: false, reason: 'Public academic corpus cannot be deleted or modified.' };
    }
    if (doc.ownerId !== user.id) {
      return { authorized: false, reason: 'Only the document owner can modify or delete this document.' };
    }
    return { authorized: true };
  }

  // 2. Read & AI Analysis Access:
  // Public corpus is readable by all authenticated roles
  if (doc.isPublicCorpus) {
    return { authorized: true };
  }

  // Document owner has full access (subject to AI consent check)
  if (doc.ownerId === user.id) {
    if (action === 'ai_analyze' && !doc.aiConsentGranted) {
      return { authorized: false, reason: 'AI privacy consent must be granted before analyzing this document.' };
    }
    return { authorized: true };
  }

  // Faculty Supervisor access
  if (user.role === 'supervisor') {
    if (doc.isSupervisorShared) {
      if (action === 'ai_analyze' && !doc.aiConsentGranted) {
        return { authorized: false, reason: 'Student owner has not granted external AI privacy consent.' };
      }
      return { authorized: true };
    }
    return { authorized: false, reason: 'Document has not been shared with the research supervisor.' };
  }

  // University Administrator access
  if (user.role === 'admin') {
    if (doc.adminOversightConsent) {
      return { authorized: true };
    }
    return { authorized: false, reason: 'Student owner has not granted institutional oversight consent.' };
  }

  return { authorized: false, reason: 'Access denied.' };
}
