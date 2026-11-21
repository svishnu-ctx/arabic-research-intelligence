'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { PrivacyConsentModal } from '@/components/privacy/PrivacyConsentModal';
import { formatBytes } from '@/lib/utils';

export function DocumentUploadView() {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConsentGranted, setIsConsentGranted] = useState(false);
  const [shareSupervisor, setShareSupervisor] = useState(false);
  const [adminConsent, setAdminConsent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMsg('يسمح فقط برفع ملفات PDF الأكاديمية.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('حجم الملف يتجاوز الحد المسموح (10 ميغابايت).');
        setSelectedFile(null);
        return;
      }
      setErrorMsg(null);
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    if (!isConsentGranted) {
      setErrorMsg('يجب الموافقة الصريحة على إشعار خصوصية الذكاء الاصطناعي أولاً.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Mock / Future endpoint connection
      setTimeout(() => {
        setIsUploading(false);
        setSuccessMsg('تم رفع الورقة واستخراج نصوصها بنجاح وهي جاهزة للتحليل.');
      }, 1500);
    } catch {
      setIsUploading(false);
      setErrorMsg('فشل الرفع. تعذر الاتصال بالخادم.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{t.documents.uploadTitle}</h2>
        <p className="text-xs text-slate-500 mt-1">{t.documents.uploadSubtitle}</p>

        {/* Privacy Gate */}
        <div className="mt-5">
          <PrivacyConsentModal
            isConsentGranted={isConsentGranted}
            onConsentChange={(granted) => {
              setIsConsentGranted(granted);
              if (granted) setErrorMsg(null);
            }}
          />
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <div className="flex justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-8 hover:border-emerald-500 transition">
            <div className="text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
              <div className="mt-3 flex text-sm leading-6 text-slate-600 justify-center">
                <label className="relative cursor-pointer rounded-md font-semibold text-emerald-700 hover:text-emerald-800">
                  <span>{t.documents.selectFile}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-1">{t.documents.maxLimitNotice}</p>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-700" />
                <span className="font-semibold text-slate-800">{selectedFile.name}</span>
                <span className="text-slate-400">({formatBytes(selectedFile.size)})</span>
              </div>
              <span className="text-emerald-600 font-medium">جاهز للرفع</span>
            </div>
          )}

          {/* Permissions Options */}
          <div className="space-y-2 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shareSupervisor}
                onChange={(e) => setShareSupervisor(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">{t.documents.shareSupervisor}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={adminConsent}
                onChange={(e) => setAdminConsent(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">{t.documents.adminConsent}</span>
            </label>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="flex w-full justify-center rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-800 disabled:opacity-50 transition"
          >
            {isUploading ? t.documents.uploading : t.documents.uploadTitle}
          </button>
        </form>
      </div>
    </div>
  );
}
