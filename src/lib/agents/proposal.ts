import { fanarAdapter, FanarChatMessage } from '@/lib/fanar/adapter';
import { StoredProposal } from '@/lib/server/storage';

const SYSTEM_PROMPT = `
أنت "المستشار الذكي لتطوير المقترحات البحثية" في جامعة الواحة (Al-Waha University)، مدعوم بنموذج فنار (Fanar AI).
مهمتك: مساعدة طلبة البكالوريوس، والماجستير، والدكتوراه في تحويل أفكارهم البحثية الأولية إلى مقترحات أكاديمية رصينة ومتكاملة الأركان.

السياسات الأكاديمية الصارمة:
1. التزم باللغة الأكاديمية الرصينة (سواء بالعربية الفصحى المعاصرة أو بالإنجليزية وفق طلب الطالب).
2. لا تختلق مصادر أو مراجع وهمية مطلقاً.
3. ميز بدقة بين الحقائق الأكاديمية المثبتة والفرضيات المقترحة.
4. اتبع المعايير المعتمدة في كليات جامعة الواحة للدراسات العليا.

يجب أن تولد المقترح بصيغة JSON واضحة ومحددة تحتوي الحقول التالية بالضبط:
{
  "title": "عنوان البحث المقترح",
  "background": "خلفية البحث وسياقه النظري",
  "problemStatement": "صياغة المشكلة البحثية بدقة",
  "objectives": ["الهدف الأول", "الهدف الثاني", "الهدف الثالث"],
  "questions": ["السؤال الأول", "السؤال الثاني"],
  "hypotheses": ["الفرضية الأولى إن وجدت"],
  "scopeAndLimitations": "نطاق البحث ومحدداته الزمانية والمكانية",
  "expectedContribution": "المساهمة العلمية والتطبيقية المتوقعة",
  "suggestedNextSteps": "الخطوات المنهجية اللاحقة الموصى بها"
}
`;

export async function generateResearchProposal(params: {
  field: string;
  level: string;
  interests: string;
  idea: string;
  language?: 'ar' | 'en';
}): Promise<StoredProposal> {
  const userPrompt = `
${params.language === 'en' ? 'STRICT LANGUAGE DIRECTIVE: You MUST generate all JSON string values, titles, objectives, questions, hypotheses, and text strictly in Academic English only. Do NOT output Arabic.' : 'تعليمات لغوية صارمة: يجب توليد جميع حقول JSON، العناوين، الأهداف، الأسئلة، والفرضيات باللغة العربية الفصحى الأكاديمية المعاصرة فقط. لا تستخدم الإنجليزية.'}

مجال البحث: ${params.field}
المستوى الأكاديمي للطالب: ${params.level}
الاهتمامات البحثية: ${params.interests}
الفكرة الأولية للطالب: ${params.idea}
لغة المخرجات المطلوبة: ${params.language === 'en' ? 'Academic English' : 'العربية الفصحى المعاصرة'}

قم بتوليد مقترح بحثي متكامل مستوفٍ لجميع الحقول بصيغة JSON.
`;

  const messages: FanarChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];

  const result = await fanarAdapter.generateResponse({
    messages,
    temperature: 0.3,
    maxTokens: 1600,
  });

  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const rawObjectives = parsed.objectives || [];
      const objectives = Array.isArray(rawObjectives) ? rawObjectives : [rawObjectives].filter(Boolean);

      const rawQuestions = parsed.questions || parsed.researchQuestions || [];
      const questions = Array.isArray(rawQuestions) ? rawQuestions : [rawQuestions].filter(Boolean);

      const rawContrib = parsed.potentialContributions || parsed.expectedContribution || [];
      const contributions = Array.isArray(rawContrib) ? rawContrib : [rawContrib].filter(Boolean);

      const rawSteps = parsed.suggestedNextSteps || [];
      const nextSteps = Array.isArray(rawSteps) ? rawSteps : [rawSteps].filter(Boolean);

      return {
        id: `prop_${Date.now()}`,
        title: parsed.title || params.idea,
        background: parsed.background || '',
        problemStatement: parsed.problemStatement || '',
        objectives: objectives.length > 0 ? objectives : ['تحديد المشكلة البحثية وصياغة الإطار النظري'],
        questions: questions.length > 0 ? questions : ['ما هي العوامل الأساسية المؤثرة في الظاهرة المدروسة؟'],
        researchQuestions: questions.length > 0 ? questions : ['ما هي العوامل الأساسية المؤثرة في الظاهرة المدروسة؟'],
        hypotheses: Array.isArray(parsed.hypotheses) ? parsed.hypotheses : [],
        scopeAndLimitations: parsed.scopeAndLimitations || '',
        expectedContribution: typeof parsed.expectedContribution === 'string' ? parsed.expectedContribution : contributions.join('\n'),
        potentialContributions: contributions.length > 0 ? contributions : ['إثراء البحث العلمي والتطبيقي في جامعة الواحة'],
        suggestedNextSteps: typeof parsed.suggestedNextSteps === 'string' ? parsed.suggestedNextSteps : nextSteps.join('\n'),
        updatedAt: new Date().toISOString()
      } as any;
    }
  } catch {
    // If JSON parsing fails, structure cleanly from raw content
  }

  return {
    id: `prop_${Date.now()}`,
    title: params.idea.slice(0, 80),
    background: result.content.slice(0, 300),
    problemStatement: result.content,
    objectives: ['تحليل المشكلة البحثية وتحديد الفجوات', 'تطبيق منهجية علمية رصينة'],
    questions: ['ما هي العوامل المؤثرة في الظاهرة المدروسة؟'],
    researchQuestions: ['ما هي العوامل المؤثرة في الظاهرة المدروسة؟'],
    hypotheses: ['توجد علاقة ارتباطية إيجابية ذات دلالة إحصائية بين المتغيرات'],
    scopeAndLimitations: 'جامعة الواحة والمؤسسات الأكاديمية المماثلة.',
    expectedContribution: 'إثراء المكتبة العلمية بأدلة تجريبية حديثة.',
    potentialContributions: ['إثراء المكتبة العلمية بأدلة تجريبية حديثة.'],
    suggestedNextSteps: 'الانتقال إلى مرحلة مسح الأدبيات واستخراج المراجع المعتمدة.',
    updatedAt: new Date().toISOString()
  } as any;
}
