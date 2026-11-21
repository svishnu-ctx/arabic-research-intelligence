import { describe, it } from 'node:test';
import assert from 'node:assert';
import { normalizeArabic } from './arabic/normalize';
import { retrievePassages } from './retrieval/retriever';
import { verifyQuote } from './evidence/verifier';
import { DocumentMetadata } from '@/types';

describe('AI Intelligence & Retrieval Layer', () => {
  const mockDoc: DocumentMetadata = {
    id: 'P01',
    title: 'Arabic NLP Review',
    filename: 'P01.pdf',
    mimeType: 'application/pdf',
    fileSize: 500000,
    pageCount: 18,
    totalCharacters: 40000,
    ownerId: 'system',
    ownerRole: 'admin',
    isPublicCorpus: true,
    isSupervisorShared: false,
    adminOversightConsent: true,
    aiConsentGranted: true,
    uploadedAt: Date.now(),
    pages: [
      {
        pageNumber: 2,
        text: 'تُعَدُّ اللغة العربية الفصحى الحديثة واللهجات الإقليمية تحدياً حقيقياً للنماذج اللغوية.',
        characterCount: 100,
        sha256Hash: 'p2-hash'
      },
      {
        pageNumber: 8,
        text: 'Pretrained transformers experience performance degradation on colloquial Gulf and Egyptian dialect texts.',
        characterCount: 120,
        sha256Hash: 'p8-hash'
      }
    ]
  };

  it('correctly normalizes Tashkeel while preserving letters (ة and ى)', () => {
    const raw = 'تُعَدُّ مَدِينَةُ الشَّارِقَةِ رَائِدَةً فِي مَجَالِ الْبَحْثِ الْعِلْمِيِّ';
    const normalized = normalizeArabic(raw);
    assert.strictEqual(normalized.includes('الشَّارِقَةِ'), false);
    assert.ok(normalized.includes('الشارقة'));
    assert.ok(normalized.endsWith('العلمي'));
  });

  it('retrieves relevant passages using cross-language query tokens', () => {
    const passages = retrievePassages([mockDoc], 'colloquial Gulf dialect');
    assert.strictEqual(passages.length, 1);
    assert.strictEqual(passages[0].physicalPage, 8);
    assert.strictEqual(passages[0].documentId, 'P01');
  });

  it('verifies verbatim quotes and catches mismatches', () => {
    const verified = verifyQuote(mockDoc, 2, 'اللغة العربية الفصحى');
    assert.strictEqual(verified, 'QUOTE_VERIFIED');

    const mismatch = verifyQuote(mockDoc, 2, 'معادلة غير موجودة في النص');
    assert.strictEqual(mismatch, 'QUOTE_MISMATCH');

    const invalidPage = verifyQuote(mockDoc, 99, 'نص');
    assert.strictEqual(invalidPage, 'PAGE_NOT_FOUND');
  });
});
