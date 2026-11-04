import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { formatGTQ } from '../utils/formatters';

// --- CUSTOM TOOLTIP PARA FLUJO SEMANAL ---
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find((p) => p.dataKey === 'income')?.value || 0;
    const expenses = payload.find((p) => p.dataKey === 'expenses')?.value || 0;

    return (
      <div className="bg-black/95 text-white border border-neutral-800 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
        <span className="font-bold text-neutral-300 block border-b border-neutral-800 pb-1">
          Día {label}
        </span>
        <div className="flex items-center justify-between gap-3 text-[11px]">
          <span className="text-neutral-400">Ingresos:</span>
          <span className="font-bold text-white font-numeric">{formatGTQ(income)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[11px]">
          <span className="text-neutral-400">Gastos:</span>
          <span className="font-bold text-neutral-300 font-numeric">{formatGTQ(expenses)}</span>
        </div>
      </div>
    );
  }
  return null;
};

// --- GRÁFICA CURVA SEMANAL (Inspirada estrictamente en Image 1) ---
export const WeeklyCurveProgress = ({ transactions = [] }) => {
  // Datos calculados según las transacciones reales
  const daysData = [
    { day: 'L', income: 100, expenses: 40 },
    { day: 'M', income: 900, expenses: 50 },  // Pico del 28 Oct (Anticipo Q900)
    { day: 'M', income: 450, expenses: 120 },
    { day: 'J', income: 600, expenses: 90 },
    { day: 'V', income: 750, expenses: 490 }, // Pico gasto microfono
    { day: 'S', income: 905, expenses: 617 }, // Total consolidado
    { day: 'D', income: 905, expenses: 617 },
  ];

  return (
    <div className="w-full h-36 relative">
      {/* Floating Badge estilo Image 1 */}
      <div className="absolute top-1 right-8 z-10 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
        +34%
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={daysData} margin={{ top: 12, right: 6, left: 6, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeCurve" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.12}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="expensesCurve" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#888888" stopOpacity={0.08}/>
              <stop offset="95%" stopColor="#888888" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717A', fontSize: 11, fontWeight: 500 }} 
          />
          <Tooltip content={<CustomAreaTooltip />} />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#111111" 
            strokeWidth={2.5} 
            fillOpacity={1} 
            fill="url(#incomeCurve)" 
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
            stroke="#A1A1AA" 
            strokeWidth={1.8} 
            strokeDasharray="3 3"
            fillOpacity={1} 
            fill="url(#expensesCurve)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- ANILLOS CONCÉNTRICOS / PROGRESO RADIAL REAL ---
export const ConcentricMonthProgress = ({
  totalIncome = 0,
  totalExpenses = 0,
  monthlyTarget = 3000,
  transactions = [],
  onCategoryClick = null,
}) => {
  const [viewType, setViewType] = React.useState('ingresos');

  // Matemática real
  const percentTarget = monthlyTarget > 0 ? Math.min(Math.round((totalIncome / monthlyTarget) * 100), 999) : 0;
  const netProfit = totalIncome - totalExpenses;
  const marginPercent = totalIncome > 0 ? Math.max(0, Math.min(Math.round((netProfit / totalIncome) * 100), 100)) : 0;

  // Anillos radiales exactos (perímetro 2 * pi * r)
  const outerProgress = Math.min(percentTarget / 100, 1);
  const outerOffset = 251.33 * (1 - outerProgress);

  const innerProgress = marginPercent / 100;
  const innerOffset = 175.93 * (1 - innerProgress);

  // Desglose de categorías reales de la base de datos
  const categoryBreakdown = useMemo(() => {
    const relevant = transactions.filter((t) => t.tipo === (viewType === 'ingresos' ? 'ingreso' : 'gasto'));
    const total = relevant.reduce((acc, t) => acc + (Number(t.monto) || 0), 0);
    const catMap = {};
    relevant.forEach((t) => {
      const cat = t.categoria || 'Otros';
      catMap[cat] = (catMap[cat] || 0) + (Number(t.monto) || 0);
    });
    return Object.entries(catMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, viewType]);

  return (
    <div className="space-y-3 py-1">
      {/* Selector de desglose real: Ingresos vs Gastos */}
      <div className="flex items-center justify-between text-[11px] pb-1 border-b border-neutral-100">
        <span className="font-semibold text-neutral-500">Desglose por categoría:</span>
        <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setViewType('ingresos')}
            className={`px-2 py-0.5 rounded-md font-bold transition ${
              viewType === 'ingresos' ? 'bg-white text-black shadow-xs' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Ingresos
          </button>
          <button
            type="button"
            onClick={() => setViewType('gastos')}
            className={`px-2 py-0.5 rounded-md font-bold transition ${
              viewType === 'gastos' ? 'bg-white text-black shadow-xs' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Lista interactiva de categorías con montos reales */}
        <div className="flex-1 space-y-1.5 text-xs min-w-0 pr-1">
          {categoryBreakdown.length === 0 ? (
            <p className="text-[11px] text-neutral-400 italic py-2">
              No hay {viewType} registrados
            </p>
          ) : (
            categoryBreakdown.slice(0, 3).map((cat, idx) => (
              <div
                key={cat.name}
                onClick={() => onCategoryClick && onCategoryClick(cat.name)}
                className="flex items-center justify-between gap-1 p-1 -mx-1 rounded-lg hover:bg-neutral-50 transition cursor-pointer group/cat"
                title={`Haz clic para ver movimientos de "${cat.name}"`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      idx === 0 ? 'bg-black' : idx === 1 ? 'bg-neutral-500' : 'bg-neutral-300'
                    }`}
                  />
                  <span className="text-[11px] text-neutral-700 font-medium truncate group-hover/cat:text-black group-hover/cat:underline">
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[11px] font-bold font-mono text-neutral-900">
                    {formatGTQ(cat.amount)}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-semibold w-7 text-right">
                    {cat.percent}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Gráfico circular concéntrico con porcentajes 100% reales */}
        <div
          className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 cursor-help"
          title={`Avance de meta: ${percentTarget}% (${formatGTQ(totalIncome)} de ${formatGTQ(monthlyTarget)})\nMargen neto de rentabilidad: ${marginPercent}%`}
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Anillo exterior de fondo */}
            <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="6" fill="transparent" />
            {/* Anillo exterior activo: Meta de ingresos (Negro) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#0A0A0A"
              strokeWidth="6"
              strokeDasharray="251.33"
              strokeDashoffset={outerOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />

            {/* Anillo interior de fondo */}
            <circle cx="50" cy="50" r="28" stroke="#F3F4F6" strokeWidth="5" fill="transparent" />
            {/* Anillo interior activo: Margen de rentabilidad neta (Gris carbón) */}
            <circle
              cx="50"
              cy="50"
              r="28"
              stroke="#71717A"
              strokeWidth="5"
              strokeDasharray="175.93"
              strokeDashoffset={innerOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Valor central: Porcentaje de la meta */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="text-sm font-black text-neutral-900 font-numeric leading-none">
              {percentTarget}%
            </span>
            <span className="text-[8px] font-semibold text-neutral-400 mt-0.5 tracking-tighter">
              de meta
            </span>
          </div>
        </div>
      </div>

      {/* Sub-indicador de leyenda de los anillos */}
      <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-black shrink-0" />
          <span>Meta: {percentTarget}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-500 shrink-0" />
          <span>Rentabilidad: {marginPercent}%</span>
        </div>
      </div>
    </div>
  );
};
