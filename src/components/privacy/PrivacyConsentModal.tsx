'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckSquare, Square, XCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

interface PrivacyConsentProps {
  isConsentGranted: boolean;
  onConsentChange: (granted: boolean) => void;
  documentTitle?: string;
}

export function PrivacyConsentModal({
  isConsentGranted,
  onConsentChange,
  documentTitle,
}: PrivacyConsentProps) {
  const { t } = useI18n();
  const [isChecked, setIsChecked] = useState(isConsentGranted);

  const handleToggle = () => {
    const next = !isChecked;
    setIsChecked(next);
    onConsentChange(next);
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-start shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-amber-900">
            {t.privacy.bannerTitle}
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            {t.privacy.bannerText}
          </p>
          {documentTitle && (
            <div className="text-xs font-semibold text-slate-800">
              {documentTitle}
            </div>
          )}

          <div
            onClick={handleToggle}
            className="flex items-start gap-2.5 pt-2 cursor-pointer select-none"
          >
            {isChecked ? (
              <CheckSquare className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
            ) : (
              <Square className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
            )}
            <span className="text-xs font-semibold text-slate-900">
              {t.privacy.consentCheckbox}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 italic pt-1">
            {t.privacy.warningNotice}
          </div>
        </div>
      </div>
    </div>
  );
}
