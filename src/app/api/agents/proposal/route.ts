import { NextRequest, NextResponse } from 'next/server';
import { generateResearchProposal } from '@/lib/agents/proposal';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { field, level, interests, idea, projectId, language } = body;

    if (!idea || !field) {
      return NextResponse.json(
        { success: false, error: 'Field and Research Idea are required.' },
        { status: 400 }
      );
    }

    const proposal = await generateResearchProposal({
      field,
      level: level || 'Masters',
      interests: interests || field,
      idea,
      language: language || 'ar',
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
