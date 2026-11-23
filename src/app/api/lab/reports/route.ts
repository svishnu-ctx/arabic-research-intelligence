import { NextResponse } from 'next/server';
import { LAB_MODELS, LAB_BENCHMARKS } from '@/lib/lab/data';

export async function GET() {
  const models = LAB_MODELS;
  const benchmarks = LAB_BENCHMARKS;

  const avgScore = (models.reduce((sum, m) => sum + m.overallScore, 0) / models.length).toFixed(1);
  const leading = [...models].sort((a, b) => b.overallScore - a.overallScore)[0];

  const csvRows = [
    'Model Name,Developer,Category,Overall Score,Arabic Fluency,Academic Writing,Latency (ms),Cost / 1k Tokens',
    ...models.map(m =>
      `"${m.name}","${m.developer}","${m.category}",${m.overallScore},${m.arabicFluency},${m.academicWriting},${m.latencyMs},"${m.estimatedCostPer1kTokens}"`
    )
  ];

  return NextResponse.json({
    success: true,
    generatedAt: new Date().toISOString(),
    metrics: {
      totalModels: models.length,
      totalBenchmarks: benchmarks.length,
      averageScore: Number(avgScore),
      leadingModel: leading.name,
      leadingModelScore: leading.overallScore,
    },
    csvContent: csvRows.join('\n'),
    models,
  });
}
