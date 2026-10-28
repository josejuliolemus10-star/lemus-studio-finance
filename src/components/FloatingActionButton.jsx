import React, { useState } from 'react';
import { Plus, ArrowUpRight, Briefcase, UserPlus, X } from 'lucide-react';

export const FloatingActionButton = ({ onOpenTransaction, onOpenProject, onOpenClient }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Speed Dial Options */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <button
            onClick={() => {
              onOpenTransaction();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#11212D] border border-[#253745] hover:border-[#00E5FF] text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#CCD0CF] group-hover:text-white">Registrar Movimiento</span>
            <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              onOpenProject();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#11212D] border border-[#253745] hover:border-emerald-400 text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#CCD0CF] group-hover:text-white">Nuevo Proyecto</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              onOpenClient();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#11212D] border border-[#253745] hover:border-[#D946EF] text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#CCD0CF] group-hover:text-white">Nuevo Cliente</span>
            <div className="w-7 h-7 rounded-lg bg-[#D946EF]/20 text-[#D946EF] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 p-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-[#253745] text-white rotate-45 border border-[#9BA8AB]'
            : 'bg-[#00E5FF] text-[#06141B] hover:scale-105 shadow-[0_0_25px_rgba(0,229,255,0.4)]'
        }`}
        title="Acciones Rápidas"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
