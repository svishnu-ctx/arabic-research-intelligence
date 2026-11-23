export interface AIModel {
  id: string;
  name: string;
  developer: string;
  country: string;
  category: 'llm' | 'speech';
  languageFocus: 'arabic-first' | 'bilingual' | 'multilingual';
  capabilities: string[];
  capabilitiesAr: string[];
  evaluationStatus: 'evaluated' | 'in-progress' | 'not-evaluated';
  lastTestedDate: string;
  version: string;
  parameters: string;
  overallScore: number;
  arabicFluency: number;
  academicWriting: number;
  researchUnderstanding: number;
  bilingualPerformance: number;
  latencyMs: number;
  estimatedCostPer1kTokens: string;
  licenseStatus: string;
}

export interface BenchmarkTestCase {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  language: 'Arabic' | 'English' | 'Bilingual';
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  difficultyAr: string;
  expectedCriteria: string;
  expectedCriteriaAr: string;
  modelsTestedCount: number;
  lastUpdated: string;
  status: 'Active' | 'Review' | 'Draft';
  prompt: string;
  referenceAnswer: string;
}

export interface ModelTestingResponse {
  modelId: string;
  modelName: string;
  arabicResponse: string;
  englishTranslation?: string;
  responseTimeMs: number;
  tokenCount: number;
  estimatedCostUSD: string;
  fluencyScore: number;
  academicReasoningScore: number;
  naturalnessScore: number;
  terminologyScore: number;
}

export interface ExpertReviewRecord {
  id: string;
  benchmarkId: string;
  modelId: string;
  grammarScore: number;
  academicVocabScore: number;
  fluencyScore: number;
  meaningPreservationScore: number;
  academicWritingScore: number;
  culturalAppropriatenessScore: number;
  errorClassification: string;
  decision: 'acceptable' | 'acceptable-with-corrections' | 'needs-improvement' | 'unacceptable';
  comments: string;
  reviewerName: string;
  reviewedAt: string;
}

export interface SpeechEvaluationScenario {
  id: string;
  title: string;
  titleAr: string;
  speaker: string;
  duration: string;
  dialect: string;
  dialectAr: string;
  referenceTranscript: string;
  models: {
    modelId: string;
    modelName: string;
    transcript: string;
    wer: number;
    cer: number;
    spellingQuality: number;
    intelligibilityScore: number;
    latencySeconds: number;
  }[];
}
