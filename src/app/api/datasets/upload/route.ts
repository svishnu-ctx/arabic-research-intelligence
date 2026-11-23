import { NextRequest, NextResponse } from 'next/server';
import { analyzeDatasetText, explainDatasetWithFanar } from '@/lib/agents/methodology';
import { ServerStorage } from '@/lib/server/storage';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const csvContent = body.csvContent || body.content || body.csvText;
    const filename = body.filename || 'research_dataset.csv';
    const projectId = body.projectId;

    if (!csvContent || typeof csvContent !== 'string') {
      return NextResponse.json(
        { success: false, error: 'CSV content is required.' },
        { status: 400 }
      );
    }

    const analysis = analyzeDatasetText(csvContent, filename);

    // Run Fanar AI explanation
    try {
      const explanation = await explainDatasetWithFanar(analysis);
      analysis.aiInterpretation = explanation;
    } catch {
      analysis.aiInterpretation = 'Completed numerical statistical analysis for dataset variables.';
    }

    if (projectId) {
      ServerStorage.addDatasetAnalysis(projectId, analysis);
    }

    // Transform numerical stats into UI summary table format
    const summary = Object.entries(analysis.numericalStats).map(([col, stats]) => ({
      column: col,
      mean: stats.mean,
      min: stats.min,
      max: stats.max,
      stdDev: stats.std,
    }));

    const columns = analysis.columns.map((col) => ({
      name: col,
      type: analysis.numericalStats[col] ? 'numerical' : 'categorical',
      missingCount: analysis.missingValuesSummary[col] || 0,
    }));

    const stats = {
      rowCount: analysis.rowCount,
      columnCount: analysis.columnCount,
      columns,
      summary,
    };

    return NextResponse.json({
      success: true,
      stats,
      analysis,
      fanarExplanation: analysis.aiInterpretation,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Dataset analysis failed' },
      { status: 500 }
    );
  }
}
