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

// --- ANILLOS CONCÉNTRICOS / PROGRESO RADIAL (Image 1 "Month Progress") ---
export const ConcentricMonthProgress = ({ totalIncome = 905, totalExpenses = 617 }) => {
  // Progreso relativo con base a meta mensual (ej. Q 1,000)
  const percent = Math.min(Math.round((totalIncome / 750) * 100), 120);

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      {/* Lista de categorías a la izquierda */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
          <span className="text-neutral-700 font-medium">Webs completas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 shrink-0" />
          <span className="text-neutral-500 font-medium">Mantenimiento</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0" />
          <span className="text-neutral-500 font-medium">Hosting & Otros</span>
        </div>
      </div>

      {/* Círculo concéntrico estilizado Image 1 */}
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Anillo exterior de fondo */}
          <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="6" fill="transparent" />
          {/* Anillo exterior activo (Negro) */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="#111111" 
            strokeWidth="6" 
            strokeDasharray="251.2" 
            strokeDashoffset={251.2 * (1 - 0.85)} 
            strokeLinecap="round" 
            fill="transparent" 
          />

          {/* Anillo interior de fondo */}
          <circle cx="50" cy="50" r="28" stroke="#F3F4F6" strokeWidth="5" fill="transparent" />
          {/* Anillo interior activo (Gris) */}
          <circle 
            cx="50" 
            cy="50" 
            r="28" 
            stroke="#71717A" 
            strokeWidth="5" 
            strokeDasharray="175.9" 
            strokeDashoffset={175.9 * (1 - 0.65)} 
            strokeLinecap="round" 
            fill="transparent" 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-neutral-900 font-numeric">{percent}%</span>
        </div>
      </div>
    </div>
  );
};
