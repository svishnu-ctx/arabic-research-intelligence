'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useLab } from '@/lib/lab/context';
import {
  Cpu,
  Search,
  Filter,
  Plus,
  Check,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { AIModel } from '@/lib/lab/types';

export default function ModelRegistryPage() {
  const { t, language } = useI18n();
  const { models, selectedComparisonIds, toggleComparisonModel, addNewModel } = useLab();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'llm' | 'speech' | 'arabic-first' | 'bilingual'>('all');
  const [selectedModelForModal, setSelectedModelForModal] = useState<AIModel | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch('/api/lab/models').catch(() => {});
  }, []);

  // New Model Form State
  const [newName, setNewName] = useState('');
  const [newDeveloper, setNewDeveloper] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newCategory, setNewCategory] = useState<'llm' | 'speech'>('llm');

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.country.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'llm') return m.category === 'llm';
    if (activeTab === 'speech') return m.category === 'speech';
    if (activeTab === 'arabic-first') return m.languageFocus === 'arabic-first';
    if (activeTab === 'bilingual') return m.languageFocus === 'bilingual';
    return true;
  });

  const handleAddModelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const modelPayload = {
      name: newName,
      developer: newDeveloper || 'Academic Contributor',
      country: newCountry || 'UAE / Global',
      category: newCategory,
      languageFocus: 'arabic-first' as const,
      capabilities: ['Arabic processing', 'Demonstration entry'],
      capabilitiesAr: ['معالجة اللغة العربية', 'نموذج تجريبي'],
      evaluationStatus: 'not-evaluated' as const,
      lastTestedDate: new Date().toISOString().split('T')[0],
      version: 'v1.0 (Demo)',
      parameters: '7 Billion',
      overallScore: 78,
      arabicFluency: 79,
      academicWriting: 77,
      researchUnderstanding: 76,
      bilingualPerformance: 75,
      latencyMs: 390,
      estimatedCostPer1kTokens: '$0.0010',
      licenseStatus: 'Academic Evaluation Only'
    };

    addNewModel(modelPayload);

    try {
      await fetch('/api/lab/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelPayload),
      });
    } catch {
      // Local fallback in addNewModel
    }

    setNewName('');
    setNewDeveloper('');
    setNewCountry('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Cpu className="h-6 w-6 text-indigo-600" />
            <span>{t.labNav.models}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'إدارة وتقييم النماذج اللغوية وتقنيات التعرف الصوتي المرشحة للاعتماد الأكاديمي'
              : 'Discover and manage Arabic AI language models and speech technologies for evaluation'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          <span>{t.lab.addModel}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 start-3 h-4 w-4 my-auto text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث عن نموذج أو مطور أو دولة...' : 'Search models by name, developer, or country...'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 ps-10 pe-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {[
              { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
              { id: 'llm', label: language === 'ar' ? 'نماذج لغوية (LLMs)' : 'Language Models' },
              { id: 'speech', label: language === 'ar' ? 'تقنيات الصوت' : 'Speech Models' },
              { id: 'arabic-first', label: language === 'ar' ? 'عربية الأصل' : 'Arabic-First' },
              { id: 'bilingual', label: language === 'ar' ? 'ثنائية اللغة' : 'Bilingual' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3 py-1.5 font-medium transition shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((model) => {
          const isSelected = selectedComparisonIds.includes(model.id);
          return (
            <div
              key={model.id}
              className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm transition flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                      {model.category.toUpperCase()} • {model.country}
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">
                      {model.name}
                    </h3>
                    <div className="text-xs text-slate-500">{model.developer}</div>
                  </div>

                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                    {model.overallScore} / 100
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'فصاحة العربية:' : 'Arabic Fluency:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{model.arabicFluency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الكتابة الأكاديمية:' : 'Academic Writing:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{model.academicWriting}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'زمن الاستجابة:' : 'Latency:'}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">{model.latencyMs} ms</span>
                  </div>
                </div>

                {/* Capabilities tags */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {(language === 'ar' ? model.capabilitiesAr : model.capabilities).slice(0, 3).map((cap, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedModelForModal(model)}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition"
                >
                  {t.common.viewDetails}
                </button>

                <button
                  onClick={() => toggleComparisonModel(model.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                  <span>{isSelected ? (language === 'ar' ? 'محدد للمقارنة' : 'In Comparison') : (language === 'ar' ? '+ إضافة للمقارنة' : '+ Compare')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Details Modal */}
      {selectedModelForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {selectedModelForModal.category.toUpperCase()} • {selectedModelForModal.country}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedModelForModal.name}
                </h2>
                <div className="text-xs text-slate-500">{selectedModelForModal.developer}</div>
              </div>
              <button
                onClick={() => setSelectedModelForModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
                <div>
                  <span className="text-slate-500">{language === 'ar' ? 'الإصدار المعتمد:' : 'Version:'}</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedModelForModal.version}</div>
                </div>
                <div>
                  <span className="text-slate-500">{language === 'ar' ? 'عدد المعاملات:' : 'Parameters:'}</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedModelForModal.parameters}</div>
                </div>
                <div>
                  <span className="text-slate-500">{language === 'ar' ? 'حالة الترخيص:' : 'License:'}</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedModelForModal.licenseStatus}</div>
                </div>
                <div>
                  <span className="text-slate-500">{language === 'ar' ? 'التكلفة التقديرية:' : 'Est. Cost:'}</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedModelForModal.estimatedCostPer1kTokens}</div>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'القدرات والإمكانات:' : 'Capabilities:'}
                </span>
                <ul className="mt-1.5 list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {(language === 'ar' ? selectedModelForModal.capabilitiesAr : selectedModelForModal.capabilities).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedModelForModal(null)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Model Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.lab.addModel}
            </h2>
            <form onSubmit={handleAddModelSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'اسم النموذج:' : 'Model Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Arabic-Llama-3"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'المطور أو الجهة البحثية:' : 'Developer / Lab:'}
                </label>
                <input
                  type="text"
                  value={newDeveloper}
                  onChange={(e) => setNewDeveloper(e.target.value)}
                  placeholder="e.g. Al-Waha University AI Lab"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'التصنيف:' : 'Category:'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="llm">Language Model (LLM)</option>
                  <option value="speech">Speech Model (ASR / TTS)</option>
                </select>
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
