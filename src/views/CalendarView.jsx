import React, { useState, useMemo } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  ExternalLink,
  Users,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const CalendarView = ({ onOpenNewEvent, onEditEvent }) => {
  const calendarEvents = useFinancialStore((state) => state.calendarEvents);
  const deleteCalendarEvent = useFinancialStore((state) => state.deleteCalendarEvent);
  const toggleEventCompleted = useFinancialStore((state) => state.toggleEventCompleted);

  // Fecha actual como referencia
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  // Navegación de mes
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    );
  };

  // Calcular días del mes para la cuadrícula
  const monthDays = useMemo(() => {
    // Primer día del mes
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Último día del mes
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    // Determinar día de la semana del primer día (0 domingo, convertimos a lunes = 0)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // domingo es 6

    const days = [];

    // Celdas vacías del mes anterior
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ dayNumber: null, dateString: null });
    }

    // Días del mes
    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateString = `${currentYear}-${monthStr}-${dayStr}`;

      // Contar eventos en este día
      const eventsOnDay = calendarEvents.filter((e) => e.fecha === dateString);

      days.push({
        dayNumber: d,
        dateString,
        events: eventsOnDay,
      });
    }

    return days;
  }, [currentYear, currentMonth, calendarEvents]);

  // Eventos del día seleccionado ordenados por hora
  const selectedDayEvents = useMemo(() => {
    return calendarEvents
      .filter((e) => e.fecha === selectedDate)
      .sort((a, b) => (a.hora_inicio || '').localeCompare(b.hora_inicio || ''));
  }, [calendarEvents, selectedDate]);

  // Próximos eventos en general
  const upcomingEvents = useMemo(() => {
    return [...calendarEvents]
      .filter((e) => !e.completado)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(0, 5);
  }, [calendarEvents]);

  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'Reunión Virtual':
        return 'bg-white text-black font-semibold';
      case 'Cita con Cliente':
        return 'bg-[#1F1F1F] text-white border border-[#383838]';
      case 'Entrega de Proyecto':
        return 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60';
      default:
        return 'bg-[#141414] text-[#A1A1AA] border border-[#262626]';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            Calendario de Citas & Recordatorios
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#111111] text-[#A1A1AA] border border-[#242424]">
              {calendarEvents.length} agendados
            </span>
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Organiza reuniones virtuales, citas presenciales con clientes y horarios de entrega
          </p>
        </div>

        <button
          onClick={() => onOpenNewEvent(selectedDate)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agendar Cita</span>
        </button>
      </div>

      {/* Grid Principal: Calendario Mensual a la izquierda, Agenda a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ==================== CALENDARIO MENSUAL (8 COLS) ==================== */}
        <div className="lg:col-span-7 xl:col-span-8 dashboard-card p-6 space-y-5">
          {/* Cabecera del mes con controles */}
          <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white font-display">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={handleGoToday}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-[#A1A1AA] hover:text-white border border-[#242424] transition-colors"
              >
                Hoy
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-[#050505] hover:bg-[#1A1A1A] text-[#A1A1AA] hover:text-white border border-[#242424] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-[#050505] hover:bg-[#1A1A1A] text-[#A1A1AA] hover:text-white border border-[#242424] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#71717A] py-1">
            {DAY_NAMES.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Cuadrícula de Días */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {monthDays.map((item, idx) => {
              if (!item.dayNumber) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-16 sm:h-20 rounded-xl bg-[#080808]/40 border border-transparent opacity-30"
                  />
                );
              }

              const isSelected = item.dateString === selectedDate;
              const isToday =
                item.dateString ===
                `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              const hasEvents = item.events && item.events.length > 0;

              return (
                <button
                  key={item.dateString}
                  onClick={() => setSelectedDate(item.dateString)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between text-left transition-all relative group ${
                    isSelected
                      ? 'bg-[#1C1C1C] border-white text-white shadow-lg'
                      : 'bg-[#080808] border-[#222222] text-[#A1A1AA] hover:border-[#3D3D3D] hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-numeric font-bold rounded-md px-1 ${
                        isToday
                          ? 'bg-white text-black'
                          : isSelected
                          ? 'text-white'
                          : 'text-[#D4D4D8]'
                      }`}
                    >
                      {item.dayNumber}
                    </span>

                    {hasEvents && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white text-black font-bold">
                        {item.events.length}
                      </span>
                    )}
                  </div>

                  {/* Indicadores de eventos en el día */}
                  <div className="w-full space-y-0.5 overflow-hidden">
                    {item.events && item.events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[9px] truncate px-1 py-0.5 rounded bg-[#171717] text-[#E4E4E7] font-medium"
                      >
                        {ev.hora_inicio ? `${ev.hora_inicio} ` : ''}{ev.titulo}
                      </div>
                    ))}
                    {item.events && item.events.length > 2 && (
                      <span className="text-[8px] text-[#A1A1AA] block leading-none">
                        +{item.events.length - 2} más
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== AGENDA DEL DÍA SELECCIONADO (4 COLS) ==================== */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="dashboard-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-mono block">
                  Agenda del Día
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  {formatDate(selectedDate)}
                </h3>
              </div>

              <button
                onClick={() => onOpenNewEvent(selectedDate)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Cita</span>
              </button>
            </div>

            {/* Lista de citas en este día */}
            {selectedDayEvents.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#71717A] space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-[#333333]" />
                <p>No tienes citas agendadas para esta fecha.</p>
                <button
                  onClick={() => onOpenNewEvent(selectedDate)}
                  className="text-white underline hover:text-[#E4E4E7]"
                >
                  Agendar una cita aquí
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      evt.completado
                        ? 'bg-[#080808] border-[#1C1C1C] opacity-60'
                        : 'bg-[#111111] border-[#262626] hover:border-[#3D3D3D]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleEventCompleted(evt.id)}
                          title={evt.completado ? 'Marcar pendiente' : 'Marcar completado'}
                          className="text-[#A1A1AA] hover:text-white"
                        >
                          {evt.completado ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span
                          className={`text-xs font-bold font-display ${
                            evt.completado ? 'line-through text-[#71717A]' : 'text-white'
                          }`}
                        >
                          {evt.titulo}
                        </span>
                      </div>

                      <span className={`text-[9px] px-2 py-0.5 rounded-full ${getBadgeColor(evt.tipo)}`}>
                        {evt.tipo}
                      </span>
                    </div>

                    {/* Horario y Cliente */}
                    <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA] pl-6 font-mono mb-2">
                      <span className="flex items-center gap-1 text-white">
                        <Clock className="w-3 h-3 text-[#A1A1AA]" />
                        {evt.hora_inicio} - {evt.hora_fin}
                      </span>
                      {evt.cliente && (
                        <span className="flex items-center gap-1 truncate">
                          <Users className="w-3 h-3 text-[#71717A]" />
                          {evt.cliente}
                        </span>
                      )}
                    </div>

                    {/* Enlace de reunión si existe */}
                    {evt.enlace && (
                      <div className="pl-6 mb-2">
                        <a
                          href={evt.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-white hover:underline bg-[#050505] px-2.5 py-1 rounded-lg border border-[#242424]"
                        >
                          <Video className="w-3.5 h-3.5 text-white" />
                          <span>Entrar a la videollamada</span>
                          <ExternalLink className="w-3 h-3 text-[#71717A]" />
                        </a>
                      </div>
                    )}

                    {/* Notas */}
                    {evt.notas && (
                      <p className="text-[11px] text-[#888888] pl-6 leading-relaxed">
                        {evt.notas}
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex justify-end gap-2 pt-2 mt-2 border-t border-[#1F1F1F]">
                      <button
                        onClick={() => onEditEvent(evt)}
                        className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Editar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la cita "${evt.titulo}"?`)) {
                            deleteCalendarEvent(evt.id);
                          }
                        }}
                        className="text-xs text-[#A1A1AA] hover:text-rose-400 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos compromisos rápidos */}
          <div className="dashboard-card p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Próximos Compromisos
            </h4>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-[#71717A]">No tienes citas pendientes programadas.</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-lg bg-[#050505] border border-[#242424] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-white block truncate">{ev.titulo}</span>
                      <span className="text-[10px] text-[#A1A1AA] font-mono">
                        {formatDate(ev.fecha)} • {ev.hora_inicio}
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#171717] text-[#D4D4D8] shrink-0">
                      {ev.tipo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
