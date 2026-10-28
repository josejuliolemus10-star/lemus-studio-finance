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
  Calendar,
  Layers,
  HelpCircle,
  Inbox,
  Sparkles
} from 'lucide-react';

import { useFinancialStore } from './store/useFinancialStore';
import { formatGTQ, formatDate } from './utils/formatters';
import { BarChartMonthly, DonutCategories } from './components/FinanceCharts';
import { ToastContainer } from './components/ToastContainer';
import { ModalTransaction } from './components/ModalTransaction';
import { ModalProject } from './components/ModalProject';
import { ModalClient } from './components/ModalClient';
import { ModalEditProgress } from './components/ModalEditProgress';
import { FloatingActionButton } from './components/FloatingActionButton';
import { ProjectsView } from './views/ProjectsView';
import { ClientsView } from './views/ClientsView';
import { SettingsView } from './views/SettingsView';

// --- LOGO VECTORIAL DE LEMUS STUDIO ---
export const LemusLogo = ({ className = "h-9", showText = true }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative w-9 h-9 rounded-xl bg-black border border-[#253745] flex items-center justify-center p-1 overflow-hidden shadow-sm hover:border-[#9BA8AB] transition-colors shrink-0">
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
          <span className="text-[17px] font-semibold tracking-tight text-[#CCD0CF] leading-tight font-display">
            Lemus <span className="font-normal text-[#9BA8AB]">Studio</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#9BA8AB]/70 font-medium">
            Financial Suite
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
  const [txFilterType, setTxFilterType] = useState('Todos'); // 'Todos' | 'ingreso' | 'gasto'

  // Modals States
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const [modalProjOpen, setModalProjOpen] = useState(false);
  const [modalClientOpen, setModalClientOpen] = useState(false);
  const [modalEditProgOpen, setModalEditProgOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Global State (Zustand + LocalStorage)
  const transactions = useFinancialStore((state) => state.transactions);
  const projects = useFinancialStore((state) => state.projects);
  const clients = useFinancialStore((state) => state.clients);
  const baseBacBalance = useFinancialStore((state) => state.baseBacBalance);
  const deleteTransaction = useFinancialStore((state) => state.deleteTransaction);

  // --- CÁLCULOS EN TIEMPO REAL CONECTADOS AL ESTADO ---
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
  const bacBalance = baseBacBalance + netProfit;
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

  // Items de navegación lateral
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: FileText, count: '3' },
    { id: 'proyectos', label: 'Proyectos', icon: Briefcase, count: String(projects.length) },
    { id: 'clientes', label: 'Clientes', icon: Users, count: String(clients.length) },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const handleOpenEditProgress = (proj) => {
    setSelectedProject(proj);
    setModalEditProgOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF] flex font-sans antialiased overflow-x-hidden selection:bg-[#253745] selection:text-white">
      {/* Toast Alert Notifications */}
      <ToastContainer />

      {/* Floating Action Speed-Dial Button */}
      <FloatingActionButton
        onOpenTransaction={() => setModalTxOpen(true)}
        onOpenProject={() => setModalProjOpen(true)}
        onOpenClient={() => setModalClientOpen(true)}
      />

      {/* Modales Interactivos */}
      <ModalTransaction isOpen={modalTxOpen} onClose={() => setModalTxOpen(false)} />
      <ModalProject isOpen={modalProjOpen} onClose={() => setModalProjOpen(false)} />
      <ModalClient isOpen={modalClientOpen} onClose={() => setModalClientOpen(false)} />
      <ModalEditProgress
        isOpen={modalEditProgOpen}
        onClose={() => setModalEditProgOpen(false)}
        project={selectedProject}
      />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ==================== SIDEBAR IZQUIERDO ==================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#11212D] border-r border-[#253745] flex flex-col justify-between p-5 z-50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo Superior */}
          <div className="flex items-center justify-between pb-4 border-b border-[#253745]/60">
            <LemusLogo />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-[#9BA8AB] hover:text-[#CCD0CF] rounded-lg hover:bg-[#253745]/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú Principal */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[#9BA8AB]/60 uppercase tracking-wider px-3 mb-1">
              Menú Principal
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-[#253745] text-white shadow-sm shadow-black/40 font-semibold'
                      : 'text-[#9BA8AB] hover:text-[#CCD0CF] hover:bg-[#253745]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#00E5FF]' : 'text-[#9BA8AB] group-hover:text-[#CCD0CF]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold'
                          : 'bg-[#253745]/70 text-[#9BA8AB]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Preferencias */}
          <div className="flex flex-col gap-1.5 pt-4 border-t border-[#253745]/60">
            <span className="text-[11px] font-semibold text-[#9BA8AB]/60 uppercase tracking-wider px-3 mb-1">
              Operaciones Rápidas
            </span>
            <button
              onClick={() => setModalTxOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrar Movimiento</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="pt-4 border-t border-[#253745]/60 flex flex-col gap-3">
          <div className="bg-[#06141B]/70 border border-[#253745] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#CCD0CF]">Lemus Cloud</span>
                <span className="text-[10px] text-[#9BA8AB]">GTQ • Conectado</span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-[#253745] text-[10px] font-mono text-[#00E5FF]">v2.4</div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs text-[#9BA8AB]">
              <div className="flex items-center bg-[#06141B] p-1 rounded-lg border border-[#253745]">
                <button title="Modo Oscuro Activo" className="p-1 rounded bg-[#253745] text-[#00E5FF]">
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button title="Modo Claro Desactivado" className="p-1 rounded text-[#9BA8AB]/40 cursor-not-allowed">
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] font-medium">Dark Mode</span>
            </div>

            <button
              onClick={() => setActiveTab('configuracion')}
              title="Configuración"
              className="p-1.5 rounded-lg text-[#9BA8AB] hover:text-[#CCD0CF] hover:bg-[#253745]/40 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== ÁREA DE CONTENIDO PRINCIPAL ==================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ==================== HEADER ==================== */}
        <header className="sticky top-0 bg-[#06141B]/90 backdrop-blur-md z-30 px-5 sm:px-8 py-4 border-b border-[#253745]/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#11212D] border border-[#253745] text-[#CCD0CF]"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#CCD0CF] font-display flex items-center gap-2">
                Hola, Julio
                <span className="hidden sm:inline-block text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#11212D] text-[#9BA8AB] border border-[#253745]">
                  Director
                </span>
              </h1>
              <p className="text-xs text-[#9BA8AB] hidden sm:block">
                Dashboard privado y flujo de caja en tiempo real de <span className="text-[#CCD0CF] font-medium">Lemus Studio</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Barra de búsqueda reactiva */}
            <div className="relative w-44 sm:w-72 md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente, motivo o servicio..."
                className="w-full bg-[#11212D] border border-[#253745] rounded-xl pl-9 pr-8 py-2 text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/60 focus:outline-none focus:border-[#00E5FF] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9BA8AB] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Botón rápido Registrar */}
            <button
              onClick={() => setModalTxOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00E5FF] text-[#06141B] hover:bg-[#00E5FF]/90 text-xs font-bold transition-all shadow-glow-cyan"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar</span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-[#253745]">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#253745] to-[#11212D] border border-[#253745] flex items-center justify-center font-bold text-sm text-[#00E5FF] font-display shadow-inner">
                  JL
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#06141B]" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#CCD0CF] leading-tight">Julio Lemus</span>
                <span className="text-[10px] text-[#9BA8AB]">julio@lemus.studio</span>
              </div>
            </div>
          </div>
        </header>

        {/* ==================== VISTA PRINCIPAL / CONDICIONAL ==================== */}
        <main className="p-5 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* TAB 1: DASHBOARD DINÁMICO */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* COLUMNA CENTRAL (TARJETAS + BARRAS + TRANSACCIONES) */}
              <div className="lg:col-span-8 space-y-6">

                {/* TARJETAS SUPERIORES DINÁMICAS (SUMAS REALES) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* CARD 1: Ingresos Totales */}
                  <div className="dashboard-card p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00E5FF]/10 transition-all" />

                    <div className="flex items-center justify-between text-xs text-[#9BA8AB] mb-2">
                      <span className="font-medium tracking-wide">Ingresos Totales</span>
                      <div className="flex items-center gap-1 text-[11px] bg-[#06141B] px-2 py-0.5 rounded-md border border-[#253745]">
                        <span>Real Acumulado</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-[#00E5FF] font-display">Q</span>
                          <span className="text-2xl sm:text-3xl font-bold text-[#CCD0CF] font-numeric tracking-tight">
                            {totalIncome.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            {transactions.filter(t => t.tipo === 'ingreso').length} cobros
                          </span>
                          <span className="text-[11px] text-[#9BA8AB]">en base de datos</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setModalTxOpen(true)}
                        title="Agregar ingreso"
                        className="p-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: Gastos Totales */}
                  <div className="dashboard-card p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#F43F5E]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#F43F5E]/10 transition-all" />

                    <div className="flex items-center justify-between text-xs text-[#9BA8AB] mb-2">
                      <span className="font-medium tracking-wide">Gastos Totales</span>
                      <div className="flex items-center gap-1 text-[11px] bg-[#06141B] px-2 py-0.5 rounded-md border border-[#253745]">
                        <span>Operativo Real</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-[#F43F5E] font-display">Q</span>
                          <span className="text-2xl sm:text-3xl font-bold text-[#CCD0CF] font-numeric tracking-tight">
                            {totalExpenses.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-md">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            {transactions.filter(t => t.tipo === 'gasto').length} egresos
                          </span>
                          <span className="text-[11px] text-[#9BA8AB]">servidores & licencias</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setModalTxOpen(true)}
                        title="Agregar gasto"
                        className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* GRÁFICA DE BARRAS PRINCIPAL (RECHARTS DINÁMICO) */}
                <div className="dashboard-card p-6 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-[#CCD0CF] font-display flex items-center gap-2">
                        Comparativa: Ingresos vs Gastos
                        <span className="text-[11px] font-normal font-sans text-[#9BA8AB]">
                          (Calculado en tiempo real)
                        </span>
                      </h3>
                      <p className="text-xs text-[#9BA8AB] mt-0.5">
                        Margen Neto: <span className="text-emerald-400 font-semibold">{netMargin}</span> • Utilidad Neta: <span className="font-numeric font-semibold text-white">{formatGTQ(netProfit)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-xs shadow-[#00E5FF]" />
                        <span className="text-[#CCD0CF] font-medium">Ingresos</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D946EF] shadow-xs shadow-[#D946EF]" />
                        <span className="text-[#9BA8AB]">Gastos</span>
                      </div>
                    </div>
                  </div>

                  {/* Renderizado de Recharts Bar Chart conectado a `transactions` */}
                  <BarChartMonthly transactions={transactions} />
                </div>

                {/* ==================== TRANSACCIONES RECIENTES ==================== */}
                <div className="dashboard-card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#CCD0CF] font-display flex items-center gap-2">
                        Transacciones Recientes
                        <span className="text-[11px] font-normal text-[#9BA8AB]">
                          ({filteredTransactions.length} visibles)
                        </span>
                      </h3>
                      <p className="text-[11px] text-[#9BA8AB]">
                        Fechas y montos en Quetzales ordenados cronológicamente
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Filtros de Tipo */}
                      <div className="bg-[#06141B] p-1 rounded-xl border border-[#253745] flex items-center text-xs">
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
                                ? 'bg-[#253745] text-white font-semibold'
                                : 'text-[#9BA8AB] hover:text-[#CCD0CF]'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setModalTxOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Registrar</span>
                      </button>
                    </div>
                  </div>

                  {filteredTransactions.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-[#06141B] border border-[#253745] flex items-center justify-center text-[#9BA8AB] mb-2.5">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-[#CCD0CF]">No hay transacciones registradas</p>
                      <p className="text-[11px] text-[#9BA8AB] mt-0.5 max-w-xs">
                        Has iniciado de cero. Haz clic en "Registrar Movimiento" para guardar tu primer cobro o pago de hosting.
                      </p>
                      <button
                        onClick={() => setModalTxOpen(true)}
                        className="mt-3.5 px-3.5 py-1.5 rounded-lg bg-[#00E5FF] text-[#06141B] text-xs font-bold hover:bg-[#00E5FF]/90 shadow-glow-cyan"
                      >
                        + Registrar Primer Movimiento
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#253745]/50">
                      {filteredTransactions.map((tx) => {
                        const isIncome = tx.tipo === 'ingreso';

                        return (
                          <div
                            key={tx.id}
                            className="py-3 flex items-center justify-between gap-3 hover:bg-[#253745]/20 -mx-2 px-2 rounded-xl transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                  isIncome
                                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                                    : 'bg-rose-950/30 border-rose-800/40 text-rose-400'
                                }`}
                              >
                                {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-[#CCD0CF] truncate group-hover:text-white transition-colors">
                                    {tx.motivo}
                                  </span>
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                                      isIncome
                                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                                        : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                                    }`}
                                  >
                                    {tx.categoria || (isIncome ? 'Ingreso' : 'Gasto')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-[#9BA8AB] mt-0.5 truncate">
                                  <span>{tx.id_cliente_o_proveedor || 'Sin asociar'}</span>
                                  <span>•</span>
                                  <span className="font-mono text-[10px] text-[#00E5FF] flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#9BA8AB]" />
                                    {formatDate(tx.fecha)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span
                                  className={`text-xs sm:text-sm font-bold font-numeric block ${
                                    isIncome ? 'text-emerald-400' : 'text-[#CCD0CF]'
                                  }`}
                                >
                                  {isIncome ? '+' : '-'} {formatGTQ(tx.monto)}
                                </span>
                                <span className="text-[10px] text-[#9BA8AB]/70 font-mono">
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
                                className="p-2 rounded-xl text-[#9BA8AB] hover:text-rose-400 hover:bg-rose-950/40 border border-[#253745]/60 hover:border-rose-800/60 transition-all flex items-center justify-center"
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

              {/* PANEL DERECHO (BAC CREDOMATIC + DONUT CHART + INDICADORES) */}
              <div className="lg:col-span-4 space-y-6">

                {/* ==================== TARJETA BAC CREDOMATIC MOCKUP ==================== */}
                <div className="dashboard-card p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#00E5FF]" />
                      <span className="text-xs font-semibold text-[#CCD0CF] font-display">
                        Active Cards
                      </span>
                    </div>
                    <span className="text-[11px] text-[#9BA8AB]">BAC Credomatic GT</span>
                  </div>

                  <div className="relative bac-card-gradient border border-[#253745] rounded-2xl p-5 shadow-2xl text-white group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-[#E31837] via-[#E31837] to-transparent" />

                    {/* Encabezado BAC */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#E31837] flex items-center justify-center font-bold text-[10px] text-white tracking-tighter">
                          BAC
                        </div>
                        <span className="text-xs font-semibold tracking-wider text-neutral-200">
                          Credomatic
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-neutral-400">
                        <Wifi className="w-4 h-4 rotate-90 text-neutral-400" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#9BA8AB]">
                          Business
                        </span>
                      </div>
                    </div>

                    {/* Chip & Saldo en Vivo */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-sm border border-amber-300/40 flex items-center justify-center">
                        <div className="w-full h-full border border-amber-700/30 rounded-xs flex flex-col justify-between p-0.5">
                          <div className="border-b border-amber-700/30 h-1" />
                          <div className="border-b border-amber-700/30 h-1" />
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#9BA8AB] block">
                          Saldo Disponible
                        </span>
                        <span className="text-lg font-bold font-numeric text-white tracking-tight">
                          {formatGTQ(bacBalance)}
                        </span>
                      </div>
                    </div>

                    {/* Número de Tarjeta */}
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <div className="font-mono text-sm tracking-widest text-neutral-300">
                        {showCardNumber ? '4519 • 8920 • 3412 • 4519' : '•••• •••• •••• 4519'}
                      </div>
                      <button
                        onClick={() => setShowCardNumber(!showCardNumber)}
                        className="p-1 text-[#9BA8AB] hover:text-white transition-colors"
                        title={showCardNumber ? "Ocultar número" : "Mostrar número"}
                      >
                        {showCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Titular y Expiración */}
                    <div className="flex items-end justify-between pt-2 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#9BA8AB] block">Titular</span>
                        <span className="font-mono font-medium tracking-wide text-neutral-200 uppercase text-[11px]">
                          JULIO LEMUS
                        </span>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#9BA8AB] block">Expira</span>
                          <span className="font-mono text-neutral-300 text-[11px]">12/28</span>
                        </div>
                        <div className="italic font-black text-sm tracking-tighter text-white bg-blue-900/60 px-2 py-0.5 rounded border border-blue-500/30">
                          VISA
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de la tarjeta */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#253745]/60 text-[11px]">
                    <button
                      onClick={() => setModalTxOpen(true)}
                      className="py-1.5 px-2 rounded-lg bg-[#06141B] hover:bg-[#253745] text-[#00E5FF] font-semibold text-center border border-[#253745] transition-colors"
                    >
                      + Nuevo Movimiento
                    </button>
                    <button
                      onClick={() => setActiveTab('cotizaciones')}
                      className="py-1.5 px-2 rounded-lg bg-[#06141B] hover:bg-[#253745] text-[#CCD0CF] text-center border border-[#253745] transition-colors"
                    >
                      Ver Cotizaciones
                    </button>
                  </div>
                </div>

                {/* ==================== CATEGORÍAS DE INGRESOS (DONUT CHART CONECTADO) ==================== */}
                <div className="dashboard-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-semibold text-[#CCD0CF] font-display">
                        Categorías de Ingreso
                      </h3>
                      <p className="text-[11px] text-[#9BA8AB]">Distribución de facturación real</p>
                    </div>
                    <div className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20">
                      En Vivo
                    </div>
                  </div>

                  {/* Componente Donut conectado al estado real de `transactions` */}
                  <DonutCategories transactions={transactions} />
                </div>

                {/* ==================== RESUMEN OPERATIVO DE PROYECTOS ==================== */}
                <div className="dashboard-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#CCD0CF] font-display">
                      Proyectos en Curso
                    </h3>
                    <button
                      onClick={() => setActiveTab('proyectos')}
                      className="text-[11px] text-[#00E5FF] hover:underline"
                    >
                      Ver todos ({projects.length})
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <p className="text-xs text-[#9BA8AB] py-2 text-center">No hay proyectos activos.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {projects.slice(0, 3).map((proj) => (
                        <div key={proj.id} className="bg-[#06141B] p-2.5 rounded-xl border border-[#253745]">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-white truncate max-w-[160px]">{proj.nombre}</span>
                            <span className="font-mono text-[#00E5FF] font-bold">{proj.progreso}%</span>
                          </div>
                          <div className="w-full bg-[#11212D] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#00E5FF] to-emerald-400 h-full rounded-full"
                              style={{ width: `${proj.progreso}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PROYECTOS VIEW */}
          {activeTab === 'proyectos' && (
            <ProjectsView
              onOpenNewProject={() => setModalProjOpen(true)}
              onEditProgress={handleOpenEditProgress}
            />
          )}

          {/* TAB 3: CLIENTES VIEW */}
          {activeTab === 'clientes' && (
            <ClientsView onOpenNewClient={() => setModalClientOpen(true)} />
          )}

          {/* TAB 4: COTIZACIONES VIEW */}
          {activeTab === 'cotizaciones' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="dashboard-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#CCD0CF] font-display">
                      Control de Cotizaciones
                    </h2>
                    <p className="text-xs text-[#9BA8AB]">
                      Presupuestos emitidos para clientes y prospectos de Lemus Studio
                    </p>
                  </div>
                  <button
                    onClick={() => setModalTxOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#06141B] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-glow-cyan"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar Anticipo</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#253745] text-[#9BA8AB] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Folio</th>
                        <th className="pb-3 font-semibold">Cliente</th>
                        <th className="pb-3 font-semibold">Servicio Cotizado</th>
                        <th className="pb-3 font-semibold">Monto Estimado</th>
                        <th className="pb-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#253745]/50">
                      {[
                        { id: 'COT-2026-031', client: 'Hospital Los Arcos', service: 'Portal de Citas y Rediseño Web', amount: 16500.00, status: 'En Negociación' },
                        { id: 'COT-2026-030', client: 'Grupo Constructor Bolívar', service: 'Landing Page & Branding Digital', amount: 6200.00, status: 'Aprobada' },
                        { id: 'COT-2026-029', client: 'Restaurante K’ulub', service: 'Menú Digital Interactivo & Delivery', amount: 4800.00, status: 'Pendiente Firma' },
                      ].map((q) => (
                        <tr key={q.id} className="hover:bg-[#253745]/20">
                          <td className="py-4 font-mono font-medium text-[#00E5FF]">{q.id}</td>
                          <td className="py-4 font-semibold text-[#CCD0CF]">{q.client}</td>
                          <td className="py-4 text-[#9BA8AB]">{q.service}</td>
                          <td className="py-4 font-numeric font-bold text-white">{formatGTQ(q.amount)}</td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#253745] text-[#CCD0CF] border border-[#253745]">
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

          {/* TAB 5: CONFIGURACIÓN */}
          {activeTab === 'configuracion' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
