import React from 'react';
import { Phone } from 'lucide-react';
import type { ParcelRecord } from '../../types/tracking.types';
import type { TranslationSet } from '../../translations/i18n';

interface SenderCardProps {
  parcel: ParcelRecord;
  t: TranslationSet;
}

export const SenderCard: React.FC<SenderCardProps> = ({ parcel, t }) => (
  <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6FA] border border-slate-200/80 flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#001B5E]">
          <span className="w-2 h-2 rounded-full bg-[#001B5E]" />
          <span>{t.senderCardTitle}</span>
        </span>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white text-[#001B5E] border border-slate-200/80">
          {parcel.fromCity}
        </span>
      </div>
      <p className="font-bold text-base sm:text-lg text-[#001B5E] mb-1">
        {parcel.senderName}
      </p>
      <div className="inline-flex items-center gap-2 text-sm text-slate-600 font-medium">
        <Phone className="w-4 h-4 text-[#001B5E]/70 shrink-0" />
        <span className="font-mono">{parcel.senderPhone}</span>
      </div>
    </div>
    <div className="mt-3.5 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
      <span>{t.departureCityLabel}</span>
      <span className="font-bold text-[#001B5E] uppercase">{parcel.fromCity}</span>
    </div>
  </div>
);
