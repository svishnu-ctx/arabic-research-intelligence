import { AIResponseView } from '@/components/ai/AIResponseView';

export default function SupervisorReviewPage() {
  return (
    <AIResponseView
      title="التقييم الأكاديمي الشامل للمسودة (Supervisory Review)"
      subtitle="نقد منهجي، فحص المحددات، واقتراح أسئلة المناقشة للدراسات العليا"
      disclaimerNotice="المراجعة مقصورة حصرياً على الأوراق التي تمت مشاركتها صراحة من قبل الطالب مع المشرف الأكاديمي."
    />
  );
}
