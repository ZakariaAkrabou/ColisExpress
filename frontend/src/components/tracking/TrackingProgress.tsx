import React from 'react';
import { Check } from 'lucide-react';
import type { Language, ParcelRecord } from '../../types/tracking.types';
import type { TranslationSet } from '../../translations/i18n';

interface TrackingProgressProps {
  parcel: ParcelRecord;
  lang: Language;
  t: TranslationSet;
}

export const TrackingProgress: React.FC<TrackingProgressProps> = ({
  parcel,
  lang,
  t,
}) => (
  <div className="p-6 sm:p-8">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-sm font-bold text-[#001B5E] uppercase tracking-wider">
        {t.progressTitle}
      </h3>
      <span className="text-xs font-bold text-[#001B5E] bg-[#001B5E]/8 px-3 py-1 rounded-full">
        {lang === 'fr'
          ? `Étape ${parcel.stepIndex + 1} sur ${t.steps.length}`
          : `Step ${parcel.stepIndex + 1} of ${t.steps.length}`}
      </span>
    </div>

    <div className="relative">
      <div className="hidden sm:block absolute top-5 left-0 right-0 h-1 bg-slate-100 rounded-full mx-8">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            parcel.isDelivered
              ? 'bg-[#007A3D]'
              : 'bg-gradient-to-r from-[#001B5E] to-[#D90429]'
          }`}
          style={{
            width: `${(parcel.stepIndex / (t.steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
        {t.steps.map((stepLabel, idx) => {
          const isCompleted =
            idx < parcel.stepIndex ||
            (idx === parcel.stepIndex && parcel.isDelivered);
          const isCurrent = idx === parcel.stepIndex && !parcel.isDelivered;

          let circleClasses =
            'bg-[#F4F6FA] text-slate-400 border-2 border-slate-200';
          let labelClasses = 'text-slate-400 font-medium';

          if (isCompleted) {
            circleClasses = parcel.isDelivered
              ? 'bg-[#007A3D] text-white border-2 border-[#007A3D] shadow-sm'
              : 'bg-[#001B5E] text-white border-2 border-[#001B5E] shadow-sm';
            labelClasses = 'text-[#001B5E] font-semibold';
          } else if (isCurrent) {
            circleClasses =
              'bg-white text-[#D90429] border-2 border-[#D90429] ring-4 ring-[#D90429]/15 shadow-sm';
            labelClasses = 'text-[#D90429] font-bold';
          }

          return (
            <div
              key={stepLabel}
              className="flex sm:flex-col items-center gap-3 sm:gap-2.5 sm:text-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${circleClasses}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D90429] animate-pulse" />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              <span className={`text-xs sm:text-[13px] leading-tight ${labelClasses}`}>
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
