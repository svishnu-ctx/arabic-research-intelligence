import { NextRequest, NextResponse } from 'next/server';
import { generateDefenseQuestions } from '@/lib/agents/thesis';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, thesisTitle, methodologySummary, academicLevel } = body;

    let project = projectId ? ServerStorage.getProject(projectId) : ServerStorage.listProjects()[0];
    if (!project) {
      project = {
        id: 'proj_default',
        studentId: 'usr_student',
        title: thesisTitle || 'Optimizing Renewable Energy Microgrids in Sharjah',
        researchField: 'Computer Science & Sustainable Engineering',
        academicLevel: academicLevel || 'Master’s Thesis',
        description: methodologySummary || 'Academic research methodology and AI modeling',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else if (thesisTitle) {
      project.title = thesisTitle;
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
