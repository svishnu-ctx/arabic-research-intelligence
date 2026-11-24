import { NextRequest, NextResponse } from 'next/server';
import { generateDefenseQuestions } from '@/lib/agents/thesis';
import { ServerStorage, StoredProject } from '@/lib/server/storage';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, thesisTitle, methodologySummary, academicLevel } = body;

    let project: StoredProject | null | undefined = projectId
      ? ServerStorage.getProject(projectId)
      : ServerStorage.listProjects()[0];

    if (!project) {
      project = {
        id: 'proj_default',
        studentId: 'usr_student',
        title: thesisTitle || 'Optimizing Renewable Energy Microgrids at Al-Waha University',
        researchField: 'Computer Science & Sustainable Engineering',
        academicLevel: 'Masters',
        description: methodologySummary || 'Academic research methodology and AI modeling',
        completionProgress: 50,
        dataClassification: 'Restricted',
        encryptionAtRest: true,
        exportRestricted: true,
        auditLogs: [],
        publications: [],
        datasets: [],
        chapters: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else if (thesisTitle) {
      project.title = thesisTitle;
    }

    const language = body.language || 'en';

    const safeTitle = thesisTitle || project?.title || 'Academic Thesis';
    const safeDesc = methodologySummary || project?.description || '';
    const safeLevel = academicLevel || project?.academicLevel || 'Masters';
    const safeProjectId = project?.id || 'proj_default';

    const questions = await generateDefenseQuestions({
      thesisTitle: safeTitle,
      methodologySummary: safeDesc,
      academicLevel: safeLevel,
      language: language === 'ar' ? 'ar' : 'en',
    });
    ServerStorage.setDefenseQuestions(safeProjectId, questions.map(q => typeof q === 'string' ? q : q.question));

    return NextResponse.json({
      success: true,
      questions,
      projectId: safeProjectId,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Defense question generation failed' },
      { status: 500 }
    );
  }
}
