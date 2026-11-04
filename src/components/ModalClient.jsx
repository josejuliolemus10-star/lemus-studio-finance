import React, { useState } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, UserPlus, Building2, Mail, CheckCircle2, AlertCircle, Clock, Check } from 'lucide-react';

export const ModalClient = ({ isOpen, onClose }) => {
  const addClient = useFinancialStore((state) => state.addClient);

  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [contacto, setContacto] = useState('');
  const [estado, setEstado] = useState('Contactado'); // 'Contactado' | 'En proceso' | 'Cerrado' | 'Inactivo'
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() && !empresa.trim()) {
      setError('Por favor indica al menos el nombre del contacto o de la empresa');
      return;
    }

    addClient({
      nombre,
      empresa: empresa || nombre,
      contacto,
      estado,
    });

    setNombre('');
    setEmpresa('');
    setContacto('');
    setEstado('Contactado');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl p-6 relative text-white overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Nuevo Cliente / Lead</h2>
              <p className="text-xs text-neutral-400">Registra el prospecto y define su estado comercial</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Empresa / Razón Social */}
          <div>
            <label className="block text-neutral-400 font-medium mb-1.5">Empresa o Negocio *</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                required
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="ej. Inmobiliaria Santander"
                className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-9 pr-3 py-2.5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Nombre del Contacto */}
          <div>
            <label className="block text-neutral-400 font-medium mb-1.5">Nombre de Contacto / Encargado</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ej. Lic. Fernando Santander"
              className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3 py-2.5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Email o Teléfono */}
          <div>
            <label className="block text-neutral-400 font-medium mb-1.5">Teléfono o Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="ej. contacto@santander.gt o +502 4589-1234"
                className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-9 pr-3 py-2.5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Estado Comercial / Pipeline */}
          <div>
            <label className="block text-neutral-400 font-medium mb-1.5">Estado del Trato Comercial</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Contactado', label: 'Contactado' },
                { id: 'En proceso', label: 'En proceso' },
                { id: 'Cerrado', label: 'Cerrado (Trato)' },
              ].map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setEstado(st.id)}
                  className={`py-2 px-1.5 rounded-xl text-center border font-medium transition-all text-[11px] ${
                    estado === st.id
                      ? 'bg-white text-black border-white font-bold shadow-sm'
                      : 'bg-[#141414] border-[#262626] text-neutral-400 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#242424]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shadow-md active:scale-95"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
