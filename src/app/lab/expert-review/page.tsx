'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLab } from '@/lib/lab/context';
import {
  Award,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Star
} from 'lucide-react';

export default function ExpertReviewPage() {
  const { t, language } = useI18n();
  const { benchmarks, addReview } = useLab();

  const [currentBenchIndex, setCurrentBenchIndex] = useState(0);
  const [showModelIdentity, setShowModelIdentity] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Scores state (1 to 5)
  const [grammar, setGrammar] = useState(5);
  const [vocab, setVocab] = useState(5);
  const [fluency, setFluency] = useState(5);
  const [meaning, setMeaning] = useState(5);
  const [writing, setWriting] = useState(5);
  const [cultural, setCultural] = useState(5);

  const [errorClassification, setErrorClassification] = useState('None');
  const [decision, setDecision] = useState<'acceptable' | 'acceptable-with-corrections' | 'needs-improvement' | 'unacceptable'>('acceptable');
  const [comments, setComments] = useState('');

  const currentBenchmark = benchmarks[currentBenchIndex] || benchmarks[0];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData = {
      benchmarkId: currentBenchmark.id,
      modelId: 'fanar',
      grammarScore: grammar,
      academicVocabScore: vocab,
      fluencyScore: fluency,
      meaningPreservationScore: meaning,
      academicWritingScore: writing,
      culturalAppropriatenessScore: cultural,
      errorClassification,
      decision,
      comments: comments || (language === 'ar' ? 'مراجعة خبير معتمدة.' : 'Verified expert evaluation.'),
      reviewerName: language === 'ar' ? 'د. فاطمة الزهراء (محكم لغوي معتمد)' : 'Dr. Fatima Al-Zahra (Certified Arabic Linguistic Reviewer)'
    };

    addReview(reviewData);

    try {
      await fetch('/api/lab/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
    } catch {
      // Local fallback in addReview
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const nextCase = () => {
    if (currentBenchIndex < benchmarks.length - 1) {
      setCurrentBenchIndex(currentBenchIndex + 1);
    }
  };

  const prevCase = () => {
    if (currentBenchIndex > 0) {
      setCurrentBenchIndex(currentBenchIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="h-6 w-6 text-indigo-600" />
            <span>{t.labNav.expertReview}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'بيئة التحكيم اللغوي والأكاديمي الأعمى لتقييم مخرجات النماذج بواسطة خبراء اللغة'
              : 'Blind academic & linguistic evaluation interface for certified Arabic language reviewers'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModelIdentity(!showModelIdentity)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            {showModelIdentity ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-indigo-600" />}
            <span>{showModelIdentity ? (language === 'ar' ? 'إخفاء هوية النموذج (أعمى)' : 'Hide Model Identity (Blind)') : (language === 'ar' ? 'كشف هوية النموذج' : 'Reveal Model Identity')}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{language === 'ar' ? 'تم حفظ واعتماد تقييم الخبير بنجاح وتحديث الإحصاءات العامة!' : 'Expert review saved successfully and aggregate statistics updated!'}</span>
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Test Case Info & Reference (3 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600">{currentBenchmark.id}</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                {currentBenchIndex + 1} / {benchmarks.length}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? currentBenchmark.titleAr : currentBenchmark.title}
              </h3>
              <div className="text-[11px] text-slate-500 mt-0.5">{currentBenchmark.category}</div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                {language === 'ar' ? 'المدخل الأكاديمي الأصلي:' : 'Original Prompt:'}
              </span>
              <p className="mt-1 text-xs font-arabic text-slate-900 dark:text-slate-100 leading-relaxed" dir="rtl">
                {currentBenchmark.prompt}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                {language === 'ar' ? 'الإجابة المرجعية النموذجية:' : 'Expert Reference Answer:'}
              </span>
              <p className="mt-1 text-xs font-arabic text-slate-900 dark:text-slate-100 leading-relaxed" dir="rtl">
                {currentBenchmark.referenceAnswer}
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={prevCase}
                disabled={currentBenchIndex === 0}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
              </button>
              <button
                onClick={nextCase}
                disabled={currentBenchIndex === benchmarks.length - 1}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              >
                <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Model Response Under Review (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {language === 'ar' ? 'استجابة النموذج الخاضعة للتحكيم' : 'Model Response Under Evaluation'}
              </span>
              {showModelIdentity ? (
                <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                  Fanar (QCRI)
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                  Candidate Model [Blind ID: #04]
                </span>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
              <div className="font-arabic text-sm text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line" dir="rtl">
                تُمثّل الطاقة الشمسية رافداً استراتيجياً حيوياً لمنظومة الطاقة المستدامة في دولة الإمارات العربية المتحدة؛ حيث يُسهم ارتفاع معدلات الإشعاع الشمسي المباشر في تعزيز الكفاءة الإنتاجية لتوليد الكهرباء النظيفة والحد من البصمة الكربونية للمنشآت الصناعية.
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'تعليمات الفاحص اللغوي:' : 'Reviewer Guidance:'}
              </div>
              <p>
                {language === 'ar'
                  ? 'يرجى تدقيق التوافق النحوي، ودقة المصطلحات العلمية، وسلامة التراكيب البلاغية المعاصرة قبل اعتماد الدرجة.'
                  : 'Examine syntactic concordance, technical terminology, and Modern Standard Arabic register appropriateness.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Expert Scoring Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {language === 'ar' ? 'استمارة التقييم والتحكيم (1 إلى 5)' : 'Expert Rubric Scoring (1 to 5)'}
            </h3>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-3 text-xs">
              {[
                { label: language === 'ar' ? '١. النحو وصحة الإعراب' : '1. Grammar & Correctness', val: grammar, set: setGrammar },
                { label: language === 'ar' ? '٢. المصطلحات الأكاديمية' : '2. Academic Vocabulary', val: vocab, set: setVocab },
                { label: language === 'ar' ? '٣. الفصاحة والسلاسة' : '3. Naturalness & Fluency', val: fluency, set: setFluency },
                { label: language === 'ar' ? '٤. حفظ المعنى الدقيق' : '4. Meaning Preservation', val: meaning, set: setMeaning },
                { label: language === 'ar' ? '٥. جودة الكتابة العلمية' : '5. Academic Writing Style', val: writing, set: setWriting },
                { label: language === 'ar' ? '٦. الملاءمة الثقافية' : '6. Cultural Appropriateness', val: cultural, set: setCultural },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => item.set(star)}
                        className={`h-6 w-6 rounded-md font-bold text-[11px] transition ${
                          item.val >= star
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Error Classification */}
              <div className="pt-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'تصنيف الملاحظة اللغوية:' : 'Error Classification:'}
                </label>
                <select
                  value={errorClassification}
                  onChange={(e) => setErrorClassification(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                >
                  <option value="None">لا توجد أخطاء (None)</option>
                  <option value="Grammar">خطأ نحوي أو إعرابي (Grammar error)</option>
                  <option value="Terminology">مصطلح غير دقيق (Incorrect terminology)</option>
                  <option value="Unnatural">تعبير ركيك أو مترجم حرفياً (Unnatural phrasing)</option>
                  <option value="Meaning">تحريف في المعنى (Meaning distortion)</option>
                </select>
              </div>

              {/* Reviewer Final Decision */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'القرار التحكيمي النهائي:' : 'Final Reviewer Decision:'}
                </label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                >
                  <option value="acceptable">مقبول للنشر الأكاديمي (Acceptable)</option>
                  <option value="acceptable-with-corrections">مقبول مع تعديلات طفيفة (Acceptable with corrections)</option>
                  <option value="needs-improvement">بحاجة لإعادة صياغة (Needs improvement)</option>
                  <option value="unacceptable">غير مقبول (Unacceptable)</option>
                </select>
              </div>

              {/* Written Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'ملاحظات المحكم الأكاديمية:' : 'Reviewer Comments:'}
                </label>
                <textarea
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="ملاحظات توجيهية حول الأسلوب والمفردات..."
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 py-2.5 font-semibold text-white shadow-sm transition"
              >
                <Save className="h-4 w-4" />
                <span>{t.lab.submitReview}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
