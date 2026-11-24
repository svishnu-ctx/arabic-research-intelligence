import { NextRequest, NextResponse } from 'next/server';
import { evaluateStudentProposal } from '@/lib/agents/supervisor';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName = 'Maryam Al-Mazrouei (مريم المزروعي)',
      topic = 'Optimizing Renewable Energy Microgrids in the UAE using Deep Reinforcement Learning',
      problemStatement = 'Intermittent solar irradiance and extreme ambient temperatures in the UAE cause high-frequency battery cycling degradation.',
      researchQuestions = [
        'How to formulate state-space matrices under temperatures exceeding 45°C?',
        'Can deep reinforcement learning minimize grid outage probability?'
      ],
      noveltyScore = 88,
      language = 'en'
    } = body;

    const evaluation = await evaluateStudentProposal({
      studentName,
      topic,
      problemStatement,
      researchQuestions,
      noveltyScore,
      language
    });

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    console.error('Supervisor Proposal API Error:', error);
    return NextResponse.json({ error: 'Failed to evaluate proposal' }, { status: 500 });
  }
}
