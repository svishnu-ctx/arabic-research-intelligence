import { NextResponse } from 'next/server';
import { getSandboxAgents, testSandboxAgent } from '@/lib/agents/sandbox';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId, agentConfig, prompt, language = 'ar' } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required for testing.' },
        { status: 400 }
      );
    }

    let targetAgent = agentConfig;
    if (!targetAgent && agentId) {
      const agents = getSandboxAgents();
      targetAgent = agents.find((a) => a.id === agentId);
    }

    if (!targetAgent) {
      return NextResponse.json(
        { success: false, error: 'Agent configuration not found.' },
        { status: 404 }
      );
    }

    const testResult = await testSandboxAgent(targetAgent, prompt, language);

    return NextResponse.json({
      success: true,
      result: testResult,
      agentName: language === 'ar' ? targetAgent.nameAr : targetAgent.nameEn,
      safetyBadge: 'Al-Waha Safety Harness Verified',
      sandboxMode: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to test sandbox agent' },
      { status: 500 }
    );
  }
}
