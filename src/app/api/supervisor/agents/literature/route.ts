import { NextRequest, NextResponse } from 'next/server';
import { auditLiteratureIntegrity } from '@/lib/agents/supervisor';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName = 'Maryam Al-Mazrouei (مريم المزروعي)',
      topic = 'Deep Reinforcement Learning for Solar Microgrids',
      citations = [
        'Al-Maktoum et al. (2023) - High temperature microgrid operations',
        'Zhang & Patel (2024) - Reinforcement learning in distributed renewable grids',
        'IEEE Taskforce on UAE Clean Energy Infrastructure (2022)'
      ],
      identifiedGaps = [
        'Lack of empirical degradation modeling in high ambient desert heat (>45°C)',
        'Unresolved battery replacement lifecycle cost analysis'
      ],
      language = 'en'
    } = body;

    const audit = await auditLiteratureIntegrity({
      studentName,
      topic,
      citations,
      identifiedGaps,
      language
    });

    return NextResponse.json({ success: true, audit });
  } catch (error) {
    console.error('Supervisor Literature API Error:', error);
    return NextResponse.json({ error: 'Failed to audit literature' }, { status: 500 });
  }
}
