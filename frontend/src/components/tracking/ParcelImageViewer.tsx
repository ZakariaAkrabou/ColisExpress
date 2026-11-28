import React from 'react';
import { ZoomIn } from 'lucide-react';
import type { TranslationSet } from '../../translations/i18n';

interface ParcelImageViewerProps {
  imageUrl: string;
  onOpenModal: () => void;
  t: TranslationSet;
}

export const ParcelImageViewer: React.FC<ParcelImageViewerProps> = ({
  imageUrl,
  onOpenModal,
  t,
}) => (
  <div className="w-32 sm:w-36 shrink-0">
    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
      {t.parcelPhotoLabel}
    </span>
    <button
      type="button"
      onClick={onOpenModal}
      className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F4F6FA] border border-slate-200/90 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#001B5E]"
    >
      <img
        src={imageUrl}
        onError={(e) => {
          e.currentTarget.src =
            'https://placehold.co/400x400/001B5E/FFFFFF?text=Colis';
        }}
        alt="Photo du colis CASMOH"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001B5E]/75 via-transparent to-transparent opacity-90" />
      <div className="absolute bottom-2 inset-x-2 flex items-center justify-center">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/25 backdrop-blur-md text-white text-[10px] font-bold">
          <ZoomIn className="w-3 h-3" />
          <span>{t.zoomBtn}</span>
        </span>
      </div>
    </button>
  </div>
);
