import React, { useState } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { Plus, Briefcase, Calendar, Sliders, Trash2, Code, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatGTQ, formatDate } from '../utils/formatters';

export const ProjectsView = ({ onOpenNewProject, onOpenEditProgress }) => {
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
        return 'bg-neutral-900 text-white border-neutral-700';
      case 'En revisión':
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      default:
        return 'bg-black text-white border-neutral-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header de la sección (Estilo Black & White Limpio) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display flex items-center gap-2.5">
            Gestión de Proyectos
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              {projects.length} totales
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Monitoreo en tiempo real del progreso de entregables y presupuestos de Lemus Studio
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filtro de estado en blanco y negro */}
          <div className="bg-neutral-100 p-1 rounded-2xl border border-neutral-200 flex items-center text-xs">
            {['Todos', 'En progreso', 'En revisión', 'Finalizado'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Botón Nuevo Proyecto: Ahora en Negro y Blanco */}
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Grid de Proyectos */}
      {filteredProjects.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200/80 rounded-[28px] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 mb-3 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">No hay proyectos en esta lista</h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Puedes crear un nuevo proyecto o asignar entregables a tus clientes en cualquier momento.
          </p>
          <button
            onClick={onOpenNewProject}
            className="mt-4 px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-semibold shadow-sm transition"
          >
            + Crear Primer Proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-[28px] p-6 border border-neutral-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-neutral-900 font-display truncate">
                      {proj.nombre}
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="truncate font-medium">{getClientName(proj.id_cliente)}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold border shrink-0 ${getStatusBadge(proj.estado)}`}>
                    {proj.estado}
                  </span>
                </div>

                {/* Stack tecnológico */}
                {proj.tecnologia && (
                  <p className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5 mt-2">
                    <Code className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">{proj.tecnologia}</span>
                  </p>
                )}
              </div>

              {/* Barra de Progreso Visual (Negro & Blanco) */}
              <div className="space-y-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Progreso Real:</span>
                  <span className="font-numeric text-neutral-900 font-bold">{proj.progreso}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progreso}%` }}
                  />
                </div>
              </div>

              {/* Footer de la tarjeta con presupuesto y fecha */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium">Presupuesto</span>
                  <span className="font-numeric font-bold text-neutral-900">
                    {formatGTQ(proj.presupuesto)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-medium">Entrega</span>
                  <span className="font-mono text-neutral-600 text-[11px] flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    {formatDate(proj.fecha_entrega)}
                  </span>
                </div>
              </div>

              {/* Acciones de la tarjeta: Editar progreso y Eliminar */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => onOpenEditProgress(proj)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition active:scale-95 shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Editar progreso</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${proj.nombre}"?`)) {
                      deleteProject(proj.id);
                    }
                  }}
                  title="Eliminar proyecto"
                  className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
