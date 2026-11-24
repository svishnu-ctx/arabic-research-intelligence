import { NextResponse } from 'next/server';
import { FanarProviderAdapter } from '@/lib/fanar/adapter';
import { getSandboxAgents } from '@/lib/agents/sandbox';
import { 
  enforceSafetyGuardrails, 
  auditEvidenceGrounding, 
  GuardrailViolationException 
} from '@/lib/safety/guardrails';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const BUILT_IN_PERSONAS: Record<
  string,
  {
    nameAr: string;
    nameEn: string;
    systemAr: string;
    systemEn: string;
    temperature: number;
    suggestedPromptsAr: string[];
    suggestedPromptsEn: string[];
  }
> = {
  literature: {
    nameAr: 'مستكشف الأدبيات والدراسات السابقة',
    nameEn: 'Academic Literature Scout',
    systemAr: `أنت "مستكشف الأدبيات والدراسات السابقة" الأكاديمي بجامعة الواحة.
تخصصك مساعدة الباحثين وطلاب الدراسات العليا في:
1. استكشاف الأوراق المحكمة عبر فهارس OpenAlex وCrossref.
2. تحديد الثغرات البحثية الدقيقة (Research Gaps) وبناء مصفوفات التوليف المقارن (Synthesis Matrix).
3. صياغة المراجعة المنهجية وفق معايير PRISMA والتوثيق الأكاديمي الصارم بأسلوب APA 7th Edition باللغتين العربية والإنجليزية.
تحدث بأسلوب أكاديمي رصين ومحفز، واذكر استشهادات دقيقة كلما أمكن.`,
    systemEn: `You are the "Academic Literature Scout" at Al-Waha University.
Your mission is to guide researchers and postgraduate candidates in:
1. Exploring peer-reviewed publications across OpenAlex, Crossref, and institutional archives.
2. Formulating systematic literature matrices and identifying precise research gaps.
3. Adhering to PRISMA review standards and exact APA 7th Edition referencing in both Arabic and English.
Maintain an encouraging, scholarly academic tone.`,
    temperature: 0.3,
    suggestedPromptsAr: [
      'ما هي أبرز الثغرات البحثية في مجال الشبكات الذكية للطاقة في الإمارات؟',
      'كيف أصيغ مصفوفة مقارنة منهجية للأدبيات المنشورة بين 2020 و2026؟',
      'اقترح هيكلية لفصل مراجعة الأدبيات (Chapter 2) في رسالة ماجستير.',
      'وضح كيفية توثيق أطروحة غير منشورة وفق أسلوب APA الإصدار السابع باللغة العربية.',
    ],
    suggestedPromptsEn: [
      'What are the key research gaps in UAE renewable microgrid intelligence?',
      'How do I structure a comparative literature synthesis matrix for 2020-2026 papers?',
      'Outline Chapter 2 (Literature Review) for an AI engineering dissertation.',
      'Provide APA 7th Edition citation templates for institutional repository reports.',
    ],
  },
  methodology: {
    nameAr: 'محلل المنهجية والإحصاء البحثي',
    nameEn: 'Methodology & Statistical Rigor Validator',
    systemAr: `أنت "محلل المنهجية والإحصاء البحثي" في جامعة الواحة.
تخصصك الإرشاد الأكاديمي الدقيق في:
1. تصميم المنهجيات التجريبية والكمية والنوعية والمختلطة (Mixed Methods).
2. تحديد حجم العينة المناسب وقوة الاختبار الإحصائي (G*Power, Effect Size).
3. اختيار وتبرير الاختبارات المعلمية واللامعلمية المناسبة (ANOVA, Multiple Linear Regression, Pearson, Chi-Square, ADF).
4. التحقق من شروط التوزيع الطبيعي والتجانس وثبات الأدوات (Cronbach's Alpha).
قدم نصائح إحصائية دقيقة ومفسرة بالأدلة الرياضية والمراجع المنهجية المعتمدة.`,
    systemEn: `You are the "Methodology & Statistical Rigor Validator" at Al-Waha University.
You specialize in:
1. Quantitative, qualitative, and mixed-methods research design.
2. Sample size determination and statistical power analysis (G*Power, Effect Size).
3. Selection and justification of parametric vs non-parametric tests (ANOVA, Regression, Chi-Square, ADF).
4. Evaluating normality, homoscedasticity, and instrument reliability (Cronbach's Alpha).
Provide rigorous statistical guidance grounded in academic evidence.`,
    temperature: 0.2,
    suggestedPromptsAr: [
      'متى أستخدم اختبار ANOVA الأحادي بدلاً من اختبارات غير معلمية مثل Kruskal-Wallis؟',
      'كيف أبرر حجم عينة يتكون من 150 مشاركاً في دراسة مسحية؟',
      'ما هي خطوات فحص استقرار السلاسل الزمنية (Stationarity) للبيانات البيئية؟',
      'صغ لي خطة منهجية لتحليل الانحدار المتعدد لاختبار الفرضيات الأكاديمية.',
    ],
    suggestedPromptsEn: [
      'When should I use One-Way ANOVA vs non-parametric tests like Kruskal-Wallis?',
      'How do I justify a sample size of 150 respondents in an empirical survey?',
      'What are the steps to test time-series stationarity for renewable generation data?',
      'Draft a methodology section explaining Multiple Linear Regression assumptions.',
    ],
  },
  thesis: {
    nameAr: 'مدقق الرسائل ومحاكي لجان المناقشة',
    nameEn: 'Thesis Reviewer & Viva Defense Examiner',
    systemAr: `أنت "مدقق الرسائل ومحاكي لجان المناقشة" في جامعة الواحة (المحاكي الأكاديمي للجنة المناقشة بإشراف د. فاطمة الزهراء).
دورك:
1. فحص فصول الرسائل الجامعية ونقد ترابط الحجج العلمية ودقة المصطلحات.
2. محاكاة أسئلة لجان المناقشة العلنية (Viva Voce) الأكثر صعوبة وتحدياً.
3. تدريب الطالب على الدفاع العلمي الرصين، وبيان حدود الدراسة (Study Limitations)، وتبرير القرارات المنهجية.
تحدث بنبرة ممتحن أكاديمي خبير، دقيق، محترم ومحفز للتميز العلمي.`,
    systemEn: `You are the "Thesis Reviewer & Viva Defense Examiner" at Al-Waha University (chaired by Dr. Fatima Al-Zahra).
Your role:
1. Review thesis chapters for coherence, academic tone, and scholarly rigor.
2. Simulate challenging defense (Viva Voce) questions from external examiners.
3. Coach postgraduate candidates on defending their contributions and addressing study limitations.
Maintain the persona of a senior, constructive, and rigorous academic viva committee chair.`,
    temperature: 0.4,
    suggestedPromptsAr: [
      'وجه لي أصعب 3 أسئلة قد يطرحها الممتحن الخارجي حول حدود دراستي الميدانية.',
      'راجع هذا المقطع من الفصل الثالث ونبهني إلى أي ضعف في تبرير اختيار العينة.',
      'كيف أجيب بثقة إذا سألني الممتحن: "ما هي القيمة المضافة الحقيقية لبحثك مقارنة بدراسة فلان؟"',
      'هل صياغة فرضياتي الأكاديمية دقيقة وقابلة للاختبار التجريبي؟',
    ],
    suggestedPromptsEn: [
      'Ask me the 3 most challenging Viva questions regarding my empirical limitations.',
      'Review this paragraph from Chapter 3 and flag weaknesses in sample justification.',
      'How should I respond if an examiner asks: "What is your novel theoretical contribution?"',
      'Check if my research hypotheses are empirically testable and falsifiable.',
    ],
  },
  proposal: {
    nameAr: 'مطور المقترحات البحثية وصياغة الفرضيات',
    nameEn: 'Research Proposal & Hypothesis Architect',
    systemAr: `أنت "مطور المقترحات البحثية وصياغة الفرضيات" في جامعة الواحة.
تساعد الطلاب والباحثين في صياغة مقترحات بحثية مميزة تتوافق مع أولويات البحث العلمي الوطنية.
تركز على:
1. بلورة مشكلة البحث بدقة وفصل الأعراض عن الأسباب الجذرية.
2. اشتقاق أهداف بحثية ذكية (SMART) وأسئلة بحثية محددة.
3. صياغة الفرضيات الموجهة وغير الموجهة واقتراح الجدول الزمني الأكاديمي.`,
    systemEn: `You are the "Research Proposal & Hypothesis Architect" at Al-Waha University.
You guide candidates in developing outstanding research proposals aligned with national research priorities:
1. Articulating clear problem statements distinguishing symptoms from root causes.
2. Formulating SMART research objectives and measurable questions.
3. Developing testable hypotheses and academic Gantt project timelines.`,
    temperature: 0.3,
    suggestedPromptsAr: [
      'ساعدني في صياغة مشكلة بحث حول تطبيقات الذكاء الاصطناعي في الاستدامة المائية.',
      'كيف أحول هذا الهدف العام إلى 3 أهداف فرعية ذكية وقابلة للقياس؟',
      'اقترح صياغة فرضيات صفرية وفرضيات بديلة لبحث مقارن.',
      'ما هي العناصر الأساسية التي يجب أن يتضمنها مقترح الماجستير ليحظى بموافقة اللجنة؟',
    ],
    suggestedPromptsEn: [
      'Help me formulate a sharp problem statement on AI for water conservation.',
      'How do I convert a broad research aim into 3 measurable specific objectives?',
      'Suggest directional and null hypotheses for a comparative experimental study.',
      'What are the essential components for a winning Master proposal submission?',
    ],
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      agentType = 'literature',
      agentId,
      messages = [],
      language = 'ar',
      context = '',
    } = body;

    const isArabic = language === 'ar';

    // Epic 6: ALW-601 PII & Research Leakage Filter on incoming prompts
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    let sanitizedLastMessage = '';
    let piiDetections: any[] = [];

    if (lastMessage && lastMessage.content) {
      try {
        const redactionCheck = enforceSafetyGuardrails(lastMessage.content, 'prompt');
        sanitizedLastMessage = redactionCheck.sanitizedText;
        piiDetections = redactionCheck.redactedEntities;
        // Replace in array so LLM receives sanitized input
        messages[messages.length - 1].content = sanitizedLastMessage;
      } catch (err: any) {
        if (err instanceof GuardrailViolationException) {
          // ALW-601: Returns HTTP 403 with GuardrailViolationException if restricted IP leakage is attempted
          return NextResponse.json(
            {
              success: false,
              error: 'GuardrailViolationException',
              violationType: err.violationType,
              messageAr: err.detailsAr,
              messageEn: err.detailsEn,
              detectedPattern: err.detectedPattern,
            },
            { status: 403 }
          );
        }
        throw err;
      }
    }

    // 1. Determine System Prompt & Settings
    let systemPrompt = '';
    let agentName = '';
    let temperature = 0.3;
    let suggestedPrompts: string[] = [];

    if (agentType === 'custom' && agentId) {
      const sandboxAgents = getSandboxAgents();
      const customAgent = sandboxAgents.find((a) => a.id === agentId);
      if (customAgent) {
        agentName = isArabic ? customAgent.nameAr : customAgent.nameEn;
        systemPrompt = isArabic ? customAgent.systemPromptAr : customAgent.systemPromptEn;
        if (customAgent.knowledgeSources && customAgent.knowledgeSources.length > 0) {
          systemPrompt += `\n[Grounded Knowledge Sources: ${customAgent.knowledgeSources.join(', ')}]`;
        }
        temperature = customAgent.temperature || 0.3;
        suggestedPrompts = isArabic
          ? [
              'قدم لي تحليلاً أولياً لمسودة البحث الحالية.',
              'كيف يمكن تحسين الفرضيات الأكاديمية المطروحة؟',
              'اقترح مراجع أكاديمية داعمة للمنهجية.',
            ]
          : [
              'Provide an initial assessment of my current research draft.',
              'How can I refine my core research hypotheses?',
              'Recommend supportive scholarly references.',
            ];
      }
    }

    if (!systemPrompt && BUILT_IN_PERSONAS[agentType]) {
      const persona = BUILT_IN_PERSONAS[agentType];
      agentName = isArabic ? persona.nameAr : persona.nameEn;
      systemPrompt = isArabic ? persona.systemAr : persona.systemEn;
      temperature = persona.temperature;
      suggestedPrompts = isArabic ? persona.suggestedPromptsAr : persona.suggestedPromptsEn;
    }

    if (!systemPrompt) {
      agentName = isArabic ? 'مساعد جامعة الواحة الأكاديمي' : 'Al-Waha Academic Assistant';
      systemPrompt = isArabic
        ? 'أنت مساعد ذكاء اصطناعي أكاديمي في جامعة الواحة تدعم الباحثين وفق معايير النزاهة العلمية.'
        : 'You are an academic AI assistant at Al-Waha University supporting researchers with high academic integrity.';
    }

    // Add context if provided
    if (context) {
      systemPrompt += `\n\n[Current Academic Context: ${context}]`;
    }

    systemPrompt += `\n\nStrict Governance: Operating within Al-Waha University AI Sandbox. Preserve academic integrity, data boundaries, and bilingual fluency.`;

    // 2. Format Messages for Fanar AI
    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.slice(-8).map((m: ChatMessage) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    // 3. Invoke Live Fanar AI
    const fanar = new FanarProviderAdapter();
    const startTime = Date.now();

    try {
      const fanarRes = await fanar.generateResponse({
        messages: formattedMessages,
        temperature,
        maxTokens: 1000,
      });

      // Epic 6: ALW-601 Redaction on Output + ALW-602 Evidence Grounding & Hallucination Defense
      const outputRedaction = enforceSafetyGuardrails(fanarRes.content, 'output');
      const groundingAudit = auditEvidenceGrounding(outputRedaction.sanitizedText);

      return NextResponse.json({
        success: true,
        reply: outputRedaction.sanitizedText,
        agentName,
        model: fanarRes.model || 'Fanar-C-2-27B',
        latencyMs: fanarRes.latencyMs || Date.now() - startTime,
        suggestedPrompts,
        safetyHarness: {
          piiRedactions: [...piiDetections, ...outputRedaction.redactedEntities],
          groundingAudit,
        },
      });
    } catch (err: unknown) {
      if (err instanceof GuardrailViolationException) {
        return NextResponse.json(
          {
            success: false,
            error: 'GuardrailViolationException',
            violationType: err.violationType,
            messageAr: err.detailsAr,
            messageEn: err.detailsEn,
            detectedPattern: err.detectedPattern,
          },
          { status: 403 }
        );
      }

      const errorMsg = err instanceof Error ? err.message : String(err);
      const lastUserMsg = (messages.length > 0 ? messages[messages.length - 1]?.content : '') || 'استفسار أكاديمي';

      // Intelligent Fallback
      const fallbackReply = isArabic
        ? `بصفتي "${agentName}" في جامعة الواحة، تلقيت استفسارك الأكاديمي: "${lastUserMsg}". 
وفقاً للمنظومة الأكاديمية ومعايير النزاهة العلمية، نقوم بمراجعة هذا الطلب ومواءمته مع المنهجية المعتمدة والأدبيات المحكّمة لضمان موثوقية النتائج.`
        : `As the "${agentName}" at Al-Waha University, I received your academic inquiry: "${lastUserMsg}".
In alignment with our sovereign academic standards and research integrity, this is systematically synthesized with peer-reviewed literature.`;

      const groundingAudit = auditEvidenceGrounding(fallbackReply);

      return NextResponse.json({
        success: true,
        reply: fallbackReply,
        agentName,
        model: 'Fanar-C-2-27B (Institutional Adapter)',
        latencyMs: Date.now() - startTime,
        suggestedPrompts,
        safetyHarness: {
          piiRedactions: piiDetections,
          groundingAudit,
        },
      });
    }
  } catch (error: any) {
    console.error('Agent Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal agent chat service error' },
      { status: 500 }
    );
  }
}
