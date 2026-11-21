import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const mem = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());
  
  // Render automatically injects RENDER_GIT_COMMIT into the runtime container.
  // In local development or fallback, use NEXT_PUBLIC_GIT_COMMIT_SHA.
  const commitSha = process.env.RENDER_GIT_COMMIT || process.env.NEXT_PUBLIC_GIT_COMMIT_SHA || 'unknown';

  return NextResponse.json({
    status: 'healthy',
    uptimeSeconds,
    memoryRssMb: parseFloat((mem.rss / (1024 * 1024)).toFixed(2)),
    memoryHeapUsedMb: parseFloat((mem.heapUsed / (1024 * 1024)).toFixed(2)),
    commitSha,
    circuitBreaker: 'CLOSED',
    activeSessions: 0,
    documentsCount: 0
  });
}
