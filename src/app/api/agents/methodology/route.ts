import { NextRequest, NextResponse } from 'next/server';
import { generateMethodologyPlan } from '@/lib/agents/methodology';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body.topic;
    const rawType = String(body.researchType || 'Quantitative');
    const researchType: 'Quantitative' | 'Qualitative' | 'Mixed-Methods' =
      rawType.toUpperCase().includes('QUANT')
        ? 'Quantitative'
        : rawType.toUpperCase().includes('QUAL')
        ? 'Qualitative'
        : 'Mixed-Methods';
    const level = body.level || body.academicLevel || 'Masters';
    const questions = body.questions;
    const objectives = body.objectives;
    const projectId = body.projectId;

    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic is required.' },
        { status: 400 }
      );
    }

    const methodology = await generateMethodologyPlan({
      topic,
      researchType,
      level,
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
