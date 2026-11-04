import React, { useState, useMemo, useEffect } from 'react';
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
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { ModalConfirmDelete } from '../components/ModalConfirmDelete';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const CalendarView = ({
  onOpenAddModal,
  onOpenEditModal,
  activeDate = null,
  onDateChange = null,
}) => {
  const calendarEvents = useFinancialStore((state) => state.calendarEvents);
  const deleteCalendarEvent = useFinancialStore((state) => state.deleteCalendarEvent);
  const toggleEventCompleted = useFinancialStore((state) => state.toggleEventCompleted);

  // Fecha actual de referencia
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(activeDate || todayStr);
  const [agendaTab, setAgendaTab] = useState('dia'); // 'dia' | 'todas'

  // Estado para modal de confirmación de eliminación
  const [deletingId, setDeletingId] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Sincronizar cuando activeDate cambie externamente (ej. tras guardar cita)
  useEffect(() => {
    if (activeDate) {
      setSelectedDate(activeDate);
      const parts = activeDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setCurrentYear(y);
          setCurrentMonth(m);
        }
      }
    }
  }, [activeDate]);

  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    setAgendaTab('dia');
    if (onDateChange) onDateChange(dateStr);
  };

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
    handleSelectDate(todayStr);
  };

  // Cuadrícula de días
  const monthDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ dayNumber: null, dateString: null });
    }

    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateString = `${currentYear}-${monthStr}-${dayStr}`;
      const eventsOnDay = calendarEvents.filter((e) => e.fecha === dateString);

      days.push({
        dayNumber: d,
        dateString,
        events: eventsOnDay,
      });
    }

    return days;
  }, [currentYear, currentMonth, calendarEvents]);

  // Eventos del día seleccionado
  const selectedDayEvents = useMemo(() => {
    return calendarEvents
      .filter((e) => e.fecha === selectedDate)
      .sort((a, b) => (a.hora_inicio || '').localeCompare(b.hora_inicio || ''));
  }, [calendarEvents, selectedDate]);

  // Todas las citas ordenadas cronológicamente
  const allEventsSorted = useMemo(() => {
    return [...calendarEvents].sort((a, b) => {
      const diff = new Date(a.fecha) - new Date(b.fecha);
      if (diff !== 0) return diff;
      return (a.hora_inicio || '').localeCompare(b.hora_inicio || '');
    });
  }, [calendarEvents]);

  const requestDelete = (evt) => {
    setEventToDelete(evt);
    setDeletingId(evt.id);
  };

  const confirmDelete = () => {
    if (!eventToDelete) return;
    deleteCalendarEvent(eventToDelete.id);
    setDeletingId(null);
    setEventToDelete(null);
  };

  const jumpToEventDate = (dateStr) => {
    handleSelectDate(dateStr);
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      if (!isNaN(y) && !isNaN(m)) {
        setCurrentYear(y);
        setCurrentMonth(m);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Modal de confirmación para eliminar evento */}
      <ModalConfirmDelete
        isOpen={Boolean(deletingId)}
        onClose={() => { setDeletingId(null); setEventToDelete(null); }}
        onConfirm={confirmDelete}
        title={`¿Eliminar cita "${eventToDelete?.titulo}"?`}
        message="¿Estás seguro de que deseas eliminar este evento o recordatorio de tu agenda?"
      />

      {/* Cuadrito 1: Header del Calendario */}
      <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display">
              Calendario de Citas & Horarios
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
              {calendarEvents.length} agendados
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Organiza reuniones con clientes, entregas de desarrollo y recordatorios de la agencia
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal(selectedDate)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agendar Cita</span>
        </button>
      </div>

      {/* Cuadrito 2: Grid Principal (Calendario a la izquierda, Agenda a la derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ==================== CALENDARIO MENSUAL (7 u 8 COLS) ==================== */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-[28px] p-6 border border-neutral-200/80 shadow-sm space-y-5">
          {/* Cabecera del mes con controles */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-neutral-900 font-display capitalize">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={handleGoToday}
                className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 border border-neutral-200 transition-all"
              >
                Hoy
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                title="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                title="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-neutral-400 py-1">
            {DAY_NAMES.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Cuadrícula de Días */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((item, idx) => {
              if (!item.dayNumber) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-16 sm:h-20 rounded-2xl bg-neutral-50/50 border border-transparent opacity-40"
                  />
                );
              }

              const isSelected = item.dateString === selectedDate;
              const isToday = item.dateString === todayStr;
              const hasEvents = item.events && item.events.length > 0;

              return (
                <button
                  key={item.dateString}
                  onClick={() => handleSelectDate(item.dateString)}
                  className={`h-16 sm:h-20 p-2 rounded-2xl border flex flex-col justify-between text-left transition-all relative group ${
                    isToday
                      ? 'bg-white border-2 border-white ring-4 ring-white/60 shadow-[0_0_30px_rgba(255,255,255,0.95),0_10px_20px_rgba(0,0,0,0.1)] text-black font-extrabold scale-[1.03] z-20'
                      : isSelected
                      ? 'bg-[#181818] border-black text-white shadow-md'
                      : 'bg-[#111111] border-neutral-800 text-neutral-300 hover:border-neutral-500 hover:bg-[#1C1C1C]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-numeric font-bold rounded-lg px-1.5 py-0.5 ${
                        isToday
                          ? 'bg-black text-white text-[10px] font-extrabold tracking-wider'
                          : isSelected
                          ? 'text-white'
                          : 'text-neutral-200'
                      }`}
                    >
                      {item.dayNumber}
                    </span>

                    {/* Badge de HOY */}
                    {isToday && (
                      <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-400 text-black shadow-sm animate-pulse">
                        HOY
                      </span>
                    )}

                    {hasEvents && !isToday && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white text-black font-bold shadow-sm">
                        {item.events.length}
                      </span>
                    )}
                  </div>

                  {/* Indicadores de eventos en el día */}
                  <div className="w-full space-y-0.5 overflow-hidden">
                    {item.events && item.events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDate(item.dateString);
                          onOpenEditModal(ev);
                        }}
                        className={`text-[9px] truncate px-1.5 py-0.5 rounded font-medium cursor-pointer ${
                          isToday
                            ? 'bg-neutral-100 hover:bg-black hover:text-white text-neutral-900 border border-neutral-300'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                        }`}
                        title={`${ev.hora_inicio || ''} ${ev.titulo} (Clic para ver/editar)`}
                      >
                        {ev.hora_inicio ? `${ev.hora_inicio} ` : ''}{ev.titulo}
                      </div>
                    ))}
                    {item.events && item.events.length > 2 && (
                      <span className={`text-[8px] block leading-none font-bold ${isToday ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        +{item.events.length - 2} más
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== AGENDA DEL DÍA & LISTA DE CITAS (4 COLS) ==================== */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          <div className="bg-white rounded-[28px] p-6 border border-neutral-200/80 shadow-sm space-y-4">
            
            {/* Cabecera y botón de acción */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                  Control de Citas
                </span>
                <h3 className="text-sm font-bold text-neutral-900 font-display">
                  {agendaTab === 'dia' ? formatDate(selectedDate) : 'Todas las Citas Registradas'}
                </h3>
              </div>

              <button
                onClick={() => onOpenAddModal(selectedDate)}
                className="px-3 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition active:scale-95 shadow-sm"
              >
                + Cita
              </button>
            </div>

            {/* Pestañas de Vista en Agenda: Día actual / Todas */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setAgendaTab('dia')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                  agendaTab === 'dia'
                    ? 'bg-white text-neutral-900 shadow-sm font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Día Seleccionado ({selectedDayEvents.length})
              </button>
              <button
                onClick={() => setAgendaTab('todas')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                  agendaTab === 'todas'
                    ? 'bg-white text-neutral-900 shadow-sm font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Ver Todas ({calendarEvents.length})
              </button>
            </div>

            {/* VISTA 1: CITAS DEL DÍA SELECCIONADO */}
            {agendaTab === 'dia' && (
              <>
                {selectedDayEvents.length === 0 ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/70 rounded-2xl border border-neutral-100 p-5">
                    <CalendarIcon className="w-8 h-8 mb-2 text-neutral-300" />
                    <p className="text-xs font-bold text-neutral-800">
                      Sin citas para el {formatDate(selectedDate)}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-xs leading-snug">
                      ¿Tienes una reunión, llamada o entrega este día?
                    </p>
                    <button
                      onClick={() => onOpenAddModal(selectedDate)}
                      className="mt-3.5 px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition active:scale-95 shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Agendar para este día</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50 hover:bg-white hover:shadow-md transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => toggleEventCompleted(evt.id)}
                              className="mt-0.5 text-neutral-900 transition"
                            >
                              {evt.completado ? (
                                <CheckCircle2 className="w-4 h-4 fill-black text-white" />
                              ) : (
                                <Circle className="w-4 h-4 text-neutral-300 hover:text-black" />
                              )}
                            </button>
                            <div>
                              <h4 className={`text-xs font-bold leading-tight ${evt.completado ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                                {evt.titulo}
                              </h4>
                              <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-neutral-400" />
                                {evt.hora_inicio || 'Horario'} - {evt.hora_fin || 'definir'}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black text-white shrink-0">
                            {evt.tipo}
                          </span>
                        </div>

                        {evt.cliente && (
                          <p className="text-[11px] text-neutral-600 flex items-center gap-1.5 pl-6">
                            <Users className="w-3 h-3 text-neutral-400" />
                            <span>{evt.cliente}</span>
                          </p>
                        )}

                        {evt.enlace && (
                          <div className="pl-6 pt-1">
                            <a
                              href={evt.enlace}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:underline bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-none hover:shadow-sm transition"
                            >
                              <Video className="w-3.5 h-3.5 text-neutral-700" />
                              <span>Unirse a videollamada</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}

                        {evt.notas && (
                          <p className="text-[11px] text-neutral-500 bg-white/70 p-2 rounded-xl border border-neutral-100 ml-6">
                            {evt.notas}
                          </p>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 text-xs">
                          <button
                            onClick={() => onOpenEditModal(evt)}
                            className="text-neutral-500 hover:text-black flex items-center gap-1 text-[11px] font-semibold"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => requestDelete(evt)}
                            className="text-neutral-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-semibold"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* VISTA 2: TODAS LAS CITAS AGENDADAS */}
            {agendaTab === 'todas' && (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {allEventsSorted.length === 0 ? (
                  <div className="py-8 text-center text-neutral-400 text-xs">
                    No hay citas registradas en el calendario.
                  </div>
                ) : (
                  allEventsSorted.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => jumpToEventDate(evt.fecha)}
                      className="p-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50 hover:bg-white hover:shadow-md transition-all space-y-1.5 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-black text-white">
                          {formatDate(evt.fecha)}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500">
                          {evt.hora_inicio || 'Horario'}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold leading-tight ${evt.completado ? 'line-through text-neutral-400' : 'text-neutral-900 group-hover:text-black'}`}>
                        {evt.titulo}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                        <span>{evt.cliente || evt.tipo}</span>
                        <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                          <span>Ver en día</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
