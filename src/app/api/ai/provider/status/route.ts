import { NextResponse } from 'next/server';
import { fanarAdapter } from '@/lib/fanar/adapter';

export async function GET() {
  const isConfigured = fanarAdapter.isConfigured();
  return NextResponse.json({
    provider: 'Fanar AI',
    developer: 'Qatar Computing Research Institute (QCRI)',
    baseUrl: process.env.FANAR_BASE_URL || 'https://api.fanar.qa',
    configured: isConfigured,
    model: process.env.FANAR_MODEL || 'Fanar',
    status: isConfigured ? 'Ready' : 'API Key Missing',
  });
}

export async function POST() {
  const testRes = await fanarAdapter.testConnection();
  return NextResponse.json(testRes);
}
