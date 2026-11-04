import React from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { CheckCircle2, AlertTriangle, Info, X, Trash2 } from 'lucide-react';

export const ToastContainer = () => {
  const toasts = useFinancialStore((state) => state.toasts);
  const removeToast = useFinancialStore((state) => state.removeToast);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'text-white';
        let categoryLabel = 'Confirmación';

        const isDelete = toast.message?.includes('eliminad') || toast.message?.includes('🗑️');

        if (isDelete) {
          Icon = Trash2;
          categoryLabel = 'Eliminado';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-amber-300';
          categoryLabel = 'Advertencia';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-neutral-200';
          categoryLabel = 'Notificación';
        } else {
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
          categoryLabel = 'Completado';
        }

        // Limpiar emojis al inicio del texto para una apariencia 100% pulida
        const cleanMessage = (toast.message || '').replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]\s*/gu, '').trim();

        return (
          <div
            key={toast.id}
            className="pointer-events-auto relative overflow-hidden flex items-start justify-between gap-3.5 p-4 rounded-[22px] bg-white/95 backdrop-blur-2xl border border-neutral-200/90 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)] text-neutral-900 transition-all duration-300 animate-in slide-in-from-bottom-5"
          >
            {/* Icono en squircle negro elegante */}
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>

            {/* Contenido textual */}
            <div className="flex-1 min-w-0 pr-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block font-mono">
                Lemus Studio • {categoryLabel}
              </span>
              <p className="text-xs font-semibold text-neutral-900 leading-snug mt-0.5">
                {cleanMessage}
              </p>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-black hover:bg-neutral-100 p-1.5 rounded-lg transition-colors shrink-0"
              title="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Barra de progreso de auto-cierre */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 overflow-hidden">
              <div className="h-full bg-black/80 toast-progress-bar" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
