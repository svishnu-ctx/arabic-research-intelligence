import { NextRequest, NextResponse } from 'next/server';
import { ServerStorage } from '@/lib/server/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = ServerStorage.getProject(id);
  if (!project) {
    return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = ServerStorage.updateProject(id, body);
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = ServerStorage.deleteProject(id);
  return NextResponse.json({ success: deleted });
}
