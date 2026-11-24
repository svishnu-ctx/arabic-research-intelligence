/**
 * Enterprise Agent Marketplace & Lifecycle Governance Types & Seed Data
 * Epic 5: ALW-EP5 (ALW-501 & ALW-502)
 */

export type DepartmentKey = 
  | 'engineering' 
  | 'medicine' 
  | 'business' 
  | 'humanities' 
  | 'sciences' 
  | 'interdisciplinary';

export type LanguageSupport = 'arabic' | 'bilingual' | 'english';

export type AgentLifecycleStage = 
  | 'Draft' 
  | 'Under Review' 
  | 'Active Production' 
  | 'Deprecated' 
  | 'Retired';

export interface AgentVersionRecord {
  version: string;
  releaseDate: string;
  changelogAr: string;
  changelogEn: string;
  author: string;
  regressionTestScore: number; // 0 - 100
  isCurrent: boolean;
}

export interface MarketplaceAgent {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  department: DepartmentKey;
  departmentAr: string;
  departmentEn: string;
  ownerNameAr: string;
  ownerNameEn: string;
  ownerRoleAr: string;
  ownerRoleEn: string;
  ownerAvatar?: string;
  language: LanguageSupport;
  currentVersion: string;
  stage: AgentLifecycleStage;
  rating: number; // e.g. 4.9
  reviewCount: number;
  totalExecutions: number;
  securityAuditDate: string;
  securityStatus: 'PASSED' | 'AUDIT_PENDING' | 'RENEWAL_REQUIRED';
  complianceLevel: 'ALWAHA_SOVEREIGN_TIER_1' | 'FEDERATED_TIER_2';
  tags: string[];
  samplePromptsAr: string[];
  samplePromptsEn: string[];
  systemPromptPreview: string;
  versionHistory: AgentVersionRecord[];
  targetAudience: ('undergraduate' | 'postgraduate' | 'faculty' | 'researcher')[];
  deprecationNotice?: {
    retiredAfterDate: string;
    recommendedAlternativeId: string;
    recommendedAlternativeTitle: string;
    reasonAr: string;
    reasonEn: string;
  };
}

export const INITIAL_MARKETPLACE_AGENTS: MarketplaceAgent[] = [
  {
    id: 'agent-mkt-001',
    slug: 'arabic-nlp-literature-synthesizer',
    titleAr: 'مستكشف الأدبيات التخصصية للذكاء الاصطناعي العربي',
    titleEn: 'Arabic NLP & LLM Literature Synthesizer',
    taglineAr: 'تجميع ومقارنة الأوراق العلمية ونماذج معالجة اللغة العربية الكبيرة',
    taglineEn: 'Systematic literature synthesis for Arabic NLP & Sovereign LLM architectures',
    descriptionAr: 'وكيل أكاديمي معتمد ومتخصص في استخراج ومقارنة المقالات العلمية المنشورة في مؤتمرات ACL وEMNLP وWANLP والمجلات المحكّمة. يقوم بتوليد مصفوفات المقارنة ونقد المنهجيات وفق معايير APA 7th.',
    descriptionEn: 'Vetted academic agent specializing in extracting and synthesizing papers from ACL, EMNLP, WANLP and high-impact journals. Builds comparative synthesis matrices and methodology critiques in full APA 7th style.',
    department: 'engineering',
    departmentAr: 'كلية الحوسبة والهندسة المعلوماتية',
    departmentEn: 'College of Computing & Informatics',
    ownerNameAr: 'د. مروان الكعبي',
    ownerNameEn: 'Dr. Marwan Al-Kaabi',
    ownerRoleAr: 'أستاذ مشارك - معمل الذكاء الاصطناعي العربي',
    ownerRoleEn: 'Associate Professor - Arabic AI Lab',
    language: 'bilingual',
    currentVersion: 'v2.1.0',
    stage: 'Active Production',
    rating: 4.9,
    reviewCount: 42,
    totalExecutions: 3840,
    securityAuditDate: '2026-10-15',
    securityStatus: 'PASSED',
    complianceLevel: 'ALWAHA_SOVEREIGN_TIER_1',
    tags: ['Arabic NLP', 'Literature Matrix', 'ACL/WANLP', 'APA 7th', 'Fanar'],
    samplePromptsAr: [
      'قارن بين أداء نماذج Fanar وJais في مهام الفهم القرائي باللغة العربية الفصحى المعاصرة.',
      'استخرج الثغرات البحثية في معالجة اللهجات الخليجية من أوراق آخر 3 سنوات.'
    ],
    samplePromptsEn: [
      'Synthesize current state-of-the-art architectures for sovereign Arabic foundational models.',
      'Extract methodological limitations in contemporary Gulf dialect sentiment analysis benchmarks.'
    ],
    systemPromptPreview: 'You are the sovereign Al-Waha Arabic NLP Literature Synthesizer. Ground all citations in peer-reviewed corpuses with verified DOIs...',
    versionHistory: [
      {
        version: 'v2.1.0',
        releaseDate: '2026-10-15',
        changelogAr: 'إضافة دعم تدقيق مؤتمرات WANLP 2026 ونماذج الفنار متعددة الوسائط.',
        changelogEn: 'Added WANLP 2026 conference corpus support and Fanar multimodal verification.',
        author: 'Dr. Marwan Al-Kaabi',
        regressionTestScore: 99.2,
        isCurrent: true
      },
      {
        version: 'v2.0.0',
        releaseDate: '2026-06-10',
        changelogAr: 'ترقية المعمارية لتدعم التوليد المتوازي للمصفوفات التخليقية الببليومترية.',
        changelogEn: 'Upgraded architecture to parallel generation of bibliometric synthesis matrices.',
        author: 'Dr. Marwan Al-Kaabi',
        regressionTestScore: 97.8,
        isCurrent: false
      },
      {
        version: 'v1.0.0',
        releaseDate: '2026-01-12',
        changelogAr: 'الإصدار التأسيسي المعتمد من عمادة الدراسات العليا.',
        changelogEn: 'Foundational release approved by the Deanship of Graduate Studies.',
        author: 'Dr. Marwan Al-Kaabi',
        regressionTestScore: 95.0,
        isCurrent: false
      }
    ],
    targetAudience: ['postgraduate', 'faculty', 'researcher']
  },
  {
    id: 'agent-mkt-002',
    slug: 'uae-clinical-irb-protocol-evaluator',
    titleAr: 'مدقق أخلاقيات البحوث الطبية والامتثال لبروتوكول IRB',
    titleEn: 'UAE Clinical Research & IRB Ethics Protocol Evaluator',
    taglineAr: 'فحص مسبق ومطابقة بروتوكولات البحوث الصحية مع معايير وزارة الصحة وحماية البيانات',
    taglineEn: 'Automated clinical research screening against UAE Health Data Laws and IRB mandates',
    descriptionAr: 'يفحص المقترحات الطبية والسريرية لرصد المعرفات المباشرة للمرضى (PII/PHI)، ويدقق نماذج الموافقة المستنيرة، ويحدد مستوى تصنيف المخاطر المعتمد (معفي، سريع، أو عرض كامل على اللجنة).',
    descriptionEn: 'Screens clinical research protocols for protected health information (PHI/PII), audits patient consent documentation, and classifies institutional risk (Exempt, Expedited, or Full Board).',
    department: 'medicine',
    departmentAr: 'كلية الطب والعلوم الصحية',
    departmentEn: 'College of Medicine & Health Sciences',
    ownerNameAr: 'د. فاطمة الشامسي',
    ownerNameEn: 'Dr. Fatima Al-Shamsi',
    ownerRoleAr: 'رئيسة لجنة أخلاقيات البحوث الطبية الحيوية',
    ownerRoleEn: 'Chair of Biomedical Ethics Committee',
    language: 'bilingual',
    currentVersion: 'v1.4.2',
    stage: 'Active Production',
    rating: 4.95,
    reviewCount: 36,
    totalExecutions: 1920,
    securityAuditDate: '2026-11-01',
    securityStatus: 'PASSED',
    complianceLevel: 'ALWAHA_SOVEREIGN_TIER_1',
    tags: ['IRB Ethics', 'Clinical Protocol', 'UAE Health Law', 'PHI Sanitization', 'Bioethics'],
    samplePromptsAr: [
      'دقق بروتوكول جمع عينات جينومية في مجتمع سكاني محلي وحدد متطلبات الموافقة المستنيرة.',
      'افحص منهجية دراسة وبائية سريرية وتأكد من خلوها من أي تسريب لبيانات ملفات المرضى.'
    ],
    samplePromptsEn: [
      'Audit clinical methodology involving diabetic retinopathy imaging under UAE Data Privacy laws.',
      'Evaluate informed consent clauses for pediatric observational cohorts.'
    ],
    systemPromptPreview: 'You are the official Al-Waha Institutional Review Board (IRB) Medical Protocol Evaluator. Uphold the highest sovereign bioethics standards...',
    versionHistory: [
      {
        version: 'v1.4.2',
        releaseDate: '2026-11-01',
        changelogAr: 'تحديث معايير الامتثال لقانون استخدام تكنولوجيا المعلومات والاتصالات في المجالات الصحية بالدولة.',
        changelogEn: 'Updated compliance rules to UAE Federal Law on health data exchange.',
        author: 'Dr. Fatima Al-Shamsi',
        regressionTestScore: 100.0,
        isCurrent: true
      },
      {
        version: 'v1.3.0',
        releaseDate: '2026-04-18',
        changelogAr: 'إضافة التقييم الآلي لاشتراطات أبحاث الذكاء الاصطناعي التوليدي في التشخيص السريري.',
        changelogEn: 'Added automated assessment rules for generative AI in clinical diagnostic trials.',
        author: 'Dr. Fatima Al-Shamsi',
        regressionTestScore: 98.4,
        isCurrent: false
      }
    ],
    targetAudience: ['postgraduate', 'faculty', 'researcher']
  },
  {
    id: 'agent-mkt-003',
    slug: 'islamic-finance-econometric-auditor',
    titleAr: 'محلل الاقتصاد القياسي وأبحاث الصيرفة الإسلامية',
    titleEn: 'Islamic Finance & Econometric Methodology Auditor',
    taglineAr: 'فحص التوافق الشرعي ومعادلات الاقتصاد القياسي ومصفوفات الارتباط المالية',
    taglineEn: 'Econometric specification tests and Shariah-compliant asset pricing auditor',
    descriptionAr: 'يراجع الأطروحات المالية والاقتصادية، ويتأكد من دقة اختبارات السلاسل الزمنية (ADF، Cointegration، GARCH)، ويتحقق من الالتزام بالمعايير الشرعية لهيئة أيوفي (AAOIFI).',
    descriptionEn: 'Reviews quantitative finance dissertations, verifying econometric time-series tests (ADF, Cointegration, GARCH) and compliance with international AAOIFI Shariah standards.',
    department: 'business',
    departmentAr: 'كلية إدارة الأعمال والاقتصاد',
    departmentEn: 'College of Business Administration',
    ownerNameAr: 'أ.د. طارق المنصوري',
    ownerNameEn: 'Prof. Tariq Al-Mansoori',
    ownerRoleAr: 'عميد كلية إدارة الأعمال',
    ownerRoleEn: 'Dean of Business Administration',
    language: 'arabic',
    currentVersion: 'v1.2.0',
    stage: 'Active Production',
    rating: 4.85,
    reviewCount: 29,
    totalExecutions: 1450,
    securityAuditDate: '2026-09-18',
    securityStatus: 'PASSED',
    complianceLevel: 'ALWAHA_SOVEREIGN_TIER_1',
    tags: ['Islamic Banking', 'AAOIFI', 'Econometrics', 'Time Series', 'Sukuk'],
    samplePromptsAr: [
      'تحقق من سلامة نموذج قياس أثر تقلبات أسعار الصكوك الخضراء على الاستقرار المالي.',
      'هل توجد شبهة غرر أو تداخل عقود في هيكلة أداة التحوط المقترحة في أطروحتي؟'
    ],
    samplePromptsEn: [
      'Verify the econometric stability of a GARCH model evaluating green Sukuk volatility.',
      'Check consistency with AAOIFI Standard No. 17 for Islamic investment sukuk.'
    ],
    systemPromptPreview: 'You are the Al-Waha Sovereign Econometric & Islamic Banking Research Auditor...',
    versionHistory: [
      {
        version: 'v1.2.0',
        releaseDate: '2026-09-18',
        changelogAr: 'إضافة معايير تدقيق معايير الحوكمة الشرعية لمعاملات التكنولوجيا المالية (FinTech).',
        changelogEn: 'Integrated Shariah governance criteria for financial technology (FinTech) protocols.',
        author: 'Prof. Tariq Al-Mansoori',
        regressionTestScore: 98.1,
        isCurrent: true
      }
    ],
    targetAudience: ['postgraduate', 'faculty', 'researcher']
  },
  {
    id: 'agent-mkt-004',
    slug: 'gulf-heritage-discourse-analyst',
    titleAr: 'محلل الخطاب والتراث الثقافي الخليجي',
    titleEn: 'Gulf Heritage & Critical Discourse Analyst',
    taglineAr: 'تحليل السرديات التاريخية، اللهجات الشفوية، ومخطوطات التراث العربي',
    taglineEn: 'Discourse analysis for regional oral histories, manuscript transcription, and cultural texts',
    descriptionAr: 'وكيل بحثي نوعي للعلوم الإنسانية، يقوم بالترميز الموضوعي (Thematic Coding)، وتحليل الخطاب النقدي (CDA)، وتوثيق المرويات التاريخية والمخطوطات التراثية لدول الخليج العربية.',
    descriptionEn: 'Qualitative research agent for humanities, performing thematic coding, critical discourse analysis (CDA), and archival documentation for Arabian Gulf oral histories and manuscripts.',
    department: 'humanities',
    departmentAr: 'كلية العلوم الإنسانية والاجتماعية',
    departmentEn: 'College of Humanities & Social Sciences',
    ownerNameAr: 'د. حصة الزعابي',
    ownerNameEn: 'Dr. Hessa Al-Zaabi',
    ownerRoleAr: 'رئيسة قسم التاريخ والآثار وتراث الإمارات',
    ownerRoleEn: 'Head of History, Archaeology & UAE Heritage',
    language: 'arabic',
    currentVersion: 'v1.1.0',
    stage: 'Active Production',
    rating: 4.88,
    reviewCount: 19,
    totalExecutions: 820,
    securityAuditDate: '2026-08-22',
    securityStatus: 'PASSED',
    complianceLevel: 'ALWAHA_SOVEREIGN_TIER_1',
    tags: ['Thematic Analysis', 'Oral History', 'Gulf Heritage', 'Manuscripts', 'Humanities'],
    samplePromptsAr: [
      'قم بتوليد إطار ترميز موضوعي (Coding Framework) لـ 20 مقابلة حول تاريخ الغوص وتجارة اللؤلؤ.',
      'حلل تحولات الخطاب التنموي في الوثائق التاريخية لنهضة دولة الإمارات العربية المتحدة.'
    ],
    samplePromptsEn: [
      'Generate a thematic coding scheme for oral narrative interviews on maritime pearl diving.',
      'Perform critical discourse analysis on regional educational policy evolutions 1971-2020.'
    ],
    systemPromptPreview: 'You are the Al-Waha Gulf Heritage & Discourse Analysis Specialist...',
    versionHistory: [
      {
        version: 'v1.1.0',
        releaseDate: '2026-08-22',
        changelogAr: 'تحسين قدرات تفسير المصطلحات البحرية القديمة ومفردات اللهجة الإماراتية.',
        changelogEn: 'Enhanced lexicon recognition for historical maritime Emirati dialect terminology.',
        author: 'Dr. Hessa Al-Zaabi',
        regressionTestScore: 96.5,
        isCurrent: true
      }
    ],
    targetAudience: ['undergraduate', 'postgraduate', 'faculty']
  },
  {
    id: 'agent-mkt-005',
    slug: 'quantum-cryptography-verifier-legacy',
    titleAr: 'محلل بروتوكولات التشفير ما بعد الكوانتم (نسخة سابقة)',
    titleEn: 'Post-Quantum Cryptographic Protocol Verifier (Legacy v0.9)',
    taglineAr: 'نسخة سابقة لفحص بروتوكولات Kyber/Dilithium - مجدولة للإحالة إلى التقاعد',
    taglineEn: 'Legacy protocol validator scheduled for retirement. Please migrate to v2.0.',
    descriptionAr: 'تم إطلاق هذا الوكيل كنسخة تجريبية مبكرة. تم استبداله بالوكيل المؤسسي v2.0 المعتمد والمدرج في حزمة الحوسبة المتقدمة. سيتم إيقاف تشغيله نهائياً خلال 30 يوماً.',
    descriptionEn: 'This agent was released as an early prototype. It has been superseded by the production v2.0 agent. It will be permanently retired in 30 days.',
    department: 'engineering',
    departmentAr: 'كلية الحوسبة والهندسة المعلوماتية',
    departmentEn: 'College of Computing & Informatics',
    ownerNameAr: 'م. سيف النعيمي',
    ownerNameEn: 'Eng. Saif Al-Nuaimi',
    ownerRoleAr: 'باحث دكتوراه في أمن المعلومات',
    ownerRoleEn: 'PhD Researcher in Cybersecurity',
    language: 'english',
    currentVersion: 'v0.9.4',
    stage: 'Deprecated',
    rating: 3.9,
    reviewCount: 14,
    totalExecutions: 610,
    securityAuditDate: '2026-03-01',
    securityStatus: 'RENEWAL_REQUIRED',
    complianceLevel: 'FEDERATED_TIER_2',
    tags: ['Cryptography', 'Post-Quantum', 'NIST', 'Deprecated'],
    samplePromptsAr: [
      'فحص كفاءة خوارزمية التشفير في مواجهة هجمات القنوات الجانبية.'
    ],
    samplePromptsEn: [
      'Audit lattice-based key exchange compliance with NIST post-quantum standard.'
    ],
    systemPromptPreview: 'You are an experimental cryptographic analyzer (Deprecated)...',
    versionHistory: [
      {
        version: 'v0.9.4',
        releaseDate: '2026-03-01',
        changelogAr: 'إعلان حالة الإهلاك والتحويل إلى النسخة الحديثة المعتمدة.',
        changelogEn: 'Marked as deprecated; migration path provided to v2.0.',
        author: 'Eng. Saif Al-Nuaimi',
        regressionTestScore: 82.0,
        isCurrent: true
      }
    ],
    targetAudience: ['postgraduate', 'researcher'],
    deprecationNotice: {
      retiredAfterDate: '2026-12-31',
      recommendedAlternativeId: 'agent-mkt-001',
      recommendedAlternativeTitle: 'مستكشف الأدبيات التخصصية للذكاء الاصطناعي العربي',
      reasonAr: 'انتهاء فترة الاختبار المعتمدة وصدور حزمة الحوسبة الكمومية v2.0 المتوافقة كلياً مع معايير الأمان الوطنية.',
      reasonEn: 'Superseded by verified enterprise quantum suite v2.0 aligned with UAE national cipher standards.'
    }
  },
  {
    id: 'agent-mkt-006',
    slug: 'smart-grid-renewable-energy-simulator',
    titleAr: 'محاكي تكامل شبكات الطاقة الشمسية والمتجددة',
    titleEn: 'Smart Grid & Solar PV Integration Simulator',
    taglineAr: 'محاكاة استقرار شبكات الكهرباء تحت ظروف المناخ الخليجي والحرارة المرتفعة',
    taglineEn: 'Grid stability and renewable photovoltaic integration under harsh arid climates',
    descriptionAr: 'قيد المراجعة والاعتماد الأكاديمي بواسطة لجنة البحث العلمي والهندسي. يقدم نماذج محاكاة لتذبذب الأحمال في محطات الطاقة الشمسية في صحراء الإمارات.',
    descriptionEn: 'Currently under formal review by the Faculty Engineering Research Board. Models smart grid frequency stabilization and PV degradation in arid environments.',
    department: 'engineering',
    departmentAr: 'كلية الحوسبة والهندسة المعلوماتية',
    departmentEn: 'College of Computing & Informatics',
    ownerNameAr: 'م. عائشة المزروعي',
    ownerNameEn: 'Eng. Aisha Al-Mazrouei',
    ownerRoleAr: 'باحثة ماجستير - هندسة الطاقة المستدامة',
    ownerRoleEn: 'Master Researcher - Sustainable Energy',
    language: 'bilingual',
    currentVersion: 'v0.5.0',
    stage: 'Under Review',
    rating: 4.6,
    reviewCount: 8,
    totalExecutions: 240,
    securityAuditDate: '2026-11-20',
    securityStatus: 'AUDIT_PENDING',
    complianceLevel: 'ALWAHA_SOVEREIGN_TIER_1',
    tags: ['Renewable Energy', 'Smart Grid', 'Solar PV', 'Under Review'],
    samplePromptsAr: [
      'محاكاة تراجع كفاءة الألواح الكهروضوئية عند درجات حرارة تتجاوز 45 مئوية مع الغبار.',
      'تحديد سعة التخزين بالبطاريات المثلى لمزرعة شمسية بقدرة 100 ميجاوات.'
    ],
    samplePromptsEn: [
      'Simulate high-temperature PV cell efficiency degradation during UAE summer months.',
      'Calculate optimal battery energy storage capacity (BESS) for peak shaving.'
    ],
    systemPromptPreview: 'You are the Al-Waha Smart Grid & Sustainable Energy Simulator (Candidate)...',
    versionHistory: [
      {
        version: 'v0.5.0',
        releaseDate: '2026-11-20',
        changelogAr: 'تقديم الوكيل للمراجعة الأكاديمية والتدقيق الأمني المؤسسي.',
        changelogEn: 'Submitted agent for formal board review and university security audit.',
        author: 'Eng. Aisha Al-Mazrouei',
        regressionTestScore: 91.5,
        isCurrent: true
      }
    ],
    targetAudience: ['postgraduate', 'researcher']
  }
];
