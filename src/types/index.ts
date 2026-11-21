export type UserRole = 'admin' | 'supervisor' | 'scholar' | 'student';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  displayName: string;
  email: string;
}

export interface Session {
  id: string;
  user: User;
  csrfToken: string;
  createdAt: number;
  lastAccessedAt: number;
}

export type PhysicalQuoteStatus =
  | 'QUOTE_VERIFIED'
  | 'QUOTE_MISMATCH'
  | 'PAGE_NOT_FOUND';

export type ClaimSupportStatus =
  | 'CLAIM_SUPPORTED'
  | 'CLAIM_UNSUPPORTED'
  | 'INCONCLUSIVE';

export interface CitationVerificationResult {
  citationId: string;
  documentId: string;
  physicalPage: number;
  quotedSnippet: string;
  quoteStatus: PhysicalQuoteStatus;
  quoteMatchScore: number;
  claimStatus: ClaimSupportStatus;
  claimConfidenceScore: number;
  explanation: string;
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  characterCount: number;
  sha256Hash: string;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  filename: string;
  mimeType: 'application/pdf';
  fileSize: number;
  pageCount: number;
  totalCharacters: number;
  ownerId: string;
  ownerRole: UserRole;
  isPublicCorpus: boolean;
  isSupervisorShared: boolean;
  adminOversightConsent: boolean;
  aiConsentGranted: boolean;
  aiConsentTimestamp?: string;
  uploadedAt: number;
  pages: DocumentPage[];
}
