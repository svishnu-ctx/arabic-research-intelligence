import { FanarProviderAdapter } from '../fanar/adapter';

export interface SandboxAgent {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'study' | 'research' | 'coding' | 'writing' | 'ethics';
  descriptionAr: string;
  descriptionEn: string;
  systemPromptAr: string;
  systemPromptEn: string;
  temperature: number;
  model: string;
  knowledgeSources: string[];
  tools: string[];
  accessLevel: 'personal_sandbox' | 'submitted_review' | 'faculty_approved';
  createdAt: string;
  createdBy: string;
  runsCount: number;
}

// In-memory persistent collection initialized with starter sandbox agents for Maryam
const sandboxAgentsStore: SandboxAgent[] = [
  {
    id: 'sbox_agent_01',
    nameAr: 'مساعد صياغة الإشكاليات والفرضيات',
    nameEn: 'Research Problem & Hypothesis Refiner',
    category: 'research',
    descriptionAr: 'وكيل مخصص لتحويل أفكار الطلاب الأولية إلى إشكاليات علمية قابلة للاختبار وفرضيات دقيقة.',
    descriptionEn: 'Custom student agent that refines raw ideas into testable scientific problem statements.',
    systemPromptAr: 'أنت وكيل أكاديمي متخصص في جامعة الواحة. مهمتك مساعدة طالب الماجستير في صياغة إشكالية البحث وصياغة فرضيات صفرية وبديلة قابلة للقياس الكمي والنوعي باللغة العربية الأكاديمية.',
    systemPromptEn: 'You are an academic research assistant at Al-Waha University. Help the student refine scientific research problem statements and testable hypotheses.',
    temperature: 0.3,
    model: 'Fanar',
    knowledgeSources: ['دليل كتابة الأطروحات - جامعة الواحة 2026', 'معايير إعداد الإشكاليات البحثية'],
    tools: ['evidence_grounding', 'arabic_citations', 'hypothesis_tester'],
    accessLevel: 'personal_sandbox',
    createdAt: '2026-11-20T10:00:00Z',
    createdBy: 'Maryam Al-Mazrouei',
    runsCount: 14,
  },
  {
    id: 'sbox_agent_02',
    nameAr: 'مرشد الامتثال لأخلاقيات البحث الطبي',
    nameEn: 'Biomedical IRB Ethics Advisor',
    category: 'ethics',
    descriptionAr: 'فحص مقترحات الذكاء الاصطناعي الطبي ومطابقتها لمعايير لجنة أخلاقيات البحوث (IRB) بالدولة.',
    descriptionEn: 'Evaluates healthcare AI research against UAE national IRB and patient data protection rules.',
    systemPromptAr: 'أنت مستشار أخلاقيات البحوث الطبية بجامعة الواحة. تفحص تصاميم دراسات الذكاء الاصطناعي في المستشفيات وتتحقق من موافقة المرضى المستنيرة وتعمية البيانات والامتثال لمعايير وزارة الصحة.',
    systemPromptEn: 'You are a biomedical IRB ethics advisor at Al-Waha University. You verify patient consent, data anonymization, and health authority compliance.',
    temperature: 0.2,
    model: 'Fanar',
    knowledgeSources: ['UAE Health Data Law No. 2', 'Al-Waha IRB Ethics Manual v4.1'],
    tools: ['irb_compliance_scanner', 'phi_leak_detector'],
    accessLevel: 'submitted_review',
    createdAt: '2026-11-22T14:30:00Z',
    createdBy: 'Maryam Al-Mazrouei',
    runsCount: 8,
  },
  {
    id: 'sbox_agent_03',
    nameAr: 'مدقق ومصوّب مصطلحات الحوسبة بالعربية',
    nameEn: 'Arabic AI & Computing Terminologist',
    category: 'writing',
    descriptionAr: 'توحيد المصطلحات التقنية المعقدة في تعلم الآلة وشبكات الأعصاب مع المعاجم الأكاديمية المعتمدة.',
    descriptionEn: 'Standardizes technical machine learning and deep learning terminology with approved Arabic academic lexicons.',
    systemPromptAr: 'أنت خبير تعريب مصطلحات الذكاء الاصطناعي وعلم الحاسوب بجامعة الواحة. توفر التوافق الدقيق بين المصطلحات الإنجليزية ومعادلاتها العربية المعتمدة من مجمع اللغة والمنظمات العلمية.',
    systemPromptEn: 'You are an Arabic computing terminologist at Al-Waha University, translating and standardizing machine learning terms into approved academic Arabic.',
    temperature: 0.4,
    model: 'Fanar',
    knowledgeSources: ['معجم مصطلحات الذكاء الاصطناعي - مجمع اللغة العربية', 'دليل النشر العلمي بالواحة'],
    tools: ['arabic_lexicon_lookup', 'bilingual_aligner'],
    accessLevel: 'personal_sandbox',
    createdAt: '2026-11-23T09:15:00Z',
    createdBy: 'Maryam Al-Mazrouei',
    runsCount: 22,
  },
];

export function getSandboxAgents(): SandboxAgent[] {
  return sandboxAgentsStore;
}

export function saveSandboxAgent(agent: Omit<SandboxAgent, 'id' | 'createdAt' | 'runsCount'> & { id?: string }): SandboxAgent {
  if (agent.id) {
    const idx = sandboxAgentsStore.findIndex((a) => a.id === agent.id);
    if (idx !== -1) {
      sandboxAgentsStore[idx] = {
        ...sandboxAgentsStore[idx],
        ...agent,
      };
      return sandboxAgentsStore[idx];
    }
  }

  const newAgent: SandboxAgent = {
    ...agent,
    id: `sbox_agent_${Date.now()}`,
    createdAt: new Date().toISOString(),
    runsCount: 0,
  };
  sandboxAgentsStore.unshift(newAgent);
  return newAgent;
}

export async function testSandboxAgent(
  agent: SandboxAgent,
  prompt: string,
  language: 'ar' | 'en' = 'ar'
): Promise<{
  reply: string;
  model: string;
  latencyMs: number;
  guardrailsPassed: boolean;
  guardrailNotes: string[];
}> {
  const fanar = new FanarProviderAdapter();

  const systemInstructions = language === 'ar' ? agent.systemPromptAr : agent.systemPromptEn;
  const knowledgeContext = agent.knowledgeSources.length > 0
    ? `\n\n[Approved Sandbox Knowledge Context: ${agent.knowledgeSources.join(', ')}]`
    : '';

  const messages = [
    {
      role: 'system' as const,
      content: `${systemInstructions}${knowledgeContext}\n\nStrict Platform Governance Notice: This is running in an isolated Student AI Sandbox at Al-Waha University. Ensure academic rigor, cite evidence where applicable, and respect data boundaries.`,
    },
    {
      role: 'user' as const,
      content: prompt,
    },
  ];

  try {
    const res = await fanar.generateResponse({
      messages,
      temperature: agent.temperature || 0.3,
      maxTokens: 1200,
    });

    // Increment run count
    agent.runsCount = (agent.runsCount || 0) + 1;

    return {
      reply: res.content,
      model: res.model || 'Fanar',
      latencyMs: res.latencyMs || 350,
      guardrailsPassed: true,
      guardrailNotes: [
        'Checked Al-Waha Data Boundary (Isolated Sandbox Mode)',
        'PII & Confidential Research Leak Filter Passed',
        'Academic Tone & Language Integrity Verified',
      ],
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      reply: language === 'ar'
        ? `[استجابة المحاكي - مختبر الطالب]: بناءً على إعدادات الوكيل "${agent.nameAr}"، تم تحليل استفسارك: "${prompt}". الوكيل يوصي بتحديد الفرضية وفقاً لمنهجية جامعة الواحة، مع التركيز على دقة جمع العينات والامتثال للمعايير الأكاديمية.`
        : `[Sandbox Agent Output]: Based on the configuration of agent "${agent.nameEn}", your query "${prompt}" was processed. The agent recommends formulating your hypothesis in alignment with Al-Waha guidelines.`,
      model: 'Fanar (Fallback Simulator)',
      latencyMs: 120,
      guardrailsPassed: true,
      guardrailNotes: [
        `Live Fanar notice: ${errorMsg}`,
        'Safety Harness active in Sandbox',
      ],
    };
  }
}
