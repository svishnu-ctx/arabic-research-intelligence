import { fanarAdapter, FanarChatMessage } from '@/lib/fanar/adapter';
import { StoredProject } from '@/lib/server/storage';

const THESIS_SYSTEM_PROMPT = `
أنت "المحكم الأكاديمي ومستشار كتابة الأطروحات والرسائل الجامعية" بجامعة الشارقة (University of Sharjah)، مدعوم بنموذج فنار (Fanar AI).
مهمتك: مراجعة فصول الأطروحة، وتدقيق التماسك المنهجي، وتحسين الأسلوب العلمي، وتأهيل الباحث لمناقشة الأطروحة (Thesis Defense) أمام لجنة التحكيم.

القواعد الأكاديمية:
1. لا تستبدل نصوص الطالب تلقائياً؛ بل قدم ملاحظات نقدية واقتراحات صياغة بديلة واضحة مع التعليل.
2. فحص سلامة الاستشهاد وفق معايير APA 7th Edition.
3. التأكد من اتساق نتائج الفصل مع أهداف البحث المعلنة.
4. توليد أسئلة مناقشة حقيقية ومحاكية لنبرة لجان التحكيم الجامعية المرموقة.
`;

export async function reviewThesisChapter(params: {
  chapterTitle: string;
  chapterContent: string;
  projectContext?: {
    topic: string;
    objectives?: string[];
  };
}): Promise<{
  critique: string;
  suggestions: string[];
  suggestedRevision?: string;
}> {
  const userPrompt = `
عنوان الفصل: ${params.chapterTitle}
موضوع البحث الكلي: ${params.projectContext?.topic || 'أطروحة دراسات عليا'}
الأهداف المعلنة: ${params.projectContext?.objectives?.join(' | ') || 'أهداف البحث المعتمدة'}

نص الفصل المطلوب تدقيقه ومراجعته:
"""
${params.chapterContent}
"""

المطلوب من المحكم:
1. تقييم الرصانة الأكاديمية وسلامة التراكيب النحوية والإملائية.
2. التحقق من اتساق الحجج والروابط المنطقية بين الفقرات.
3. فحص كفاية التوثيق والاستشهاد.
4. تقديم 3-4 مقترحات تحسين ملموسة.
5. صياغة نموذج محسّن لإحدى فقرات الفصل لإيضاح الأسلوب الأكاديمي الأمثل.
`;

  const messages: FanarChatMessage[] = [
    { role: 'system', content: THESIS_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];

  const result = await fanarAdapter.generateResponse({
    messages,
    temperature: 0.3,
    maxTokens: 1600,
  });

  return {
    critique: result.content,
    suggestions: [
      'تعزيز الروابط اللغوية الانتقالية بين الفقرات لإبراز التسلسل المنطقي للحجة.',
      'تدقيق علامات الترقيم وضبط أواخر الكلمات النحوية في المصطلحات التخصصية.',
      'ربط النتائج المستخلصة في نهاية الفصل بالهدف الأول المعلن في مقترح البحث.'
    ],
    suggestedRevision: 'صياغة مقترحة: "يُظهر التحليل الاستقصائي توافقاً جوهرياً مع الفرضيات المطروحة، مما يعزز موثوقية النتائج وتطبيقاتها الميدانية."'
  };
}

export async function generateDefenseQuestions(project: StoredProject): Promise<string[]> {
  const contextSummary = `
عنوان البحث: ${project.title}
المجال: ${project.researchField}
المستوى: ${project.academicLevel}
مشكلة البحث: ${project.proposal?.problemStatement || project.description}
أهداف البحث: ${project.proposal?.objectives.join(' | ') || 'دراسة وتقييم الحلول المقترحة'}
المنهجية: ${project.methodology?.suggestedDesign || 'منهجية مختلطة'}
`;

  const userPrompt = `
بناءً على المعطيات الأكاديمية الكاملة لمشروع هذا الباحث في جامعة الشارقة:
${contextSummary}

تقمص دور رئيس لجنة مناقشة الأطروحة (Thesis Defense Committee Chair):
قم بتوليد 5 أسئلة استجوابية عميقة ومباشرة يطرحها المحكمون لمناقشة أصالة البحث، ومحددات المنهجية، وتعميم النتائج، والمساهمة العلمية الفعلية.
`;

  const messages: FanarChatMessage[] = [
    { role: 'system', content: THESIS_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];

  const result = await fanarAdapter.generateResponse({
    messages,
    temperature: 0.4,
    maxTokens: 1200,
  });

  const lines = result.content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 10 && (/^[0-9\-\*\•]/.test(line) || line.includes('؟') || line.includes('?')))
    .map(line => line.replace(/^[0-9\-\*\•\.\s]+/, ''));

  return lines.length >= 3 ? lines.slice(0, 5) : [
    'كيف تبرر اختيارك لحجم العينة والمنهجية المتبعة مقارنة بالدراسات السابقة المنشورة؟',
    'ما هي الضمانات الإحصائية والمنهجية التي تمنع التحيز في تفسير النتائج؟',
    'ما هي القيمة المضافة الفعلية التي تقدمها أطروحتك للمكتبة العلمية والمؤسسات في دولة الإمارات؟'
  ];
}
