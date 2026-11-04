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
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl shadow-2xl p-6 relative text-neutral-900 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-neutral-900">Editar Progreso</h2>
              <p className="text-xs text-neutral-500 truncate max-w-[240px]">{project.nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Slider de Progreso */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600 font-semibold">Porcentaje Completado:</span>
              <span className="text-lg font-bold font-numeric text-black bg-white px-3 py-0.5 rounded-xl border border-neutral-200 shadow-sm">
                {progreso}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progreso}
              onChange={(e) => setProgreso(e.target.value)}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>0% Inicio</span>
              <span>50% Mitad</span>
              <span>100% Entregado</span>
            </div>
          </div>

          {/* Selector de Estado */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1.5">
              Estado del Entregable
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['En progreso', 'En revisión', 'Finalizado'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setEstado(st)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                    estado === st
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold shadow-md transition active:scale-95"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
