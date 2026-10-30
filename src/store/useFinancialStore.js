import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFinancialStore = create(
  persist(
    (set, get) => ({
      // --- ENTIDADES PRINCIPALES (Base de Datos Local) ---
      // Movimientos de flujo de caja (Inicia en 0)
      transactions: [],

      // Clientes con Pipeline CRM: 'Contactado', 'En proceso', 'Cerrado'
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

      // Proyectos de la agencia
      projects: [],

      // Saldo base de la tarjeta BAC Credomatic (Inicia estrictamente en 0.00)
      baseBacBalance: 0.00,

      // --- CATÁLOGO DE PÁGINAS WEB CREADAS (Para reciclaje de código y componentes) ---
      websites: [
        {
          id: 'web-1',
          titulo: 'Portal Inmobiliario Santander',
          cliente: 'Inmobiliaria Santander',
          url: 'https://santander-inmuebles.gt',
          categoria: 'Inmobiliaria',
          descripcion: 'Buscador de propiedades con filtros, cotizador de hipotecas y mapa interactivo.',
          fecha: '2026-10-15',
        },
        {
          id: 'web-2',
          titulo: 'Tienda Online Café Despierto',
          cliente: 'Café Despierto Guatemala',
          url: 'https://cafedespierto.gt',
          categoria: 'E-Commerce',
          descripcion: 'Carrito lateral deslizante, pasarela de pago Q/USD y selector de grano/tueste.',
          fecha: '2026-10-20',
        },
        {
          id: 'web-3',
          titulo: 'Landing Page Corporativa Díaz',
          cliente: 'Buffet Legal Díaz & Asoc.',
          url: 'https://diazlegal.gt',
          categoria: 'Corporativa',
          descripcion: 'Diseño ultra tipográfico minimalista, calculadora de honorarios y agendador.',
          fecha: '2026-09-28',
        }
      ],

      // --- SISTEMA DE CALENDARIO / CITAS & RECORDATORIOS ---
      calendarEvents: [
        {
          id: 'cal-1',
          titulo: 'Reunión de Avance & Demo Fase 1',
          fecha: '2026-10-30',
          hora_inicio: '10:00',
          hora_fin: '11:30',
          tipo: 'Reunión Virtual',
          cliente: 'Inmobiliaria Santander',
          enlace: 'https://meet.google.com/abc-def-ghi',
          notas: 'Presentar avance del mapa interactivo y listado de propiedades',
          completado: false,
        },
        {
          id: 'cal-2',
          titulo: 'Llamada de Requerimientos E-commerce',
          fecha: '2026-10-31',
          hora_inicio: '15:00',
          hora_fin: '16:00',
          tipo: 'Cita con Cliente',
          cliente: 'Hospital Los Arcos',
          enlace: '',
          notas: 'Definir pasarela de pago y catálogo de servicios médicos',
          completado: false,
        },
        {
          id: 'cal-3',
          titulo: 'Renovación de Servidor AWS Lemus Studio',
          fecha: '2026-11-05',
          hora_inicio: '09:00',
          hora_fin: '09:30',
          tipo: 'Recordatorio',
          cliente: 'Interno',
          enlace: '',
          notas: 'Verificar cobro automático de la tarjeta BAC Credomatic',
          completado: false,
        }
      ],

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
          estado: data.estado || 'En progreso',
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

      // --- ACCIONES DE PÁGINAS WEB (CATÁLOGO & RECICLAJE) ---
      addWebsite: (data) => {
        const id = 'web-' + Date.now();
        const newWeb = {
          id,
          titulo: data.titulo.trim(),
          cliente: data.cliente.trim() || 'Proyecto Propio',
          url: data.url.trim(),
          categoria: data.categoria || 'Landing Page',
          descripcion: data.descripcion ? data.descripcion.trim() : '',
          fecha: data.fecha || new Date().toISOString().split('T')[0],
        };

        set((state) => ({
          websites: [newWeb, ...state.websites]
        }));

        get().addToast(`🌐 Sitio web "${newWeb.titulo}" agregado al catálogo.`, 'success');
        return newWeb;
      },

      updateWebsite: (id, updates) => {
        set((state) => ({
          websites: state.websites.map((w) => (w.id === id ? { ...w, ...updates } : w))
        }));
        get().addToast(`✨ Información del sitio web actualizada.`, 'success');
      },

      deleteWebsite: (id) => {
        const web = get().websites.find((w) => w.id === id);
        set((state) => ({
          websites: state.websites.filter((w) => w.id !== id)
        }));
        if (web) {
          get().addToast(`🗑️ Sitio "${web.titulo}" eliminado del catálogo.`, 'info');
        }
      },

      // --- ACCIONES DE CALENDARIO & CITAS ---
      addCalendarEvent: (data) => {
        const id = 'cal-' + Date.now();
        const newEvent = {
          id,
          titulo: data.titulo.trim(),
          fecha: data.fecha || new Date().toISOString().split('T')[0],
          hora_inicio: data.hora_inicio || '10:00',
          hora_fin: data.hora_fin || '11:00',
          tipo: data.tipo || 'Cita con Cliente',
          cliente: data.cliente || '',
          enlace: data.enlace || '',
          notas: data.notas ? data.notas.trim() : '',
          completado: false,
        };

        set((state) => ({
          calendarEvents: [...state.calendarEvents, newEvent]
        }));

        get().addToast(`📅 Cita "${newEvent.titulo}" agendada para el ${newEvent.fecha}.`, 'success');
        return newEvent;
      },

      updateCalendarEvent: (id, updates) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.map((e) => (e.id === id ? { ...e, ...updates } : e))
        }));
        get().addToast(`✨ Cita actualizada.`, 'success');
      },

      deleteCalendarEvent: (id) => {
        const evt = get().calendarEvents.find((e) => e.id === id);
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((e) => e.id !== id)
        }));
        if (evt) {
          get().addToast(`🗑️ Cita "${evt.titulo}" eliminada.`, 'info');
        }
      },

      toggleEventCompleted: (id) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.map((e) =>
            e.id === id ? { ...e, completado: !e.completado } : e
          )
        }));
      },

      // --- ACCIONES DE CLIENTES ---
      addClient: (data) => {
        const id = 'cli-' + Date.now();
        const newClient = {
          id,
          nombre: data.nombre.trim(),
          empresa: data.empresa.trim(),
          contacto: data.contacto.trim(),
          estado: data.estado || 'Contactado',
        };

        set((state) => ({
          clients: [newClient, ...state.clients]
        }));

        get().addToast(`👤 Cliente "${newClient.empresa || newClient.nombre}" registrado.`, 'success');
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
          websites: [],
          calendarEvents: [],
          clients: [],
          baseBacBalance: 0.00
        });
        get().addToast(`♻️ Base de datos reiniciada a cero.`, 'warning');
      },

      // --- CARGAR DATOS DE EJEMPLO DE LEMUS STUDIO ---
      seedDemoData: () => {
        set({
          baseBacBalance: 0.00,
          clients: [
            { id: 'cli-1', nombre: 'Lic. Fernando Santander', empresa: 'Inmobiliaria Santander', contacto: 'fsantander@santander.gt', estado: 'Cerrado' },
            { id: 'cli-2', nombre: 'Ana Lucía Morales', empresa: 'Café Despierto Guatemala', contacto: '+502 5543-9821', estado: 'En proceso' },
            { id: 'cli-3', nombre: 'Dr. Alejandro Méndez', empresa: 'Hospital Los Arcos', contacto: 'amendez@losarcos.gt', estado: 'Contactado' }
          ],
          websites: [
            { id: 'web-1', titulo: 'Portal Inmobiliario Santander', cliente: 'Inmobiliaria Santander', url: 'https://santander-inmuebles.gt', categoria: 'Inmobiliaria', descripcion: 'Buscador de propiedades con filtros, cotizador de hipotecas y mapa interactivo.', fecha: '2026-10-15' },
            { id: 'web-2', titulo: 'Tienda Online Café Despierto', cliente: 'Café Despierto Guatemala', url: 'https://cafedespierto.gt', categoria: 'E-Commerce', descripcion: 'Carrito lateral desplegable, pasarela de pago Q/USD y selector de tueste.', fecha: '2026-10-20' },
            { id: 'web-3', titulo: 'Landing Page Buffet Legal Díaz', cliente: 'Buffet Legal Díaz & Asoc.', url: 'https://diazlegal.gt', categoria: 'Corporativa', descripcion: 'Diseño ultra minimalista, calculadora de honorarios y agendador.', fecha: '2026-09-28' }
          ],
          calendarEvents: [
            { id: 'cal-1', titulo: 'Reunión de Avance & Demo Fase 1', fecha: '2026-10-30', hora_inicio: '10:00', hora_fin: '11:30', tipo: 'Reunión Virtual', cliente: 'Inmobiliaria Santander', enlace: 'https://meet.google.com/abc-def-ghi', notas: 'Presentar avance del mapa interactivo', completado: false },
            { id: 'cal-2', titulo: 'Llamada de Requerimientos E-commerce', fecha: '2026-10-31', hora_inicio: '15:00', hora_fin: '16:00', tipo: 'Cita con Cliente', cliente: 'Hospital Los Arcos', enlace: '', notas: 'Definir pasarela de pago', completado: false }
          ],
          projects: [
            { id: 'proj-seed-1', nombre: 'Portal Inmobiliario & CRM', id_cliente: 'cli-1', estado: 'En progreso', progreso: 65, fecha_entrega: '2026-11-20', presupuesto: 9800.00, tecnologia: 'Next.js, Tailwind, Supabase' }
          ],
          transactions: [
            { id: 'tx-seed-1', tipo: 'ingreso', monto: 4900.00, motivo: 'Inmobiliaria Santander - Anticipo 50% Plataforma Web', categoria: 'Webs completas', fecha: '2026-10-27', id_cliente_o_proveedor: 'cli-1' }
          ]
        });
        get().addToast(`📦 Datos de prueba de Lemus Studio cargados.`, 'success');
      }
    }),
    {
      name: 'lemus_studio_finance_v4', // Versión 4 con Páginas Web y Calendario
      version: 4,
    }
  )
);
