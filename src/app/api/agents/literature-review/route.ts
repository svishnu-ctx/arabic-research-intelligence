import { NextRequest, NextResponse } from 'next/server';
import { generateLiteratureSynthesis } from '@/lib/agents/literature';
import { AcademicPaperResult } from '@/lib/publications/openalex';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body.topic;
    const publications = body.publications || body.papers || [];
    const language = body.language || 'ar';

    if (!topic || !Array.isArray(publications) || publications.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Topic and at least one retrieved publication are required.' },
        { status: 400 }
      );
    }

    const synthesis = await generateLiteratureSynthesis({
      topic,
      publications,
      language: language === 'en' ? 'en' : 'ar',
    });

    return NextResponse.json({
      success: true,
      synthesis,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Literature synthesis failed' },
      { status: 500 }
    );
  }
}
