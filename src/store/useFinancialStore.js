import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFinancialStore = create(
  persist(
    (set, get) => ({
      // --- ENTIDADES PRINCIPALES (Base de Datos Local) ---
      // 100% Desde Cero: 0 movimientos iniciales
      transactions: [],

      // Clientes con el nuevo pipeline CRM: 'Contactado', 'En proceso', 'Cerrado'
      clients: [
        {
          id: 'cli-1',
          nombre: 'Lic. Fernando Santander',
          empresa: 'Inmobiliaria Santander',
          contacto: 'fsantander@santander.gt',
          estado: 'Cerrado', // Trato cerrado
        },
        {
          id: 'cli-2',
          nombre: 'Ana Lucía Morales',
          empresa: 'Café Despierto Guatemala',
          contacto: '+502 5543-9821',
          estado: 'En proceso', // En negociación
        },
        {
          id: 'cli-3',
          nombre: 'Dr. Alejandro Méndez',
          empresa: 'Hospital Los Arcos',
          contacto: 'amendez@losarcos.gt',
          estado: 'Contactado', // Primer contacto
        }
      ],

      // Proyectos iniciales (100% borrables y editables)
      projects: [],

      // Saldo base de la tarjeta BAC Credomatic (Inicia estrictamente en 0.00)
      baseBacBalance: 0.00,

      // --- SISTEMA DE TOASTS ---
      toasts: [],
      addToast: (message, type = 'success') => {
        const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }]
        }));

        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
          }));
        }, 3500);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      },

      // --- ACCIONES DE TRANSACCIONES ---
      addTransaction: (data) => {
        const id = 'tx-' + Date.now();
        const newTx = {
          id,
          tipo: data.tipo, // 'ingreso' | 'gasto'
          monto: parseFloat(data.monto) || 0,
          motivo: data.motivo.trim(),
          categoria: data.categoria || (data.tipo === 'ingreso' ? 'Webs completas' : 'Servidores'),
          fecha: data.fecha || new Date().toISOString().split('T')[0],
          id_cliente_o_proveedor: data.id_cliente_o_proveedor || '',
        };

        set((state) => ({
          transactions: [newTx, ...state.transactions]
        }));

        const symbol = newTx.tipo === 'ingreso' ? '+' : '-';
        get().addToast(
          `✅ ${newTx.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} de ${symbol}Q ${newTx.monto.toLocaleString('es-GT', { minimumFractionDigits: 2 })} registrado.`,
          newTx.tipo === 'ingreso' ? 'success' : 'info'
        );

        return newTx;
      },

      deleteTransaction: (id) => {
        const tx = get().transactions.find((t) => t.id === id);
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }));
        if (tx) {
          get().addToast(`🗑️ Movimiento de Q ${tx.monto.toLocaleString('es-GT', { minimumFractionDigits: 2 })} eliminado.`, 'info');
        }
      },

      // --- ACCIONES DE PROYECTOS ---
      addProject: (data) => {
        const id = 'proj-' + Date.now();
        const newProj = {
          id,
          nombre: data.nombre.trim(),
          id_cliente: data.id_cliente,
          estado: data.estado || 'En progreso', // 'En progreso' | 'En revisión' | 'Finalizado'
          progreso: parseInt(data.progreso, 10) || 0,
          fecha_entrega: data.fecha_entrega || '',
          presupuesto: parseFloat(data.presupuesto) || 0,
          tecnologia: data.tecnologia || 'React, Tailwind CSS'
        };

        set((state) => ({
          projects: [newProj, ...state.projects]
        }));

        get().addToast(`🚀 Proyecto "${newProj.nombre}" creado exitosamente.`, 'success');
        return newProj;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }));
        get().addToast(`✨ Progreso del proyecto actualizado.`, 'success');
      },

      deleteProject: (id) => {
        const proj = get().projects.find((p) => p.id === id);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id)
        }));
        if (proj) {
          get().addToast(`🗑️ Proyecto "${proj.nombre}" eliminado exitosamente.`, 'warning');
        }
      },

      // --- ACCIONES DE CLIENTES ---
      addClient: (data) => {
        const id = 'cli-' + Date.now();
        const newClient = {
          id,
          nombre: data.nombre.trim(),
          empresa: data.empresa.trim(),
          contacto: data.contacto.trim(),
          estado: data.estado || 'Contactado', // 'Contactado' | 'En proceso' | 'Cerrado' | 'Inactivo'
        };

        set((state) => ({
          clients: [newClient, ...state.clients]
        }));

        get().addToast(`👤 Cliente "${newClient.empresa || newClient.nombre}" registrado como [${newClient.estado}].`, 'success');
        return newClient;
      },

      updateClientStatus: (id, newStatus) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, estado: newStatus } : c))
        }));
        get().addToast(`🔄 Estado de cliente actualizado a "${newStatus}".`, 'info');
      },

      deleteClient: (id) => {
        const client = get().clients.find((c) => c.id === id);
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id)
        }));
        if (client) {
          get().addToast(`🗑️ Cliente eliminado.`, 'info');
        }
      },

      // --- REINICIAR TODO A CERO ---
      resetToZero: () => {
        set({
          transactions: [],
          projects: [],
          clients: [],
          baseBacBalance: 0.00
        });
        get().addToast(`♻️ Todo reiniciado a cero: Tarjeta Q 0.00, sin proyectos ni gastos.`, 'warning');
      },

      // --- CARGAR DATOS DE EJEMPLO ---
      seedDemoData: () => {
        set({
          baseBacBalance: 0.00,
          clients: [
            { id: 'cli-1', nombre: 'Lic. Fernando Santander', empresa: 'Inmobiliaria Santander', contacto: 'fsantander@santander.gt', estado: 'Cerrado' },
            { id: 'cli-2', nombre: 'Ana Lucía Morales', empresa: 'Café Despierto Guatemala', contacto: '+502 5543-9821', estado: 'En proceso' },
            { id: 'cli-3', nombre: 'Dr. Alejandro Méndez', empresa: 'Hospital Los Arcos', contacto: 'amendez@losarcos.gt', estado: 'Contactado' }
          ],
          projects: [
            {
              id: 'proj-seed-1',
              nombre: 'Portal Inmobiliario & CRM',
              id_cliente: 'cli-1',
              estado: 'En progreso',
              progreso: 65,
              fecha_entrega: '2026-11-20',
              presupuesto: 9800.00,
              tecnologia: 'Next.js, Tailwind, Supabase'
            }
          ],
          transactions: [
            {
              id: 'tx-seed-1',
              tipo: 'ingreso',
              monto: 4900.00,
              motivo: 'Inmobiliaria Santander - Anticipo 50% Plataforma Web',
              categoria: 'Webs completas',
              fecha: '2026-10-27',
              id_cliente_o_proveedor: 'cli-1'
            }
          ]
        });
        get().addToast(`📦 Datos de prueba de Lemus Studio cargados.`, 'success');
      }
    }),
    {
      name: 'lemus_studio_finance_v3', // Versión 3 para asegurar que el saldo de la tarjeta inicie en 0
      version: 3,
      migrate: (persistedState, version) => {
        if (version < 3) {
          return {
            ...persistedState,
            baseBacBalance: 0.00, // Fuerza que el saldo inicial sea Q 0.00
          };
        }
        return persistedState;
      }
    }
  )
);
