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
  X
} from 'lucide-react';

import { useFinancialStore } from './store/useFinancialStore';
import { formatGTQ, formatDate } from './utils/formatters';
import { exportToExcel } from './utils/excelExporter';
import { WeeklyCurveProgress, ConcentricMonthProgress } from './components/FinanceCharts';
import { ToastContainer } from './components/ToastContainer';
import { ModalTransaction } from './components/ModalTransaction';
import { ModalProject } from './components/ModalProject';
import { ModalClient } from './components/ModalClient';
import { ModalEditProgress } from './components/ModalEditProgress';
import { ModalWebsite } from './components/ModalWebsite';
import { ModalCalendarEvent } from './components/ModalCalendarEvent';
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

  // Metas interactivas del mes (Checkbox toggleable)
  const [monthGoals, setMonthGoals] = useState([
    { id: 1, text: 'Cobro anticipo 50% Inmobiliaria Santander', completed: true },
    { id: 2, text: 'Compra de micrófono para setup oficina', completed: true },
    { id: 3, text: 'Entregar maqueta frontend Santander', completed: false },
    { id: 4, text: 'Cotizar nueva web para Café Despierto', completed: false },
  ]);

  const toggleGoal = (id) => {
    setMonthGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  // Modales
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const [modalProjOpen, setModalProjOpen] = useState(false);
  const [modalClientOpen, setModalClientOpen] = useState(false);
  const [modalEditProgOpen, setModalEditProgOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [modalWebOpen, setModalWebOpen] = useState(false);
  const [selectedWebsiteToEdit, setSelectedWebsiteToEdit] = useState(null);
  const [modalCalOpen, setModalCalOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);
  const [calendarDefaultDate, setCalendarDefaultDate] = useState(null);

  // Store
  const transactions = useFinancialStore((state) => state.transactions);
  const projects = useFinancialStore((state) => state.projects);
  const clients = useFinancialStore((state) => state.clients);
  const websites = useFinancialStore((state) => state.websites);
  const calendarEvents = useFinancialStore((state) => state.calendarEvents);
  const baseBacBalance = useFinancialStore((state) => state.baseBacBalance);
  const deleteTransaction = useFinancialStore((state) => state.deleteTransaction);
  const addToast = useFinancialStore((state) => state.addToast);

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

  const handleExportExcel = () => {
    exportToExcel({
      transactions,
      websites,
      calendarEvents,
      projects,
      clients
    });
    addToast('📊 Libro de Excel descargado listo para Google Sheets.', 'success');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendario', label: 'Calendario', icon: CalendarIcon, count: String(calendarEvents.length) },
    { id: 'proyectos', label: 'Proyectos', icon: Briefcase, count: String(projects.length) },
    { id: 'clientes', label: 'Clientes CRM', icon: Users, count: String(clients.length) },
    { id: 'websites', label: 'Páginas Web', icon: Globe, count: String(websites.length) },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4 lg:px-6 flex items-center justify-center">
      <ToastContainer />

      <FloatingActionButton
        onOpenTransaction={() => setModalTxOpen(true)}
        onOpenProject={() => setModalProjOpen(true)}
        onOpenClient={() => setModalClientOpen(true)}
        onOpenWebsite={() => { setSelectedWebsiteToEdit(null); setModalWebOpen(true); }}
        onOpenCalendar={() => { setSelectedEventToEdit(null); setModalCalOpen(true); }}
        onExportExcel={handleExportExcel}
      />

      <ModalTransaction isOpen={modalTxOpen} onClose={() => setModalTxOpen(false)} />
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
      />

      {/* MARCO PRINCIPAL VIDRIO FROSTED (ESTILO iDraft DE IMAGEN 1) */}
      <div className="idraft-glass-frame w-full max-w-[1550px] p-4 sm:p-6 lg:p-7 flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR FLOTANTE (ESTILO BLANCO MINIMALISTA) */}
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

            {/* INTEGRACIONES (Estilo Image 1) */}
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

            {/* EQUIPOS (Estilo Image 1) */}
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
                  <span>UI / UX Design</span>
                </div>
              </div>
            </div>
          </div>

          {/* User profile & settings bottom */}
          <div className="hidden lg:flex items-center gap-3 pt-4 border-t border-neutral-100">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              JL
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-900 leading-tight">Julio Lemus</span>
              <span className="text-[10px] text-neutral-400">Director Creativo</span>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 space-y-6 overflow-hidden">
          {/* HEADER (Estilo "Hi, Dilan!" -> "Hi, Julio!") */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-display">
                Hi, Julio! 👋
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Dashboard financiero privado • Lemus Studio
              </p>
            </div>

            {/* Header Right Actions (Estilo Image 1: + Create, Search, Bell, Avatar) */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => setModalTxOpen(true)}
                className="bg-black hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Registrar Movimiento</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="bg-white hover:bg-neutral-50 text-neutral-700 p-2.5 rounded-full border border-neutral-200/80 shadow-sm transition active:scale-95"
                title="Descargar Excel"
              >
                <Download className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  className="bg-white hover:bg-neutral-50 text-neutral-700 p-2.5 rounded-full border border-neutral-200/80 shadow-sm transition"
                  title="Notificaciones"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                </button>
              </div>

              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm border border-neutral-200">
                JL
              </div>
            </div>
          </header>

          {/* VISTAS CONDICIONALES */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* FILA SUPERIOR: 3 TARJETAS BENTO (Overall Information, Weekly Progress, Month Progress) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                
                {/* 1. OVERALL INFORMATION (TARJETA NEGRA PRINCIPAL ESTILO IMAGE 1) */}
                <div className="idraft-card-dark p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs font-semibold text-neutral-300">Overall Information</span>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:text-white transition">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:text-white transition">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Saldo BAC Disponible */}
                  <div className="my-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-numeric tracking-tight">
                        {formatGTQ(bacBalance)}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Saldo disponible BAC Credomatic (Business)
                    </span>
                  </div>

                  {/* 3 Mini Tarjetas Blancas Internas (Estilo Image 1) */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <div className="bg-white rounded-2xl p-3 text-neutral-900 text-center shadow-sm">
                      <span className="text-xs font-bold font-numeric block">{formatGTQ(totalIncome)}</span>
                      <span className="text-[9px] text-neutral-500 font-medium">Ingresos ({transactions.filter(t => t.tipo === 'ingreso').length})</span>
                    </div>
                    <div className="bg-white rounded-2xl p-3 text-neutral-900 text-center shadow-sm">
                      <span className="text-xs font-bold font-numeric block">{formatGTQ(totalExpenses)}</span>
                      <span className="text-[9px] text-neutral-500 font-medium">Gastos ({transactions.filter(t => t.tipo === 'gasto').length})</span>
                    </div>
                    <div className="bg-white rounded-2xl p-3 text-neutral-900 text-center shadow-sm">
                      <span className="text-sm font-bold font-numeric block">{projects.length}</span>
                      <span className="text-[9px] text-neutral-500 font-medium">Proyectos</span>
                    </div>
                  </div>
                </div>

                {/* 2. WEEKLY PROGRESS (TARJETA BLANCA CON CURVA DE FLUJO) */}
                <div className="idraft-card-white p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-display">Weekly progress</h3>
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

                  {/* Gráfica de onda suave con días L M M J V S D */}
                  <div className="py-1">
                    <WeeklyCurveProgress transactions={transactions} />
                  </div>

                  <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span>M T W T F S S</span>
                    <span className="font-semibold text-neutral-700">+Q 288.00 Margen Neto</span>
                  </div>
                </div>

                {/* 3. MONTH PROGRESS (TARJETA BLANCA CON ANILLO RADIAL Y EXCEL BUTTON) */}
                <div className="idraft-card-white p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-display">Month progress</h3>
                      <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                        +20% compared to last month*
                      </span>
                    </div>
                    <div className="p-2 rounded-full bg-neutral-100 text-neutral-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Anillos concéntricos de progreso */}
                  <ConcentricMonthProgress totalIncome={totalIncome} totalExpenses={totalExpenses} />

                  {/* Botón Download Report (Excel) exactamente como en Image 1 */}
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
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* FILA MEDIA: METAS DEL MES + TAREAS EN PROCESO (STICKY CARDS ESTILO IMAGE 1) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* METAS DEL MES (Left 4 cols) */}
                <div className="lg:col-span-4 idraft-card-white p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-neutral-900 font-display">Month goals:</h3>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        <Edit3 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {monthGoals.map((goal) => (
                        <div
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className="flex items-start gap-3 cursor-pointer group select-none"
                        >
                          <div className="mt-0.5 text-neutral-900 transition transform group-hover:scale-110">
                            {goal.completed ? (
                              <CheckCircle2 className="w-4 h-4 fill-black text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500" />
                            )}
                          </div>
                          <span
                            className={`text-xs leading-snug transition ${
                              goal.completed
                                ? 'line-through text-neutral-400 font-normal'
                                : 'text-neutral-800 font-medium group-hover:text-black'
                            }`}
                          >
                            {goal.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{monthGoals.filter(g => g.completed).length} de {monthGoals.length} completadas</span>
                    <span className="font-semibold text-neutral-700">Meta: Q 5,000.00</span>
                  </div>
                </div>

                {/* TASK IN PROCESS (STICKY NOTES ESTILO IMAGE 1 - Right 8 cols) */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-neutral-900 font-display">
                      Task In process (2)
                    </h3>
                    <button
                      onClick={() => setActiveTab('proyectos')}
                      className="text-xs font-semibold text-neutral-500 hover:text-black transition"
                    >
                      Open archive &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Nota 1: Anticipo Santander */}
                    <div className="idraft-card-note p-5 flex flex-col justify-between min-h-[145px] relative">
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
                          Anticipo página web 50%
                        </span>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
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
                    <div className="idraft-card-note p-5 flex flex-col justify-between min-h-[145px] relative">
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
                          Pago de micrófono
                        </span>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
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

                    {/* Nota 3: + Add task (Dashed Card) */}
                    <div
                      onClick={() => setModalTxOpen(true)}
                      className="border-2 border-dashed border-neutral-300 hover:border-black rounded-[24px] p-5 flex flex-col items-center justify-center min-h-[145px] cursor-pointer group hover:bg-white/60 transition-all text-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-neutral-600 transition mb-2">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-neutral-700 group-hover:text-black">
                        + Registrar Movimiento
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Ingreso o Gasto
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* FILA INFERIOR: LAST PROJECTS (HORIZONTALES OSCUROS ESTILO IMAGE 1) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-neutral-900 font-display">
                    Last Projects & Portafolio
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">Sort by</span>
                    <button className="flex items-center gap-1 text-xs font-semibold text-neutral-700 bg-white px-2.5 py-1 rounded-xl border border-neutral-200">
                      <span>Recientes</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Proyecto 1: Inmobiliaria Santander */}
                  <div className="bg-[#141414] text-white p-5 rounded-[24px] flex flex-col justify-between shadow-md hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Inmobiliaria Santander</span>
                      <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-bold">
                        50%
                      </span>
                    </div>
                    <div className="my-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>En progreso</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                        Página Web Corporativa • Anticipo Q900 cobrado exitosamente.
                      </p>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-white h-full rounded-full w-1/2" />
                    </div>
                  </div>

                  {/* Proyecto 2: Portal Inmobiliario Santander (Web Creada) */}
                  <div className="bg-[#141414] text-white p-5 rounded-[24px] flex flex-col justify-between shadow-md hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Portal Santander Inmuebles</span>
                      <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-bold">
                        1/1
                      </span>
                    </div>
                    <div className="my-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 mb-1">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        <span>Web Reciclable</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                        Buscador con filtros y mapa interactivo listo para reutilizar.
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
                      <span>Categoría: Inmobiliaria</span>
                      <a
                        href="https://santander-inmuebles.gt"
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:underline flex items-center gap-1"
                      >
                        <span>Visitar</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {/* Proyecto 3: Tarjeta BAC Credomatic Card */}
                  <div className="bg-gradient-to-br from-[#1C1C1E] to-[#0A0A0A] text-white p-5 rounded-[24px] flex flex-col justify-between shadow-md border border-neutral-800 hover:border-neutral-700 transition">
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

              {/* FILA 4: LISTA COMPLETA DE TRANSACCIONES REALES (IMAGEN 2) */}
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
                      onClick={() => setModalTxOpen(true)}
                      className="bg-black hover:bg-neutral-800 text-white rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Movimiento</span>
                    </button>
                  </div>
                </div>

                {/* Lista de transacciones exactas de Image 2 */}
                <div className="divide-y divide-neutral-100">
                  {filteredTransactions.map((tx) => {
                    const isIncome = tx.tipo === 'ingreso';
                    return (
                      <div
                        key={tx.id}
                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50/80 px-2 rounded-2xl transition group"
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
                            onClick={() => {
                              if (confirm(`¿Eliminar "${tx.motivo}"?`)) {
                                deleteTransaction(tx.id);
                              }
                            }}
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
            <div className="idraft-card-white p-6 animate-fadeIn">
              <CalendarView
                onOpenAddModal={(date) => {
                  setCalendarDefaultDate(date);
                  setSelectedEventToEdit(null);
                  setModalCalOpen(true);
                }}
                onOpenEditModal={(evt) => {
                  setSelectedEventToEdit(evt);
                  setCalendarDefaultDate(null);
                  setModalCalOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'proyectos' && (
            <div className="idraft-card-white p-6 animate-fadeIn">
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
            <div className="idraft-card-white p-6 animate-fadeIn">
              <ClientsView onOpenNewClient={() => setModalClientOpen(true)} />
            </div>
          )}

          {activeTab === 'websites' && (
            <div className="idraft-card-white p-6 animate-fadeIn">
              <WebsitesView
                onOpenNewWebsite={() => {
                  setSelectedWebsiteToEdit(null);
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
            <div className="idraft-card-white p-6 animate-fadeIn">
              <SettingsView />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
