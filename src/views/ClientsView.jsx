import React, { useState, useMemo } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { Plus, Users, Building2, Mail, Briefcase, Trash2, ArrowUpRight, CheckCircle2, Clock, MessageSquare, ChevronDown } from 'lucide-react';
import { formatGTQ } from '../utils/formatters';
import { ModalConfirmDelete } from '../components/ModalConfirmDelete';

export const ClientsView = ({ onOpenNewClient }) => {
  const clients = useFinancialStore((state) => state.clients);
  const projects = useFinancialStore((state) => state.projects);
  const transactions = useFinancialStore((state) => state.transactions);
  const deleteClient = useFinancialStore((state) => state.deleteClient);
  const updateClientStatus = useFinancialStore((state) => state.updateClientStatus);

  const [activeTabStatus, setActiveTabStatus] = useState('Todos');

  // Estado para confirmación y animación de eliminación
  const [deletingId, setDeletingId] = useState(null);
  const [animatingDeleteId, setAnimatingDeleteId] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

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

  const requestDelete = (client) => {
    setClientToDelete(client);
    setDeletingId(client.id);
  };

  const confirmDelete = () => {
    if (!clientToDelete) return;
    const id = clientToDelete.id;
    setAnimatingDeleteId(id);
    setTimeout(() => {
      deleteClient(id);
      setAnimatingDeleteId(null);
      setDeletingId(null);
      setClientToDelete(null);
    }, 320);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Modal de confirmación para eliminar cliente */}
      <ModalConfirmDelete
        isOpen={Boolean(deletingId)}
        onClose={() => { setDeletingId(null); setClientToDelete(null); }}
        onConfirm={confirmDelete}
        title={`¿Eliminar a "${clientToDelete?.empresa || clientToDelete?.nombre}"?`}
        message="¿Estás seguro de que deseas eliminar este cliente del CRM? Se borrarán sus datos y el seguimiento comercial."
      />

      {/* Cuadrito 1: Header de Clientes CRM */}
      <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display">
              Pipeline & Directorio de Clientes
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
              {clients.length} totales
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Gestión comercial y seguimiento de clientes potenciales de Lemus Studio
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Cliente / Lead</span>
        </button>
      </div>

      {/* Cuadrito 2: Tabs de Filtro de Pipeline en su propio cuadrito */}
      <div className="bg-white rounded-[24px] p-4 border border-neutral-200/80 shadow-sm flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'Todos', label: 'Todos los clientes', count: counts.all },
          { id: 'Contactado', label: 'Contactado', count: counts.contactado },
          { id: 'En proceso', label: 'En proceso', count: counts.enProceso },
          { id: 'Cerrado', label: 'Trato Cerrado', count: counts.cerrado },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabStatus(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap text-xs ${
              activeTabStatus === tab.id
                ? 'bg-black text-white border-black font-semibold shadow-sm'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              activeTabStatus === tab.id ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cuadrito 3: Grid de Clientes */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-neutral-200/80 p-12 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 mb-3 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">No hay clientes en estado "{activeTabStatus}"</h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Puedes cambiar el estado de tus prospectos existentes o registrar un nuevo cliente.
          </p>
          <button
            onClick={onOpenNewClient}
            className="mt-4 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-sm transition"
          >
            + Registrar Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const isDeleting = animatingDeleteId === client.id;
            return (
              <div
                key={client.id}
                className={`bg-white rounded-[28px] p-6 border border-neutral-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                  isDeleting ? 'item-deleting' : ''
                }`}
              >
                <div>
                  {/* Cabecera del cliente y selector de estado */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm font-display shrink-0 shadow-sm">
                        {(client.empresa || client.nombre || 'CL').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-neutral-900 font-display truncate">
                          {client.empresa}
                        </h3>
                        <p className="text-xs text-neutral-500 truncate">{client.nombre}</p>
                      </div>
                    </div>

                    <select
                      value={client.estado}
                      onChange={(e) => updateClientStatus(client.id, e.target.value)}
                      className="text-[11px] font-bold py-1.5 px-3 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Contactado">Contactado</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Cerrado">Trato Cerrado</option>
                    </select>
                  </div>

                  {/* Datos de contacto y proyectos */}
                  <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{client.contacto || 'Sin contacto directo'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-200/60">
                      <span className="text-neutral-500 font-medium">Proyectos Activos:</span>
                      <span className="font-bold text-neutral-900 px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-none">
                        {client.projectCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Métricas y acciones */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Facturado Total</span>
                    <span className="text-sm font-bold font-numeric text-neutral-900">
                      {formatGTQ(client.totalBilled)}
                    </span>
                  </div>

                  <button
                    onClick={() => requestDelete(client)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Eliminar cliente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
