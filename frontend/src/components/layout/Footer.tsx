import React from 'react';
import type { TranslationSet } from '../../translations/i18n';
import { CasmohLogo } from '../common/CasmohLogo';

interface FooterProps {
  t: TranslationSet;
  onOpenSupport: () => void;
  onResetView: (e: React.MouseEvent) => void;
}

export const Footer: React.FC<FooterProps> = ({
  t,
  onOpenSupport,
  onResetView,
}) => (
  <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 mt-auto">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
      <div className="flex items-center gap-3">
        <div className="w-9 h-8 flex items-center justify-center">
          <CasmohLogo clipId="fr-clip-footer" />
        </div>
        <span className="font-extrabold text-[#001B5E]">
          CAS<span className="text-[#D90429]">MOH</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-xs sm:text-sm font-medium">{t.footerTagline}</span>
      </div>

      <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={onOpenSupport}
          className="text-[#001B5E] hover:text-[#D90429] transition-colors"
        >
          {t.footerHelp}
        </button>
        <a
          href="#top"
          onClick={onResetView}
          className="text-[#001B5E] hover:text-[#D90429] transition-colors"
        >
          {t.footerTrack}
        </a>
      </div>
    </div>
  </footer>
);
