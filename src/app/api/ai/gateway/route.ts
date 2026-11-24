import { NextResponse } from 'next/server';
import { gatewayRouter, SUPPORTED_GATEWAY_MODELS } from '@/lib/ai/gateway';

export async function GET() {
  const probe = await gatewayRouter.probeSovereignHealth();
  return NextResponse.json({
    gateway: 'Al-Waha Multi-Model Sovereign Gateway (ALW-EP7)',
    status: 'ONLINE',
    sovereignPrimary: probe,
    supportedModels: SUPPORTED_GATEWAY_MODELS,
    routingPolicy: {
      defaultSovereignModel: 'Fanar-C-2-27B',
      fallbackHierarchy: ['QCRI Fanar Sovereign', 'Academic Cloud Federated', 'Al-Waha Offline Cache'],
      failoverThresholdMs: 5000,
      circuitBreakerStatus: 'CLOSED_HEALTHY'
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { department = 'engineering', simulateFailure = false, message = '' } = body;

    const decision = gatewayRouter.resolveRouting(department, simulateFailure);

    return NextResponse.json({
      success: true,
      decision,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
