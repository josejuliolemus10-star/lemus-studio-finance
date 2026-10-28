import React, { useState, useMemo } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { Plus, Users, Building2, Mail, Briefcase, Trash2, ArrowUpRight, CheckCircle2, Clock, MessageSquare, ChevronDown } from 'lucide-react';
import { formatGTQ } from '../utils/formatters';

export const ClientsView = ({ onOpenNewClient }) => {
  const clients = useFinancialStore((state) => state.clients);
  const projects = useFinancialStore((state) => state.projects);
  const transactions = useFinancialStore((state) => state.transactions);
  const deleteClient = useFinancialStore((state) => state.deleteClient);
  const updateClientStatus = useFinancialStore((state) => state.updateClientStatus);

  const [activeTabStatus, setActiveTabStatus] = useState('Todos');

  // Mapear cada cliente con sus proyectos y total facturado
  const clientsWithMetrics = useMemo(() => {
    return clients.map((client) => {
      const clientProjects = projects.filter((p) => p.id_cliente === client.id);

      const clientIncome = transactions
        .filter(
          (t) =>
            t.tipo === 'ingreso' &&
            (t.id_cliente_o_proveedor === client.id ||
              t.id_cliente_o_proveedor === client.empresa ||
              t.id_cliente_o_proveedor === client.nombre)
        )
        .reduce((sum, t) => sum + t.monto, 0);

      return {
        ...client,
        projectCount: clientProjects.length,
        totalBilled: clientIncome,
      };
    });
  }, [clients, projects, transactions]);

  // Filtrar según pestaña de estado comercial
  const filteredClients = useMemo(() => {
    if (activeTabStatus === 'Todos') return clientsWithMetrics;
    return clientsWithMetrics.filter((c) => c.estado === activeTabStatus);
  }, [clientsWithMetrics, activeTabStatus]);

  // Contadores para pipeline comercial
  const counts = useMemo(() => {
    return {
      all: clients.length,
      contactado: clients.filter((c) => c.estado === 'Contactado').length,
      enProceso: clients.filter((c) => c.estado === 'En proceso').length,
      cerrado: clients.filter((c) => c.estado === 'Cerrado').length,
    };
  }, [clients]);

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Cerrado':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
      case 'En proceso':
        return 'bg-amber-950/60 text-amber-400 border-amber-800/60';
      case 'Contactado':
        return 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30';
      default:
        return 'bg-[#253745]/60 text-[#9BA8AB] border-[#253745]';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#CCD0CF] font-display flex items-center gap-2">
            Pipeline & Directorio de Clientes
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#11212D] text-[#9BA8AB] border border-[#253745]">
              {clients.length} totales
            </span>
          </h2>
          <p className="text-xs text-[#9BA8AB] mt-0.5">
            Gestiona prospectos y acuerdos comerciales de Lemus Studio
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00E5FF] text-[#06141B] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente / Lead</span>
        </button>
      </div>

      {/* Tabs de Filtro de Pipeline */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'Todos', label: 'Todos los clientes', count: counts.all },
          { id: 'Contactado', label: 'Contactado', count: counts.contactado, color: 'text-[#00E5FF]' },
          { id: 'En proceso', label: 'En proceso', count: counts.enProceso, color: 'text-amber-400' },
          { id: 'Cerrado', label: 'Trato Cerrado', count: counts.cerrado, color: 'text-emerald-400' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabStatus(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeTabStatus === tab.id
                ? 'bg-[#11212D] text-white border-[#00E5FF]/50 font-semibold shadow-sm'
                : 'bg-[#06141B] text-[#9BA8AB] border-[#253745] hover:text-[#CCD0CF]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#253745]/70 ${tab.color || 'text-[#9BA8AB]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid de Clientes */}
      {filteredClients.length === 0 ? (
        <div className="dashboard-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#06141B] border border-[#253745] flex items-center justify-center text-[#9BA8AB] mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#CCD0CF]">No hay clientes en estado "{activeTabStatus}"</h3>
          <p className="text-xs text-[#9BA8AB] max-w-sm mt-1">
            Puedes cambiar el estado de tus prospectos existentes o registrar un nuevo cliente.
          </p>
          <button
            onClick={onOpenNewClient}
            className="mt-4 px-4 py-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 text-xs font-semibold"
          >
            + Registrar Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div key={client.id} className="dashboard-card p-5 flex flex-col justify-between space-y-4 group">
              <div>
                {/* Cabecera del cliente y selector rápido de estado */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#06141B] border border-[#253745] flex items-center justify-center font-bold text-sm text-[#00E5FF] font-display shrink-0">
                      {(client.empresa || client.nombre || 'CL').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#CCD0CF] font-display truncate group-hover:text-white transition-colors">
                        {client.empresa}
                      </h3>
                      <p className="text-xs text-[#9BA8AB] truncate">{client.nombre}</p>
                    </div>
                  </div>

                  {/* Selector interactivo de estado rápido */}
                  <div className="relative">
                    <select
                      value={client.estado}
                      onChange={(e) => updateClientStatus(client.id, e.target.value)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none appearance-none pr-6 ${getStatusBadge(client.estado)}`}
                    >
                      <option value="Contactado" className="bg-[#11212D] text-[#00E5FF]">Contactado</option>
                      <option value="En proceso" className="bg-[#11212D] text-amber-400">En proceso</option>
                      <option value="Cerrado" className="bg-[#11212D] text-emerald-400">Trato Cerrado</option>
                      <option value="Inactivo" className="bg-[#11212D] text-[#9BA8AB]">Inactivo</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>
                </div>

                {/* Contacto */}
                <div className="bg-[#06141B] p-2.5 rounded-xl border border-[#253745] space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-[#9BA8AB]">
                    <Mail className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                    <span className="truncate font-mono text-[11px] text-[#CCD0CF]">
                      {client.contacto || 'Sin contacto directo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Métricas: Proyectos asociados & Total Facturado */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#253745] text-xs">
                <div className="bg-[#06141B]/70 p-2 rounded-lg border border-[#253745]/60">
                  <span className="text-[10px] text-[#9BA8AB] flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#9BA8AB]" /> Proyectos
                  </span>
                  <span className="text-sm font-bold font-numeric text-white block mt-0.5">
                    {client.projectCount} {client.projectCount === 1 ? 'proyecto' : 'proyectos'}
                  </span>
                </div>

                <div className="bg-[#06141B]/70 p-2 rounded-lg border border-[#253745]/60">
                  <span className="text-[10px] text-[#9BA8AB] flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" /> Facturado
                  </span>
                  <span className="text-sm font-bold font-numeric text-emerald-400 block mt-0.5 truncate">
                    {formatGTQ(client.totalBilled)}
                  </span>
                </div>
              </div>

              {/* Botón eliminar cliente */}
              <div className="flex justify-between items-center pt-1 border-t border-[#253745]/40 text-xs">
                <span className="text-[10px] text-[#9BA8AB]/70">
                  Estado: <strong className="text-white">{client.estado}</strong>
                </span>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar al cliente "${client.empresa}"?`)) {
                      deleteClient(client.id);
                    }
                  }}
                  title="Eliminar cliente"
                  className="flex items-center gap-1.5 text-[11px] text-[#9BA8AB] hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
