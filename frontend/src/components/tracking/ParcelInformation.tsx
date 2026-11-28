import React from 'react';
import {
  Scale,
  Package,
  Banknote,
  CheckCircle2,
  FileText,
  Home,
  Building2,
} from 'lucide-react';
import type { Language, ParcelRecord } from '../../types/tracking.types';
import type { TranslationSet } from '../../translations/i18n';
import { ParcelImageViewer } from './ParcelImageViewer';
import { SenderCard } from './SenderCard';
import { ReceiverCard } from './ReceiverCard';

interface ParcelInformationProps {
  parcel: ParcelRecord;
  lang: Language;
  onOpenImageModal: () => void;
  t: TranslationSet;
}

export const ParcelInformation: React.FC<ParcelInformationProps> = ({
  parcel,
  lang,
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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#001B5E]">
            {t.colisInfoTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">{t.colisInfoSubtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#001B5E]/10 text-[#001B5E] border border-[#001B5E]/20">
            {isFrToMa ? t.dirFrToMa : t.dirMaToFr}
          </span>
          {parcel.isADomicile ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#001B5E]/10 text-[#001B5E] border border-[#001B5E]/20">
              <Home className="w-3.5 h-3.5 text-[#D90429]" />
              <span>{t.domicileYes}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-[#001B5E]" />
              <span>{t.domicileNo}</span>
            </span>
          )}
        </div>
      </div>

      {/* Top Row: Compact 1:1 Square Parcel Image Card + Sender & Receiver Cards */}
      <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
        <ParcelImageViewer
          imageUrl={parcel.image}
          onOpenModal={onOpenImageModal}
          t={t}
        />

        <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <SenderCard parcel={parcel} t={t} />
          <ReceiverCard parcel={parcel} t={t} />
        </div>
      </div>

      {/* Metrics Row: Weight, Quantity, Price, Payment */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-[#001B5E]" />
            <span>{t.weightLabel}</span>
          </div>
          <p className="font-extrabold text-xl text-[#001B5E]">{parcel.weight} kg</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 text-[#001B5E]" />
            <span>{t.quantityLabel}</span>
          </div>
          <p className="font-extrabold text-xl text-[#001B5E]">
            {parcel.quantity} {unitLabel}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Banknote className="w-4 h-4 text-[#D90429]" />
            <span>{t.priceLabel}</span>
          </div>
          <p className="font-extrabold text-xl text-[#001B5E]">
            {parcel.price} {isFrToMa ? '€' : 'MAD'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#007A3D]" />
            <span>{t.paymentLabel}</span>
          </div>
          <div>
            {parcel.isPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#007A3D]/12 text-[#007A3D] border border-[#007A3D]/25">
                ● {t.paidYes}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D90429]/12 text-[#D90429] border border-[#D90429]/25">
                ● {t.paidNo}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Package Description Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FA] border border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#001B5E] mb-1.5">
          <FileText className="w-4 h-4 text-[#D90429]" />
          <span>{t.descriptionLabel}</span>
        </div>
        <p className="text-sm text-slate-700 font-medium leading-relaxed">
          {parcel.description || '—'}
        </p>
      </div>
    </div>
  );
};
