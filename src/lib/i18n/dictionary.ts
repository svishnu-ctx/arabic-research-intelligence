export type Language = 'ar' | 'en';

export interface Dictionary {
  common: {
    appName: string;
    universityName: string;
    tagline: string;
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    confirm: string;
    submit: string;
    save: string;
    delete: string;
    close: string;
    back: string;
    search: string;
    viewDetails: string;
    logout: string;
    status: string;
    actions: string;
    online: string;
    offline: string;
    accessDenied: string;
    unauthorizedMsg: string;
    sessionExpired: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    username: string;
    password: string;
    showPassword: string;
    hidePassword: string;
    signIn: string;
    signingIn: string;
    invalidCreds: string;
    accountLocked: string;
    demoNotice: string;
    roleAdmin: string;
    roleSupervisor: string;
    roleScholar: string;
    roleStudent: string;
  };
  nav: {
    dashboard: string;
    researchInsights: string;
    researchCorpus: string;
    sharedPapers: string;
    aiReview: string;
    myPapers: string;
    literatureResearch: string;
    comparePapers: string;
    researchOpportunities: string;
    myDocuments: string;
    documentIntelligence: string;
    academicAssistant: string;
    profileSettings: string;
  };
  roles: {
    admin: string;
    supervisor: string;
    scholar: string;
    student: string;
    deanTitle: string;
    supervisorTitle: string;
    scholarTitle: string;
    studentTitle: string;
  };
  privacy: {
    bannerTitle: string;
    bannerText: string;
    consentRequired: string;
    consentCheckbox: string;
    revokeConsent: string;
    consentRevoked: string;
    warningNotice: string;
  };
  documents: {
    uploadTitle: string;
    uploadSubtitle: string;
    dragDropText: string;
    selectFile: string;
    uploading: string;
    maxLimitNotice: string;
    processing: string;
    processed: string;
    failed: string;
    pageCount: string;
    fileSize: string;
    uploadedOn: string;
    noDocsYet: string;
    emptyCorpus: string;
    shareSupervisor: string;
    adminConsent: string;
    sharedWithSupervisor: string;
    adminOversightGranted: string;
    revokeAccess: string;
    confirmRevoke: string;
    deleteDoc: string;
    confirmDelete: string;
  };
  ai: {
    copilotTitle: string;
    disclaimer: string;
    evidenceBased: string;
    askQuestion: string;
    placeholderQuestion: string;
    generating: string;
    stopGeneration: string;
    physicalCitation: string;
    verifiedQuote: string;
    quoteMismatch: string;
    claimSupported: string;
    claimUnsupported: string;
    inconclusive: string;
    methodologyCritique: string;
    strengths: string;
    limitations: string;
    defenseQuestions: string;
    summaryTitle: string;
    problemStatement: string;
    keyFindings: string;
    comparativeMatrix: string;
    selectTwoDocs: string;
    compareButton: string;
    unavailableTitle: string;
    unavailableDesc: string;
  };
  labNav: {
    dashboard: string;
    models: string;
    benchmarks: string;
    testing: string;
    expertReview: string;
    speech: string;
    comparison: string;
    reports: string;
    settings: string;
  };
  lab: {
    appTitle: string;
    appSubtitle: string;
    demoBadge: string;
    modelsEvaluated: string;
    benchmarkTests: string;
    expertReviews: string;
    leadingModel: string;
    averageScore: string;
    modelOverview: string;
    evaluationCoverage: string;
    recentActivity: string;
    recommendationPreview: string;
    quickActions: string;
    compareModels: string;
    runTest: string;
    addModel: string;
    addBenchmark: string;
    submitReview: string;
    exportReport: string;
  };
}

export const dictionaries: Record<Language, Dictionary> = {
  ar: {
    common: {
      appName: 'مختبر تقييم الذكاء الاصطناعي العربي',
      universityName: 'جامعة الواحة',
      tagline: 'منصة تقييم ومقارنة نماذج الذكاء الاصطناعي وتقنيات الصوت باللغة العربية',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ غير متوقع',
      retry: 'إعادة المحاولة',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      submit: 'إرسال',
      save: 'حفظ',
      delete: 'حذف',
      close: 'إغلاق',
      back: 'رجوع',
      search: 'بحث...',
      viewDetails: 'عرض التفاصيل',
      logout: 'تسجيل الخروج',
      status: 'الحالة',
      actions: 'الإجراءات',
      online: 'متصل',
      offline: 'غير متصل',
      accessDenied: 'تم رفض الوصول',
      unauthorizedMsg: 'ليس لديك الصلاحيات الكافية لعرض هذه الصفحة.',
      sessionExpired: 'انتهت جلستك الحالية. يرجى تسجيل الدخول مجدداً.',
    },
    auth: {
      loginTitle: 'بوابة الدخول البحثية',
      loginSubtitle: 'تسجيل الدخول للنظام الأكاديمي الذكي بجامعة الواحة',
      username: 'اسم المستخدم الأكاديمي',
      password: 'كلمة المرور',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
      signIn: 'دخول المنظومة',
      signingIn: 'جاري التحقق من الهوية...',
      invalidCreds: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
      accountLocked: 'تم تأمين الحساب مؤقتاً بسبب تكرار المحاولات غير الناجحة. يرجى الانتظار 10 دقائق.',
      demoNotice: 'بيئة عرض تجريبية موجهة لأعضاء جامعة الواحة.',
      roleAdmin: 'مدير الجامعة / إدارة البحث العلمي',
      roleSupervisor: 'مشرف البحث العلمي',
      roleScholar: 'باحث دكتوراه',
      roleStudent: 'طالب دراسات عليا / ماجستير',
    },
    nav: {
      dashboard: 'لوحة التحكم',
      researchInsights: 'رؤى البحث المؤسسي',
      researchCorpus: 'قاعدة الأبحاث المعتمدة',
      sharedPapers: 'أبحاث الطلاب المشرف عليها',
      aiReview: 'مراجعة وتقييم الأبحاث',
      myPapers: 'أبحاثي المنشورة والمسودات',
      literatureResearch: 'البحث في المراجع والدراسات',
      comparePapers: 'المقارنة المنهجية بين ورقتين',
      researchOpportunities: 'الفرص والفجوات البحثية',
      myDocuments: 'مستنداتي الدراسية',
      documentIntelligence: 'التحليل المعرفي للورقة',
      academicAssistant: 'المساعد الأكاديمي الثنائي',
      profileSettings: 'الملف الشخصي والإعدادات',
    },
    roles: {
      admin: 'إدارة البحث العلمي',
      supervisor: 'مشرف أكاديمي',
      scholar: 'باحث دكتوراه',
      student: 'طالب دراسات عليا',
      deanTitle: 'أ.د. طارق النعيمي (عميد البحث العلمي)',
      supervisorTitle: 'د. فاطمة الزهراء (مشرف بحوث كلية العلوم)',
      scholarTitle: 'عمر المنصور (مرشح دكتوراه)',
      studentTitle: 'مريم القاسمي (طالبة ماجستير علوم حاسوب)',
    },
    privacy: {
      bannerTitle: 'إشعار خصوصية البيانات الأكاديمية (Google AI Studio Free Tier)',
      bannerText: 'تستخدم هذه المنظومة التجريبية نموذج Gemini المجاني. ووفق شروط الاستخدام المعتمدة، قد يتم تدقيق الأسئلة ونصوص الأوراق المستخرجة من قبل مراجعين بشريين لتحسين النماذج. يمنع منعاً باتاً تحميل وثائق جامعية سرية، أو بيانات شخصية، أو أبحاث غير منشورة.',
      consentRequired: 'موافقة خصوصية الذكاء الاصطناعي مطلوبة',
      consentCheckbox: 'أوافق صراحة على معالجة مقتطفات من هذه الورقة بواسطة محرك الذكاء الاصطناعي الخارجي، وأدرك إمكانية إلغاء الموافقة في أي وقت.',
      revokeConsent: 'إلغاء موافقة الذكاء الاصطناعي',
      consentRevoked: 'تم إلغاء موافقة الذكاء الاصطناعي لهذه الورقة بنجاح.',
      warningNotice: 'لا يمكن استرجاع المقتطفات التي تم إرسالها مسبقاً لمزود الخدمة الخارجي بعد الإرسال.',
    },
    documents: {
      uploadTitle: 'رفع ورقة بحثية جديدة (PDF)',
      uploadSubtitle: 'يدعم النظام استخراج النصوص والتحليل المنهجي المباشر للأوراق بصيغة PDF',
      dragDropText: 'اسحب ملف PDF وأفلته هنا، أو اضغط للاختيار من جهازك',
      selectFile: 'اختيار ملف PDF',
      uploading: 'جاري رفع واستخراج نصوص الورقة...',
      maxLimitNotice: 'الحد الأقصى: 10 ميغابايت لكل ملف، بحد أقصى 20 صفحة للورقة الواحدة.',
      processing: 'جاري المعالجة والاستخراج...',
      processed: 'جاهزة للتحليل الأكاديمي',
      failed: 'فشل الاستخراج (مستند ممسوح ضوئياً أو مشفر)',
      pageCount: 'عدد الصفحات',
      fileSize: 'حجم الملف',
      uploadedOn: 'تاريخ الإدراج',
      noDocsYet: 'لم يتم العثور على أوراق بحثية مضافة بعد.',
      emptyCorpus: 'القاعدة المرجعية المعتمدة متوفرة وجاهزة للتحليل.',
      shareSupervisor: 'مشاركة الورقة مع المشرف الأكاديمي',
      adminConsent: 'الموافقة على تضمين الورقة في التحليلات المؤسسية',
      sharedWithSupervisor: 'تمت المشاركة مع المشرف',
      adminOversightGranted: 'الموافقة المؤسسية مفعلة',
      revokeAccess: 'إلغاء المشاركة',
      confirmRevoke: 'هل أنت متأكد من رغبتك في إلغاء صلاحية الوصول؟',
      deleteDoc: 'حذف الورقة نهائياً',
      confirmDelete: 'هل أنت متأكد من حذف هذه الورقة البحثية؟ سيتم إزالتها من الذاكرة فوراً.',
    },
    ai: {
      copilotTitle: 'مساعد البحث الذكي الموثق',
      disclaimer: 'تنبيه: مخرجات الذكاء الاصطناعي هي استرشادية وتحتوي على استشهادات بالصفحات المادية المحددة للتحقق منها.',
      evidenceBased: 'توثيق مدعوم بالأدلة المادية',
      askQuestion: 'اطرح سؤالاً بحثياً حول الورقة...',
      placeholderQuestion: 'مثال: ما هي المحددات المنهجية التي واجهها الباحثون في تدريب النموذج؟',
      generating: 'جاري قراءة الورقة وتوليد الإجابة الموثقة...',
      stopGeneration: 'إيقاف التوليد',
      physicalCitation: 'صفحة المصدر المادية',
      verifiedQuote: 'اقتباس مطابق للأصل',
      quoteMismatch: 'اقتباس غير مطابق',
      claimSupported: 'الادعاء مدعوم بالسياق',
      claimUnsupported: 'الادعاء غير مدعوم',
      inconclusive: 'غير جازم',
      methodologyCritique: 'التقييم المنهجي والأكاديمي',
      strengths: 'نقاط القوة المنهجية',
      limitations: 'المحددات والثغرات البحثية',
      defenseQuestions: 'أسئلة مقترحة للجنة المناقشة',
      summaryTitle: 'الملخص الهيكلي للورقة البحثية',
      problemStatement: 'مشكلة البحث والهدف الأساسي',
      keyFindings: 'أهم النتائج التجريبية المستخلصة',
      comparativeMatrix: 'مصفوفة المقارنة المنهجية بين ورقتين',
      selectTwoDocs: 'اختر ورقتين بحثيتين لبدء المقارنة المنهجية',
      compareButton: 'توليد المقارنة التحليلية المباشرة',
      unavailableTitle: 'محرك التحليل الذكي غير مهيأ حالياً',
      unavailableDesc: 'لم يتم تزويد مفتاح Google Gemini API أو لم يتم استكمال التحقق من الخدمة. يمكنك تصفح المستندات والبيانات الوصفية بأمان.',
    },
    labNav: {
      dashboard: 'لوحة التقييم',
      models: 'سجل النماذج',
      benchmarks: 'مكتبة الاختبارات',
      testing: 'مساحة اختبار النماذج',
      expertReview: 'مراجعة الخبراء',
      speech: 'تقييم الكلام والصوت',
      comparison: 'مقارنة الأداء',
      reports: 'تقارير التقييم',
      settings: 'الإعدادات',
    },
    lab: {
      appTitle: 'مختبر تقييم الذكاء الاصطناعي العربي',
      appSubtitle: 'تقييم ومقارنة واختيار التقنيات اللغوية والصوتية الملائمة للتميز الأكاديمي',
      demoBadge: 'بيئة عرض تجريبية (بيانات استرشادية)',
      modelsEvaluated: 'النماذج الخاضعة للتقييم',
      benchmarkTests: 'اختبارات المعايرة الأكاديمية',
      expertReviews: 'المراجعات الخبيرة المنجزة',
      leadingModel: 'النموذج المتصدر',
      averageScore: 'متوسط درجة التقييم',
      modelOverview: 'نظرة عامة على أداء النماذج',
      evaluationCoverage: 'تغطية محاور التقييم',
      recentActivity: 'أحدث أنشطة التقييم اللغوي',
      recommendationPreview: 'ملخص توصيات الاختيار المؤسسي',
      quickActions: 'إجراءات سريعة',
      compareModels: 'مقارنة النماذج',
      runTest: 'تشغيل محاكاة الاختبار',
      addModel: 'إضافة نموذج جديد',
      addBenchmark: 'إضافة اختبار قياسي',
      submitReview: 'اعتماد المراجعة اللغوية',
      exportReport: 'تصدير التقرير التنفيذي',
    },
  },
  en: {
    common: {
      appName: 'Arabic AI Evaluation Lab',
      universityName: 'Al-Waha University',
      tagline: 'Evaluation workspace for Arabic AI language models and speech technologies',
      loading: 'Loading...',
      error: 'An unexpected error occurred',
      retry: 'Retry',
      cancel: 'Cancel',
      confirm: 'Confirm',
      submit: 'Submit',
      save: 'Save',
      delete: 'Delete',
      close: 'Close',
      back: 'Back',
      search: 'Search...',
      viewDetails: 'View Details',
      logout: 'Sign Out',
      status: 'Status',
      actions: 'Actions',
      online: 'Online',
      offline: 'Offline',
      accessDenied: 'Access Denied',
      unauthorizedMsg: 'You do not have permission to view this page.',
      sessionExpired: 'Your session has expired. Please sign in again.',
    },
    auth: {
      loginTitle: 'Academic Portal Sign In',
      loginSubtitle: 'Sign in to the Al-Waha University Academic Intelligence System',
      username: 'Academic Username',
      password: 'Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signIn: 'Sign In',
      signingIn: 'Verifying credentials...',
      invalidCreds: 'Invalid username or password.',
      accountLocked: 'Account temporarily locked due to multiple failed attempts. Please retry in 10 minutes.',
      demoNotice: 'Demonstration environment for Al-Waha University research faculty and students.',
      roleAdmin: 'University Administrator / Research Office',
      roleSupervisor: 'Faculty Research Supervisor',
      roleScholar: 'Ph.D. Research Scholar',
      roleStudent: 'Postgraduate / Master’s Student',
    },
    nav: {
      dashboard: 'Dashboard',
      researchInsights: 'Institutional Research Insights',
      researchCorpus: 'Public Research Corpus',
      sharedPapers: 'Supervised Student Papers',
      aiReview: 'AI Manuscript Review',
      myPapers: 'My Research Papers',
      literatureResearch: 'Literature Research',
      comparePapers: 'Compare Papers',
      researchOpportunities: 'Research Opportunities',
      myDocuments: 'My Documents',
      documentIntelligence: 'Document Intelligence',
      academicAssistant: 'Academic Assistant',
      profileSettings: 'Profile & Settings',
    },
    roles: {
      admin: 'Research Administration',
      supervisor: 'Faculty Supervisor',
      scholar: 'Ph.D. Scholar',
      student: 'Postgraduate Student',
      deanTitle: 'Prof. Dr. Tariq Al-Nuaimi (Dean of Research)',
      supervisorTitle: 'Dr. Fatima Al-Zahra (Science Faculty Supervisor)',
      scholarTitle: 'Omar Al-Mansoor (Ph.D. Candidate)',
      studentTitle: 'Mariam Al-Qasimi (M.Sc. Computer Science)',
    },
    privacy: {
      bannerTitle: 'Academic Research Data Privacy Disclosure (Google AI Studio Free Tier)',
      bannerText: 'This demonstration platform operates under Google AI Studio Free Tier terms. Prompts and extracted text excerpts may be reviewed by human reviewers to train and improve AI models. Do NOT upload confidential university records, proprietary research, or personally identifiable information (PII).',
      consentRequired: 'AI Privacy Consent Required',
      consentCheckbox: 'I explicitly consent to transmitting excerpts of this document to the external Google Gemini AI engine. I understand I can revoke this consent at any time.',
      revokeConsent: 'Revoke AI Consent',
      consentRevoked: 'AI processing consent has been revoked for this document.',
      warningNotice: 'Excerpts previously transmitted to external providers cannot be retrieved or deleted by this application.',
    },
    documents: {
      uploadTitle: 'Upload Research Paper (PDF)',
      uploadSubtitle: 'Supports direct text extraction and academic analysis for PDF manuscripts',
      dragDropText: 'Drag and drop your PDF here, or click to browse files',
      selectFile: 'Select PDF File',
      uploading: 'Uploading and extracting document pages...',
      maxLimitNotice: 'Limits: Maximum 10 MB per file, up to 20 physical pages per document.',
      processing: 'Processing extraction...',
      processed: 'Ready for Analysis',
      failed: 'Extraction Failed (Scanned or Encrypted PDF)',
      pageCount: 'Pages',
      fileSize: 'File Size',
      uploadedOn: 'Uploaded On',
      noDocsYet: 'No research documents found.',
      emptyCorpus: 'Verified academic corpus loaded and ready for analysis.',
      shareSupervisor: 'Share Paper with Faculty Supervisor',
      adminConsent: 'Consent to Institutional Analytics Oversight',
      sharedWithSupervisor: 'Shared with Supervisor',
      adminOversightGranted: 'Admin Oversight Granted',
      revokeAccess: 'Revoke Access',
      confirmRevoke: 'Are you sure you want to revoke access?',
      deleteDoc: 'Delete Document',
      confirmDelete: 'Are you sure you want to permanently delete this document?',
    },
    ai: {
      copilotTitle: 'AI Research Copilot (Grounded Evidence)',
      disclaimer: 'Note: AI-generated responses are assistive and cite physical page numbers for verification.',
      evidenceBased: 'Evidence-Grounded Citations',
      askQuestion: 'Ask an academic question regarding this paper...',
      placeholderQuestion: 'e.g. What baseline models were evaluated against the proposed architecture?',
      generating: 'Reading paper pages and generating grounded answer...',
      stopGeneration: 'Stop Generation',
      physicalCitation: 'Physical Source Page',
      verifiedQuote: 'Verified Verbatim Quote',
      quoteMismatch: 'Quote Mismatch',
      claimSupported: 'Claim Supported by Context',
      claimUnsupported: 'Claim Unsupported',
      inconclusive: 'Inconclusive Evidence',
      methodologyCritique: 'Methodological Critique',
      strengths: 'Methodological Strengths',
      limitations: 'Limitations & Research Gaps',
      defenseQuestions: 'Proposed Defense Questions',
      summaryTitle: 'Structured Paper Summary',
      problemStatement: 'Problem Statement & Objectives',
      keyFindings: 'Key Empirical Findings',
      comparativeMatrix: 'Two-Paper Comparative Synthesis Matrix',
      selectTwoDocs: 'Select two papers to generate comparative synthesis',
      compareButton: 'Generate Comparative Analysis',
      unavailableTitle: 'AI Research Engine Currently Unavailable',
      unavailableDesc: 'Google Gemini API key has not been configured or Phase 0 verification is pending. Document metadata and textual context remain fully browsable.',
    },
    labNav: {
      dashboard: 'Evaluation Dashboard',
      models: 'Model Registry',
      benchmarks: 'Benchmark Library',
      testing: 'Model Testing',
      expertReview: 'Expert Review',
      speech: 'Speech Evaluation',
      comparison: 'Performance Comparison',
      reports: 'Evaluation Reports',
      settings: 'Settings',
    },
    lab: {
      appTitle: 'Arabic AI Evaluation Lab',
      appSubtitle: 'Evaluate, compare and select the right AI technologies for academic excellence.',
      demoBadge: 'Demonstration Workspace (Illustrative Data)',
      modelsEvaluated: 'Models Evaluated',
      benchmarkTests: 'Benchmark Tests',
      expertReviews: 'Expert Reviews Completed',
      leadingModel: 'Leading Model',
      averageScore: 'Average Evaluation Score',
      modelOverview: 'Model Performance Overview',
      evaluationCoverage: 'Evaluation Coverage',
      recentActivity: 'Recent Evaluation Activity',
      recommendationPreview: 'Model Recommendation Preview',
      quickActions: 'Quick Actions',
      compareModels: 'Compare Models',
      runTest: 'Run Simulated Test',
      addModel: 'Register Model',
      addBenchmark: 'Add Benchmark',
      submitReview: 'Submit Expert Review',
      exportReport: 'Export Report',
    },
  },
};
