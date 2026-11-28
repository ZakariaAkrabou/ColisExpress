import React from 'react';
import { Copy, Calendar, ChevronsRight } from 'lucide-react';
import type { Language, ParcelRecord } from '../../types/tracking.types';
import type { TranslationSet } from '../../translations/i18n';
import { TrackingProgress } from './TrackingProgress';
import { ParcelInformation } from './ParcelInformation';

interface TrackingResultProps {
  parcel: ParcelRecord;
  lang: Language;
  onCopyTrackingNumber: () => void;
  onOpenImageModal: () => void;
  t: TranslationSet;
}

export const TrackingResult: React.FC<TrackingResultProps> = ({
  parcel,
  lang,
  onCopyTrackingNumber,
  onOpenImageModal,
  t,
}) => {
  const isFrToMa = parcel.direction === 'FR_TO_MA';
  const unitLabel =
    Number(parcel.quantity) > 1
      ? lang === 'fr'
        ? 'colis'
        : 'parcels'
      : lang === 'fr'
      ? 'colis'
      : 'parcel';

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Summary & 5-Step Progress Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#001B5E] via-[#001B5E] to-[#D90429]" />

        {/* Card Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.trackingNumberLabel}
              </span>
              <button
                type="button"
                onClick={onCopyTrackingNumber}
                title="Copier le numéro"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#F4F6FA] hover:bg-[#001B5E]/10 text-[#001B5E] font-mono font-bold text-sm border border-slate-200/80 transition-colors"
              >
                <span>{parcel.id}</span>
                <Copy className="w-3.5 h-3.5 text-[#D90429]" />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#001B5E]">
              {parcel.headline[lang]}
            </h2>
          </div>

          {/* Status Pill */}
          <div className="self-start sm:self-center">
            {parcel.statusType === 'delivered' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#007A3D]/12 text-[#007A3D] border border-[#007A3D]/25">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007A3D]" />
                <span>{parcel.statusText[lang]}</span>
              </span>
            )}
            {parcel.statusType === 'transit' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#D90429]/10 text-[#D90429] border border-[#D90429]/25">
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#D90429] pulse-dot" />
                <span>{parcel.statusText[lang]}</span>
              </span>
            )}
            {parcel.statusType === 'active' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#001B5E]/10 text-[#001B5E] border border-[#001B5E]/20">
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#001B5E] pulse-dot" />
                <span>{parcel.statusText[lang]}</span>
              </span>
            )}
          </div>
        </div>

        {/* Route & ETA Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-[#F4F6FA]/70">
          <div className="p-6 md:col-span-2 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#001B5E] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#001B5E]" />
                <span>
                  {isFrToMa
                    ? lang === 'fr'
                      ? 'Expéditeur (France)'
                      : 'Sender (France)'
                    : lang === 'fr'
                    ? 'Expéditeur (Maroc)'
                    : 'Sender (Morocco)'}
                </span>
              </div>
              <p className="font-bold text-[#001B5E] text-base sm:text-lg">
                {parcel.fromCity}
              </p>
              <p className="text-xs text-slate-500">{parcel.senderName}</p>
            </div>

            <div className="flex-grow flex items-center justify-center px-2 max-w-[180px]">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-[#001B5E] bg-white shrink-0" />
              <div className="h-0.5 flex-grow bg-gradient-to-r from-[#001B5E] to-[#D90429] relative mx-1">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-1 text-[#D90429] rounded-full shadow-2xs">
                  <ChevronsRight className="w-4 h-4" />
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#D90429] shrink-0" />
            </div>

            <div className="text-right">
              <div className="inline-flex items-center justify-end gap-1.5 text-xs font-bold text-[#D90429] uppercase tracking-wider mb-1">
                <span>
                  {isFrToMa
                    ? lang === 'fr'
                      ? 'Destinataire (Maroc)'
                      : 'Recipient (Morocco)'
                    : lang === 'fr'
                    ? 'Destinataire (France)'
                    : 'Recipient (France)'}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#D90429]" />
              </div>
              <p className="font-bold text-[#001B5E] text-base sm:text-lg">
                {parcel.toCity}
              </p>
              <p className="text-xs text-slate-500">{parcel.receiverName}</p>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-center bg-white/50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {parcel.isDelivered ? t.deliveredOnLabel : t.etaLabel}
            </p>
            <div className="flex items-center gap-2 text-[#001B5E]">
              <Calendar className="w-5 h-5 text-[#D90429] shrink-0" />
              <span className="font-bold text-base sm:text-lg">
                {parcel.eta[lang]}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {parcel.quantity} {unitLabel} • {parcel.weight} kg
            </p>
          </div>
        </div>

        {/* 5-Step Visual Progress Stepper */}
        <TrackingProgress parcel={parcel} lang={lang} t={t} />
      </div>

      {/* Parcel Information Card */}
      <ParcelInformation
        parcel={parcel}
        lang={lang}
        onOpenImageModal={onOpenImageModal}
        t={t}
      />
    </div>
  );
};
