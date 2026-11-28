import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { Language } from '../../types/tracking.types';
import type { TranslationSet } from '../../translations/i18n';
import { CasmohLogo } from '../common/CasmohLogo';

interface HeaderProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onResetView: (e: React.MouseEvent) => void;
  onOpenSupport: () => void;
  t: TranslationSet;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onChangeLang,
  onResetView,
  onOpenSupport,
  t,
}) => (
  <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
      <a
        href="#top"
        onClick={onResetView}
        className="flex items-center gap-3 group focus:outline-none"
      >
        <div className="w-12 h-11 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
          <CasmohLogo clipId="fr-clip-header" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-[#001B5E]">
              CAS<span className="text-[#D90429]">MOH</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#001B5E]/8 text-[#001B5E] border border-[#001B5E]/15">
              {t.badgeLive}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
            {t.brandSub}
          </span>
        </div>
      </a>

      {/* Right Controls: FR/EN Switcher + Assistance */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className="inline-flex rounded-xl bg-[#F4F6FA] p-1 border border-slate-200/80"
          role="group"
          aria-label="Language switcher"
        >
          <button
            type="button"
            onClick={() => onChangeLang('fr')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
              lang === 'fr'
                ? 'font-bold bg-white text-[#001B5E] shadow-sm'
                : 'font-semibold text-slate-600 hover:text-[#001B5E]'
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => onChangeLang('en')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
              lang === 'en'
                ? 'font-bold bg-white text-[#001B5E] shadow-sm'
                : 'font-semibold text-slate-600 hover:text-[#001B5E]'
            }`}
          >
            EN
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenSupport}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-[#001B5E] hover:text-[#D90429] hover:bg-[#D90429]/5 border border-transparent hover:border-[#D90429]/15 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#D90429]" />
          <span>{t.supportBtn}</span>
        </button>
      </div>
    </div>
  </header>
);
