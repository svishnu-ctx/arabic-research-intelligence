import { NextRequest, NextResponse } from 'next/server';
import { ServerStorage } from '@/lib/server/storage';

export async function GET() {
  const projects = ServerStorage.listProjects();
  const student = ServerStorage.getStudent();
  return NextResponse.json({
    success: true,
    student,
    projects,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, titleAr, researchField, academicLevel, description } = body;

    if (!title || !researchField) {
      return NextResponse.json(
        { success: false, error: 'Project title and research field are required.' },
        { status: 400 }
      );
    }

    const project = ServerStorage.createProject({
      title,
      titleAr,
      researchField,
      academicLevel: academicLevel || 'Masters',
      description,
    });

    return NextResponse.json({
      success: true,
      message: 'Research project created successfully in Al-Waha University workspace',
      project,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Project creation failed' },
      { status: 500 }
    );
  }
}
