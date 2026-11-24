import { NextResponse } from 'next/server';
import { 
  enforceSafetyGuardrails, 
  auditEvidenceGrounding, 
  GuardrailViolationException 
} from '@/lib/safety/guardrails';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action = 'scan', text = '', sampleMode } = body;

    if (action === 'test_leak') {
      try {
        enforceSafetyGuardrails('Confidential patent draft for Al-Waha sovereign model', 'prompt');
      } catch (err: any) {
        if (err instanceof GuardrailViolationException) {
          return NextResponse.json({
            blocked: true,
            status: 403,
            exception: 'GuardrailViolationException',
            violationType: err.violationType,
            messageAr: err.detailsAr,
            messageEn: err.detailsEn,
            detectedPattern: err.detectedPattern
          }, { status: 403 });
        }
      }
    }

    if (action === 'test_pii') {
      const sampleText = 'Student Maryam Al-Mazrouei with UAE Emirates ID 784-1998-1234567-1 and contact phone +971 50 123 4567 submitted MRN-847291 clinical records.';
      const result = enforceSafetyGuardrails(sampleText, 'prompt');
      return NextResponse.json({
        success: true,
        action: 'test_pii',
        rawText: sampleText,
        sanitizedText: result.sanitizedText,
        redactedCount: result.redactedEntities.length,
        redactions: result.redactedEntities
      });
    }

    if (action === 'test_grounding') {
      const sampleClaims = 'This study on Fanar LLM demonstrates high Arabic comprehension. However, another unverified study claims 99% accuracy across all dialects without benchmarks.';
      const groundingAudit = auditEvidenceGrounding(sampleClaims);
      return NextResponse.json({
        success: true,
        action: 'test_grounding',
        audit: groundingAudit
      });
    }

    // Default dynamic scan
    const redaction = enforceSafetyGuardrails(text, 'prompt');
    const grounding = auditEvidenceGrounding(redaction.sanitizedText);

    return NextResponse.json({
      success: true,
      originalText: text,
      sanitizedText: redaction.sanitizedText,
      redactedEntities: redaction.redactedEntities,
      groundingAudit: grounding
    });
  } catch (err: any) {
    if (err instanceof GuardrailViolationException) {
      return NextResponse.json({
        blocked: true,
        status: 403,
        exception: 'GuardrailViolationException',
        violationType: err.violationType,
        messageAr: err.detailsAr,
        messageEn: err.detailsEn,
        detectedPattern: err.detectedPattern
      }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    engine: 'Al-Waha Safety Harness Gateway (ALW-EP6)',
    activeGuardrails: [
      {
        code: 'ALW-601',
        name: 'PII & Research Leakage Filter',
        entities: ['UAE_EMIRATES_ID', 'UAE_PHONE_NUMBER', 'MEDICAL_RECORD_NUMBER', 'RESTRICTED_IP_LEAK'],
        mode: 'BLOCK_AND_REDACT'
      },
      {
        code: 'ALW-602',
        name: 'Evidence Grounding & Hallucination Defense',
        cosineThreshold: 0.78,
        mode: 'ANCHOR_AND_FLAG'
      }
    ]
  });
}
