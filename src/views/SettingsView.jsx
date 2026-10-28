import React from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { Settings, RotateCcw, Database, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

export const SettingsView = () => {
  const resetToZero = useFinancialStore((state) => state.resetToZero);
  const seedDemoData = useFinancialStore((state) => state.seedDemoData);
  const transactions = useFinancialStore((state) => state.transactions);
  const projects = useFinancialStore((state) => state.projects);
  const clients = useFinancialStore((state) => state.clients);

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los datos a cero? Se borrarán todos los movimientos, proyectos y clientes guardados en LocalStorage.')) {
      resetToZero();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-[#CCD0CF] font-display flex items-center gap-2">
          Configuración & Datos del Sistema
        </h2>
        <p className="text-xs text-[#9BA8AB] mt-0.5">
          Parámetros contables, almacenamiento local y utilidades de Lemus Studio
        </p>
      </div>

      {/* Tarjeta de Parámetros de la Agencia */}
      <div className="dashboard-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
          <span>Información de la Suite Financiera</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#06141B] p-3 rounded-xl border border-[#253745]">
            <span className="text-[#9BA8AB] block mb-1">Nombre Comercial:</span>
            <span className="text-white font-semibold font-display">Lemus Studio</span>
          </div>

          <div className="bg-[#06141B] p-3 rounded-xl border border-[#253745]">
            <span className="text-[#9BA8AB] block mb-1">Moneda Principal:</span>
            <span className="text-[#00E5FF] font-mono font-bold">GTQ — Quetzal Guatemalteco (Q)</span>
          </div>

          <div className="bg-[#06141B] p-3 rounded-xl border border-[#253745]">
            <span className="text-[#9BA8AB] block mb-1">Banco Asociado:</span>
            <span className="text-white font-semibold">BAC Credomatic Guatemala (Monetaria Business)</span>
          </div>

          <div className="bg-[#06141B] p-3 rounded-xl border border-[#253745]">
            <span className="text-[#9BA8AB] block mb-1">Persistencia:</span>
            <span className="text-emerald-400 font-mono">LocalStorage Activo (lemus_studio_finance_v1)</span>
          </div>
        </div>
      </div>

      {/* Estado del Almacenamiento Local */}
      <div className="dashboard-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Resumen de Entidades Guardadas</span>
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#06141B] p-3 rounded-xl border border-[#253745]">
            <span className="text-xl font-bold font-numeric text-white block">{transactions.length}</span>
            <span className="text-[11px] text-[#9BA8AB]">Movimientos (Flujo)</span>
          </div>
          <div className="bg-[#06141B] p-3 rounded-xl border border-[#253745]">
            <span className="text-xl font-bold font-numeric text-white block">{projects.length}</span>
            <span className="text-[11px] text-[#9BA8AB]">Proyectos Activos</span>
          </div>
          <div className="bg-[#06141B] p-3 rounded-xl border border-[#253745]">
            <span className="text-xl font-bold font-numeric text-white block">{clients.length}</span>
            <span className="text-[11px] text-[#9BA8AB]">Clientes en Cartera</span>
          </div>
        </div>
      </div>

      {/* Control de Datos y Resets */}
      <div className="dashboard-card p-6 border-rose-900/30 space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Acciones de Base de Datos</span>
        </h3>

        <p className="text-xs text-[#9BA8AB] leading-relaxed">
          Puedes vaciar completamente los datos para comenzar desde cero con tu contabilidad real, o recargar movimientos de demostración si deseas evaluar el comportamiento de las gráficas.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/40 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Todo a Cero (Limpiar)</span>
          </button>

          <button
            onClick={seedDemoData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cargar Datos de Demostración</span>
          </button>
        </div>
      </div>
    </div>
  );
};
