import React from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const toasts = useFinancialStore((state) => state.toasts);
  const removeToast = useFinancialStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderColor = 'border-emerald-500/40';
        let iconColor = 'text-emerald-400';
        let glow = 'shadow-emerald-950/50';

        if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'border-amber-500/40';
          iconColor = 'text-amber-400';
          glow = 'shadow-amber-950/50';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderColor = 'border-[#00E5FF]/40';
          iconColor = 'text-[#00E5FF]';
          glow = 'shadow-cyan-950/50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#11212D]/95 backdrop-blur-md border ${borderColor} shadow-2xl ${glow} text-xs text-[#CCD0CF] animate-in slide-in-from-bottom-3 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9BA8AB] hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
