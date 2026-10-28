import React, { useState } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, Briefcase, Calendar, Users, Sliders, DollarSign, Code, AlertCircle } from 'lucide-react';

export const ModalProject = ({ isOpen, onClose }) => {
  const addProject = useFinancialStore((state) => state.addProject);
  const clients = useFinancialStore((state) => state.clients);

  const [nombre, setNombre] = useState('');
  const [idCliente, setIdCliente] = useState(clients[0]?.id || '');
  const [presupuesto, setPresupuesto] = useState('');
  const [estado, setEstado] = useState('En progreso');
  const [progreso, setProgreso] = useState(25);
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [tecnologia, setTecnologia] = useState('Next.js, Tailwind CSS');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor ingresa el nombre del proyecto');
      return;
    }

    addProject({
      nombre,
      id_cliente: idCliente,
      estado,
      progreso: parseInt(progreso, 10),
      fecha_entrega: fechaEntrega,
      presupuesto: parseFloat(presupuesto) || 0,
      tecnologia,
    });

    // Limpiar formulario y cerrar
    setNombre('');
    setPresupuesto('');
    setProgreso(25);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#11212D] border border-[#253745] rounded-2xl shadow-2xl p-6 relative text-[#CCD0CF] overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#253745]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Nuevo Proyecto Web</h2>
              <p className="text-xs text-[#9BA8AB]">Asigna cliente, presupuesto y fecha de entrega</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#9BA8AB] hover:text-white rounded-lg hover:bg-[#253745]/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nombre del Proyecto */}
          <div>
            <label className="block text-[#9BA8AB] font-medium mb-1.5">Nombre del Proyecto *</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ej. Portal Inmobiliario & CRM Santander"
              className="w-full bg-[#06141B] border border-[#253745] rounded-xl px-3 py-2.5 text-[#CCD0CF] text-xs placeholder-[#9BA8AB]/40 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* Cliente & Presupuesto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">Cliente Asignado</label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
                <select
                  value={idCliente}
                  onChange={(e) => setIdCliente(e.target.value)}
                  className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] text-xs focus:outline-none focus:border-[#00E5FF]"
                >
                  {clients.length === 0 ? (
                    <option value="">(Sin clientes creados)</option>
                  ) : (
                    clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.empresa || c.nombre}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">Presupuesto (GTQ)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold font-numeric text-[#00E5FF]">Q</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  placeholder="ej. 8500.00"
                  className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] font-numeric text-xs placeholder-[#9BA8AB]/40 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>
          </div>

          {/* Estado & Fecha de entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full bg-[#06141B] border border-[#253745] rounded-xl px-3 py-2.5 text-[#CCD0CF] text-xs focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="En progreso">En progreso</option>
                <option value="En revisión">En revisión</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">Fecha de Entrega Estimada</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
                <input
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] text-xs focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>
          </div>

          {/* Barra Deslizable (Slider) de Progreso */}
          <div className="bg-[#06141B] p-3.5 rounded-xl border border-[#253745] space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[#9BA8AB] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
                Progreso del Proyecto:
              </span>
              <span className="font-mono text-white font-bold bg-[#11212D] px-2 py-0.5 rounded border border-[#253745]">
                {progreso}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progreso}
              onChange={(e) => setProgreso(e.target.value)}
              className="w-full h-2 bg-[#253745] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
            />
            <div className="flex justify-between text-[10px] text-[#9BA8AB]/60 font-mono">
              <span>0% Inicio</span>
              <span>50% Desarrollo</span>
              <span>100% Entregado</span>
            </div>
          </div>

          {/* Stack Tecnológico */}
          <div>
            <label className="block text-[#9BA8AB] font-medium mb-1.5">Stack Tecnológico</label>
            <div className="relative">
              <Code className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
              <input
                type="text"
                value={tecnologia}
                onChange={(e) => setTecnologia(e.target.value)}
                placeholder="ej. Next.js 14, Tailwind, Supabase"
                className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] text-xs focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#9BA8AB] hover:text-white transition-colors text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#06141B] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-glow-cyan"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
