import { useState, useCallback } from 'react';
import type { Language, ParcelRecord, ToastMessage } from '../types/tracking.types';
import { i18n } from '../translations/i18n';
import { findParcelByTrackingCode } from '../services/trackingService';

export const useTracking = () => {
  const [lang, setLang] = useState<Language>('fr');
  const [inputValue, setInputValue] = useState<string>('');
  const [activeParcel, setActiveParcel] = useState<ParcelRecord | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = i18n[lang];

  const showToast = useCallback(
    (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3000);
    },
    []
  );

  const searchParcel = useCallback(
    async (code: string): Promise<boolean> => {
      const normalized = code.trim().toUpperCase();
      if (!normalized) {
        showToast(t.toastEmptyInput, 'warning');
        return false;
      }

      setLoading(true);
      try {
        const found = await findParcelByTrackingCode(normalized);
        if (!found) {
          setActiveParcel(null);
          setNotFoundCode(normalized);
          return false;
        }

        setNotFoundCode(null);
        setActiveParcel(found);
        return true;
      } finally {
        setLoading(false);
      }
    },
    [showToast, t.toastEmptyInput]
  );

  const resetTracking = useCallback(() => {
    setActiveParcel(null);
    setNotFoundCode(null);
    setInputValue('');
  }, []);

  return {
    lang,
    setLang,
    t,
    inputValue,
    setInputValue,
    activeParcel,
    notFoundCode,
    loading,
    toasts,
    showToast,
    searchParcel,
    resetTracking,
  };
};
