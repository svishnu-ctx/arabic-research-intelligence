import { NextResponse } from 'next/server';
import { getSandboxAgents, saveSandboxAgent } from '@/lib/agents/sandbox';

export async function GET() {
  try {
    const agents = getSandboxAgents();
    return NextResponse.json({
      success: true,
      agents,
      total: agents.length,
      mode: 'student_isolated_sandbox',
      university: 'Al-Waha University (جامعة الواحة)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sandbox agents' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nameAr || !body.systemPromptAr) {
      return NextResponse.json(
        { success: false, error: 'Name and System Instructions are required.' },
        { status: 400 }
      );
    }

    const saved = saveSandboxAgent({
      id: body.id,
      nameAr: body.nameAr,
      nameEn: body.nameEn || body.nameAr,
      category: body.category || 'research',
      descriptionAr: body.descriptionAr || '',
      descriptionEn: body.descriptionEn || '',
      systemPromptAr: body.systemPromptAr,
      systemPromptEn: body.systemPromptEn || body.systemPromptAr,
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.3,
      model: body.model || 'Fanar',
      knowledgeSources: Array.isArray(body.knowledgeSources) ? body.knowledgeSources : [],
      tools: Array.isArray(body.tools) ? body.tools : ['evidence_grounding'],
      accessLevel: body.submitForReview ? 'submitted_review' : (body.accessLevel || 'personal_sandbox'),
      createdBy: 'Maryam Al-Mazrouei (مريم المزروعي)',
    });

    return NextResponse.json({
      success: true,
      agent: saved,
      message: body.submitForReview
        ? 'Agent created and submitted for Faculty Supervisor review.'
        : 'Agent successfully saved to personal sandbox.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save sandbox agent' },
      { status: 500 }
    );
  }
}
