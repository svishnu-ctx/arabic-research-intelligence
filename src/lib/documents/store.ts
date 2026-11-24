import { DocumentMetadata } from '@/types';

// In-Memory Document Store (Max 50 documents, bounded)
const documentStore = new Map<string, DocumentMetadata>();

// Initial public corpus mock/seed
export function seedPublicCorpus() {
  if (documentStore.size > 0) return;

  const p01: DocumentMetadata = {
    id: 'P01',
    title: 'Arabic Natural Language Processing in the Age of Large Language Models: A Review',
    filename: 'P01.pdf',
    mimeType: 'application/pdf',
    fileSize: 580000,
    pageCount: 18,
    totalCharacters: 48000,
    ownerId: 'system',
    ownerRole: 'admin',
    isPublicCorpus: true,
    isSupervisorShared: false,
    adminOversightConsent: true,
    aiConsentGranted: true,
    uploadedAt: Date.now(),
    pages: [
      {
        pageNumber: 1,
        text: 'Arabic Natural Language Processing in the Age of Large Language Models: A Review. Abstract: This review provides a systematic analysis of Arabic NLP evolution from classical rule-based to transformer architectures...',
        characterCount: 1500,
        sha256Hash: 'hash-p01-page-1'
      },
      {
        pageNumber: 2,
        text: 'Modern Standard Arabic (MSA) and dialectal variations pose significant challenges for LLMs due to morphological complexity and orthographic ambiguity...',
        characterCount: 1800,
        sha256Hash: 'hash-p01-page-2'
      },
      {
        pageNumber: 8,
        text: 'Dialectal Arabic datasets deficiency: While MSA models achieve high accuracy on news corpora, performance drops by 35% on Levantine and Gulf social media text...',
        characterCount: 1900,
        sha256Hash: 'hash-p01-page-8'
      },
      {
        pageNumber: 14,
        text: 'Computational cost of pretraining LLMs: Training large-scale models natively on Arabic corpora requires extensive computational resources, creating a dependency on adapted multilingual backbones...',
        characterCount: 1600,
        sha256Hash: 'hash-p01-page-14'
      }
    ]
  };

  const p02: DocumentMetadata = {
    id: 'P02',
    title: 'Renewable Energy Transition in the UAE: Technical Feasibility & Resource Assessment',
    filename: 'P02.pdf',
    mimeType: 'application/pdf',
    fileSize: 640000,
    pageCount: 16,
    totalCharacters: 42000,
    ownerId: 'system',
    ownerRole: 'admin',
    isPublicCorpus: true,
    isSupervisorShared: false,
    adminOversightConsent: true,
    aiConsentGranted: true,
    uploadedAt: Date.now(),
    pages: [
      {
        pageNumber: 1,
        text: 'Renewable Energy Transition in the UAE: Technical Feasibility & Resource Assessment. Assessing solar PV and wind generation capabilities across University of Sharjah campuses and northern Emirates...',
        characterCount: 1400,
        sha256Hash: 'hash-p02-page-1'
      },
      {
        pageNumber: 6,
        text: 'Solar irradiance mapping in the UAE indicates direct normal irradiance (DNI) exceeding 2200 kWh/m2/year. However, dust accumulation and high ambient temperatures decrease PV efficiency by 0.5% per degree Celsius above 25°C...',
        characterCount: 1750,
        sha256Hash: 'hash-p02-page-6'
      }
    ]
  };

  const p03: DocumentMetadata = {
    id: 'P03',
    title: 'Arabic Sentiment Analysis Using Transformer Architectures: A Comprehensive Empirical Study',
    filename: 'P03.pdf',
    mimeType: 'application/pdf',
    fileSize: 490000,
    pageCount: 14,
    totalCharacters: 38000,
    ownerId: 'system',
    ownerRole: 'admin',
    isPublicCorpus: true,
    isSupervisorShared: false,
    adminOversightConsent: true,
    aiConsentGranted: true,
    uploadedAt: Date.now(),
    pages: [
      {
        pageNumber: 1,
        text: 'Arabic Sentiment Analysis Using Transformer Architectures: A Comprehensive Empirical Study. Investigating MARBERT, AraBERT, and multilingual BERT across 5 diverse Arabic sentiment datasets...',
        characterCount: 1550,
        sha256Hash: 'hash-p03-page-1'
      },
      {
        pageNumber: 4,
        text: 'Empirical benchmark setup: Five benchmark datasets collected from social media platforms were annotated for positive, negative, and neutral sentiment across MSA and Egyptian dialects...',
        characterCount: 1850,
        sha256Hash: 'hash-p03-page-4'
      },
      {
        pageNumber: 11,
        text: 'Limitations on sarcastic and mixed script text: Pretrained transformer models struggle significantly with sarcastic comments and Arabizi notations, showing an error increase of 28%...',
        characterCount: 1650,
        sha256Hash: 'hash-p03-page-11'
      }
    ]
  };

  documentStore.set(p01.id, p01);
  documentStore.set(p02.id, p02);
  documentStore.set(p03.id, p03);
}

// Initial seed call
seedPublicCorpus();

export function getAllDocuments(): DocumentMetadata[] {
  seedPublicCorpus();
  return Array.from(documentStore.values());
}

export function getDocumentById(id: string): DocumentMetadata | null {
  seedPublicCorpus();
  return documentStore.get(id) || null;
}

export function saveDocument(doc: DocumentMetadata): void {
  // Enforce global 50-doc limit
  if (documentStore.size >= 50) {
    // Evict oldest non-public document
    for (const [key, val] of documentStore.entries()) {
      if (!val.isPublicCorpus) {
        documentStore.delete(key);
        break;
      }
    }
  }
  documentStore.set(doc.id, doc);
}

export function deleteDocument(id: string): boolean {
  const doc = documentStore.get(id);
  if (!doc || doc.isPublicCorpus) return false;
  return documentStore.delete(id);
}

export function updateDocumentPermissions(
  id: string,
  updates: {
    isSupervisorShared?: boolean;
    adminOversightConsent?: boolean;
    aiConsentGranted?: boolean;
  }
): DocumentMetadata | null {
  const doc = documentStore.get(id);
  if (!doc) return null;

  if (updates.isSupervisorShared !== undefined) doc.isSupervisorShared = updates.isSupervisorShared;
  if (updates.adminOversightConsent !== undefined) doc.adminOversightConsent = updates.adminOversightConsent;
  if (updates.aiConsentGranted !== undefined) {
    doc.aiConsentGranted = updates.aiConsentGranted;
    if (updates.aiConsentGranted) doc.aiConsentTimestamp = new Date().toISOString();
  }

  documentStore.set(id, doc);
  return doc;
}
