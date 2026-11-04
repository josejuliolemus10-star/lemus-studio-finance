import React, { useState, useEffect } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, Target, Sparkles, Check } from 'lucide-react';
import { formatGTQ } from '../utils/formatters';

export const ModalMonthlyTarget = ({ isOpen, onClose }) => {
  const monthlyTarget = useFinancialStore((state) => state.monthlyTarget || 3000);
  const setMonthlyTarget = useFinancialStore((state) => state.setMonthlyTarget);
  const addToast = useFinancialStore((state) => state.addToast);

  const [targetInput, setTargetInput] = useState(String(monthlyTarget));
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTargetInput(String(monthlyTarget));
      setError('');
    }
  }, [isOpen, monthlyTarget]);

  if (!isOpen) return null;

  const quickTargets = [1500, 3000, 5000, 7500, 10000];

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (isNaN(val) || val <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }
    setMonthlyTarget(val);
    addToast(`🎯 Meta mensual establecida en ${formatGTQ(val)}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl p-6 relative text-white overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Definir Meta Mensual
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Objetivo de facturación para Lemus Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5">
              Monto de Meta de Facturación (GTQ) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-white text-sm">
                Q
              </span>
              <input
                type="number"
                step="50"
                min="1"
                required
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="ej. 5000"
                className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-9 pr-3.5 py-3 text-white text-sm font-bold font-mono focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Botones de sugerencias en 1 clic */}
          <div>
            <label className="block text-[#71717A] text-[11px] mb-2 font-medium">
              Metas sugeridas en 1 clic:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickTargets.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setTargetInput(String(q))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    Number(targetInput) === q
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-[#141414] text-[#A1A1AA] border-[#242424] hover:text-white hover:border-[#383838]'
                  }`}
                >
                  Q {q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#242424]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#A1A1AA] hover:text-white transition text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Guardar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
