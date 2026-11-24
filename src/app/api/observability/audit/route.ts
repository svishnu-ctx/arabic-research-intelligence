import { NextResponse } from 'next/server';
import { 
  INITIAL_AUDIT_TRANSACTIONS, 
  INITIAL_DEPARTMENT_QUOTAS, 
  AITransactionAuditRecord, 
  DepartmentBudgetQuota 
} from '@/lib/observability/audit';

let auditStore: AITransactionAuditRecord[] = [...INITIAL_AUDIT_TRANSACTIONS];
let quotasStore: DepartmentBudgetQuota[] = [...INITIAL_DEPARTMENT_QUOTAS];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format');
  const department = searchParams.get('department');
  const role = searchParams.get('role');

  let filtered = [...auditStore];
  if (department && department !== 'all') {
    filtered = filtered.filter(a => a.department === department);
  }
  if (role && role !== 'all') {
    filtered = filtered.filter(a => a.role === role);
  }

  // ALW-801: CSV Export
  if (format === 'csv') {
    const headers = [
      'TransactionID',
      'Timestamp',
      'UserID',
      'UserEmail',
      'Role',
      'AgentName',
      'Model',
      'PromptTokens',
      'CompletionTokens',
      'TotalTokens',
      'LatencyMs',
      'CostUSD',
      'GuardrailStatus',
      'Classification',
      'Department',
      'RetentionUntil'
    ];

    const rows = filtered.map(t => [
      t.transactionId,
      t.timestamp,
      t.userId,
      t.userEmail,
      t.role,
      `"${t.agentName}"`,
      t.model,
      t.promptTokens,
      t.completionTokens,
      t.totalTokens,
      t.latencyMs,
      t.costEstimateUsd,
      t.guardrailStatus,
      t.classification,
      t.department,
      t.retentionUntil
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="alwaha_ai_audit_log_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  }

  // ALW-801: JSON Export
  if (format === 'json_download') {
    return new Response(JSON.stringify(filtered, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="alwaha_ai_audit_log_${new Date().toISOString().slice(0, 10)}.json"`
      }
    });
  }

  // ALW-802: Calculate overall tokens & budget metrics
  const totalTokensConsumed = quotasStore.reduce((acc, q) => acc + q.tokensConsumed, 0);
  const totalTokensAllocated = quotasStore.reduce((acc, q) => acc + q.monthlyTokenAllocation, 0);
  const totalCostEstimateUsd = quotasStore.reduce((acc, q) => acc + q.monthlyCostEstimateUsd, 0);

  return NextResponse.json({
    success: true,
    retentionPolicy: '7-Year UAE Higher Education Regulatory Archival',
    auditCount: filtered.length,
    quotas: quotasStore,
    summary: {
      totalTokensConsumed,
      totalTokensAllocated,
      utilizationPercentage: Number(((totalTokensConsumed / totalTokensAllocated) * 100).toFixed(1)),
      totalCostEstimateUsd: Number(totalCostEstimateUsd.toFixed(2)),
      activeAlertsCount: quotasStore.filter(q => q.status !== 'NORMAL').length
    },
    transactions: filtered
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, departmentKey, newQuotaTokens } = body;

    // Adjust department quota allocation
    if (action === 'update_quota' && departmentKey && newQuotaTokens) {
      const qIndex = quotasStore.findIndex(q => q.departmentKey === departmentKey);
      if (qIndex === -1) {
        return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
      }

      quotasStore[qIndex].monthlyTokenAllocation = Number(newQuotaTokens);
      const util = (quotasStore[qIndex].tokensConsumed / Number(newQuotaTokens)) * 100;
      quotasStore[qIndex].utilizationPercentage = Number(util.toFixed(1));
      quotasStore[qIndex].status = 
        util >= 100 ? 'EXHAUSTED_LOCKED' : util >= 95 ? 'CRITICAL_95' : util >= 80 ? 'WARNING_80' : 'NORMAL';
      quotasStore[qIndex].lastUpdated = new Date().toISOString();

      return NextResponse.json({
        success: true,
        message: 'Department token budget successfully updated',
        quota: quotasStore[qIndex]
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
