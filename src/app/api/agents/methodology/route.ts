import { NextRequest, NextResponse } from 'next/server';
import { generateMethodologyPlan } from '@/lib/agents/methodology';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, researchType, level, questions, objectives, projectId } = body;

    if (!topic || !researchType) {
      return NextResponse.json(
        { success: false, error: 'Topic and research type are required.' },
        { status: 400 }
      );
    }

    const methodology = await generateMethodologyPlan({
      topic,
      researchType,
      level: level || 'Masters',
      questions,
      objectives,
    });

    if (projectId) {
      ServerStorage.saveMethodology(projectId, methodology);
    }

    return NextResponse.json({
      success: true,
      methodology,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Methodology generation failed' },
      { status: 500 }
    );
  }
}
