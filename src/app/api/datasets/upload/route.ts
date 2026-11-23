import { NextRequest, NextResponse } from 'next/server';
import { analyzeDatasetText, explainDatasetWithFanar } from '@/lib/agents/methodology';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { csvContent, filename, projectId } = body;

    if (!csvContent || typeof csvContent !== 'string') {
      return NextResponse.json(
        { success: false, error: 'CSV content is required.' },
        { status: 400 }
      );
    }

    const analysis = analyzeDatasetText(csvContent, filename || 'research_dataset.csv');

    // Explain with Fanar AI
    try {
      const explanation = await explainDatasetWithFanar(analysis);
      analysis.aiInterpretation = explanation;
    } catch {
      analysis.aiInterpretation = 'تم إتمام التحليل الإحصائي الرقمي للبيانات بنجاح.';
    }

    if (projectId) {
      ServerStorage.addDatasetAnalysis(projectId, analysis);
    }

    return NextResponse.json({
      success: true,
      analysis,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Dataset analysis failed' },
      { status: 500 }
    );
  }
}
