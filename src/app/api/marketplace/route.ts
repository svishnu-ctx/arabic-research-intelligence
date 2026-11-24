import { NextResponse } from 'next/server';
import { INITIAL_MARKETPLACE_AGENTS, MarketplaceAgent, AgentLifecycleStage } from '@/lib/marketplace/data';

// Server-side in-memory store for marketplace lifecycle & versions
let marketplaceAgents: MarketplaceAgent[] = [...INITIAL_MARKETPLACE_AGENTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department');
  const language = searchParams.get('language');
  const stage = searchParams.get('stage');
  const search = searchParams.get('search')?.toLowerCase();

  let filtered = [...marketplaceAgents];

  if (department && department !== 'all') {
    filtered = filtered.filter(a => a.department === department);
  }

  if (language && language !== 'all') {
    filtered = filtered.filter(a => a.language === language);
  }

  if (stage && stage !== 'all') {
    filtered = filtered.filter(a => a.stage === stage);
  }

  if (search) {
    filtered = filtered.filter(a =>
      a.titleAr.toLowerCase().includes(search) ||
      a.titleEn.toLowerCase().includes(search) ||
      a.descriptionAr.toLowerCase().includes(search) ||
      a.descriptionEn.toLowerCase().includes(search) ||
      a.tags.some(t => t.toLowerCase().includes(search)) ||
      a.ownerNameAr.toLowerCase().includes(search) ||
      a.ownerNameEn.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    agents: filtered
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, agentId, targetVersion, stage } = body;

    const agentIndex = marketplaceAgents.findIndex(a => a.id === agentId);
    if (agentIndex === -1) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    const agent = { ...marketplaceAgents[agentIndex] };

    // ALW-502: Rollback action
    if (action === 'rollback' && targetVersion) {
      const targetVerObj = agent.versionHistory.find(v => v.version === targetVersion);
      if (!targetVerObj) {
        return NextResponse.json({ success: false, error: 'Version not found in history' }, { status: 400 });
      }

      // Mark target version as current, unmark others
      agent.versionHistory = agent.versionHistory.map(v => ({
        ...v,
        isCurrent: v.version === targetVersion
      }));
      agent.currentVersion = targetVersion;

      // If rolled back from deprecated, reset stage to Active Production if appropriate
      if (agent.stage === 'Deprecated') {
        agent.stage = 'Active Production';
        agent.deprecationNotice = undefined;
      }

      marketplaceAgents[agentIndex] = agent;

      return NextResponse.json({
        success: true,
        message: `Successfully rolled back agent to ${targetVersion}`,
        agent
      });
    }

    // ALW-502: Lifecycle stage transition
    if (action === 'transition_stage' && stage) {
      const validStages: AgentLifecycleStage[] = ['Draft', 'Under Review', 'Active Production', 'Deprecated', 'Retired'];
      if (!validStages.includes(stage)) {
        return NextResponse.json({ success: false, error: 'Invalid lifecycle stage' }, { status: 400 });
      }

      agent.stage = stage;
      if (stage === 'Deprecated' && !agent.deprecationNotice) {
        agent.deprecationNotice = {
          retiredAfterDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          recommendedAlternativeId: 'agent-mkt-001',
          recommendedAlternativeTitle: 'مستكشف الأدبيات التخصصية للذكاء الاصطناعي العربي',
          reasonAr: 'تم تحديث الوكيل وفق سياسات الحوكمة المؤسسية. سيتم إيقاف هذا الإصدار قريباً.',
          reasonEn: 'Agent marked deprecated per governance policies. Recommended to migrate to verified alternatives.'
        };
      }

      marketplaceAgents[agentIndex] = agent;

      return NextResponse.json({
        success: true,
        message: `Agent state transitioned to ${stage}`,
        agent
      });
    }

    // Action: Fork to sandbox
    if (action === 'fork') {
      return NextResponse.json({
        success: true,
        message: `Agent blueprint '${agent.titleAr}' successfully cloned into your personal sandbox.`,
        forkedAgent: {
          ...agent,
          id: `fork-${Date.now()}`,
          stage: 'Draft',
          currentVersion: 'v0.1.0-fork'
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
