import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatGTQ } from '../utils/formatters';

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// --- CUSTOM TOOLTIP PARA RECHARTS ---
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find((p) => p.dataKey === 'income')?.value || 0;
    const expenses = payload.find((p) => p.dataKey === 'expenses')?.value || 0;
    const net = income - expenses;

    return (
      <div className="bg-[#06141B] border border-[#253745] p-3 rounded-xl shadow-2xl text-xs space-y-1.5 z-50">
        <span className="font-bold text-white font-display block border-b border-[#253745] pb-1">
          {label} 2026
        </span>
        <div className="flex items-center gap-2 font-numeric text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
          <span className="text-[#9BA8AB]">Ingresos:</span>
          <span className="text-white font-semibold">{formatGTQ(income)}</span>
        </div>
        <div className="flex items-center gap-2 font-numeric text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#D946EF]" />
          <span className="text-[#9BA8AB]">Gastos:</span>
          <span className="text-rose-400 font-semibold">{formatGTQ(expenses)}</span>
        </div>
        <div className="pt-1 border-t border-[#253745] flex items-center justify-between text-[10px]">
          <span className="text-[#9BA8AB]">Margen Neto:</span>
          <span className={`font-mono font-bold ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatGTQ(net)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// --- GRÁFICA DE BARRAS PRINCIPAL ---
export const BarChartMonthly = ({ transactions = [] }) => {
  // Procesar transacciones reales agrupadas por mes del año actual
  const data = useMemo(() => {
    // Inicializar los 12 meses en 0
    const monthlyTotals = MONTH_NAMES.map((m) => ({
      month: m,
      income: 0,
      expenses: 0,
    }));

    transactions.forEach((tx) => {
      if (!tx.fecha) return;
      const parts = tx.fecha.split('-');
      if (parts.length >= 2) {
        const monthIdx = parseInt(parts[1], 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          if (tx.tipo === 'ingreso') {
            monthlyTotals[monthIdx].income += tx.monto;
          } else if (tx.tipo === 'gasto') {
            monthlyTotals[monthIdx].expenses += tx.monto;
          }
        }
      }
    });

    return monthlyTotals;
  }, [transactions]);

  const hasData = transactions.length > 0;

  return (
    <div className="w-full h-64 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="month"
            stroke="#9BA8AB"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#253745' }}
          />
          <YAxis
            stroke="#9BA8AB"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: '#253745' }}
            tickFormatter={(val) => (val >= 1000 ? `Q${val / 1000}k` : `Q${val}`)}
          />
          <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(37, 55, 69, 0.3)' }} />
          <Bar dataKey="income" fill="#00E5FF" radius={[4, 4, 0, 0]} maxBarSize={16} />
          <Bar dataKey="expenses" fill="#D946EF" radius={[4, 4, 0, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>

      {!hasData && (
        <div className="text-center text-xs text-[#9BA8AB]/70 -mt-24 pb-12 pointer-events-none">
          <span>Aún no hay movimientos registrados. Registra tu primer ingreso o gasto para visualizar la comparativa.</span>
        </div>
      )}
    </div>
  );
};

// --- GRÁFICA DONUT DE CATEGORÍAS ---
const CATEGORY_COLORS = {
  'Webs completas': '#00E5FF',
  'Mantenimiento': '#D946EF',
  'Dominio/Hosting': '#2DD4BF',
  'Consultoría UI/UX': '#F59E0B',
  'Otros': '#818CF8',
};

export const DonutCategories = ({ transactions = [] }) => {
  // Filtrar solo ingresos para calcular de dónde viene la facturación
  const incomeTransactions = useMemo(
    () => transactions.filter((t) => t.tipo === 'ingreso'),
    [transactions]
  );

  const totalIncome = useMemo(
    () => incomeTransactions.reduce((acc, curr) => acc + curr.monto, 0),
    [incomeTransactions]
  );

  const categoryBreakdown = useMemo(() => {
    if (totalIncome === 0) return [];

    const grouped = {};
    incomeTransactions.forEach((t) => {
      const cat = t.categoria || 'Webs completas';
      grouped[cat] = (grouped[cat] || 0) + t.monto;
    });

    return Object.entries(grouped).map(([name, amount]) => {
      const pct = Math.round((amount / totalIncome) * 100);
      return {
        name,
        amount,
        percentage: pct,
        color: CATEGORY_COLORS[name] || '#CCD0CF',
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [incomeTransactions, totalIncome]);

  // Si no hay ingresos todavía
  if (totalIncome === 0 || categoryBreakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="relative w-28 h-28 flex items-center justify-center mb-3">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#06141B" strokeWidth="12" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#253745" strokeWidth="12" strokeDasharray="238" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-[#9BA8AB] font-numeric">Q 0.00</span>
            <span className="text-[9px] text-[#9BA8AB]/60">Sin ingresos</span>
          </div>
        </div>
        <p className="text-xs text-[#9BA8AB]">Registra un cobro de cliente para ver la distribución.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 py-2">
      {/* Gráfico Donut con Recharts */}
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdown}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={50}
              paddingAngle={4}
              stroke="none"
            >
              {categoryBreakdown.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centro de la dona */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] text-[#9BA8AB] uppercase tracking-wider font-medium">Total</span>
          <span className="text-xs font-bold font-numeric text-white leading-tight">
            {formatGTQ(totalIncome)}
          </span>
          <span className="text-[9px] text-emerald-400 font-mono">100%</span>
        </div>
      </div>

      {/* Lista de desglose por categoría */}
      <div className="flex-1 w-full space-y-2.5">
        {categoryBreakdown.map((cat) => (
          <div key={cat.name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-[#CCD0CF] text-[11px] truncate font-medium">{cat.name}</span>
              </div>
              <span className="font-mono text-white text-[11px] font-bold">{cat.percentage}%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#9BA8AB] pl-4 font-numeric">
              <span>Monto:</span>
              <span>{formatGTQ(cat.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
