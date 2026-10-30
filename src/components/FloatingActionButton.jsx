import React, { useState } from 'react';
import { Plus, ArrowUpRight, Briefcase, UserPlus, Globe, Calendar as CalendarIcon, FileSpreadsheet, X } from 'lucide-react';

export const FloatingActionButton = ({
  onOpenTransaction,
  onOpenProject,
  onOpenClient,
  onOpenWebsite,
  onOpenCalendar,
  onExportExcel
}) => {
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
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0D0D0D] border border-[#242424] hover:border-white text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#A1A1AA] group-hover:text-white">Registrar Movimiento</span>
            <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              onOpenCalendar();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0D0D0D] border border-[#242424] hover:border-white text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#A1A1AA] group-hover:text-white">Agendar Cita / Horario</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              onOpenWebsite();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0D0D0D] border border-[#242424] hover:border-white text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#A1A1AA] group-hover:text-white">Registrar Sitio Web</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              onOpenProject();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0D0D0D] border border-[#242424] hover:border-white text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#A1A1AA] group-hover:text-white">Nuevo Proyecto</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              onOpenClient();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0D0D0D] border border-[#242424] hover:border-white text-white shadow-2xl text-xs font-semibold group transition-all"
          >
            <span className="text-[#A1A1AA] group-hover:text-white">Nuevo Cliente CRM</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              onExportExcel();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 shadow-2xl text-xs font-semibold group transition-all"
          >
            <span>Descargar Excel (.xlsx)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 p-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-white text-black rotate-45 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
            : 'bg-white text-black hover:scale-105 shadow-[0_0_25px_rgba(255,255,255,0.3)]'
        }`}
        title="Acciones Rápidas"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
