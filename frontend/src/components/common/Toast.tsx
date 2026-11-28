import React from 'react';
import type { ToastMessage } from '../../types/tracking.types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const colors: Record<ToastMessage['type'], string> = {
    success: 'bg-[#007A3D] text-white border-[#005C2E]',
    warning: 'bg-[#D90429] text-white border-[#A80320]',
    info: 'bg-[#001B5E] text-white border-[#0A2472]',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fade-up ${colors[toast.type]}`}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-85" />
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
