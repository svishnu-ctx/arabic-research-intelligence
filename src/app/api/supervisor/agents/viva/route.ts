import { NextRequest, NextResponse } from 'next/server';
import { prepareVivaCommitteeRubric } from '@/lib/agents/supervisor';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName = 'Maryam Al-Mazrouei (مريم المزروعي)',
      thesisTitle = 'Optimizing Renewable Energy Microgrids in the UAE using Deep Reinforcement Learning',
      methodologySummary = 'Deep Reinforcement Learning trained on Al-Waha meteorological dataset with Markov decision processes',
      identifiedLimitations = 'Sensor calibration drift under dust storms, simulation restricted to university microgrid scale',
      language = 'en'
    } = body;

    const vivaPrep = await prepareVivaCommitteeRubric({
      studentName,
      thesisTitle,
      methodologySummary,
      identifiedLimitations,
      language
    });

    return NextResponse.json({ success: true, vivaPrep });
  } catch (error) {
    console.error('Supervisor Viva Prep API Error:', error);
    return NextResponse.json({ error: 'Failed to prepare viva rubric' }, { status: 500 });
  }
}
