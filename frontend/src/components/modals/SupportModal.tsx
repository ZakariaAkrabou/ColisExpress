import React from 'react';
import { X } from 'lucide-react';
import type { TranslationSet } from '../../translations/i18n';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationSet;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#001B5E]/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-up relative overflow-hidden"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#001B5E] to-[#D90429] absolute top-0 left-0" />
        <div className="flex items-center justify-between mb-4 mt-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D90429]" />
            <h3 className="text-xl font-bold text-[#001B5E]">{t.supportModalTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#D90429] hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{t.supportModalDesc}</p>
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#F4F6FA] border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-[#001B5E]">
                {t.phoneLabelFrance}
              </span>
              <span className="text-[11px] text-slate-500">Hub Paris / Lyon</span>
            </div>
            <span className="font-mono font-bold text-sm text-[#001B5E]">
              +33 1 86 95 40 12
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F6FA] border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-[#D90429]">
                {t.phoneLabelMaroc}
              </span>
              <span className="text-[11px] text-slate-500">Hub Casablanca / Tanger</span>
            </div>
            <span className="font-mono font-bold text-sm text-[#D90429]">
              +212 5 22 48 90 10
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#001B5E] hover:bg-[#0A2472] text-white font-bold text-sm transition-colors shadow-md shadow-[#001B5E]/20"
        >
          {t.closeBtn}
        </button>
      </div>
    </div>
  );
};
