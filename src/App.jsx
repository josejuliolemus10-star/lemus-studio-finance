import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Briefcase,
  Users,
  Globe,
  Settings,
  Search,
  Bell,
  Plus,
  Share2,
  MoreVertical,
  Download,
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  Gift,
  Volume2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  CreditCard,
  SlidersHorizontal,
  Grid,
  List,
  Menu,
  X,
  BookOpen,
  Video,
  ArrowRight
} from 'lucide-react';

import { useFinancialStore } from './store/useFinancialStore';
import { formatGTQ, formatDate, getTodayString } from './utils/formatters';
import { exportToExcel } from './utils/excelExporter';
import { WeeklyCurveProgress, ConcentricMonthProgress } from './components/FinanceCharts';
import { ToastContainer } from './components/ToastContainer';
import { ModalTransaction } from './components/ModalTransaction';
import { ModalProject } from './components/ModalProject';
import { ModalClient } from './components/ModalClient';
import { ModalEditProgress } from './components/ModalEditProgress';
import { ModalWebsite } from './components/ModalWebsite';
import { ModalCalendarEvent } from './components/ModalCalendarEvent';
import { ModalConfirmDelete } from './components/ModalConfirmDelete';
import { ModalMonthNotes } from './components/ModalMonthNotes';
import { FloatingActionButton } from './components/FloatingActionButton';
import { ProjectsView } from './views/ProjectsView';
import { ClientsView } from './views/ClientsView';
import { WebsitesView } from './views/WebsitesView';
import { CalendarView } from './views/CalendarView';
import { SettingsView } from './views/SettingsView';

// --- LOGO VECTORIAL DE LEMUS STUDIO (iDraft Style) ---
export const LemusLogo = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="w-9 h-9 rounded-2xl bg-black flex items-center justify-center p-1.5 shadow-md shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="10">
          <rect x="8" y="8" width="84" height="84" strokeWidth="8" rx="8" />
          <path d="M26 80 L52 20" strokeWidth="8" strokeLinecap="round" />
          <path d="M26 80 L62 58 L80 78" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-[17px] font-extrabold tracking-tight text-neutral-900 leading-tight font-display">
          Lemus<span className="font-light text-neutral-500">Studio</span>
        </span>
        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
          Financial Suite
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [txFilterType, setTxFilterType] = useState('Todos');

  // Modales
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const [modalTxType, setModalTxType] = useState('ingreso');
  const [modalProjOpen, setModalProjOpen] = useState(false);
  const [modalClientOpen, setModalClientOpen] = useState(false);
  const [modalEditProgOpen, setModalEditProgOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [modalWebOpen, setModalWebOpen] = useState(false);
  const [selectedWebsiteToEdit, setSelectedWebsiteToEdit] = useState(null);
  const [modalCalOpen, setModalCalOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);
  const [calendarDefaultDate, setCalendarDefaultDate] = useState(null);

  // Modal para escribir apuntes del mes
  const [modalNotesOpen, setModalNotesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Estado para el panel de recordatorios ("del día que sea")
  const [panelReminderDate, setPanelReminderDate] = useState(getTodayString());
  const [panelReminderMode, setPanelReminderMode] = useState('dia'); // 'dia' | 'proximos'
  const [quickReminderText, setQuickReminderText] = useState('');

  // Estado para eliminar transacciones con confirmación y animación
  const [txToDelete, setTxToDelete] = useState(null);
  const [animatingDeleteTxId, setAnimatingDeleteTxId] = useState(null);

  // Store
  const transactions = useFinancialStore((state) => state.transactions);
  const projects = useFinancialStore((state) => state.projects);
  const clients = useFinancialStore((state) => state.clients);
  const websites = useFinancialStore((state) => state.websites);
  const calendarEvents = useFinancialStore((state) => state.calendarEvents);
  const baseBacBalance = useFinancialStore((state) => state.baseBacBalance);
  const monthNotes = useFinancialStore((state) => state.monthNotes);
  const monthGoals = useFinancialStore((state) => state.monthGoals);
  const toggleMonthGoal = useFinancialStore((state) => state.toggleMonthGoal);
  const toggleEventCompleted = useFinancialStore((state) => state.toggleEventCompleted);
  const addCalendarEvent = useFinancialStore((state) => state.addCalendarEvent);
  const deleteCalendarEvent = useFinancialStore((state) => state.deleteCalendarEvent);
  const deleteTransaction = useFinancialStore((state) => state.deleteTransaction);
  const addToast = useFinancialStore((state) => state.addToast);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const panelDayEvents = useMemo(() => {
    if (panelReminderMode === 'proximos') {
      return [...calendarEvents]
        .filter((e) => !e.completado)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }
    return calendarEvents
      .filter((e) => e.fecha === panelReminderDate)
      .sort((a, b) => (a.hora_inicio || '').localeCompare(b.hora_inicio || ''));
  }, [calendarEvents, panelReminderDate, panelReminderMode]);

  const handleQuickAddReminder = (e) => {
    e.preventDefault();
    if (!quickReminderText.trim()) return;
    addCalendarEvent({
      titulo: quickReminderText.trim(),
      fecha: panelReminderDate,
      hora_inicio: '10:00',
      hora_fin: '11:00',
      tipo: 'Recordatorio',
    });
    setQuickReminderText('');
  };

  // Cálculos financieros
  const totalIncome = useMemo(() => {
    return transactions.filter((t) => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions.filter((t) => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
  }, [transactions]);

  const netProfit = totalIncome - totalExpenses;
  const bacBalance = (baseBacBalance || 0) + netProfit;

  // Transacciones ordenadas
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let list = sortedTransactions;
    if (txFilterType === 'ingreso') list = list.filter((t) => t.tipo === 'ingreso');
    if (txFilterType === 'gasto') list = list.filter((t) => t.tipo === 'gasto');

    if (!searchQuery.trim()) return list;
    return list.filter((t) =>
      t.motivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoria?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subinfo?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedTransactions, txFilterType]);

  // Próximas citas ordenadas
  const upcomingEvents = useMemo(() => {
    return [...calendarEvents]
      .filter((e) => !e.completado)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(0, 3);
  }, [calendarEvents]);

  const handleExportExcel = async () => {
    await exportToExcel({
      transactions,
      websites,
      calendarEvents,
      projects,
      clients
    });
    addToast('📊 Libro de Excel descargado con formato profesional.', 'success');
  };

  const confirmDeleteTransaction = () => {
    if (!txToDelete) return;
    const id = txToDelete.id;
    setAnimatingDeleteTxId(id);
    setTimeout(() => {
      deleteTransaction(id);
      setAnimatingDeleteTxId(null);
      setTxToDelete(null);
    }, 320);
  };

  const handleOpenTransactionWithType = (type) => {
    setModalTxType(type);
    setModalTxOpen(true);
  };

  const pendingCalendarEvents = useMemo(() => {
    return calendarEvents.filter((e) => !e.completado);
  }, [calendarEvents]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendario', label: 'Calendario', icon: CalendarIcon, count: String(pendingCalendarEvents.length) },
    { id: 'proyectos', label: 'Proyectos', icon: Briefcase, count: String(projects.length) },
    { id: 'clientes', label: 'Clientes CRM', icon: Users, count: String(clients.length) },
    { id: 'websites', label: 'Páginas Web', icon: Globe, count: String(websites.length) },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4 lg:px-6 flex items-center justify-center">
      <ToastContainer />

      {/* Modal de confirmación para eliminar movimiento */}
      <ModalConfirmDelete
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={confirmDeleteTransaction}
        title={`¿Eliminar movimiento "${txToDelete?.motivo}"?`}
        message={`¿Estás seguro de que deseas eliminar este movimiento de ${formatGTQ(txToDelete?.monto)}? Esta acción afectará el balance de tu tarjeta BAC.`}
      />

      {/* Modal para escribir apuntes del mes */}
      <ModalMonthNotes
        isOpen={modalNotesOpen}
        onClose={() => setModalNotesOpen(false)}
      />

      <FloatingActionButton
        onOpenTransaction={() => handleOpenTransactionWithType('ingreso')}
        onOpenProject={() => setModalProjOpen(true)}
        onOpenClient={() => setModalClientOpen(true)}
        onOpenWebsite={() => { setSelectedWebsiteToEdit(null); setModalWebOpen(true); }}
        onOpenCalendar={() => { setSelectedEventToEdit(null); setModalCalOpen(true); }}
        onExportExcel={handleExportExcel}
      />

      <ModalTransaction
        isOpen={modalTxOpen}
        onClose={() => setModalTxOpen(false)}
        defaultType={modalTxType}
      />
      <ModalProject isOpen={modalProjOpen} onClose={() => setModalProjOpen(false)} />
      <ModalClient isOpen={modalClientOpen} onClose={() => setModalClientOpen(false)} />
      <ModalEditProgress
        isOpen={modalEditProgOpen}
        onClose={() => setModalEditProgOpen(false)}
        project={selectedProject}
      />
      <ModalWebsite
        isOpen={modalWebOpen}
        onClose={() => setModalWebOpen(false)}
        websiteToEdit={selectedWebsiteToEdit}
      />
      <ModalCalendarEvent
        isOpen={modalCalOpen}
        onClose={() => setModalCalOpen(false)}
        eventToEdit={selectedEventToEdit}
        defaultDate={calendarDefaultDate}
        onEventSaved={(savedEvt) => {
          if (savedEvt?.fecha) {
            setCalendarDefaultDate(savedEvt.fecha);
          }
        }}
      />

      {/* MARCO PRINCIPAL VIDRIO FROSTED (ESTILO iDraft BENTO) */}
      <div className="idraft-glass-frame w-full max-w-[1550px] p-4 sm:p-6 lg:p-7 flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR FLOTANTE */}
        <aside className="w-full lg:w-60 bg-white rounded-[32px] p-6 shadow-sm border border-neutral-200/70 flex flex-col justify-between shrink-0">
          <div className="space-y-7">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <LemusLogo />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Navigation Links */}
            <nav className={`space-y-1.5 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-black text-white shadow-md'
                        : 'text-neutral-500 hover:text-black hover:bg-neutral-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* INTEGRACIONES */}
            <div className="hidden lg:block pt-3 border-t border-neutral-100 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-4">
                Integraciones
              </span>
              <div className="space-y-1 text-xs font-medium text-neutral-600">
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-neutral-100 text-left transition"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Sheets (Excel)</span>
                </button>
                <div className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 text-left">
                  <div className="w-3.5 h-3.5 rounded bg-neutral-300" />
                  <span>Slack Notificaciones</span>
                </div>
              </div>
            </div>

            {/* EQUIPOS */}
            <div className="hidden lg:block pt-2 border-t border-neutral-100 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-4">
                Equipos
              </span>
              <div className="space-y-1.5 text-xs px-4">
                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <span>Desarrollo Web</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span>Diseño UI / UX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Perfil inferior */}
          <div className="hidden lg:flex items-center gap-3 pt-4 border-t border-neutral-100">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              JL
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-900 leading-tight">Julio Lemus</span>
              <span className="text-[10px] text-neutral-400">Director Lemus Studio</span>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 space-y-6 overflow-hidden">
          {/* HEADER 100% EN ESPAÑOL */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-display">
                ¡Hola, Julio! 👋
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Dashboard financiero privado • Lemus Studio
              </p>
            </div>

            {/* Header Botones con Acción Real */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => handleOpenTransactionWithType('ingreso')}
                className="bg-black hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Registrar Movimiento</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="bg-white hover:bg-neutral-50 text-neutral-700 p-2.5 rounded-full border border-neutral-200/80 shadow-sm transition active:scale-95"
                title="Descargar Reporte Excel"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Botón de Campana / Panel de Recordatorios del día que sea */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="bg-white hover:bg-neutral-50 text-neutral-700 p-2.5 rounded-full border border-neutral-200/80 shadow-sm transition relative active:scale-95"
                  title="Panel de Recordatorios"
                >
                  <Bell className="w-4 h-4" />
                  {panelDayEvents.filter((e) => !e.completado).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Popover desplegable: Panel de Recordatorios del día que sea */}
                {notificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setNotificationsOpen(false)} 
                    />
                    <div className="absolute right-0 top-12 z-50 w-84 sm:w-[430px] bg-white/95 backdrop-blur-2xl border border-neutral-200/90 rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] p-5 text-neutral-900 animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* Cabecera */}
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-neutral-900 leading-tight">Panel de Recordatorios</h3>
                            <p className="text-[11px] text-neutral-400">Agenda y notas del día • Lemus Studio</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition"
                          title="Cerrar panel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Selector de fecha: "del día que sea" */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                setPanelReminderDate(getTodayString());
                                setPanelReminderMode('dia');
                              }}
                              className={`px-2.5 py-1 rounded-lg transition ${
                                panelReminderMode === 'dia' && panelReminderDate === getTodayString()
                                  ? 'bg-black text-white shadow-sm'
                                  : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              Hoy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPanelReminderDate(tomorrowStr);
                                setPanelReminderMode('dia');
                              }}
                              className={`px-2.5 py-1 rounded-lg transition ${
                                panelReminderMode === 'dia' && panelReminderDate === tomorrowStr
                                  ? 'bg-black text-white shadow-sm'
                                  : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              Mañana
                            </button>
                            <button
                              type="button"
                              onClick={() => setPanelReminderMode('proximos')}
                              className={`px-2.5 py-1 rounded-lg transition ${
                                panelReminderMode === 'proximos'
                                  ? 'bg-black text-white shadow-sm'
                                  : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              Próximos
                            </button>
                          </div>

                          {/* Selector de fecha personalizado (el día que sea) */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="date"
                              value={panelReminderDate}
                              onChange={(e) => {
                                setPanelReminderDate(e.target.value);
                                setPanelReminderMode('dia');
                              }}
                              className="text-xs bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 font-bold px-2.5 py-1 rounded-xl border border-neutral-200 focus:outline-none cursor-pointer transition font-mono"
                              title="Elige cualquier fecha"
                            />
                          </div>
                        </div>

                        {/* Banner del día seleccionado */}
                        <div className="flex items-center justify-between px-1 py-1">
                          <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-neutral-500" />
                            <span>
                              {panelReminderMode === 'proximos'
                                ? 'Próximos recordatorios activos'
                                : `Recordatorios: ${formatDate(panelReminderDate)}`}
                            </span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                            {panelDayEvents.filter((e) => !e.completado).length} pendientes
                          </span>
                        </div>
                      </div>

                      {/* Formulario rápido para agregar recordatorio para esta fecha */}
                      <form onSubmit={handleQuickAddReminder} className="mt-2 flex items-center gap-2 bg-neutral-50 hover:bg-white border border-neutral-200/80 focus-within:border-black rounded-2xl p-1.5 transition shadow-sm">
                        <input
                          type="text"
                          placeholder={`+ Añadir recordatorio para ${panelReminderMode === 'proximos' ? 'la fecha' : formatDate(panelReminderDate)}...`}
                          value={quickReminderText}
                          onChange={(e) => setQuickReminderText(e.target.value)}
                          className="bg-transparent text-xs text-neutral-900 placeholder-neutral-400 px-2.5 py-1 flex-1 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition active:scale-95 shrink-0 shadow-sm"
                        >
                          + Agregar
                        </button>
                      </form>

                      {/* Lista interactiva de recordatorios con tachado, hora, videollamada y eliminación */}
                      <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {panelDayEvents.length === 0 ? (
                          <div className="py-8 text-center flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/70 rounded-2xl border border-neutral-100 p-4">
                            <Clock className="w-7 h-7 mb-1.5 text-neutral-300" />
                            <p className="text-xs font-bold text-neutral-700">No hay recordatorios para esta fecha</p>
                            <p className="text-[11px] text-neutral-400 mt-0.5">Escribe arriba para guardar una nota o cita rápida.</p>
                          </div>
                        ) : (
                          panelDayEvents.map((evt) => (
                            <div
                              key={evt.id}
                              className="p-3 rounded-2xl bg-neutral-50 hover:bg-white border border-neutral-200/70 hover:shadow-md transition flex items-center justify-between gap-2.5 group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => toggleEventCompleted(evt.id)}
                                  className="text-neutral-900 transition shrink-0"
                                  title="Marcar como completado"
                                >
                                  {evt.completado ? (
                                    <CheckCircle2 className="w-4 h-4 fill-black text-white" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-neutral-300 hover:text-black" />
                                  )}
                                </button>
                                <div className="min-w-0">
                                  <span
                                    className={`text-xs font-bold block truncate ${
                                      evt.completado ? 'line-through text-neutral-400' : 'text-neutral-900'
                                    }`}
                                  >
                                    {evt.titulo}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                                    <span className="font-mono font-semibold text-neutral-600">{evt.hora_inicio || 'Horario'}</span>
                                    <span>•</span>
                                    <span>{evt.tipo || 'Recordatorio'}</span>
                                    {panelReminderMode === 'proximos' && (
                                      <>
                                        <span>•</span>
                                        <span className="font-bold text-neutral-700">{formatDate(evt.fecha)}</span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {evt.enlace && (
                                  <a
                                    href={evt.enlace}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded-lg bg-black text-white hover:bg-neutral-800 transition"
                                    title="Unirse a reunión"
                                  >
                                    <Video className="w-3 h-3" />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => deleteCalendarEvent(evt.id)}
                                  className="p-1 text-neutral-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Eliminar recordatorio"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Pie del panel con acceso al calendario completo */}
                      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[11px] text-neutral-400 font-medium">
                          {calendarEvents.filter((e) => !e.completado).length} pendientes en total
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCalendarDefaultDate(panelReminderDate);
                            setActiveTab('calendario');
                            setNotificationsOpen(false);
                          }}
                          className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
                        >
                          <span>Ver Calendario</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>

              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm border border-neutral-200">
                JL
              </div>
            </div>
          </header>

          {/* VISTAS CONDICIONALES */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* FILA SUPERIOR: 3 TARJETAS BENTO FUNCIONALES */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                
                {/* 1. INFORMACIÓN GENERAL (TARJETA NEGRA 100% INTERACTIVA) */}
                <div className="idraft-card-dark p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs font-semibold text-neutral-300">Información General</span>
                    <div className="flex items-center gap-2">
                      <button onClick={handleExportExcel} className="p-1 hover:text-white transition" title="Descargar Reporte">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleOpenTransactionWithType('ingreso')} className="p-1 hover:text-white transition" title="Añadir">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Saldo BAC Disponible */}
                  <div className="my-5 cursor-pointer" onClick={() => handleOpenTransactionWithType('ingreso')}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-numeric tracking-tight">
                        {formatGTQ(bacBalance)}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Saldo disponible BAC Credomatic (Business)
                    </span>
                  </div>

                  {/* 3 Mini Tarjetas Blancas Internas (Clicables con función real!) */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <button
                      onClick={() => { setTxFilterType('ingreso'); }}
                      className="bg-white rounded-2xl p-3 text-neutral-900 text-center shadow-sm hover:scale-105 active:scale-95 transition-all text-left"
                      title="Filtrar por Ingresos"
                    >
                      <span className="text-xs font-bold font-numeric block">{formatGTQ(totalIncome)}</span>
                      <span className="text-[9px] text-neutral-500 font-medium">Ingresos ({transactions.filter(t => t.tipo === 'ingreso').length})</span>
                    </button>

                    <button
                      onClick={() => { setTxFilterType('gasto'); }}
                      className="bg-white rounded-2xl p-3 text-neutral-900 text-center shadow-sm hover:scale-105 active:scale-95 transition-all text-left"
                      title="Filtrar por Gastos"
                    >
                      <span className="text-xs font-bold font-numeric block">{formatGTQ(totalExpenses)}</span>
                      <span className="text-[9px] text-neutral-500 font-medium">Gastos ({transactions.filter(t => t.tipo === 'gasto').length})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('proyectos')}
                      className="bg-white rounded-2xl p-3 text-neutral-900 text-center shadow-sm hover:scale-105 active:scale-95 transition-all text-left"
                      title="Ir a Proyectos"
                    >
                      <span className="text-sm font-bold font-numeric block">{projects.length}</span>
                      <span className="text-[9px] text-neutral-500 font-medium">Proyectos</span>
                    </button>
                  </div>
                </div>

                {/* 2. PROGRESO SEMANAL */}
                <div className="idraft-card-white p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-display">Progreso Semanal</h3>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-black" />
                          <span>Ingresos</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-neutral-400" />
                          <span>Gastos</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-neutral-100 text-neutral-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="py-1">
                    <WeeklyCurveProgress transactions={transactions} />
                  </div>

                  <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span>L M M J V S D</span>
                    <span className="font-semibold text-neutral-700">+{formatGTQ(netProfit)} Margen Neto</span>
                  </div>
                </div>

                {/* 3. PROGRESO DEL MES & DESCARGA EXCEL */}
                <div className="idraft-card-white p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-display">Progreso del Mes</h3>
                      <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                        +20% comparado con el mes anterior*
                      </span>
                    </div>
                    <div className="p-2 rounded-full bg-neutral-100 text-neutral-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <ConcentricMonthProgress totalIncome={totalIncome} totalExpenses={totalExpenses} />

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleExportExcel}
                      className="p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                      title="Compartir reporte"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleExportExcel}
                      className="flex-1 bg-black hover:bg-neutral-800 text-white rounded-2xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Reporte (Excel)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* FILA MEDIA: METAS & APUNTES + MOVIMIENTOS EN PROCESO + CALENDARIO RECORDATORIOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                
                {/* 1. OBJETIVOS DEL MES & BLOC DE APUNTES (¡LISTA CON SCROLL PARA TACHAR DIRECTO!) */}
                <div className="lg:col-span-4 idraft-card-white p-6 flex flex-col justify-between group hover:border-black/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-900 font-display">Objetivos del Mes:</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                          {monthGoals.filter(g => g.completed).length}/{monthGoals.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setModalNotesOpen(true)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
                        title="Editar lista completa y apuntes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Checklist interactivo con scroll suave para ir bajando si hay muchas tareas */}
                    <div className="max-h-[170px] overflow-y-auto pr-1.5 space-y-2.5">
                      {monthGoals.length === 0 ? (
                        <div className="py-4 text-center text-xs text-neutral-400">
                          No tienes objetivos creados este mes.
                        </div>
                      ) : (
                        monthGoals.map((goal) => (
                          <div
                            key={goal.id}
                            onClick={() => toggleMonthGoal(goal.id)}
                            className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-neutral-50 transition cursor-pointer select-none group/item"
                            title="Haz clic para marcar/desmarcar"
                          >
                            <div className="mt-0.5 text-neutral-900 transition transform group-hover/item:scale-110 shrink-0">
                              {goal.completed ? (
                                <CheckCircle2 className="w-4 h-4 fill-black text-white" />
                              ) : (
                                <Circle className="w-4 h-4 text-neutral-300 group-hover/item:text-neutral-700" />
                              )}
                            </div>
                            <span
                              className={`text-xs leading-snug break-words flex-1 transition-colors ${
                                goal.completed
                                  ? 'line-through text-neutral-400 font-normal'
                                  : 'text-neutral-800 font-medium'
                              }`}
                            >
                              {goal.text}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Vista previa de apuntes (clic para abrir bloc) */}
                    {monthNotes && (
                      <div
                        onClick={() => setModalNotesOpen(true)}
                        className="mt-3.5 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-100 text-[11px] text-neutral-600 line-clamp-2 italic cursor-pointer transition"
                        title="Haz clic para editar apuntes"
                      >
                        📝 "{monthNotes.split('\n')[0]}"
                      </div>
                    )}
                  </div>

                  {/* Botón directo para abrir y escribir */}
                  <div
                    onClick={() => setModalNotesOpen(true)}
                    className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] cursor-pointer group/btn"
                  >
                    <span className="text-neutral-400 font-medium group-hover/btn:text-neutral-700 transition">
                      Click para escribir
                    </span>
                    <span className="font-bold text-neutral-900 flex items-center gap-1 group-hover/btn:underline">
                      <span>Abrir Bloc</span>
                      <Edit3 className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 2. MOVIMIENTOS EN PROCESO */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-neutral-900 font-display">
                      Movimientos en Proceso (2)
                    </h3>
                    <button
                      onClick={() => setActiveTab('proyectos')}
                      className="text-xs font-semibold text-neutral-500 hover:text-black transition"
                    >
                      Ver archivo &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Nota 1: Anticipo Santander */}
                    <div
                      onClick={() => setSearchQuery('Santander')}
                      className="idraft-card-note p-4 flex flex-col justify-between min-h-[145px] cursor-pointer hover:border-black/30 transition"
                      title="Filtrar por Inmobiliaria Santander"
                    >
                      <div className="flex items-center justify-between text-neutral-500">
                        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                          <Gift className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          +Q 900.00
                        </span>
                      </div>
                      <div className="my-2">
                        <span className="text-xs font-bold text-neutral-900 block leading-tight">
                          Anticipo web 50%
                        </span>
                        <span className="text-[10px] text-neutral-400 block mt-0.5 truncate">
                          Inmobiliaria Santander
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>28 Oct 2026</span>
                        <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center shadow-sm">
                          <Bell className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Nota 2: Pago Micrófono */}
                    <div
                      onClick={() => setSearchQuery('microfono')}
                      className="idraft-card-note p-4 flex flex-col justify-between min-h-[145px] cursor-pointer hover:border-black/30 transition"
                      title="Filtrar por micrófono"
                    >
                      <div className="flex items-center justify-between text-neutral-500">
                        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                          -Q 490.00
                        </span>
                      </div>
                      <div className="my-2">
                        <span className="text-xs font-bold text-neutral-900 block leading-tight">
                          Pago micrófono
                        </span>
                        <span className="text-[10px] text-neutral-400 block mt-0.5 truncate">
                          Setup oficina / mi apa
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>01 Nov 2026</span>
                        <div className="w-6 h-6 rounded-lg bg-neutral-200 text-neutral-600 flex items-center justify-center">
                          <Bell className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. CALENDARIO & PRÓXIMAS CITAS DIRECTAMENTE EN EL DASHBOARD (¡NUEVO APARTADO CON PROPÓSITO!) */}
                <div className="lg:col-span-4 idraft-card-white p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-neutral-900" />
                        <h3 className="text-sm font-bold text-neutral-900 font-display">Agenda & Citas</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('calendario')}
                        className="text-xs font-semibold text-neutral-500 hover:text-black transition"
                      >
                        Ver todo &gt;
                      </button>
                    </div>

                    {/* Lista de citas próximas */}
                    {upcomingEvents.length === 0 ? (
                      <div className="py-6 text-center text-neutral-400 text-xs">
                        No hay citas pendientes agendadas.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {upcomingEvents.map((evt) => (
                          <div
                            key={evt.id}
                            onClick={() => {
                              setSelectedEventToEdit(evt);
                              setCalendarDefaultDate(evt.fecha);
                              setModalCalOpen(true);
                            }}
                            className="p-3 rounded-2xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:shadow-sm transition flex items-center justify-between gap-2.5 cursor-pointer group"
                            title="Haz clic para ver o editar cita"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEventCompleted(evt.id);
                                }}
                                className="text-neutral-900 transition shrink-0"
                                title="Marcar como completada"
                              >
                                {evt.completado ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 fill-black text-white" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-neutral-300 hover:text-black" />
                                )}
                              </button>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-neutral-900 block truncate group-hover:text-black">
                                  {evt.titulo}
                                </span>
                                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {evt.hora_inicio || 'Horario'} • {evt.cliente || 'Interno'} • {formatDate(evt.fecha)}
                                </span>
                              </div>
                            </div>

                            {evt.enlace && (
                              <a
                                href={evt.enlace}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition shrink-0"
                                title="Unirse a reunión"
                              >
                                <Video className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">Hoy: {formatDate(new Date().toISOString().split('T')[0])}</span>
                    <button
                      onClick={() => {
                        setSelectedEventToEdit(null);
                        setCalendarDefaultDate(new Date().toISOString().split('T')[0]);
                        setModalCalOpen(true);
                      }}
                      className="text-[11px] font-bold text-neutral-900 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Agendar</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* FILA INFERIOR: ÚLTIMOS PROYECTOS & PORTAFOLIO (100% DINÁMICOS Y REACTIVOS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-neutral-900 font-display">
                    Últimos Proyectos & Portafolio
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('proyectos')}
                      className="text-xs font-semibold text-neutral-500 hover:text-black transition"
                    >
                      Ver todos los proyectos →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Proyecto 1: Proyecto Activo Dinámico (Sin verde feo, reactivo a cambios de progreso en tiempo real) */}
                  {projects.length > 0 ? (
                    <div
                      onClick={() => {
                        setSelectedProject(projects[0]);
                        setModalEditProgOpen(true);
                      }}
                      className="bg-[#141414] text-white p-5 rounded-[24px] flex flex-col justify-between shadow-md hover:shadow-xl transition cursor-pointer group border border-neutral-800/80 hover:border-neutral-600"
                      title="Haz clic para ajustar el progreso y estado"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:underline truncate max-w-[190px]">
                          {projects[0].nombre}
                        </span>
                        <span className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px] font-bold font-numeric border border-neutral-700">
                          {projects[0].progreso}%
                        </span>
                      </div>
                      <div className="my-3">
                        {/* Estado en puro blanco y negro: sin color verde feo */}
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-200 mb-1">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="font-semibold">{projects[0].estado || 'En progreso'}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                          {projects[0].cliente ? `${projects[0].cliente} • ` : ''}
                          {projects[0].presupuesto ? `Presupuesto: ${formatGTQ(projects[0].presupuesto)}` : (projects[0].tecnologia || 'Lemus Studio')}
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-1">
                          <span>Progreso de Entrega</span>
                          <span className="font-mono text-white font-bold">{projects[0].progreso}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(100, Math.max(0, projects[0].progreso || 0))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setModalProjOpen(true)}
                      className="bg-[#141414] text-white p-5 rounded-[24px] flex flex-col items-center justify-center text-center shadow-md border border-neutral-800 cursor-pointer hover:border-neutral-600 transition"
                    >
                      <Plus className="w-6 h-6 text-neutral-400 mb-1" />
                      <span className="text-xs font-bold text-white">+ Nuevo Proyecto</span>
                      <span className="text-[11px] text-neutral-500">Haz clic para crear tu primer proyecto</span>
                    </div>
                  )}

                  {/* Proyecto 2: Último Sitio Web del Catálogo Dinámico */}
                  {websites.length > 0 ? (
                    <div
                      onClick={() => setActiveTab('websites')}
                      className="bg-[#141414] text-white p-5 rounded-[24px] flex flex-col justify-between shadow-md hover:shadow-xl transition cursor-pointer border border-neutral-800/80 hover:border-neutral-600 group"
                      title="Haz clic para ver catálogo de webs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:underline truncate max-w-[190px]">
                          {websites[0].titulo}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono text-[10px] font-bold border border-neutral-700">
                          1/{websites.length}
                        </span>
                      </div>
                      <div className="my-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-200 mb-1">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span className="font-semibold">{websites[0].categoria || 'Web Reciclable'}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                          {websites[0].descripcion || websites[0].cliente || 'Buscador de componentes listo para reutilizar.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-neutral-800">
                        <span className="truncate max-w-[140px]">{websites[0].cliente || 'Lemus Studio'}</span>
                        {websites[0].url ? (
                          <a
                            href={websites[0].url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Visitar</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-neutral-500">Sin URL</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveTab('websites')}
                      className="bg-[#141414] text-white p-5 rounded-[24px] flex flex-col items-center justify-center text-center shadow-md border border-neutral-800 cursor-pointer hover:border-neutral-600 transition"
                    >
                      <Globe className="w-6 h-6 text-neutral-400 mb-1" />
                      <span className="text-xs font-bold text-white">+ Catálogo Web</span>
                      <span className="text-[11px] text-neutral-500">Agrega páginas para reutilizar componentes</span>
                    </div>
                  )}

                  {/* Proyecto 3: Tarjeta BAC Credomatic Card (Clic para registrar movimiento) */}
                  <div
                    onClick={() => handleOpenTransactionWithType('gasto')}
                    className="bg-gradient-to-br from-[#1C1C1E] to-[#0A0A0A] text-white p-5 rounded-[24px] flex flex-col justify-between shadow-md border border-neutral-800 hover:border-neutral-600 transition cursor-pointer"
                    title="Haz clic para registrar un movimiento con tarjeta"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        BAC Credomatic
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                        Business
                      </span>
                    </div>
                    <div className="my-2">
                      <span className="text-[10px] text-neutral-400 block">Saldo Disponible</span>
                      <span className="text-2xl font-extrabold text-white font-numeric tracking-tight">
                        {formatGTQ(bacBalance)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                      <span>•••• •••• •••• 4519</span>
                      <span className="font-bold text-white">JULIO LEMUS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FILA 4: LISTA COMPLETA DE TRANSACCIONES REALES */}
              <div className="idraft-card-white p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">
                      Transacciones Recientes
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Mostrando movimientos reales registrados en tu libro
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-neutral-100 rounded-full p-1 text-xs">
                      {['Todos', 'ingreso', 'gasto'].map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => setTxFilterType(tipo)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
                            txFilterType === tipo
                              ? 'bg-black text-white shadow-sm'
                              : 'text-neutral-500 hover:text-black'
                          }`}
                        >
                          {tipo === 'ingreso' ? 'Ingresos' : tipo === 'gasto' ? 'Gastos' : 'Todos'}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleOpenTransactionWithType('ingreso')}
                      className="bg-black hover:bg-neutral-800 text-white rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Movimiento</span>
                    </button>
                  </div>
                </div>

                {/* Lista de transacciones exactas con animación de eliminación */}
                <div className="divide-y divide-neutral-100">
                  {filteredTransactions.map((tx) => {
                    const isIncome = tx.tipo === 'ingreso';
                    const isDeleting = animatingDeleteTxId === tx.id;
                    return (
                      <div
                        key={tx.id}
                        className={`py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50/80 px-2 rounded-2xl transition group ${
                          isDeleting ? 'item-deleting' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isIncome
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-neutral-900 capitalize">
                                {tx.motivo}
                              </span>
                              {tx.categoria && (
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    tx.categoria === 'Webs completas'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-neutral-200 text-neutral-700'
                                  }`}
                                >
                                  {tx.categoria}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-400 block mt-0.5">
                              {tx.subinfo ? `${tx.subinfo} • ` : ''}
                              {formatDate(tx.fecha)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs sm:text-sm font-bold font-numeric ${
                              isIncome ? 'text-emerald-700' : 'text-neutral-900'
                            }`}
                          >
                            {isIncome ? `+ ${formatGTQ(tx.monto)}` : `- ${formatGTQ(tx.monto)}`}
                          </span>

                          <button
                            onClick={() => setTxToDelete(tx)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Eliminar movimiento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* OTRAS PESTAÑAS (Calendario, Proyectos, Clientes, Websites, Settings) */}
          {activeTab === 'calendario' && (
            <div className="animate-fadeIn">
              <CalendarView
                activeDate={calendarDefaultDate}
                onDateChange={(d) => setCalendarDefaultDate(d)}
                onOpenAddModal={(date) => {
                  setCalendarDefaultDate(date || calendarDefaultDate || new Date().toISOString().split('T')[0]);
                  setSelectedEventToEdit(null);
                  setModalCalOpen(true);
                }}
                onOpenEditModal={(evt) => {
                  setSelectedEventToEdit(evt);
                  setCalendarDefaultDate(evt.fecha);
                  setModalCalOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'proyectos' && (
            <div className="animate-fadeIn">
              <ProjectsView
                onOpenNewProject={() => setModalProjOpen(true)}
                onOpenEditProgress={(proj) => {
                  setSelectedProject(proj);
                  setModalEditProgOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'clientes' && (
            <div className="animate-fadeIn">
              <ClientsView onOpenNewClient={() => setModalClientOpen(true)} />
            </div>
          )}

          {activeTab === 'websites' && (
            <div className="animate-fadeIn">
              <WebsitesView
                onOpenNewWebsite={() => {
                  setSelectedWebsiteToEdit(null);
                  setModalWebOpen(true);
                }}
                onEditWebsite={(web) => {
                  setSelectedWebsiteToEdit(web);
                  setModalWebOpen(true);
                }}
                onOpenEditWebsite={(web) => {
                  setSelectedWebsiteToEdit(web);
                  setModalWebOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="bg-white rounded-[28px] p-6 border border-neutral-200/80 shadow-sm animate-fadeIn">
              <SettingsView />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
