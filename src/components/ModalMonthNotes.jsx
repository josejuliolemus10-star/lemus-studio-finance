import React, { useState } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, CheckCircle2, Circle, Trash2, Plus, Edit3, Save, BookOpen, Sparkles } from 'lucide-react';

export const ModalMonthNotes = ({ isOpen, onClose }) => {
  const monthNotes = useFinancialStore((state) => state.monthNotes);
  const monthGoals = useFinancialStore((state) => state.monthGoals);
  const setMonthNotes = useFinancialStore((state) => state.setMonthNotes);
  const addMonthGoal = useFinancialStore((state) => state.addMonthGoal);
  const toggleMonthGoal = useFinancialStore((state) => state.toggleMonthGoal);
  const deleteMonthGoal = useFinancialStore((state) => state.deleteMonthGoal);
  const addToast = useFinancialStore((state) => state.addToast);

  const [newGoalText, setNewGoalText] = useState('');
  const [localNotes, setLocalNotes] = useState(monthNotes || '');

  if (!isOpen) return null;

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    addMonthGoal(newGoalText);
    setNewGoalText('');
  };

  const handleSaveNotes = () => {
    setMonthNotes(localNotes);
    addToast('📝 Apuntes guardados con éxito.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-[32px] shadow-2xl p-6 sm:p-8 relative text-neutral-900 overflow-hidden transform animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-neutral-900 leading-tight">
                Objetivos & Bloc de Apuntes del Mes
              </h2>
              <p className="text-xs text-neutral-500">
                Anota pendientes, ideas y metas estratégicas de Lemus Studio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="overflow-y-auto space-y-6 py-4 pr-1 text-xs">
          
          {/* SECCIÓN 1: CHECKLIST DE METAS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                Checklist de Objetivos Clave
              </span>
              <span className="text-[11px] text-neutral-500 font-semibold">
                {monthGoals.filter(g => g.completed).length} de {monthGoals.length} logradas
              </span>
            </div>

            {/* Lista de metas */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {monthGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-neutral-200/80 bg-neutral-50 hover:bg-white transition group"
                >
                  <div
                    onClick={() => toggleMonthGoal(goal.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                  >
                    <div className="text-neutral-900 transition transform group-hover:scale-110">
                      {goal.completed ? (
                        <CheckCircle2 className="w-4 h-4 fill-black text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500" />
                      )}
                    </div>
                    <span
                      className={`text-xs leading-snug transition ${
                        goal.completed
                          ? 'line-through text-neutral-400'
                          : 'text-neutral-800 font-semibold'
                      }`}
                    >
                      {goal.text}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteMonthGoal(goal.id)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Eliminar meta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Formulario para agregar nueva meta */}
            <form onSubmit={handleAddGoal} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Escribe un nuevo objetivo para este mes..."
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </form>
          </div>

          {/* SECCIÓN 2: BLOC DE APUNTES LIBRES */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-neutral-900" />
                Bloc de Apuntes & Notas de la Agencia
              </label>
              <span className="text-[10px] text-neutral-400 font-mono">
                Autoguardado en navegador
              </span>
            </div>

            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              rows={6}
              placeholder="Escribe aquí ideas, presupuestos rápidos, notas de clientes, requerimientos o recordatorios..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all font-sans leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-neutral-400">
            {localNotes.length} caracteres escritos
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-black hover:bg-neutral-800 shadow-md transition active:scale-95 flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Apuntes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
