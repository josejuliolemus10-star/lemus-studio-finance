import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Settings,
  Search,
  Bell,
  ChevronDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Server,
  Globe,
  Code2,
  Moon,
  Sun,
  LogOut,
  Plus,
  Menu,
  X,
  Eye,
  EyeOff,
  Wifi,
  Trash2,
  Calendar as CalendarIcon,
  Layers,
  HelpCircle,
  Inbox,
  Sparkles,
  FileSpreadsheet,
  Download,
  Clock,
  Video,
  ExternalLink
} from 'lucide-react';

import { useFinancialStore } from './store/useFinancialStore';
import { formatGTQ, formatDate } from './utils/formatters';
import { exportToExcel } from './utils/excelExporter';
import { BarChartMonthly, DonutCategories } from './components/FinanceCharts';
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

// --- LOGO VECTORIAL DE LEMUS STUDIO (Black & White Minimalist) ---
export const LemusLogo = ({ className = "h-9", showText = true }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative w-9 h-9 rounded-xl bg-black border border-[#242424] flex items-center justify-center p-1 overflow-hidden shadow-sm hover:border-white transition-colors shrink-0">
        {!imgError ? (
          <img
            src="/lemus-icon.jpg"
            alt="Lemus Studio"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter contrast-125"
          />
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="10">
            <rect x="8" y="8" width="84" height="84" strokeWidth="8" />
            <path d="M26 80 L52 20" strokeWidth="8" />
            <path d="M26 80 L62 58 L80 78" strokeWidth="8" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-[17px] font-bold tracking-tight text-white leading-tight font-display">
            Lemus <span className="font-normal text-[#A1A1AA]">Studio</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#71717A] font-medium font-mono">
            Suite Black & White
          </span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [txFilterType, setTxFilterType] = useState('Todos');

  // Modals States
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const [modalProjOpen, setModalProjOpen] = useState(false);
  const [modalClientOpen, setModalClientOpen] = useState(false);
  const [modalEditProgOpen, setModalEditProgOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // New Modals: Websites & Calendar
  const [modalWebOpen, setModalWebOpen] = useState(false);
  const [selectedWebsiteToEdit, setSelectedWebsiteToEdit] = useState(null);
  const [modalCalOpen, setModalCalOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);
  const [calendarDefaultDate, setCalendarDefaultDate] = useState(null);

  // Global State (Zustand + LocalStorage)
  const transactions = useFinancialStore((state) => state.transactions);
  const projects = useFinancialStore((state) => state.projects);
  const clients = useFinancialStore((state) => state.clients);
  const websites = useFinancialStore((state) => state.websites);
  const calendarEvents = useFinancialStore((state) => state.calendarEvents);
  const baseBacBalance = useFinancialStore((state) => state.baseBacBalance);
  const deleteTransaction = useFinancialStore((state) => state.deleteTransaction);
  const addToast = useFinancialStore((state) => state.addToast);

  // --- CÁLCULOS FINANCIEROS EN TIEMPO REAL ---
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);
  }, [transactions]);

  const netProfit = totalIncome - totalExpenses;
  const bacBalance = (baseBacBalance || 0) + netProfit;
  const netMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) + '%' : '0.0%';

  // Transacciones ordenadas por fecha más reciente
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      return new Date(b.fecha || 0) - new Date(a.fecha || 0);
    });
  }, [transactions]);

  // Filtro de búsqueda y tipo de movimiento
  const filteredTransactions = useMemo(() => {
    let list = sortedTransactions;
    if (txFilterType === 'ingreso') list = list.filter((t) => t.tipo === 'ingreso');
    if (txFilterType === 'gasto') list = list.filter((t) => t.tipo === 'gasto');

    if (!searchQuery.trim()) return list;
    return list.filter((t) =>
      t.motivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoria?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id_cliente_o_proveedor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedTransactions, txFilterType]);

  // Exportar Excel
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

  // Items de navegación lateral
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'websites', label: 'Páginas Web', icon: Globe, count: String(websites.length) },
    { id: 'calendario', label: 'Calendario & Citas', icon: CalendarIcon, count: String(calendarEvents.length) },
    { id: 'proyectos', label: 'Proyectos', icon: Briefcase, count: String(projects.length) },
    { id: 'clientes', label: 'Clientes CRM', icon: Users, count: String(clients.length) },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: FileText, count: '3' },
    { id: 'configuracion', label: 'Configuración & Excel', icon: Settings },
  ];

  const handleOpenEditProgress = (proj) => {
    setSelectedProject(proj);
    setModalEditProgOpen(true);
  };

  const handleOpenWebsiteModal = (web = null) => {
    setSelectedWebsiteToEdit(web);
    setModalWebOpen(true);
  };

  const handleOpenCalendarModal = (eventOrDate = null) => {
    if (typeof eventOrDate === 'string') {
      setCalendarDefaultDate(eventOrDate);
      setSelectedEventToEdit(null);
    } else if (eventOrDate && typeof eventOrDate === 'object') {
      setSelectedEventToEdit(eventOrDate);
      setCalendarDefaultDate(null);
    } else {
      setSelectedEventToEdit(null);
      setCalendarDefaultDate(null);
    }
    setModalCalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex font-sans antialiased overflow-x-hidden selection:bg-white selection:text-black">
      {/* Toast Alert Notifications */}
      <ToastContainer />

      {/* Floating Action Speed-Dial Button */}
      <FloatingActionButton
        onOpenTransaction={() => setModalTxOpen(true)}
        onOpenProject={() => setModalProjOpen(true)}
        onOpenClient={() => setModalClientOpen(true)}
        onOpenWebsite={() => handleOpenWebsiteModal()}
        onOpenCalendar={() => handleOpenCalendarModal()}
        onExportExcel={handleExportExcel}
      />

      {/* Modales */}
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

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ==================== SIDEBAR IZQUIERDO (Black & White) ==================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#080808] border-r border-[#242424] flex flex-col justify-between p-5 z-50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo Superior */}
          <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
            <LemusLogo />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú Principal */}
          <nav className="flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-3 mb-1 font-mono">
              Navegación Principal
            </span>
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all group ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-black' : 'text-[#A1A1AA] group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-black text-white font-bold'
                          : 'bg-[#1C1C1C] text-[#A1A1AA]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Accesos Rápidos */}
          <div className="flex flex-col gap-1.5 pt-3 border-t border-[#242424]">
            <button
              onClick={() => handleExportExcel()}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar a Excel (.xlsx)</span>
              </div>
              <Download className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="pt-4 border-t border-[#242424] flex flex-col gap-3">
          <div className="bg-[#0D0D0D] border border-[#242424] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Lemus Cloud</span>
                <span className="text-[10px] text-[#A1A1AA] font-mono">Black & White Suite</span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-[#1C1C1C] text-[10px] font-mono text-white">v4.0</div>
          </div>
        </div>
      </aside>

      {/* ==================== ÁREA DE CONTENIDO PRINCIPAL ==================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ==================== HEADER ==================== */}
        <header className="sticky top-0 bg-[#000000]/90 backdrop-blur-md z-30 px-5 sm:px-8 py-4 border-b border-[#242424] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#0D0D0D] border border-[#242424] text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
                Hola, Julio
                <span className="hidden sm:inline-block text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#111111] text-[#A1A1AA] border border-[#242424]">
                  Lemus Studio
                </span>
              </h1>
              <p className="text-xs text-[#A1A1AA] hidden sm:block">
                Dashboard financiero, catálogo de webs y agenda de reuniones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Buscador */}
            <div className="relative w-40 sm:w-64 md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente, web, cita..."
                className="w-full bg-[#0D0D0D] border border-[#242424] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Botón rápido Exportar a Excel */}
            <button
              onClick={handleExportExcel}
              title="Descargar libro de Excel completo (.xlsx)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D0D0D] hover:bg-[#1A1A1A] text-emerald-400 border border-emerald-800/40 text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </button>

            {/* Botón rápido Registrar Movimiento */}
            <button
              onClick={() => setModalTxOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-[#E4E4E7] text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar</span>
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-[#242424]">
              <div className="w-9 h-9 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center font-display shadow-md">
                JL
              </div>
            </div>
          </div>
        </header>

        {/* ==================== VISTA PRINCIPAL / CONDICIONAL ==================== */}
        <main className="p-5 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* TAB 1: DASHBOARD DINÁMICO */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* COLUMNA CENTRAL */}
              <div className="lg:col-span-8 space-y-6">

                {/* TARJETAS SUPERIORES DINÁMICAS (Black & White Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* CARD 1: Ingresos Totales */}
                  <div className="dashboard-card p-5 relative overflow-hidden group">
                    <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-2">
                      <span className="font-medium tracking-wide">Ingresos Totales (Reales)</span>
                      <div className="flex items-center gap-1 text-[11px] bg-[#050505] px-2 py-0.5 rounded-md border border-[#242424] text-white">
                        <span>GTQ</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-white font-display">Q</span>
                          <span className="text-2xl sm:text-3xl font-bold text-white font-numeric tracking-tight">
                            {totalIncome.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-white bg-[#1A1A1A] border border-[#333333] px-2 py-0.5 rounded-md">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            {transactions.filter(t => t.tipo === 'ingreso').length} cobros registrados
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setModalTxOpen(true)}
                        title="Agregar ingreso"
                        className="p-2.5 rounded-xl bg-white text-black hover:bg-[#E4E4E7] transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: Gastos Totales */}
                  <div className="dashboard-card p-5 relative overflow-hidden group">
                    <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-2">
                      <span className="font-medium tracking-wide">Gastos Totales (Reales)</span>
                      <div className="flex items-center gap-1 text-[11px] bg-[#050505] px-2 py-0.5 rounded-md border border-[#242424] text-white">
                        <span>Operativo</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-[#A1A1AA] font-display">Q</span>
                          <span className="text-2xl sm:text-3xl font-bold text-[#E4E4E7] font-numeric tracking-tight">
                            {totalExpenses.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#A1A1AA] bg-[#1A1A1A] border border-[#333333] px-2 py-0.5 rounded-md">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            {transactions.filter(t => t.tipo === 'gasto').length} egresos registrados
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setModalTxOpen(true)}
                        title="Agregar gasto"
                        className="p-2.5 rounded-xl bg-[#1F1F1F] text-white hover:bg-[#2A2A2A] border border-[#333333] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* GRÁFICA DE BARRAS PRINCIPAL (Recharts Black & White) */}
                <div className="dashboard-card p-6 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                        Comparativa: Ingresos vs Gastos
                        <span className="text-[11px] font-normal font-mono text-[#A1A1AA]">
                          (2026)
                        </span>
                      </h3>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        Margen Neto: <span className="text-white font-bold">{netMargin}</span> • Utilidad Neta: <span className="font-numeric font-bold text-white">{formatGTQ(netProfit)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                        <span className="text-white font-medium">Ingresos</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#52525B]" />
                        <span className="text-[#A1A1AA]">Gastos</span>
                      </div>
                    </div>
                  </div>

                  <BarChartMonthly transactions={transactions} />
                </div>

                {/* ==================== TRANSACCIONES RECIENTES ==================== */}
                <div className="dashboard-card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                        Transacciones Recientes
                        <span className="text-[11px] font-normal text-[#A1A1AA]">
                          ({filteredTransactions.length} visibles)
                        </span>
                      </h3>
                      <p className="text-[11px] text-[#A1A1AA]">
                        Registro de cobros y compras con opción para borrar movimientos
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="bg-[#050505] p-1 rounded-xl border border-[#242424] flex items-center text-xs">
                        {[
                          { id: 'Todos', label: 'Todos' },
                          { id: 'ingreso', label: '+ Ingresos' },
                          { id: 'gasto', label: '- Gastos' },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setTxFilterType(btn.id)}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                              txFilterType === btn.id
                                ? 'bg-white text-black font-bold'
                                : 'text-[#A1A1AA] hover:text-white'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setModalTxOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#E4E4E7] transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Registrar</span>
                      </button>
                    </div>
                  </div>

                  {filteredTransactions.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-[#050505] border border-[#242424] flex items-center justify-center text-[#A1A1AA] mb-2.5">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-white">No hay transacciones registradas</p>
                      <p className="text-[11px] text-[#A1A1AA] mt-0.5 max-w-xs">
                        Has iniciado de cero. Haz clic en "Registrar Movimiento" para guardar tu primer cobro o pago de hosting.
                      </p>
                      <button
                        onClick={() => setModalTxOpen(true)}
                        className="mt-3.5 px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-[#E4E4E7]"
                      >
                        + Registrar Primer Movimiento
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#1F1F1F]">
                      {filteredTransactions.map((tx) => {
                        const isIncome = tx.tipo === 'ingreso';

                        return (
                          <div
                            key={tx.id}
                            className="py-3 flex items-center justify-between gap-3 hover:bg-[#141414] -mx-2 px-2 rounded-xl transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                  isIncome
                                    ? 'bg-white text-black border-white font-bold'
                                    : 'bg-[#1C1C1C] text-white border-[#333333]'
                                }`}
                              >
                                {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white truncate group-hover:text-white transition-colors">
                                    {tx.motivo}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[#1C1C1C] text-[#D4D4D8] border border-[#2A2A2A]">
                                    {tx.categoria || (isIncome ? 'Ingreso' : 'Gasto')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA] mt-0.5 truncate font-mono">
                                  <span>{tx.id_cliente_o_proveedor || 'Sin asociar'}</span>
                                  <span>•</span>
                                  <span className="text-white flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3 text-[#A1A1AA]" />
                                    {formatDate(tx.fecha)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span
                                  className={`text-xs sm:text-sm font-bold font-numeric block ${
                                    isIncome ? 'text-white' : 'text-[#A1A1AA]'
                                  }`}
                                >
                                  {isIncome ? '+' : '-'} {formatGTQ(tx.monto)}
                                </span>
                                <span className="text-[10px] text-[#71717A] font-mono">
                                  {formatDate(tx.fecha)}
                                </span>
                              </div>

                              {/* Botón de Borrar Transacción Visible y Funcional */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`¿Estás seguro de que deseas eliminar este movimiento?\n\n"${tx.motivo}" (${isIncome ? '+' : '-'}${formatGTQ(tx.monto)})`)) {
                                    deleteTransaction(tx.id);
                                  }
                                }}
                                title="Eliminar este movimiento"
                                className="p-2 rounded-xl text-[#71717A] hover:text-rose-400 hover:bg-rose-950/40 border border-[#242424] hover:border-rose-800/60 transition-all flex items-center justify-center"
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

              </div>

              {/* PANEL DERECHO (BAC CREDOMATIC + DONUT CHART + PROYECTOS / CITAS) */}
              <div className="lg:col-span-4 space-y-6">

                {/* ==================== TARJETA BAC CREDOMATIC MOCKUP (Saldo Inicia en 0.00) ==================== */}
                <div className="dashboard-card p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-white" />
                      <span className="font-bold text-white font-display">Active Cards</span>
                    </div>
                    <span className="text-[11px] text-[#A1A1AA] font-mono">BAC Credomatic GT</span>
                  </div>

                  <div className="relative bac-card-gradient border border-[#242424] rounded-2xl p-5 shadow-2xl text-white group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-[#E31837] via-[#E31837] to-transparent" />

                    {/* Encabezado BAC */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#E31837] flex items-center justify-center font-bold text-[10px] text-white tracking-tighter">
                          BAC
                        </div>
                        <span className="text-xs font-bold tracking-wider text-white">
                          Credomatic
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-neutral-400">
                        <Wifi className="w-4 h-4 rotate-90 text-neutral-400" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#A1A1AA]">
                          Business
                        </span>
                      </div>
                    </div>

                    {/* Chip & Saldo Disponible en Vivo */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-sm border border-amber-300/40 flex items-center justify-center">
                        <div className="w-full h-full border border-amber-700/30 rounded-xs flex flex-col justify-between p-0.5">
                          <div className="border-b border-amber-700/30 h-1" />
                          <div className="border-b border-amber-700/30 h-1" />
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#A1A1AA] block">
                          Saldo Disponible
                        </span>
                        <span className="text-xl font-bold font-numeric text-white tracking-tight">
                          {formatGTQ(bacBalance)}
                        </span>
                      </div>
                    </div>

                    {/* Número de Tarjeta */}
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <div className="font-mono text-sm tracking-widest text-neutral-200">
                        {showCardNumber ? '4519 • 8920 • 3412 • 4519' : '•••• •••• •••• 4519'}
                      </div>
                      <button
                        onClick={() => setShowCardNumber(!showCardNumber)}
                        className="p-1 text-[#A1A1AA] hover:text-white transition-colors"
                      >
                        {showCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Titular */}
                    <div className="flex items-end justify-between pt-2 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#A1A1AA] block">Titular</span>
                        <span className="font-mono font-bold tracking-wide text-white uppercase text-[11px]">
                          JULIO LEMUS
                        </span>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#A1A1AA] block">Expira</span>
                          <span className="font-mono text-neutral-300 text-[11px]">12/28</span>
                        </div>
                        <div className="italic font-black text-sm tracking-tighter text-white">
                          VISA
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#242424] text-[11px]">
                    <button
                      onClick={() => setModalTxOpen(true)}
                      className="py-1.5 px-2 rounded-lg bg-white text-black font-bold text-center hover:bg-[#E4E4E7] transition-colors"
                    >
                      + Registrar Movimiento
                    </button>
                    <button
                      onClick={() => handleExportExcel()}
                      className="py-1.5 px-2 rounded-lg bg-[#050505] hover:bg-[#141414] text-white text-center border border-[#242424] transition-colors"
                    >
                      Descargar Excel
                    </button>
                  </div>
                </div>

                {/* ==================== CATEGORÍAS DE INGRESOS (DONUT CHART) ==================== */}
                <div className="dashboard-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-white font-display">
                        Categorías de Ingreso
                      </h3>
                      <p className="text-[11px] text-[#A1A1AA]">Distribución de facturación real</p>
                    </div>
                    <div className="text-[10px] font-mono text-white bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#333333]">
                      En Vivo
                    </div>
                  </div>

                  <DonutCategories transactions={transactions} />
                </div>

                {/* ==================== PRÓXIMAS CITAS RÁPIDAS (Widget de Calendario) ==================== */}
                <div className="dashboard-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-white" />
                      <span>Agenda & Citas Próximas</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('calendario')}
                      className="text-[11px] text-white hover:underline font-mono"
                    >
                      Ver agenda ({calendarEvents.length})
                    </button>
                  </div>

                  {calendarEvents.length === 0 ? (
                    <p className="text-xs text-[#71717A] py-2 text-center">No hay citas agendadas.</p>
                  ) : (
                    <div className="space-y-2">
                      {calendarEvents.slice(0, 3).map((ev) => (
                        <div key={ev.id} className="bg-[#050505] p-2.5 rounded-xl border border-[#242424] text-xs flex items-center justify-between">
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate">{ev.titulo}</span>
                            <span className="text-[10px] text-[#A1A1AA] font-mono flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {formatDate(ev.fecha)} • {ev.hora_inicio}
                            </span>
                          </div>
                          {ev.enlace && (
                            <a
                              href={ev.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-[#1A1A1A] text-white hover:bg-white hover:text-black transition-colors"
                              title="Abrir enlace"
                            >
                              <Video className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PÁGINAS WEB (CATÁLOGO & RECICLAJE) */}
          {activeTab === 'websites' && (
            <WebsitesView
              onOpenNewWebsite={() => handleOpenWebsiteModal()}
              onEditWebsite={(web) => handleOpenWebsiteModal(web)}
            />
          )}

          {/* TAB 3: CALENDARIO & CITAS */}
          {activeTab === 'calendario' && (
            <CalendarView
              onOpenNewEvent={(date) => handleOpenCalendarModal(date)}
              onEditEvent={(evt) => handleOpenCalendarModal(evt)}
            />
          )}

          {/* TAB 4: PROYECTOS */}
          {activeTab === 'proyectos' && (
            <ProjectsView
              onOpenNewProject={() => setModalProjOpen(true)}
              onEditProgress={handleOpenEditProgress}
            />
          )}

          {/* TAB 5: CLIENTES CRM */}
          {activeTab === 'clientes' && (
            <ClientsView onOpenNewClient={() => setModalClientOpen(true)} />
          )}

          {/* TAB 6: COTIZACIONES */}
          {activeTab === 'cotizaciones' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="dashboard-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">
                      Control de Cotizaciones
                    </h2>
                    <p className="text-xs text-[#A1A1AA]">
                      Presupuestos emitidos para clientes y prospectos de Lemus Studio
                    </p>
                  </div>
                  <button
                    onClick={() => setModalTxOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar Anticipo</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#242424] text-[#71717A] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold font-mono">Folio</th>
                        <th className="pb-3 font-semibold">Cliente</th>
                        <th className="pb-3 font-semibold">Servicio Cotizado</th>
                        <th className="pb-3 font-semibold">Monto Estimado</th>
                        <th className="pb-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F1F]">
                      {[
                        { id: 'COT-2026-031', client: 'Hospital Los Arcos', service: 'Portal de Citas y Rediseño Web', amount: 16500.00, status: 'En Negociación' },
                        { id: 'COT-2026-030', client: 'Grupo Constructor Bolívar', service: 'Landing Page & Branding Digital', amount: 6200.00, status: 'Aprobada' },
                        { id: 'COT-2026-029', client: 'Restaurante K’ulub', service: 'Menú Digital Interactivo & Delivery', amount: 4800.00, status: 'Pendiente Firma' },
                      ].map((q) => (
                        <tr key={q.id} className="hover:bg-[#141414]">
                          <td className="py-4 font-mono font-medium text-white">{q.id}</td>
                          <td className="py-4 font-bold text-white">{q.client}</td>
                          <td className="py-4 text-[#A1A1AA]">{q.service}</td>
                          <td className="py-4 font-numeric font-bold text-white">{formatGTQ(q.amount)}</td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1C1C1C] text-[#E4E4E7] border border-[#2A2A2A]">
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CONFIGURACIÓN & EXCEL */}
          {activeTab === 'configuracion' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
