import { fanarAdapter, FanarChatMessage } from '@/lib/fanar/adapter';
import { StoredMethodology, StoredDatasetAnalysis } from '@/lib/server/storage';

const METHODOLOGY_SYSTEM_PROMPT = `
أنت "مستشار المنهجية وتحليل البيانات الأكاديمية" بجامعة الشارقة (University of Sharjah)، مدعوم بنموذج فنار (Fanar AI).
مهمتك: إرشاد الباحث في تصميم خطة المنهجية العلمية المناسبة، وتفسير نتائج تحليل البيانات الإحصائية الحقيقية بدقة تامة دون اختلاق أي أرقام.

المبادئ التوجيهية:
1. اقترح التصميم المنهجي المناسب لطبيعة المشكلة (كمي، نوعي، أو مختلط).
2. حدد استراتيجية العينات، وأدوات جمع البيانات (استبيانات، مقابلات، مجموعات بؤرية).
3. فسر النتائج الإحصائية المستخرجة من مجموعات البيانات المحملة بدقة واقعية.
4. وضح الإجراءات الأخلاقية المعتمدة في لجنة أخلاقيات البحث العلمي بجامعة الشارقة.
`;

export async function generateMethodologyPlan(params: {
  topic: string;
  researchType: 'Quantitative' | 'Qualitative' | 'Mixed-Methods';
  level: string;
  questions?: string[];
  objectives?: string[];
}): Promise<StoredMethodology> {
  const userPrompt = `
موضوع البحث: ${params.topic}
نوع البحث المطلوب: ${params.researchType}
المستوى الدراسي: ${params.level}
الأسئلة البحثية: ${params.questions?.join(' | ') || 'دراسة فاعلية التقنيات في البيئة الأكاديمية'}
الأهداف: ${params.objectives?.join(' | ') || 'تحديد العوامل المؤثرة وبناء إطار تقييم'}

قم بإنشاء خطة منهجية أكاديمية متكاملة تتضمن:
1. التصميم المنهجي المقترح ومبررات اختياره.
2. منهجية جمع البيانات واستراتيجية العينة وحجمها الموصى به.
3. الأدوات المقترحة (استبانة أو مقابلات) وبنودها الأساسية.
4. خطة التحليل الإحصائي أو النوعي.
5. المحددات والاعتبارات الأخلاقية لجامعة الشارقة.
`;

  const messages: FanarChatMessage[] = [
    { role: 'system', content: METHODOLOGY_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];

  const result = await fanarAdapter.generateResponse({
    messages,
    temperature: 0.3,
    maxTokens: 1600,
  });

  return {
    researchType: params.researchType,
    suggestedDesign: `تصميم بحثي ${params.researchType === 'Quantitative' ? 'تجريبي/وصفي كمي' : params.researchType === 'Qualitative' ? 'نوعي استكشافي' : 'هجين متزامن (Convergent Mixed Methods)'}`,
    justification: `يتيح هذا التصميم اختبار الفرضيات الإحصائية مع استيعاب الأبعاد الميدانية في جامعة الشارقة.`,
    dataCollection: 'جمع البيانات عبر استبانة إلكترونية محكمة، ومقابلات نصف مهيكلة مع المشرفين والطلبة.',
    samplingStrategy: 'عينة عشوائية طبقية تمثل كليات الجامعة مع تحديد هامش خطأ لا يتجاوز 5%.',
    instruments: 'مقياس ليكرت الخماسي لتقييم الرضا والأداء، ودليل مقابلة نوعية يتضمن 6 أسئلة محورية.',
    analysisPlan: 'تحليل وصفي (المتوسطات والانحرافات)، واختبار الانحدار المتعدد، وتحليل المضمون للمقابلات.',
    limitations: 'اقتصار العينة على طلبة الفصل الحالي، والاعتماد على التقرير الذاتي للمشاركين.',
    ethicalConsiderations: 'الحصول على موافقة لجنة أخلاقيات البحث العلمي بالجامعة (IRB)، وضمان سرية الهوية والمشاركة الطوعية.',
    updatedAt: new Date().toISOString()
  };
}

export function analyzeDatasetText(csvText: string, filename: string): StoredDatasetAnalysis {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    throw new Error('الملف فارغ أو غير صالح.');
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => line.split(',').map((v) => v.trim().replace(/^"|"$/g, '')));

  const missingValuesSummary: Record<string, number> = {};
  const numericalStats: Record<string, { mean: number; min: number; max: number; std: number }> = {};
  const categoricalDistributions: Record<string, Record<string, number>> = {};

  headers.forEach((col, colIdx) => {
    missingValuesSummary[col] = 0;
    const values = rows.map((r) => r[colIdx]).filter((v) => v !== undefined && v !== '');

    missingValuesSummary[col] = rows.length - values.length;

    const numValues = values.map((v) => Number(v)).filter((v) => !isNaN(v));

    if (numValues.length > rows.length * 0.7 && numValues.length > 0) {
      const min = Math.min(...numValues);
      const max = Math.max(...numValues);
      const mean = Number((numValues.reduce((a, b) => a + b, 0) / numValues.length).toFixed(2));
      const variance = numValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numValues.length;
      const std = Number(Math.sqrt(variance).toFixed(2));
      numericalStats[col] = { mean, min, max, std };
    } else {
      const dist: Record<string, number> = {};
      values.slice(0, 50).forEach((v) => {
        dist[v] = (dist[v] || 0) + 1;
      });
      categoricalDistributions[col] = dist;
    }
  });

  return {
    id: `ds_${Date.now()}`,
    filename,
    uploadedAt: new Date().toISOString(),
    rowCount: rows.length,
    columnCount: headers.length,
    columns: headers,
    missingValuesSummary,
    numericalStats,
    categoricalDistributions,
  };
}

export async function explainDatasetWithFanar(analysis: StoredDatasetAnalysis): Promise<string> {
  const prompt = `
قام الطالب بتحميل ملف بيانات بحثية حقيقية باسم: ${analysis.filename}
ملخص البيانات المحسوبة رقمياً:
- عدد العينات/الصفوف: ${analysis.rowCount}
- عدد الأعمدة/المتغيرات: ${analysis.columnCount}
- المتغيرات الرئيسية: ${analysis.columns.join(', ')}
- الإحصاءات الوصفية للمتغيرات الرقمية: ${JSON.stringify(analysis.numericalStats)}
- ملخص القيم المفقودة: ${JSON.stringify(analysis.missingValuesSummary)}

المطلوب:
1. قدم قراءة أكاديمية رصينة ومفسرة لهذه الأرقام والنتائج المحسوبة.
2. وضح دلالات المتوسطات والانحراف المعياري للمتغيرات في سياق البحث العلمي.
3. قدم توصيات إحصائية لتحسين جودة البيانات واختيار الاختبارات المناسبة (مثل ANOVA أو t-test).
لا تختلق أي أرقام غير المذكورة أعلاه.
`;

  const messages: FanarChatMessage[] = [
    { role: 'system', content: METHODOLOGY_SYSTEM_PROMPT },
    { role: 'user', content: prompt }
  ];

  const result = await fanarAdapter.generateResponse({
    messages,
    temperature: 0.3,
    maxTokens: 1400,
  });

  return result.content;
}
