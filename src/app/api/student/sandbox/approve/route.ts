import { NextResponse } from 'next/server';
import { approveSandboxAgent, getSandboxAgents } from '@/lib/agents/sandbox';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId = 'sbox_agent_01', notes } = body;

    const approved = approveSandboxAgent(agentId, notes);
    if (!approved) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent: approved,
      message: 'Agent approved successfully by Dr. Fatima Al-Zahra (Faculty Supervisor).',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to approve sandbox agent' },
      { status: 500 }
    );
  }
}
