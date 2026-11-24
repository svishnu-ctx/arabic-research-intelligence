import { NextRequest, NextResponse } from 'next/server';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { supervisorOverrideCode } = body;

    const project = ServerStorage.getProject(id);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
    }

    const authCheck = ServerStorage.authorizeExport(id, supervisorOverrideCode);
    if (!authCheck.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: authCheck.error,
          classification: project.dataClassification,
          requiresSupervisorSignature: true,
          auditLogged: true,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project export authorized and released under Al-Waha Data Boundary governance.',
      classification: project.dataClassification,
      downloadUrl: `/api/research-projects/${id}/download-bundle`,
      projectTitle: project.title,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    );
  }
}
