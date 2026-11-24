/**
 * Epic 8: Observability, Audit Trail & Cost Management (ALW-EP8)
 * ALW-801: Immutable AI Transaction Audit Log (7-year retention schema)
 * ALW-802: Centralized Token Usage & Departmental Budget Quotas
 */

export interface AITransactionAuditRecord {
  transactionId: string;
  timestamp: string; // ISO 8601
  userId: string;
  userEmail: string;
  role: 'student' | 'supervisor' | 'admin' | 'researcher';
  agentId: string;
  agentName: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  costEstimateUsd: number;
  guardrailStatus: 'PASSED' | 'MASKED_PII' | 'BLOCKED_VIOLATION';
  classification: 'Public' | 'Internal' | 'Restricted';
  department: string;
  departmentAr: string;
  retentionUntil: string; // +7 years
}

export interface DepartmentBudgetQuota {
  departmentKey: string;
  departmentAr: string;
  departmentEn: string;
  monthlyTokenAllocation: number;
  tokensConsumed: number;
  utilizationPercentage: number;
  status: 'NORMAL' | 'WARNING_80' | 'CRITICAL_95' | 'EXHAUSTED_LOCKED';
  monthlyCostEstimateUsd: number;
  activeResearchers: number;
  lastUpdated: string;
}

export const INITIAL_DEPARTMENT_QUOTAS: DepartmentBudgetQuota[] = [
  {
    departmentKey: 'engineering',
    departmentAr: 'كلية الحوسبة والهندسة المعلوماتية',
    departmentEn: 'College of Computing & Informatics',
    monthlyTokenAllocation: 15000000,
    tokensConsumed: 12450000,
    utilizationPercentage: 83.0,
    status: 'WARNING_80', // > 80% threshold
    monthlyCostEstimateUsd: 14.94,
    activeResearchers: 142,
    lastUpdated: '2026-11-24T12:00:00Z'
  },
  {
    departmentKey: 'medicine',
    departmentAr: 'كلية الطب والعلوم الصحية',
    departmentEn: 'College of Medicine & Health Sciences',
    monthlyTokenAllocation: 10000000,
    tokensConsumed: 9600000,
    utilizationPercentage: 96.0,
    status: 'CRITICAL_95', // > 95% threshold
    monthlyCostEstimateUsd: 11.52,
    activeResearchers: 89,
    lastUpdated: '2026-11-24T12:00:00Z'
  },
  {
    departmentKey: 'business',
    departmentAr: 'كلية إدارة الأعمال والاقتصاد',
    departmentEn: 'College of Business Administration',
    monthlyTokenAllocation: 8000000,
    tokensConsumed: 4320000,
    utilizationPercentage: 54.0,
    status: 'NORMAL',
    monthlyCostEstimateUsd: 5.18,
    activeResearchers: 64,
    lastUpdated: '2026-11-24T12:00:00Z'
  },
  {
    departmentKey: 'humanities',
    departmentAr: 'كلية العلوم الإنسانية والاجتماعية',
    departmentEn: 'College of Humanities & Social Sciences',
    monthlyTokenAllocation: 6000000,
    tokensConsumed: 3100000,
    utilizationPercentage: 51.6,
    status: 'NORMAL',
    monthlyCostEstimateUsd: 3.72,
    activeResearchers: 48,
    lastUpdated: '2026-11-24T12:00:00Z'
  }
];

export const INITIAL_AUDIT_TRANSACTIONS: AITransactionAuditRecord[] = [
  {
    transactionId: 'TX-ALW-2026-98124',
    timestamp: '2026-11-24T11:42:10Z',
    userId: 'U-2024-8912',
    userEmail: 'maryam.mazrouei@alwaha.ac.ae',
    role: 'student',
    agentId: 'agent-lit-01',
    agentName: 'Academic Literature Scout',
    model: 'Fanar-C-2-27B',
    promptTokens: 420,
    completionTokens: 680,
    totalTokens: 1100,
    latencyMs: 235,
    costEstimateUsd: 0.000, // Sovereign Fanar
    guardrailStatus: 'PASSED',
    classification: 'Restricted',
    department: 'engineering',
    departmentAr: 'كلية الحوسبة والهندسة المعلوماتية',
    retentionUntil: '2033-11-24T11:42:10Z' // 7-year regulatory retention
  },
  {
    transactionId: 'TX-ALW-2026-98125',
    timestamp: '2026-11-24T10:15:32Z',
    userId: 'U-SUP-1049',
    userEmail: 'dr.marwan@alwaha.ac.ae',
    role: 'supervisor',
    agentId: 'sup-irb-03',
    agentName: 'Methodology & IRB Validator',
    model: 'Fanar-C-2-27B',
    promptTokens: 850,
    completionTokens: 520,
    totalTokens: 1370,
    latencyMs: 270,
    costEstimateUsd: 0.000,
    guardrailStatus: 'MASKED_PII',
    classification: 'Restricted',
    department: 'medicine',
    departmentAr: 'كلية الطب والعلوم الصحية',
    retentionUntil: '2033-11-24T10:15:32Z'
  },
  {
    transactionId: 'TX-ALW-2026-98126',
    timestamp: '2026-11-24T09:30:18Z',
    userId: 'U-2025-4410',
    userEmail: 'omar.falasi@alwaha.ac.ae',
    role: 'student',
    agentId: 'agent-prop-02',
    agentName: 'Proposal Evaluation Agent',
    model: 'Fanar-C-2-27B',
    promptTokens: 610,
    completionTokens: 840,
    totalTokens: 1450,
    latencyMs: 250,
    costEstimateUsd: 0.000,
    guardrailStatus: 'PASSED',
    classification: 'Internal',
    department: 'engineering',
    departmentAr: 'كلية الحوسبة والهندسة المعلوماتية',
    retentionUntil: '2033-11-24T09:30:18Z'
  },
  {
    transactionId: 'TX-ALW-2026-98127',
    timestamp: '2026-11-24T08:12:04Z',
    userId: 'U-2023-7721',
    userEmail: 'rashid.nuaimi@alwaha.ac.ae',
    role: 'student',
    agentId: 'agent-viva-04',
    agentName: 'Viva Defense Committee Simulator',
    model: 'Fanar-C-2-27B',
    promptTokens: 920,
    completionTokens: 1100,
    totalTokens: 2020,
    latencyMs: 310,
    costEstimateUsd: 0.000,
    guardrailStatus: 'PASSED',
    classification: 'Internal',
    department: 'business',
    departmentAr: 'كلية إدارة الأعمال والاقتصاد',
    retentionUntil: '2033-11-24T08:12:04Z'
  },
  {
    transactionId: 'TX-ALW-2026-98128',
    timestamp: '2026-11-23T16:45:50Z',
    userId: 'U-ADM-0001',
    userEmail: 'admin@alwaha.ac.ae',
    role: 'admin',
    agentId: 'safety-harness-00',
    agentName: 'Zero-Leakage Gateway Guardrail',
    model: 'Al-Waha Safety Gateway (ALW-601)',
    promptTokens: 310,
    completionTokens: 120,
    totalTokens: 430,
    latencyMs: 45,
    costEstimateUsd: 0.000,
    guardrailStatus: 'BLOCKED_VIOLATION',
    classification: 'Restricted',
    department: 'engineering',
    departmentAr: 'كلية الحوسبة والهندسة المعلوماتية',
    retentionUntil: '2033-11-23T16:45:50Z'
  }
];
