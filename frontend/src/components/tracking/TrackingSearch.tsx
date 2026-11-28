import React from 'react';
import { Search, Clipboard, X, ArrowRight } from 'lucide-react';
import type { TranslationSet } from '../../translations/i18n';

interface TrackingSearchProps {
  inputValue: string;
  onChangeInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onPaste: () => void;
  onLoadSample: (code: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  loading?: boolean;
  t: TranslationSet;
}

export const TrackingSearch: React.FC<TrackingSearchProps> = ({
  inputValue,
  onChangeInput,
  onSubmit,
  onClear,
  onPaste,
  onLoadSample,
  inputRef,
  loading = false,
  t,
}) => (
  <section className="relative overflow-hidden bg-[#001B5E] text-white pt-12 pb-20 sm:pt-16 sm:pb-24 px-4 sm:px-6">
    {/* Warehouse Background Image + Navy/Crimson Gradient Overlay */}
    <div className="absolute inset-0 pointer-events-none select-none">
      <img
        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80"
        onError={(e) => {
          e.currentTarget.src =
            'https://placehold.co/2000x900/001B5E/FFFFFF?text=CASMOH+Logistique+France+%E2%86%94+Maroc';
        }}
        alt="Entrepôt logistique CASMOH France Maroc"
        className="w-full h-full object-cover object-center scale-105 opacity-75"
      />
      <div
        className="absolute inset-0 backdrop-blur-[1.5px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(0, 27, 94, 0.88) 0%, rgba(0, 18, 66, 0.82) 60%, rgba(217, 4, 41, 0.35) 100%)',
        }}
      />
    </div>

    <div className="relative max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/12 border border-white/20 text-slate-100 text-xs font-semibold mb-5 backdrop-blur-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#D90429] animate-pulse" />
        <span>{t.heroPill}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        {t.heroTitle}
      </h1>
      <p className="text-blue-50/95 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
        {t.heroSubtitle}
      </p>

      {/* Tracking Input Bar */}
      <form
        onSubmit={onSubmit}
        className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl shadow-[#000D33]/70 border border-white/30 max-w-2xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-grow flex items-center">
            <div className="pl-3.5 pr-2 text-[#001B5E]/60 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onChangeInput(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder={t.inputPlaceholder}
              className="w-full py-3.5 pr-24 text-[#001B5E] placeholder-slate-400 font-bold text-base sm:text-lg bg-transparent focus:outline-none uppercase tracking-wide"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {inputValue.trim().length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  title="Effacer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#D90429] hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onPaste}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4F6FA] hover:bg-[#001B5E]/10 text-[#001B5E] text-xs font-bold transition-colors border border-slate-200"
              >
                <Clipboard className="w-3.5 h-3.5 text-[#D90429]" />
                <span>{t.pasteBtn}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-[#D90429] hover:bg-[#B80322] active:scale-[0.99] disabled:opacity-70 text-white font-bold text-base shadow-lg shadow-[#D90429]/35 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>{t.trackBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick Sample Codes */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
        <span className="text-blue-100 font-medium">{t.trySamples}</span>
        <button
          type="button"
          onClick={() => onLoadSample('CM-849201')}
          className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-mono font-semibold border border-white/20 transition-all"
        >
          CM-849201{' '}
          <span className="text-[10px] text-blue-100 font-sans">• das → sse</span>
        </button>
        <button
          type="button"
          onClick={() => onLoadSample('CM-304912')}
          className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-rose-100 font-mono font-semibold border border-white/20 transition-all"
        >
          CM-304912{' '}
          <span className="text-[10px] opacity-90 font-sans">• Lyon → Marrakech</span>
        </button>
        <button
          type="button"
          onClick={() => onLoadSample('CM-991024')}
          className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-emerald-100 font-mono font-semibold border border-white/20 transition-all"
        >
          CM-991024{' '}
          <span className="text-[10px] opacity-90 font-sans">• Casa → Paris</span>
        </button>
      </div>
    </div>
  </section>
);
