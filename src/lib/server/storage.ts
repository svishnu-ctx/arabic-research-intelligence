/**
 * Server-Side Persistent Storage Service
 * Manages Students, Research Projects, Proposals, Methodology, Datasets, Chapters & History
 */

export interface StudentProfile {
  id: string;
  studentId: string;
  email: string;
  fullName: string;
  fullNameAr: string;
  academicLevel: 'Undergraduate' | 'Masters' | 'PhD';
  department: string;
  college: string;
}

export interface StoredProposal {
  id: string;
  title: string;
  background: string;
  problemStatement: string;
  objectives: string[];
  questions: string[];
  hypotheses?: string[];
  scopeAndLimitations: string;
  expectedContribution: string;
  suggestedNextSteps?: string;
  updatedAt: string;
}

export interface StoredPublication {
  id: string;
  title: string;
  authors: string;
  year?: number;
  venue?: string;
  doi?: string;
  abstract?: string;
  url?: string;
  source: 'openalex' | 'crossref' | 'semanticscholar' | 'manual';
  notes?: string;
  savedAt: string;
}

export interface StoredMethodology {
  researchType: 'Quantitative' | 'Qualitative' | 'Mixed-Methods';
  suggestedDesign: string;
  justification: string;
  dataCollection: string;
  samplingStrategy: string;
  instruments: string;
  analysisPlan: string;
  limitations: string;
  ethicalConsiderations: string;
  updatedAt: string;
}

export interface StoredDatasetAnalysis {
  id: string;
  filename: string;
  uploadedAt: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  missingValuesSummary: Record<string, number>;
  numericalStats: Record<string, { mean: number; min: number; max: number; std: number }>;
  categoricalDistributions: Record<string, Record<string, number>>;
  aiInterpretation?: string;
}

export interface StoredThesisChapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  version: number;
  updatedAt: string;
  reviews: Array<{
    reviewedAt: string;
    feedback: string;
    suggestions: string[];
  }>;
}

export interface StoredProject {
  id: string;
  studentId: string;
  title: string;
  titleAr?: string;
  researchField: string;
  academicLevel: 'Undergraduate' | 'Masters' | 'PhD';
  description?: string;
  completionProgress: number;
  createdAt: string;
  updatedAt: string;
  proposal?: StoredProposal;
  publications: StoredPublication[];
  methodology?: StoredMethodology;
  datasets: StoredDatasetAnalysis[];
  chapters: StoredThesisChapter[];
  defenseQuestions?: string[];
}

export const MOCK_STUDENT_PROFILE: StudentProfile = {
  id: 'std_sharjah_2026_01',
  studentId: 'U22104589',
  email: 'student@sharjah.ac.ae',
  fullName: 'Tariq Mansoor Al-Ketbi',
  fullNameAr: 'طارق منصور الكتبي',
  academicLevel: 'Masters',
  department: 'Computer Science & AI',
  college: 'College of Computing & Informatics (جامعة الشارقة)',
};

// In-Memory Database with Pre-Seeded Academic Project
const memoryProjects: Map<string, StoredProject> = new Map();

// Initialize initial graduation / master's project
const initialProject: StoredProject = {
  id: 'proj_ai_sharjah_01',
  studentId: MOCK_STUDENT_PROFILE.id,
  title: 'Evaluating LLMs in Arabic Academic Writing & Thesis Defense in UAE Higher Education',
  titleAr: 'تقييم نماذج اللغة الكبيرة في الكتابة الأكاديمية ومناقشة الأطروحات في التعليم العالي الإماراتي',
  researchField: 'Artificial Intelligence & Higher Education',
  academicLevel: 'Masters',
  description: 'An empirical investigation into Arabic-native LLMs (Fanar, Jais) for thesis proposal generation and methodological literature review in University of Sharjah graduate programs.',
  completionProgress: 65,
  createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  proposal: {
    id: 'prop_01',
    title: 'Evaluating LLMs in Arabic Academic Writing & Thesis Defense in UAE Higher Education',
    background: 'With the emergence of Arabic-first foundational LLMs like Fanar and Jais, academic research workflows are undergoing transformative shifts. However, empirical studies examining syntactic fidelity, citation reliability, and hallucination containment in Arabic graduate theses remain nascent.',
    problemStatement: 'Graduate students face acute challenges in maintaining classical Modern Standard Arabic (MSA) syntactic rigor and rigorous citation formatting, while existing global LLMs often introduce hallucinations and dialectal distortion.',
    objectives: [
      'Assess Arabic LLM fidelity in generating structured academic thesis proposals.',
      'Measure accuracy in literature review citation grounding using cross-referenced APIs.',
      'Develop an empirical framework for thesis defense question generation.'
    ],
    questions: [
      'To what extent do Arabic foundation models preserve academic syntactic rigor in postgraduate literature reviews?',
      'How effectively can Fanar AI generate plausible, defense-grade examiner questions for master’s theses?'
    ],
    hypotheses: [
      'Arabic-native models exhibit statistically lower Character Error Rates in technical terminology than generic multilingual LLMs.'
    ],
    scopeAndLimitations: 'Limited to graduate computing and engineering programs across the University of Sharjah over the 2025-2026 academic year.',
    expectedContribution: 'A verified evaluation rubric and open benchmark dataset for UAE academic institutions.',
    suggestedNextSteps: 'Proceed to empirical data collection with faculty evaluation rubrics.',
    updatedAt: new Date().toISOString(),
  },
  publications: [
    {
      id: 'pub_openalex_01',
      title: 'Fanar: A Foundational Arabic Multimodal AI Model for Regional Dialects and Modern Standard Arabic',
      authors: 'QCRI Research Team, Hamad Bin Khalifa University',
      year: 2024,
      venue: 'Transactions of the Association for Computational Linguistics',
      doi: '10.1162/tacl_a_00589',
      abstract: 'We introduce Fanar, an Arabic-first language model family designed specifically to preserve syntactic precision in MSA and dialectal resilience across Gulf Arabic academic corpora.',
      url: 'https://doi.org/10.1162/tacl_a_00589',
      source: 'openalex',
      notes: 'Key reference for Fanar architecture and dialectal benchmark comparison.',
      savedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'pub_crossref_02',
      title: 'Jais and Jais-chat: Arabic-English Foundation Models for Scientific Academic Discovery',
      authors: 'Inception, Cerebras Systems & MBZUAI',
      year: 2023,
      venue: 'Proceedings of NeurIPS 2023',
      doi: '10.48550/arXiv.2308.16149',
      abstract: 'A 30-billion parameter bilingual Arabic-English language model trained on massive Arabic web corpora and scientific publications.',
      url: 'https://arxiv.org/abs/2308.16149',
      source: 'crossref',
      notes: 'Methodological baseline for bilingual academic reasoning.',
      savedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    }
  ],
  methodology: {
    researchType: 'Mixed-Methods',
    suggestedDesign: 'Convergent Parallel Mixed-Methods Design combining quantitative evaluation scores with qualitative examiner feedback.',
    justification: 'Quantifying syntactic error rates provides objective benchmarks, while qualitative professor reviews capture stylistic and scholarly nuances.',
    dataCollection: 'A structured evaluation corpus of 50 student drafts evaluated across 6 criteria by certified Arabic language experts.',
    samplingStrategy: 'Stratified purposeful sampling of graduate researchers at the College of Computing & Informatics.',
    instruments: 'Rubric with 5-point Likert scale, automated BLEU/ROUGE scripts, and structured interview guides.',
    analysisPlan: 'Descriptive statistics, paired t-tests for model comparisons, and thematic analysis of reviewer comments.',
    limitations: 'Limited sample size of 50 student theses across one university institution.',
    ethicalConsiderations: 'All student submissions anonymized with strict student privacy consent and zero external AI training on proprietary drafts.',
    updatedAt: new Date().toISOString(),
  },
  datasets: [],
  chapters: [
    {
      id: 'chap_01',
      chapterNumber: 1,
      title: 'Chapter 1: Introduction and Research Background',
      content: 'تُمثل تقنيات الذكاء الاصطناعي التوليدي، وتحديداً النماذج اللغوية الكبيرة (LLMs)، منعطفاً جذرياً في منظومة التعليم العالي والبحث الأكاديمي. وفي سياق الجامعات العربية، تبرز الحاجة الملحة لتبني نماذج تفهم البنية النحوية والصرفية للغة العربية الفصحى المعاصرة، مثل نموذج فنار (Fanar)، لتمكين طلبة الدراسات العليا في جامعة الشارقة من صياغة مقترحات بحثية متماسكة وتدقيق الأطروحات العلمية.',
      wordCount: 56,
      version: 1,
      updatedAt: new Date().toISOString(),
      reviews: []
    }
  ],
  defenseQuestions: [
    'كيف تضمن عدم إدخال النموذج اللغوي لمعلومات مضللة (Hallucinations) في استعراض الدراسات السابقة؟',
    'ما هي الضوابط الأخلاقية التي اتبعتها في جامعة الشارقة لضمان نزاهة الملكية الفكرية لأطروحة الطالب؟',
    'لماذا تم اختيار التصميم المنهجي الهجين بدلاً من الاكتفاء بالتحليل الإحصائي الكمي الصرف؟'
  ]
};

memoryProjects.set(initialProject.id, initialProject);

export class ServerStorage {
  public static getStudent(): StudentProfile {
    return MOCK_STUDENT_PROFILE;
  }

  public static listProjects(studentId: string = MOCK_STUDENT_PROFILE.id): StoredProject[] {
    return Array.from(memoryProjects.values()).filter((p) => p.studentId === studentId);
  }

  public static getProject(id: string): StoredProject | null {
    return memoryProjects.get(id) || null;
  }

  public static createProject(data: Partial<StoredProject> & { title: string; researchField: string; academicLevel: 'Undergraduate' | 'Masters' | 'PhD' }): StoredProject {
    const id = `proj_${Date.now()}`;
    const newProj: StoredProject = {
      id,
      studentId: MOCK_STUDENT_PROFILE.id,
      title: data.title,
      titleAr: data.titleAr,
      researchField: data.researchField,
      academicLevel: data.academicLevel,
      description: data.description || '',
      completionProgress: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publications: [],
      datasets: [],
      chapters: [
        {
          id: `chap_${Date.now()}_1`,
          chapterNumber: 1,
          title: 'Chapter 1: Introduction and Problem Formulation',
          content: '',
          wordCount: 0,
          version: 1,
          updatedAt: new Date().toISOString(),
          reviews: []
        }
      ],
      defenseQuestions: []
    };

    memoryProjects.set(id, newProj);
    return newProj;
  }

  public static updateProject(id: string, updates: Partial<StoredProject>): StoredProject {
    const existing = memoryProjects.get(id);
    if (!existing) throw new Error('Project not found');

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    memoryProjects.set(id, updated);
    return updated;
  }

  public static deleteProject(id: string): boolean {
    return memoryProjects.delete(id);
  }

  public static saveProposal(projectId: string, proposal: StoredProposal): StoredProject {
    const proj = this.getProject(projectId);
    if (!proj) throw new Error('Project not found');
    proj.proposal = proposal;
    proj.completionProgress = Math.max(proj.completionProgress, 35);
    proj.updatedAt = new Date().toISOString();
    memoryProjects.set(projectId, proj);
    return proj;
  }

  public static saveMethodology(projectId: string, methodology: StoredMethodology): StoredProject {
    const proj = this.getProject(projectId);
    if (!proj) throw new Error('Project not found');
    proj.methodology = methodology;
    proj.completionProgress = Math.max(proj.completionProgress, 60);
    proj.updatedAt = new Date().toISOString();
    memoryProjects.set(projectId, proj);
    return proj;
  }

  public static addPublication(projectId: string, pub: Omit<StoredPublication, 'id' | 'savedAt'>): StoredProject {
    const proj = this.getProject(projectId);
    if (!proj) throw new Error('Project not found');

    const newPub: StoredPublication = {
      ...pub,
      id: `pub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      savedAt: new Date().toISOString(),
    };

    proj.publications.unshift(newPub);
    proj.completionProgress = Math.max(proj.completionProgress, 45);
    proj.updatedAt = new Date().toISOString();
    memoryProjects.set(projectId, proj);
    return proj;
  }

  public static addDatasetAnalysis(projectId: string, analysis: StoredDatasetAnalysis): StoredProject {
    const proj = this.getProject(projectId);
    if (!proj) throw new Error('Project not found');

    proj.datasets.unshift(analysis);
    proj.completionProgress = Math.max(proj.completionProgress, 75);
    proj.updatedAt = new Date().toISOString();
    memoryProjects.set(projectId, proj);
    return proj;
  }

  public static updateChapter(projectId: string, chapterId: string, content: string, title?: string): StoredProject {
    const proj = this.getProject(projectId);
    if (!proj) throw new Error('Project not found');

    const chap = proj.chapters.find((c) => c.id === chapterId);
    if (chap) {
      chap.content = content;
      if (title) chap.title = title;
      chap.wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      chap.version += 1;
      chap.updatedAt = new Date().toISOString();
    } else {
      proj.chapters.push({
        id: chapterId,
        chapterNumber: proj.chapters.length + 1,
        title: title || `Chapter ${proj.chapters.length + 1}`,
        content,
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
        version: 1,
        updatedAt: new Date().toISOString(),
        reviews: []
      });
    }

    proj.completionProgress = Math.max(proj.completionProgress, 85);
    proj.updatedAt = new Date().toISOString();
    memoryProjects.set(projectId, proj);
    return proj;
  }

  public static addChapterReview(projectId: string, chapterId: string, feedback: string, suggestions: string[]): StoredProject {
    const proj = this.getProject(projectId);
    if (!proj) throw new Error('Project not found');

    const chap = proj.chapters.find((c) => c.id === chapterId);
    if (chap) {
      chap.reviews.unshift({
        reviewedAt: new Date().toISOString(),
        feedback,
        suggestions
      });
    }

    proj.updatedAt = new Date().toISOString();
    memoryProjects.set(projectId, proj);
    return proj;
  }

  public static setDefenseQuestions(projectId: string, questions: string[]): StoredProject {
    const proj = this.getProject(projectId);
    if (!proj) throw new Error('Project not found');
    proj.defenseQuestions = questions;
    proj.completionProgress = Math.max(proj.completionProgress, 95);
    proj.updatedAt = new Date().toISOString();
    memoryProjects.set(projectId, proj);
    return proj;
  }
}
