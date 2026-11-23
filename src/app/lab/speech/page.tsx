'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Mic,
  UploadCloud,
  Play,
  Pause,
  Volume2,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { DEMO_SPEECH_SCENARIO } from '@/lib/lab/data';

export default function SpeechEvaluationPage() {
  const { t, language } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTask, setActiveTask] = useState<'asr' | 'translation' | 'tts'>('asr');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speechModels, setSpeechModels] = useState(DEMO_SPEECH_SCENARIO.models);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  const scenario = DEMO_SPEECH_SCENARIO;

  useEffect(() => {
    runSpeechEvaluation();
  }, []);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      await runSpeechEvaluation();
    }
  };

  const runSpeechEvaluation = async () => {
    setIsEvaluating(true);
    setBackendStatus(null);
    try {
      const res = await fetch('/api/lab/speech/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: scenario.referenceTranscript,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.models) {
          setSpeechModels(data.models);
          setBackendStatus(language === 'ar' ? 'تم استدعاء واجهة التفريغ الصوتي (Live API)' : 'Live Speech Backend API Executed');
        }
      }
    } catch {
      // Keep existing models
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Mic className="h-6 w-6 text-indigo-600" />
            <span>{t.labNav.speech}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'تقييم ومقارنة تقنيات التعرف الصوتي (ASR) والترجمة الفورية للمحاضرات الجامعية والمقابلات'
              : 'Comparative evaluation of Arabic speech recognition, translation & synthesis technologies'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {backendStatus && (
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {backendStatus}
            </span>
          )}
          <button
            onClick={runSpeechEvaluation}
            disabled={isEvaluating}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm disabled:opacity-50 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isEvaluating ? t.common.loading : (language === 'ar' ? 'تشغيل تقييم التفريغ الصوتي (API)' : 'Run Speech Evaluation (API)')}</span>
          </button>
        </div>
      </div>

      {/* Audio Scenario & Upload Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Audio Player & Upload Simulation */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            {language === 'ar' ? 'ملف المحاضرة الصوتية المختبرة' : 'Benchmark Audio Scenario'}
          </h2>

          <div className="rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold">
              <FileAudio className="h-4 w-4" />
              <span>{language === 'ar' ? scenario.titleAr : scenario.title}</span>
            </div>
            <div className="text-slate-500">{scenario.speaker}</div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{scenario.duration}</span>
              <span className="font-semibold text-indigo-600">{language === 'ar' ? scenario.dialectAr : scenario.dialect}</span>
            </div>
          </div>

          {/* Audio Playback Controls Simulation */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-indigo-700 transition"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? (language === 'ar' ? 'إيقاف' : 'Pause') : (language === 'ar' ? 'تشغيل المقطع' : 'Play Audio')}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Volume2 className="h-4 w-4" />
                <span>00:45 / 01:45</span>
              </div>
            </div>

            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full rounded-full bg-indigo-600 transition-all duration-300 ${isPlaying ? 'w-1/2' : 'w-1/4'}`} />
            </div>
          </div>

          {/* Local Audio Test Upload */}
          <div className="pt-2">
            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 hover:border-indigo-500 cursor-pointer transition">
              <UploadCloud className="h-6 w-6 text-slate-400" />
              <span className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {uploadedFileName || (language === 'ar' ? 'اختيار ملف صوتي محلي للمعاينة' : 'Select Local Audio for Playback')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">MP3, WAV, M4A (Local preview only)</span>
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="sr-only" />
            </label>
          </div>
        </div>

        {/* Right: Reference Transcript (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  GROUND TRUTH (100% ACCURACY)
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'النص المرجعي المحقق بشرياً (Reference Transcript)' : 'Human Verified Reference Transcript'}
                </h2>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
              <p className="font-arabic text-sm text-slate-900 dark:text-white leading-relaxed" dir="rtl">
                "{scenario.referenceTranscript}"
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
                <span className="text-slate-500">{language === 'ar' ? 'معدل الكلمات:' : 'Total Words:'}</span>
                <div className="font-bold text-slate-900 dark:text-white">28 {language === 'ar' ? 'كلمة' : 'words'}</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
                <span className="text-slate-500">{language === 'ar' ? 'نوع التسجيل:' : 'Audio Quality:'}</span>
                <div className="font-bold text-slate-900 dark:text-white">قاعة جامعية (Classroom)</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
                <span className="text-slate-500">{language === 'ar' ? 'الضوضاء المحيطة:' : 'Noise Level:'}</span>
                <div className="font-bold text-slate-900 dark:text-white">متوسطة (15 dB SNR)</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            {language === 'ar'
              ? 'تنبيه: يتم حساب معدل الخطأ في الكلمات (WER) والرموز (CER) بمقارنة مخرجات النماذج مع هذا النص المرجعي.'
              : 'Notice: Word Error Rate (WER) and Character Error Rate (CER) are computed against this ground-truth transcript.'}
          </div>
        </div>
      </div>

      {/* Side-by-Side Model Transcriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {speechModels.map((model) => (
          <div
            key={model.modelId}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  CANDIDATE SPEECH MODEL
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {model.modelName}
                </h3>
              </div>

              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                WER: {model.wer}%
              </span>
            </div>

            {/* Model Transcript */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
              <p className="font-arabic text-sm text-slate-900 dark:text-white leading-relaxed" dir="rtl">
                {model.transcript}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="rounded-lg bg-slate-100 dark:bg-slate-800/60 p-2">
                <span className="text-[10px] text-slate-500">WER</span>
                <div className="font-bold text-emerald-600">{model.wer}%</div>
              </div>
              <div className="rounded-lg bg-slate-100 dark:bg-slate-800/60 p-2">
                <span className="text-[10px] text-slate-500">CER</span>
                <div className="font-bold text-indigo-600">{model.cer}%</div>
              </div>
              <div className="rounded-lg bg-slate-100 dark:bg-slate-800/60 p-2">
                <span className="text-[10px] text-slate-500">{language === 'ar' ? 'الإملاء' : 'Spelling'}</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{model.spellingQuality}%</div>
              </div>
              <div className="rounded-lg bg-slate-100 dark:bg-slate-800/60 p-2">
                <span className="text-[10px] text-slate-500">{language === 'ar' ? 'السرعة' : 'Latency'}</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{model.latencySeconds}s</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
