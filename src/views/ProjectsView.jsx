import React, { useState } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { Plus, Briefcase, Calendar, Sliders, Trash2, Code, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatGTQ, formatDate } from '../utils/formatters';

export const ProjectsView = ({ onOpenNewProject, onEditProgress }) => {
  const projects = useFinancialStore((state) => state.projects);
  const clients = useFinancialStore((state) => state.clients);
  const deleteProject = useFinancialStore((state) => state.deleteProject);

  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'Todos') return true;
    return p.estado === filterStatus;
  });

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? (client.empresa || client.nombre) : 'Cliente General';
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Finalizado':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
      case 'En revisión':
        return 'bg-amber-950/60 text-amber-400 border-amber-800/60';
      default:
        return 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#CCD0CF] font-display flex items-center gap-2">
            Gestión de Proyectos
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#11212D] text-[#9BA8AB] border border-[#253745]">
              {projects.length} totales
            </span>
          </h2>
          <p className="text-xs text-[#9BA8AB] mt-0.5">
            Monitoreo en tiempo real del progreso de entregables y presupuestos de Lemus Studio
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filtro de estado */}
          <div className="bg-[#11212D] p-1 rounded-xl border border-[#253745] flex items-center text-xs">
            {['Todos', 'En progreso', 'En revisión', 'Finalizado'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterStatus === st
                    ? 'bg-[#253745] text-white font-semibold'
                    : 'text-[#9BA8AB] hover:text-[#CCD0CF]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00E5FF] text-[#06141B] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-glow-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Grid de Proyectos */}
      {filteredProjects.length === 0 ? (
        <div className="dashboard-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#06141B] border border-[#253745] flex items-center justify-center text-[#9BA8AB] mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#CCD0CF]">No hay proyectos en esta lista</h3>
          <p className="text-xs text-[#9BA8AB] max-w-sm mt-1">
            Puedes crear un nuevo proyecto o asignar entregables a tus clientes en cualquier momento.
          </p>
          <button
            onClick={onOpenNewProject}
            className="mt-4 px-4 py-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 text-xs font-semibold"
          >
            + Crear Primer Proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="dashboard-card p-5 flex flex-col justify-between space-y-4 group">
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#CCD0CF] font-display truncate group-hover:text-white transition-colors">
                      {proj.nombre}
                    </h3>
                    <p className="text-xs text-[#9BA8AB] flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span className="truncate">{getClientName(proj.id_cliente)}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border shrink-0 ${getStatusBadge(proj.estado)}`}>
                    {proj.estado}
                  </span>
                </div>

                {/* Stack tecnológico si existe */}
                {proj.tecnologia && (
                  <p className="text-[11px] font-mono text-[#9BA8AB]/70 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-[#9BA8AB]" />
                    <span className="truncate">{proj.tecnologia}</span>
                  </p>
                )}
              </div>

              {/* Barra de Progreso Visual */}
              <div className="space-y-1.5 bg-[#06141B] p-3 rounded-xl border border-[#253745]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9BA8AB]">Progreso Real:</span>
                  <span className="font-mono text-white font-bold">{proj.progreso}%</span>
                </div>
                <div className="w-full bg-[#11212D] h-2 rounded-full overflow-hidden border border-[#253745]">
                  <div
                    className="bg-gradient-to-r from-[#00E5FF] to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progreso}%` }}
                  />
                </div>
              </div>

              {/* Footer de la tarjeta con presupuesto y fecha */}
              <div className="pt-3 border-t border-[#253745] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#9BA8AB] block">Presupuesto</span>
                  <span className="font-numeric font-bold text-white">
                    {formatGTQ(proj.presupuesto)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#9BA8AB] block">Entrega</span>
                  <span className="font-mono text-[#CCD0CF] text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#9BA8AB]" />
                    {formatDate(proj.fecha_entrega)}
                  </span>
                </div>
              </div>

              {/* Acciones de la tarjeta: Editar progreso y Eliminar */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#253745]/40">
                <button
                  onClick={() => onEditProgress(proj)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#253745]/60 hover:bg-[#253745] text-[#CCD0CF] hover:text-white text-xs font-medium border border-[#253745] transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Editar progreso</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${proj.nombre}"?`)) {
                      deleteProject(proj.id);
                    }
                  }}
                  title="Eliminar proyecto"
                  className="p-1.5 rounded-lg text-[#9BA8AB] hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-colors flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
