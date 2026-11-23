import { NextRequest, NextResponse } from 'next/server';
import { generateDefenseQuestions } from '@/lib/agents/thesis';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId } = body;

    const project = projectId ? ServerStorage.getProject(projectId) : ServerStorage.listProjects()[0];
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
    }

    const questions = await generateDefenseQuestions(project);
    ServerStorage.setDefenseQuestions(project.id, questions);

    return NextResponse.json({
      success: true,
      questions,
      projectId: project.id,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Defense question generation failed' },
      { status: 500 }
    );
  }
}
