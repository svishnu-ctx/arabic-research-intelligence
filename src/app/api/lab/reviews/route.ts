import { NextRequest, NextResponse } from 'next/server';
import { ExpertReviewRecord } from '@/lib/lab/types';

const serverReviews: ExpertReviewRecord[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: serverReviews.length,
    reviews: serverReviews,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newReview: ExpertReviewRecord = {
      id: `rev-${Date.now()}`,
      benchmarkId: body.benchmarkId || 'AR-001',
      modelId: body.modelId || 'fanar',
      grammarScore: body.grammarScore || 5,
      academicVocabScore: body.academicVocabScore || 5,
      fluencyScore: body.fluencyScore || 5,
      meaningPreservationScore: body.meaningPreservationScore || 5,
      academicWritingScore: body.academicWritingScore || 5,
      culturalAppropriatenessScore: body.culturalAppropriatenessScore || 5,
      errorClassification: body.errorClassification || 'None',
      decision: body.decision || 'acceptable',
      comments: body.comments || 'Evaluated on server',
      reviewerName: body.reviewerName || 'Dr. Academic Reviewer',
      reviewedAt: new Date().toISOString(),
    };

    serverReviews.unshift(newReview);

    return NextResponse.json({
      success: true,
      message: 'Expert review recorded on server successfully',
      review: newReview,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to record review' },
      { status: 500 }
    );
  }
}
