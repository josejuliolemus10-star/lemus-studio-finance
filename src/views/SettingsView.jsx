import React from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { exportToExcel } from '../utils/excelExporter';
import { Settings, RotateCcw, Database, ShieldCheck, Sparkles, AlertTriangle, FileSpreadsheet, Download, ExternalLink } from 'lucide-react';

export const SettingsView = () => {
  const resetToZero = useFinancialStore((state) => state.resetToZero);
  const seedDemoData = useFinancialStore((state) => state.seedDemoData);
  const addToast = useFinancialStore((state) => state.addToast);
  
  const transactions = useFinancialStore((state) => state.transactions);
  const projects = useFinancialStore((state) => state.projects);
  const clients = useFinancialStore((state) => state.clients);
  const websites = useFinancialStore((state) => state.websites);
  const calendarEvents = useFinancialStore((state) => state.calendarEvents);

  const handleExport = () => {
    exportToExcel({
      transactions,
      websites,
      calendarEvents,
      projects,
      clients
    });
    addToast('📊 Archivo Excel generado y descargado exitosamente.', 'success');
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los datos a cero? Se borrarán todos los movimientos, proyectos, páginas y clientes guardados en LocalStorage.')) {
      resetToZero();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
          Configuración & Datos de Lemus Studio
        </h2>
        <p className="text-xs text-[#A1A1AA] mt-0.5">
          Paleta Black & White, sincronización con Excel / Google Sheets y almacenamiento local
        </p>
      </div>

      {/* Tarjeta de Exportación a Excel / Google Sheets */}
      <div className="dashboard-card p-6 space-y-4 border-white/20 bg-[#0F0F0F]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Sincronización con Excel & Google Sheets</span>
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-xl leading-relaxed">
              Exporta todos tus datos actuales (Transacciones, Páginas Web Creadas, Calendario de Citas, Proyectos y Clientes) en un libro de Excel multihosting (.xlsx) ya formateado para arrastrar directamente a Google Drive y usarlo en tu teléfono.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Excel (.xlsx)</span>
          </button>
        </div>

        <div className="pt-3 border-t border-[#242424] flex items-center justify-between text-xs text-[#71717A]">
          <span>Compatible 100% con Microsoft Excel y Google Sheets.</span>
          <a
            href="https://sheets.new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1"
          >
            <span>Crear nueva hoja en Google Sheets</span>
            <ExternalLink className="w-3 h-3 text-[#A1A1AA]" />
          </a>
        </div>
      </div>

      {/* Resumen de Entidades Guardadas */}
      <div className="dashboard-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-white" />
          <span>Estado de la Base de Datos Local</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-xl font-bold font-numeric text-white block">{transactions.length}</span>
            <span className="text-[11px] text-[#A1A1AA]">Flujos / Caja</span>
          </div>
          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-xl font-bold font-numeric text-white block">{websites.length}</span>
            <span className="text-[11px] text-[#A1A1AA]">Webs Creadas</span>
          </div>
          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-xl font-bold font-numeric text-white block">{calendarEvents.length}</span>
            <span className="text-[11px] text-[#A1A1AA]">Citas / Agenda</span>
          </div>
          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-xl font-bold font-numeric text-white block">{projects.length}</span>
            <span className="text-[11px] text-[#A1A1AA]">Proyectos</span>
          </div>
          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-xl font-bold font-numeric text-white block">{clients.length}</span>
            <span className="text-[11px] text-[#A1A1AA]">Clientes CRM</span>
          </div>
        </div>
      </div>

      {/* Parámetros de la Agencia */}
      <div className="dashboard-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Identidad de Lemus Studio</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-[#A1A1AA] block mb-1">Paleta Visual:</span>
            <span className="text-white font-semibold font-display">Estudio Black & White (Obsidian & Blanco Puro)</span>
          </div>

          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-[#A1A1AA] block mb-1">Moneda Principal:</span>
            <span className="text-white font-mono font-bold">GTQ — Quetzal Guatemalteco (Q)</span>
          </div>

          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-[#A1A1AA] block mb-1">Banco Asociado:</span>
            <span className="text-white font-semibold">BAC Credomatic Guatemala (Business)</span>
          </div>

          <div className="bg-[#050505] p-3 rounded-xl border border-[#242424]">
            <span className="text-[#A1A1AA] block mb-1">Persistencia:</span>
            <span className="text-white font-mono">LocalStorage Activo (lemus_studio_finance_v4)</span>
          </div>
        </div>
      </div>

      {/* Control de Datos y Resets */}
      <div className="dashboard-card p-6 border-rose-900/30 space-y-4">
        <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Acciones de Base de Datos</span>
        </h3>

        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          Puedes reiniciar todos los datos para mantener tu contabilidad limpia, o recargar ejemplos si quieres ver la distribución de demostración.
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cargar Datos de Demostración</span>
          </button>
        </div>
      </div>
    </div>
  );
};
