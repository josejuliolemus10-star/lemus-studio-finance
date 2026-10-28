import React, { useState, useEffect } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, Sliders, CheckCircle2, Clock, Check, Trash2 } from 'lucide-react';

export const ModalEditProgress = ({ isOpen, onClose, project }) => {
  const updateProject = useFinancialStore((state) => state.updateProject);
  const deleteProject = useFinancialStore((state) => state.deleteProject);

  const [progreso, setProgreso] = useState(0);
  const [estado, setEstado] = useState('En progreso');

  useEffect(() => {
    if (project) {
      setProgreso(project.progreso ?? 0);
      setEstado(project.estado || 'En progreso');
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProject(project.id, {
      progreso: parseInt(progreso, 10),
      estado: parseInt(progreso, 10) === 100 ? 'Finalizado' : estado
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.nombre}"?`)) {
      deleteProject(project.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#11212D] border border-[#253745] rounded-2xl shadow-2xl p-6 relative text-[#CCD0CF] overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-[#253745]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Editar Progreso</h2>
              <p className="text-xs text-[#9BA8AB] truncate max-w-[240px]">{project.nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#9BA8AB] hover:text-white rounded-lg hover:bg-[#253745]/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Slider de Progreso */}
          <div className="bg-[#06141B] p-4 rounded-xl border border-[#253745] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#9BA8AB] font-medium">Porcentaje Completado:</span>
              <span className="text-lg font-bold font-numeric text-white bg-[#11212D] px-2.5 py-0.5 rounded-lg border border-[#253745]">
                {progreso}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progreso}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setProgreso(val);
                if (val === 100) setEstado('Finalizado');
              }}
              className="w-full h-2.5 bg-[#253745] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
            />
            <div className="flex justify-between text-[10px] text-[#9BA8AB]/70 font-mono">
              <span>0% Inicio</span>
              <span>50% Desarrollo</span>
              <span>100% Finalizado</span>
            </div>
          </div>

          {/* Selector de Estado */}
          <div>
            <label className="block text-[#9BA8AB] font-medium mb-1.5">Estado del Proyecto</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'En progreso', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20' },
                { id: 'En revisión', color: 'border-amber-500/40 text-amber-400 bg-amber-950/20' },
                { id: 'Finalizado', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' },
              ].map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setEstado(st.id)}
                  className={`py-2 px-1 rounded-xl text-center border font-medium transition-all ${
                    estado === st.id
                      ? `${st.color} font-bold ring-1 ring-white/20`
                      : 'bg-[#06141B] border-[#253745] text-[#9BA8AB] hover:text-[#CCD0CF]'
                  }`}
                >
                  {st.id}
                </button>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#253745]">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 transition-colors text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Proyecto</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-[#9BA8AB] hover:text-white transition-colors text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00E5FF] text-[#06141B] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-glow-cyan"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
