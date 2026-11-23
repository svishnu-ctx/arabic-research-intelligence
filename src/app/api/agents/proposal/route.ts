import { NextRequest, NextResponse } from 'next/server';
import { generateResearchProposal } from '@/lib/agents/proposal';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const field = body.field;
    const idea = body.idea || body.initialIdea;
    const level = body.level || body.academicLevel || 'Masters';
    const interests = body.interests || body.researchInterests || field;
    const language = body.language || 'ar';
    const projectId = body.projectId;

    if (!idea || !field) {
      return NextResponse.json(
        { success: false, error: 'Field and Research Idea are required.' },
        { status: 400 }
      );
    }

    const proposal = await generateResearchProposal({
      field,
      level,
      interests,
      idea,
      language: language === 'en' ? 'en' : 'ar',
    });

    if (projectId) {
      ServerStorage.saveProposal(projectId, proposal);
    }

    return NextResponse.json({
      success: true,
      proposal,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Proposal generation failed' },
      { status: 500 }
    );
  }
}
