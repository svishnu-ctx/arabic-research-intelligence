import { AIResponseView } from '@/components/ai/AIResponseView';

export default function StudentAssistantPage() {
  return (
    <AIResponseView
      title="المساعد الأكاديمي الثنائي (Bilingual Research Tutor)"
      subtitle="شرح المفاهيم الأكاديمية والمعادلات باللغة العربية والإنجليزية مع الاستشهاد بالنص الأصلي"
      disclaimerNotice="المساعد الأكاديمي استرشادي ويهدف لتبسيط الأفكار المعقدة دون استبدال القراءة المباشرة للورقة الأكاديمية."
    />
  );
}
