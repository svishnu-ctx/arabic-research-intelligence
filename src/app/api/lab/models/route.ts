import { NextRequest, NextResponse } from 'next/server';
import { LAB_MODELS } from '@/lib/lab/data';
import { AIModel } from '@/lib/lab/types';

// In-memory server-side registry (seeded with preloaded models)
const serverModels: AIModel[] = [...LAB_MODELS];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: serverModels.length,
    models: serverModels,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newModel: AIModel = {
      id: body.id || `custom-${Date.now()}`,
      name: body.name || 'New Arabic Model',
      developer: body.developer || 'Academic Institute',
      country: body.country || 'Regional',
      category: body.category || 'llm',
      languageFocus: body.languageFocus || 'arabic-first',
      capabilities: body.capabilities || ['Arabic NLP'],
      capabilitiesAr: body.capabilitiesAr || ['معالجة اللغة العربية'],
      evaluationStatus: 'in-progress',
      lastTestedDate: new Date().toISOString().split('T')[0],
      version: body.version || 'v1.0-eval',
      parameters: body.parameters || '7B',
      overallScore: 80,
      arabicFluency: 80,
      academicWriting: 80,
      researchUnderstanding: 80,
      bilingualPerformance: 80,
      latencyMs: 350,
      estimatedCostPer1kTokens: '$0.0010',
      licenseStatus: body.licenseStatus || 'Academic',
    };

    serverModels.unshift(newModel);

    return NextResponse.json({
      success: true,
      message: 'Model registered successfully on backend server',
      model: newModel,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to register model' },
      { status: 500 }
    );
  }
}
