'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLab } from '@/lib/lab/context';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  FileText,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { BenchmarkTestCase } from '@/lib/lab/types';

export default function BenchmarkLibraryPage() {
  const { t, language } = useI18n();
  const { benchmarks, addNewBenchmark } = useLab();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBenchmarkForDrawer, setSelectedBenchmarkForDrawer] = useState<BenchmarkTestCase | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch('/api/lab/benchmarks').catch(() => {});
  }, []);

  // New Benchmark Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academic Arabic Writing');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Advanced'>('Medium');
  const [newPrompt, setNewPrompt] = useState('');
  const [newReference, setNewReference] = useState('');

  const categories = [
    'All',
    'Academic Arabic Writing',
    'Arabic Grammar & Fluency',
    'Arabic-English Translation',
    'Research Paper Understanding',
    'Methodology Reasoning'
  ];

  const filteredBenchmarks = benchmarks.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.titleAr.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    return b.category === selectedCategory;
  });

  const handleAddBenchmarkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const benchmarkPayload = {
      title: newTitle,
      titleAr: newTitle,
      category: newCategory,
      categoryAr: newCategory,
      language: 'Arabic' as const,
      difficulty: newDifficulty,
      difficultyAr: newDifficulty === 'Advanced' ? 'متقدم' : 'متوسط',
      expectedCriteria: 'Accuracy, linguistic rigor, and academic terminology.',
      expectedCriteriaAr: 'الدقة اللغوية ومراعاة المصطلحات الأكاديمية.',
      modelsTestedCount: 4,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Active' as const,
      prompt: newPrompt || 'سؤال أكاديمي تجريبي...',
      referenceAnswer: newReference || 'إجابة مرجعية معتمدة من الخبير اللغوي...'
    };

    addNewBenchmark(benchmarkPayload);

    try {
      await fetch('/api/lab/benchmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(benchmarkPayload),
      });
    } catch {
      // Local fallback in addNewBenchmark
    }

    setNewTitle('');
    setNewPrompt('');
    setNewReference('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span>{t.labNav.benchmarks}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'مكتبة الاختبارات القياسية وحالات المعايرة الأكاديمية المتكررة لتقييم النماذج'
              : 'Standardized evaluation benchmark test suite across academic & linguistic tasks'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          <span>{t.lab.addBenchmark}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-2 font-medium transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? (language === 'ar' ? 'جميع الفئات' : 'All Categories') : cat}
          </button>
        ))}
      </div>

      {/* Benchmarks Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute inset-y-0 start-3 h-4 w-4 my-auto text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث عن معرف الاختبار أو العنوان...' : 'Search benchmarks by ID or title...'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 ps-10 pe-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500">
                <th className="p-3.5 font-bold w-20">ID</th>
                <th className="p-3.5 font-bold">{language === 'ar' ? 'عنوان الاختبار' : 'Benchmark Title'}</th>
                <th className="p-3.5 font-bold">{language === 'ar' ? 'الفئة الأكاديمية' : 'Category'}</th>
                <th className="p-3.5 font-bold">{language === 'ar' ? 'الصعوبة' : 'Difficulty'}</th>
                <th className="p-3.5 font-bold">{language === 'ar' ? 'النماذج المختبرة' : 'Models Tested'}</th>
                <th className="p-3.5 font-bold text-end">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBenchmarks.map((bench) => (
                <tr
                  key={bench.id}
                  onClick={() => setSelectedBenchmarkForDrawer(bench)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{bench.id}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                    {language === 'ar' ? bench.titleAr : bench.title}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {language === 'ar' ? bench.categoryAr : bench.category}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        bench.difficulty === 'Advanced'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {language === 'ar' ? bench.difficultyAr : bench.difficulty}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {bench.modelsTestedCount} {language === 'ar' ? 'نماذج' : 'models'}
                  </td>
                  <td className="p-3.5 text-end text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    {t.common.viewDetails}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benchmark Detail Drawer */}
      {selectedBenchmarkForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600">{selectedBenchmarkForDrawer.id}</span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {language === 'ar' ? selectedBenchmarkForDrawer.titleAr : selectedBenchmarkForDrawer.title}
                </h2>
                <div className="text-xs text-slate-500">{selectedBenchmarkForDrawer.category}</div>
              </div>
              <button
                onClick={() => setSelectedBenchmarkForDrawer(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'المدخل الأكاديمي وسياق الاختبار (Input Prompt):' : 'Original Input Prompt:'}
                </span>
                <p className="mt-1.5 font-arabic text-sm text-slate-900 dark:text-white leading-relaxed" dir="rtl">
                  {selectedBenchmarkForDrawer.prompt}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {language === 'ar' ? 'الإجابة المرجعية المعتمدة من الخبير (Reference Answer):' : 'Expert-Authored Reference Answer:'}
                </span>
                <p className="mt-1.5 font-arabic text-sm text-slate-900 dark:text-slate-100 leading-relaxed" dir="rtl">
                  {selectedBenchmarkForDrawer.referenceAnswer}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'معايير التحكيم والتقييم المتوقعة:' : 'Scoring & Evaluation Criteria:'}
                </span>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  {language === 'ar' ? selectedBenchmarkForDrawer.expectedCriteriaAr : selectedBenchmarkForDrawer.expectedCriteria}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedBenchmarkForDrawer(null)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Benchmark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.lab.addBenchmark}
            </h2>
            <form onSubmit={handleAddBenchmarkSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'عنوان الاختبار الأكاديمي:' : 'Benchmark Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Arabic Dialectal Sentiment Resolution"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'الفئة:' : 'Category:'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'نص السؤال / المدخل (Prompt):' : 'Input Prompt:'}
                </label>
                <textarea
                  rows={2}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="نص السؤال البحثي..."
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'الإجابة المرجعية النموذجية:' : 'Reference Answer:'}
                </label>
                <textarea
                  rows={2}
                  value={newReference}
                  onChange={(e) => setNewReference(e.target.value)}
                  placeholder="الإجابة النموذجية المعتمدة..."
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-700 hover:bg-indigo-800 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
