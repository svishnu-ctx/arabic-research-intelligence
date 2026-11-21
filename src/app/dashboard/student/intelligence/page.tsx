import { AIResponseView } from '@/components/ai/AIResponseView';

export default function StudentIntelligencePage() {
  return (
    <AIResponseView
      title="التحليل الهيكلي وتفكيك الورقة البحثية"
      subtitle="استخلاص مشكلة البحث، المنهجية، النتائج، ومحددات الدراسة مع التوثيق المادي"
      disclaimerNotice="مبني على المحتوى المستخرج من ملف PDF. لا تستخدم أوراقاً ممسوحة ضوئياً بدون طبقة نصية."
    />
  );
}
