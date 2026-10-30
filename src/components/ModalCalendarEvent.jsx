import React, { useState } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, Calendar as CalendarIcon, Clock, Users, Video, FileText, Trash2, AlertCircle } from 'lucide-react';
import { getTodayString } from '../utils/formatters';

export const ModalCalendarEvent = ({ isOpen, onClose, eventToEdit = null, defaultDate = null }) => {
  const addCalendarEvent = useFinancialStore((state) => state.addCalendarEvent);
  const updateCalendarEvent = useFinancialStore((state) => state.updateCalendarEvent);
  const deleteCalendarEvent = useFinancialStore((state) => state.deleteCalendarEvent);
  const clients = useFinancialStore((state) => state.clients);

  const [titulo, setTitulo] = useState(eventToEdit?.titulo || '');
  const [fecha, setFecha] = useState(eventToEdit?.fecha || defaultDate || getTodayString());
  const [horaInicio, setHoraInicio] = useState(eventToEdit?.hora_inicio || '10:00');
  const [horaFin, setHoraFin] = useState(eventToEdit?.hora_fin || '11:00');
  const [tipo, setTipo] = useState(eventToEdit?.tipo || 'Cita con Cliente');
  const [cliente, setCliente] = useState(eventToEdit?.cliente || '');
  const [enlace, setEnlace] = useState(eventToEdit?.enlace || '');
  const [notas, setNotas] = useState(eventToEdit?.notas || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Por favor indica el título de la cita o recordatorio');
      return;
    }
    if (!fecha) {
      setError('Por favor selecciona una fecha');
      return;
    }

    if (eventToEdit) {
      updateCalendarEvent(eventToEdit.id, {
        titulo,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        tipo,
        cliente,
        enlace,
        notas,
      });
    } else {
      addCalendarEvent({
        titulo,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        tipo,
        cliente,
        enlace,
        notas,
      });
    }

    setTitulo('');
    setNotas('');
    setError('');
    onClose();
  };

  const handleDelete = () => {
    if (eventToEdit && window.confirm(`¿Eliminar la cita "${eventToEdit.titulo}"?`)) {
      deleteCalendarEvent(eventToEdit.id);
      onClose();
    }
  };

  const eventTypes = [
    'Cita con Cliente',
    'Reunión Virtual',
    'Entrega de Proyecto',
    'Recordatorio',
    'Llamada Comercial'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl p-6 relative text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                {eventToEdit ? 'Editar Cita / Horario' : 'Agendar Cita o Recordatorio'}
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Control de agenda y reuniones para Lemus Studio
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Título de la Cita */}
          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5">Título de la Cita / Asunto *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="ej. Demo de Avance Fase 2 o Llamada de Propuesta"
              className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-[#71717A] focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Fecha y Horarios (Inicio & Fin) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#A1A1AA] font-medium mb-1.5">Fecha *</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A1A1AA] font-medium mb-1.5">Hora Inicio *</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="time"
                  required
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-8 pr-2 py-2 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A1A1AA] font-medium mb-1.5">Hora Fin *</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="time"
                  required
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-8 pr-2 py-2 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Cita & Cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A1A1AA] font-medium mb-1.5">Tipo de Evento</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-white transition-colors cursor-pointer"
              >
                {eventTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#A1A1AA] font-medium mb-1.5">Cliente Relacionado</label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  list="client-event-options"
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="ej. Inmobiliaria Santander"
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-9 pr-3 py-2.5 text-white text-xs placeholder-[#71717A] focus:outline-none focus:border-white transition-colors"
                />
                <datalist id="client-event-options">
                  {clients.map((c) => (
                    <option key={c.id} value={c.empresa || c.nombre} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Enlace de Reunión (Google Meet / Zoom) */}
          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5">Enlace de Reunión (Meet / Zoom / Teams)</label>
            <div className="relative">
              <Video className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                value={enlace}
                onChange={(e) => setEnlace(e.target.value)}
                placeholder="ej. https://meet.google.com/..."
                className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-9 pr-3 py-2.5 text-white text-xs font-mono placeholder-[#71717A] focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Notas Adicionales */}
          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5">Notas o Puntos a Tratar</label>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Detalles sobre lo que se va a revisar..."
              className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white text-xs placeholder-[#71717A] focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#242424]">
            {eventToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Cita</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[#A1A1AA] hover:text-white transition-colors text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {eventToEdit ? 'Guardar Cambios' : 'Agendar Cita'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
