import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTracking } from '../hooks/useTracking';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/common/Toast';
import { CasmohLogo } from '../components/common/CasmohLogo';
import { TrackingSearch } from '../components/tracking/TrackingSearch';
import { TrackingResult } from '../components/tracking/TrackingResult';
import { ImageModal } from '../components/modals/ImageModal';
import { SupportModal } from '../components/modals/SupportModal';

export const TrackingPage: React.FC = () => {
  const {
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
  } = useTracking();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const runSearch = async (code: string) => {
    const found = await searchParcel(code);
    if (!code.trim()) {
      inputRef.current?.focus();
      return;
    }
    if (found && window.innerWidth < 640) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(inputValue);
  };

  const handleLoadSample = (code: string) => {
    setInputValue(code);
    void runSearch(code);
  };

  const handleClearInput = () => {
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleResetView = (e: React.MouseEvent) => {
    e.preventDefault();
    resetTracking();
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const upper = text.trim().toUpperCase();
          setInputValue(upper);
          showToast(t.toastPasted, 'info');
          void runSearch(upper);
          return;
        }
      }
      inputRef.current?.focus();
      showToast(t.toastPasteFallback, 'info');
    } catch {
      inputRef.current?.focus();
      showToast(t.toastPasteFallback, 'info');
    }
  };

  const handleCopyTrackingNumber = async () => {
    if (!activeParcel) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeParcel.id);
        showToast(t.toastCopied, 'success');
        return;
      }
      const tempInput = document.createElement('input');
      tempInput.value = activeParcel.id;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(t.toastCopied, 'success');
    } catch {
      // Fallback ignored
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
        setIsSupportModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      id="top"
      className="bg-[#F4F6FA] text-slate-800 antialiased min-h-screen flex flex-col font-sans selection:bg-[#001B5E]/15 selection:text-[#001B5E]"
    >
      <ToastContainer toasts={toasts} />

      <Header
        lang={lang}
        onChangeLang={setLang}
        onResetView={handleResetView}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        t={t}
      />

      <main className="flex-grow">
        <TrackingSearch
          inputValue={inputValue}
          onChangeInput={setInputValue}
          onSubmit={handleFormSubmit}
          onClear={handleClearInput}
          onPaste={handlePasteFromClipboard}
          onLoadSample={handleLoadSample}
          inputRef={inputRef}
          loading={loading}
          t={t}
        />

        <section
          ref={resultRef}
          className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 pb-16 relative z-10"
        >
          {/* A. Initial Empty State + 3 Logistics Pillars */}
          {!activeParcel && !notFoundCode && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-md shadow-slate-200/60 border border-slate-200/80 p-8 sm:p-10 text-center">
                <div className="w-20 h-16 mx-auto mb-4 rounded-2xl bg-[#F4F6FA] border border-slate-200/70 flex items-center justify-center p-2">
                  <CasmohLogo clipId="fr-clip-empty" />
                </div>
                <h2 className="text-xl font-bold text-[#001B5E] mb-2">{t.emptyTitle}</h2>
                <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
                  {t.emptyDesc}
                </p>
              </div>

              {/* CASMOH 3 Core Pillars */}
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#001B5E]">
                    {t.pillarsHeading}
                  </h3>
                  <span className="text-xs font-semibold text-[#007A3D] bg-[#007A3D]/10 px-2.5 py-1 rounded-full">
                    {t.pillarsBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Pillar 1 */}
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200/80 transition-all duration-300 flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-[#001B5E]">
                      <img
                        src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://placehold.co/800x450/001B5E/FFFFFF?text=Entrepots+CASMOH';
                        }}
                        alt="Entrepôts France et Maroc"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001B5E]/75 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#001B5E] text-white text-[11px] font-bold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                        <span>{t.pillar1Tag}</span>
                      </span>
                    </div>
                    <div className="p-5 flex-grow">
                      <h4 className="font-bold text-[#001B5E] text-base mb-1.5">
                        {t.pillar1Title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {t.pillar1Desc}
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200/80 transition-all duration-300 flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-[#D90429]">
                      <img
                        src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://placehold.co/800x450/D90429/FFFFFF?text=Colis+et+Valises';
                        }}
                        alt="Transport de Colis et Valises"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001B5E]/75 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D90429] text-white text-[11px] font-bold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>{t.pillar2Tag}</span>
                      </span>
                    </div>
                    <div className="p-5 flex-grow">
                      <h4 className="font-bold text-[#001B5E] text-base mb-1.5">
                        {t.pillar2Title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {t.pillar2Desc}
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200/80 transition-all duration-300 flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-[#007A3D]">
                      <img
                        src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://placehold.co/800x450/007A3D/FFFFFF?text=Livraison+Client';
                        }}
                        alt="Livraison à Domicile"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001B5E]/75 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#007A3D] text-white text-[11px] font-bold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                        <span>{t.pillar3Tag}</span>
                      </span>
                    </div>
                    <div className="p-5 flex-grow">
                      <h4 className="font-bold text-[#001B5E] text-base mb-1.5">
                        {t.pillar3Title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {t.pillar3Desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. Not Found State */}
          {notFoundCode && (
            <div className="bg-white rounded-3xl shadow-sm border border-[#D90429]/30 p-8 sm:p-10 text-center animate-fade-up">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#D90429]/10 text-[#D90429] flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#001B5E] mb-1">{t.notFoundTitle}</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-5">
                {t.notFoundDesc} (
                <span className="font-mono font-bold text-[#001B5E]">{notFoundCode}</span>)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('CM-849201')}
                  className="px-4 py-2 rounded-xl bg-[#001B5E]/8 hover:bg-[#001B5E]/15 text-[#001B5E] font-bold text-xs transition-colors"
                >
                  CM-849201
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('CM-304912')}
                  className="px-4 py-2 rounded-xl bg-[#001B5E]/8 hover:bg-[#001B5E]/15 text-[#001B5E] font-bold text-xs transition-colors"
                >
                  CM-304912
                </button>
              </div>
            </div>
          )}

          {/* C. Active Parcel Result View */}
          {activeParcel && (
            <TrackingResult
              parcel={activeParcel}
              lang={lang}
              onCopyTrackingNumber={() => {
                void handleCopyTrackingNumber();
              }}
              onOpenImageModal={() => setIsImageModalOpen(true)}
              t={t}
            />
          )}
        </section>
      </main>

      <Footer
        t={t}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        onResetView={handleResetView}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        parcel={activeParcel}
        onClose={() => setIsImageModalOpen(false)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        t={t}
      />
    </div>
  );
};

export default TrackingPage;
