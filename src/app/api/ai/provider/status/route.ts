import { NextResponse } from 'next/server';
import { gatewayRouter } from '@/lib/ai/gateway';

export async function GET() {
  const probe = await gatewayRouter.probeSovereignHealth();
  return NextResponse.json({
    provider: 'Fanar AI',
    developer: 'Qatar Computing Research Institute (QCRI)',
    baseUrl: process.env.FANAR_BASE_URL || 'https://api.fanar.qa',
    configured: true,
    model: 'Fanar-C-2-27B',
    status: probe.status === 'HEALTHY' ? 'Ready' : 'Degraded',
    connection: {
      connected: true,
      latencyMs: probe.latencyMs,
      uptimePercentage: probe.uptimePercentage,
      cloudRegion: probe.sovereignCloud
    },
  });
}

export async function POST() {
  const probe = await gatewayRouter.probeSovereignHealth();
  return NextResponse.json({
    success: probe.status === 'HEALTHY',
    latencyMs: probe.latencyMs,
    probe
  });
}
