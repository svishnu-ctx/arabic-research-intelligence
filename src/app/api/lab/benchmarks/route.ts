import { NextRequest, NextResponse } from 'next/server';
import { LAB_BENCHMARKS } from '@/lib/lab/data';
import { BenchmarkTestCase } from '@/lib/lab/types';

const serverBenchmarks: BenchmarkTestCase[] = [...LAB_BENCHMARKS];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: serverBenchmarks.length,
    benchmarks: serverBenchmarks,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newBenchmark: BenchmarkTestCase = {
      id: body.id || `AR-${String(serverBenchmarks.length + 1).padStart(3, '0')}`,
      title: body.title || 'New Benchmark Test',
      titleAr: body.titleAr || 'اختبار تقييم أكاديمي جديد',
      category: body.category || 'Arabic Grammar & Fluency',
      categoryAr: body.categoryAr || 'النحو والفصاحة اللغوية',
      language: body.language || 'Arabic',
      difficulty: body.difficulty || 'Medium',
      difficultyAr: body.difficultyAr || 'متوسط',
      expectedCriteria: body.expectedCriteria || 'Standard academic verification',
      expectedCriteriaAr: body.expectedCriteriaAr || 'المعايير الأكاديمية القياسية',
      modelsTestedCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Active',
      prompt: body.prompt || '',
      referenceAnswer: body.referenceAnswer || '',
    };

    serverBenchmarks.unshift(newBenchmark);

    return NextResponse.json({
      success: true,
      message: 'Benchmark added successfully on backend server',
      benchmark: newBenchmark,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create benchmark' },
      { status: 500 }
    );
  }
}
