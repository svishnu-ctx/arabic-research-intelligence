import { NextRequest, NextResponse } from 'next/server';
import { validateMethodologyIRB } from '@/lib/agents/supervisor';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName = 'Maryam Al-Mazrouei (مريم المزروعي)',
      topic = 'Deep Reinforcement Learning for Solar Microgrids',
      researchDesign = 'Quantitative Simulation & Empirical Telemetry Modeling',
      dataSources = 'Al-Waha University meteorological weather station & campus solar battery telemetry',
      sampleSize = '1,240 hourly readings covering full summer diurnal cycles',
      language = 'en'
    } = body;

    const validation = await validateMethodologyIRB({
      studentName,
      topic,
      researchDesign,
      dataSources,
      sampleSize,
      language
    });

    return NextResponse.json({ success: true, validation });
  } catch (error) {
    console.error('Supervisor Methodology API Error:', error);
    return NextResponse.json({ error: 'Failed to validate methodology' }, { status: 500 });
  }
}
