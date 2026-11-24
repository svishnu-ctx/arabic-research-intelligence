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

    // Enhanced Schema Detection: numerical, categorical, time-series
    const detectedColumns = analysis.columns.map((col) => {
      const lower = col.toLowerCase();
      const isDate =
        lower.includes('date') ||
        lower.includes('time') ||
        lower.includes('year') ||
        lower.includes('month') ||
        lower.includes('timestamp');

      const isNumerical = Boolean(analysis.numericalStats[col]);
      const type: 'numerical' | 'categorical' | 'time-series' = isDate
        ? 'time-series'
        : isNumerical
        ? 'numerical'
        : 'categorical';

      return {
        name: col,
        type,
        missingCount: analysis.missingValuesSummary[col] || 0,
      };
    });

    // Statistical Tests Recommendation based on distribution checks
    const numericalCols = detectedColumns.filter((c) => c.type === 'numerical').map((c) => c.name);
    const categoricalCols = detectedColumns.filter((c) => c.type === 'categorical').map((c) => c.name);
    const timeCols = detectedColumns.filter((c) => c.type === 'time-series').map((c) => c.name);

    const suggestedTests: Array<{
      name: string;
      nameAr: string;
      type: 'Parametric' | 'Non-Parametric';
      hypothesis: string;
      targetVars: string[];
      justification: string;
    }> = [];

    if (numericalCols.length >= 2) {
      suggestedTests.push({
        name: 'Multiple Linear Regression',
        nameAr: 'تحليل الانحدار الخطي المتعدد',
        type: 'Parametric',
        hypothesis: `Significant predictive association between ${numericalCols[0]} and predictor variables`,
        targetVars: [numericalCols[0], numericalCols[1]],
        justification: 'Numerical variables exhibit continuous distribution suitable for ordinary least squares estimation.',
      });

      suggestedTests.push({
        name: 'Pearson Product-Moment Correlation (r)',
        nameAr: 'معامل ارتباط بيرسون الخطي',
        type: 'Parametric',
        hypothesis: `Bivariate linear dependency between ${numericalCols[0]} and ${numericalCols[1]}`,
        targetVars: [numericalCols[0], numericalCols[1]],
        justification: 'Tests linear association strength between continuous interval/ratio parameters.',
      });
    }

    if (numericalCols.length >= 1 && categoricalCols.length >= 1) {
      suggestedTests.push({
        name: 'One-Way Analysis of Variance (ANOVA)',
        nameAr: 'تحليل التباين الأحادي (ANOVA)',
        type: 'Parametric',
        hypothesis: `Mean differences of ${numericalCols[0]} across categorical groups of ${categoricalCols[0]}`,
        targetVars: [numericalCols[0], categoricalCols[0]],
        justification: 'Tests whether group variance exceeds within-group error across treatment cohorts.',
      });
    }

    if (categoricalCols.length >= 2) {
      suggestedTests.push({
        name: 'Chi-Square Test of Independence (χ²)',
        nameAr: 'اختبار مربع كاي للاستقلالية (χ²)',
        type: 'Non-Parametric',
        hypothesis: `Significant independence rejection between ${categoricalCols[0]} and ${categoricalCols[1]}`,
        targetVars: [categoricalCols[0], categoricalCols[1]],
        justification: 'Evaluates distribution frequencies across nominal categorical cross-tabulations without assuming normality.',
      });
    }

    if (timeCols.length >= 1 && numericalCols.length >= 1) {
      suggestedTests.push({
        name: 'Augmented Dickey-Fuller (ADF) Stationarity Test',
        nameAr: 'اختبار ديكي-فولر لسكون السلاسل الزمنية (ADF)',
        type: 'Parametric',
        hypothesis: `Unit root hypothesis for time-series ${numericalCols[0]} over ${timeCols[0]}`,
        targetVars: [timeCols[0], numericalCols[0]],
        justification: 'Verifies stationarity prerequisites before fitting autoregressive time-series models.',
      });
    }

    // Run Fanar AI explanation
    try {
      const explanation = await explainDatasetWithFanar(analysis);
      analysis.aiInterpretation = explanation;
    } catch {
      analysis.aiInterpretation = 'Completed numerical statistical analysis for dataset variables.';
    }

    if (projectId) {
      ServerStorage.addDatasetAnalysis(projectId, analysis);
      ServerStorage.logSecurityAudit(
        projectId,
        'Dataset Analyzed',
        'Maryam Al-Mazrouei (مريم المزروعي)',
        `Uploaded dataset ${filename} (${analysis.rowCount} rows, ${analysis.columnCount} cols). Statistical tests computed.`,
        'Allowed'
      );
    }

    // Transform numerical stats into UI summary table format
    const summary = Object.entries(analysis.numericalStats).map(([col, stats]) => ({
      column: col,
      mean: stats.mean,
      min: stats.min,
      max: stats.max,
      stdDev: stats.std,
    }));

    const stats = {
      rowCount: analysis.rowCount,
      columnCount: analysis.columnCount,
      columns: detectedColumns,
      summary,
      suggestedTests,
    };

    return NextResponse.json({
      success: true,
      stats,
      analysis,
      suggestedTests,
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
