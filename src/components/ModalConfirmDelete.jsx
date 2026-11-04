import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const ModalConfirmDelete = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-[28px] shadow-2xl p-6 relative text-neutral-900 overflow-hidden transform animate-in zoom-in-95 duration-150">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icono de advertencia */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Título y Mensaje */}
        <h3 className="text-base font-bold font-display text-neutral-900 leading-snug">
          {title || '¿Estás seguro de eliminar este elemento?'}
        </h3>
        <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
          {message || 'Esta acción no se puede deshacer y el registro se eliminará permanentemente de tu base de datos.'}
        </p>

        {/* Botones de acción */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sí, eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
