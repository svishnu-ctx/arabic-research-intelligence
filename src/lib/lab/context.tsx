'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIModel, BenchmarkTestCase, ExpertReviewRecord } from './types';
import { LAB_MODELS, LAB_BENCHMARKS } from './data';

interface LabContextType {
  models: AIModel[];
  benchmarks: BenchmarkTestCase[];
  selectedComparisonIds: string[];
  toggleComparisonModel: (id: string) => void;
  clearComparisonSelection: () => void;
  reviews: ExpertReviewRecord[];
  addReview: (review: Omit<ExpertReviewRecord, 'id' | 'reviewedAt'>) => void;
  addNewModel: (model: Omit<AIModel, 'id'>) => void;
  addNewBenchmark: (benchmark: Omit<BenchmarkTestCase, 'id'>) => void;
  resetDemoData: () => void;
}

const LabContext = createContext<LabContextType | null>(null);

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [models, setModels] = useState<AIModel[]>(LAB_MODELS);
  const [benchmarks, setBenchmarks] = useState<BenchmarkTestCase[]>(LAB_BENCHMARKS);
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>(['jais', 'fanar', 'allam', 'acegpt']);
  const [reviews, setReviews] = useState<ExpertReviewRecord[]>([
    {
      id: 'rev-01',
      benchmarkId: 'AR-001',
      modelId: 'fanar',
      grammarScore: 5,
      academicVocabScore: 5,
      fluencyScore: 5,
      meaningPreservationScore: 5,
      academicWritingScore: 5,
      culturalAppropriatenessScore: 5,
      errorClassification: 'None',
      decision: 'acceptable',
      comments: 'صياغة ممتازة ترقى لمعايير المجلات العلمية المحكمة، مع توظيف دقيق للمصطلحات.',
      reviewerName: 'د. فاطمة الزهراء (خبير لغوي)',
      reviewedAt: '2026-11-20'
    }
  ]);

  useEffect(() => {
    // 1. Fetch live models from backend server API
    fetch('/api/lab/models')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.models) && data.models.length > 0) {
          setModels(data.models);
        }
      })
      .catch(() => {});

    // 2. Fetch live benchmarks from backend server API
    fetch('/api/lab/benchmarks')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.benchmarks) && data.benchmarks.length > 0) {
          setBenchmarks(data.benchmarks);
        }
      })
      .catch(() => {});

    // 3. Fetch live reviews from backend server API
    fetch('/api/lab/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});

    // Local storage restore fallback
    const saved = localStorage.getItem('ari_lab_models');
    if (saved) {
      try {
        setModels(JSON.parse(saved));
      } catch {}
    }
    const savedReviews = localStorage.getItem('ari_lab_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch {}
    }
  }, []);

  const toggleComparisonModel = (id: string) => {
    setSelectedComparisonIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const clearComparisonSelection = () => {
    setSelectedComparisonIds([]);
  };

  const addReview = (newRev: Omit<ExpertReviewRecord, 'id' | 'reviewedAt'>) => {
    const record: ExpertReviewRecord = {
      ...newRev,
      id: `rev-${Date.now()}`,
      reviewedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [record, ...reviews];
    setReviews(updated);
    localStorage.setItem('ari_lab_reviews', JSON.stringify(updated));
  };

  const addNewModel = (modelData: Omit<AIModel, 'id'>) => {
    const newModel: AIModel = {
      ...modelData,
      id: `model-${Date.now()}`
    };
    const updated = [newModel, ...models];
    setModels(updated);
    localStorage.setItem('ari_lab_models', JSON.stringify(updated));
  };

  const addNewBenchmark = (benchmarkData: Omit<BenchmarkTestCase, 'id'>) => {
    const newBenchmark: BenchmarkTestCase = {
      ...benchmarkData,
      id: `AR-${String(benchmarks.length + 1).padStart(3, '0')}`
    };
    const updated = [newBenchmark, ...benchmarks];
    setBenchmarks(updated);
  };

  const resetDemoData = () => {
    setModels(LAB_MODELS);
    setBenchmarks(LAB_BENCHMARKS);
    setSelectedComparisonIds(['jais', 'fanar', 'allam', 'acegpt']);
    setReviews([]);
    localStorage.removeItem('ari_lab_models');
    localStorage.removeItem('ari_lab_reviews');
  };

  return (
    <LabContext.Provider
      value={{
        models,
        benchmarks,
        selectedComparisonIds,
        toggleComparisonModel,
        clearComparisonSelection,
        reviews,
        addReview,
        addNewModel,
        addNewBenchmark,
        resetDemoData
      }}
    >
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const context = useContext(LabContext);
  if (!context) throw new Error('useLab must be used within a LabProvider');
  return context;
}
