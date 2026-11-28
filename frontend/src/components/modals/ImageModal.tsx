import React from 'react';
import { X } from 'lucide-react';
import type { ParcelRecord } from '../../types/tracking.types';

interface ImageModalProps {
  isOpen: boolean;
  parcel: ParcelRecord | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  parcel,
  onClose,
}) => {
  if (!isOpen || !parcel) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#001B5E]/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-up"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D90429]" />
            <h4 className="font-bold text-sm text-[#001B5E]">
              {parcel.id} — {parcel.fromCity} → {parcel.toCity}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#D90429] hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-[#F4F6FA] aspect-square max-h-[70vh] mx-auto flex items-center justify-center overflow-hidden">
          <img
            src={parcel.image}
            onError={(e) => {
              e.currentTarget.src =
                'https://placehold.co/800x800/001B5E/FFFFFF?text=Colis+CASMOH';
            }}
            alt="Aperçu agrandi du colis"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
