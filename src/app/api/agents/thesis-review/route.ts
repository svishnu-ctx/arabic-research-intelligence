import { NextRequest, NextResponse } from 'next/server';
import { reviewThesisChapter } from '@/lib/agents/thesis';
import { ServerStorage } from '@/lib/server/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chapterTitle = body.chapterTitle;
    const chapterContent = body.chapterContent || body.content;
    const projectId = body.projectId;
    const chapterId = body.chapterId;
    const projectContext = body.projectContext;

    if (!chapterTitle || !chapterContent) {
      return NextResponse.json(
        { success: false, error: 'Chapter title and content are required.' },
        { status: 400 }
      );
    }

    const review = await reviewThesisChapter({
      chapterTitle,
      chapterContent,
      projectContext,
    });

    if (projectId && chapterId) {
      ServerStorage.addChapterReview(projectId, chapterId, review.critique, review.suggestions);
    }

    return NextResponse.json({
      success: true,
      review,
      provider: 'Fanar AI (QCRI)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Thesis review failed' },
      { status: 500 }
    );
  }
}
