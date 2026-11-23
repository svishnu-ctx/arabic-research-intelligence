import { NextRequest, NextResponse } from 'next/server';
import { generateLiteratureSynthesis } from '@/lib/agents/literature';
import { AcademicPaperResult } from '@/lib/publications/openalex';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, publications, language } = body as {
      topic: string;
      publications: AcademicPaperResult[];
      language?: 'ar' | 'en';
    };

    if (!topic || !Array.isArray(publications) || publications.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Topic and at least one retrieved publication are required.' },
        { status: 400 }
      );
    }

    const synthesis = await generateLiteratureSynthesis({
      topic,
      publications,
      language: language || 'ar',
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
