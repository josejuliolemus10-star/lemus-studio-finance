import React, { useState } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, ArrowUpRight, ArrowDownRight, DollarSign, Calendar, Tag, UserCheck, AlertCircle } from 'lucide-react';
import { getTodayString } from '../utils/formatters';

export const ModalTransaction = ({ isOpen, onClose }) => {
  const addTransaction = useFinancialStore((state) => state.addTransaction);
  const clients = useFinancialStore((state) => state.clients);

  const [tipo, setTipo] = useState('ingreso'); // 'ingreso' | 'gasto'
  const [monto, setMonto] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState(getTodayString());
  const [categoria, setCategoria] = useState('Webs completas');
  const [clienteProveedor, setClienteProveedor] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!monto || parseFloat(monto) <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }
    if (!motivo.trim()) {
      setError('Por favor ingresa el motivo o concepto del movimiento');
      return;
    }

    addTransaction({
      tipo,
      monto: parseFloat(monto),
      motivo,
      fecha,
      categoria,
      id_cliente_o_proveedor: clienteProveedor || (tipo === 'ingreso' ? 'Cliente General' : 'Proveedor'),
    });

    // Limpiar formulario y cerrar
    setMonto('');
    setMotivo('');
    setError('');
    onClose();
  };

  const incomeCategories = ['Webs completas', 'Mantenimiento', 'Dominio/Hosting', 'Consultoría UI/UX', 'Otros'];
  const expenseCategories = ['Servidores', 'Dominio/Hosting', 'Software/SaaS', 'Marketing', 'Equipo & Freelance', 'Operativo'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#11212D] border border-[#253745] rounded-2xl shadow-2xl p-6 relative text-[#CCD0CF] overflow-hidden">
        {/* Glow ambient */}
        <div className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20 ${tipo === 'ingreso' ? 'bg-[#00E5FF]' : 'bg-[#F43F5E]'}`} />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#253745]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${tipo === 'ingreso' ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
              {tipo === 'ingreso' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Registrar Movimiento</h2>
              <p className="text-xs text-[#9BA8AB]">Añade un nuevo flujo de caja a Lemus Studio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#9BA8AB] hover:text-white rounded-lg hover:bg-[#253745]/50 transition-colors">
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

          {/* Toggle Ingreso / Gasto */}
          <div className="grid grid-cols-2 gap-2 bg-[#06141B] p-1.5 rounded-xl border border-[#253745]">
            <button
              type="button"
              onClick={() => {
                setTipo('ingreso');
                setCategoria('Webs completas');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all ${
                tipo === 'ingreso'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm'
                  : 'text-[#9BA8AB] hover:text-[#CCD0CF]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>+ Ingreso (Cobro)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTipo('gasto');
                setCategoria('Servidores');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all ${
                tipo === 'gasto'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-[#9BA8AB] hover:text-[#CCD0CF]'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>- Gasto (Egreso)</span>
            </button>
          </div>

          {/* Monto & Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">
                Monto en Quetzales (GTQ) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold font-numeric text-[#00E5FF]">Q</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="ej. 900.00"
                  className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] font-numeric text-sm placeholder-[#9BA8AB]/40 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">Fecha del Movimiento *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] text-xs focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>
          </div>

          {/* Motivo / Concepto */}
          <div>
            <label className="block text-[#9BA8AB] font-medium mb-1.5">Motivo / Concepto *</label>
            <input
              type="text"
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={tipo === 'ingreso' ? 'ej. Anticipo 50% Sitio Web Inmobiliaria' : 'ej. Pago VPS AWS & Cloudflare mensual'}
              className="w-full bg-[#06141B] border border-[#253745] rounded-xl px-3 py-2.5 text-[#CCD0CF] text-xs placeholder-[#9BA8AB]/40 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* Categoría & Cliente/Proveedor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">Categoría</label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] text-xs focus:outline-none focus:border-[#00E5FF]"
                >
                  {(tipo === 'ingreso' ? incomeCategories : expenseCategories).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#9BA8AB] font-medium mb-1.5">
                {tipo === 'ingreso' ? 'Cliente Asociado' : 'Proveedor / Servicio'}
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA8AB]" />
                <input
                  list="clients-list"
                  type="text"
                  value={clienteProveedor}
                  onChange={(e) => setClienteProveedor(e.target.value)}
                  placeholder={tipo === 'ingreso' ? 'Selecciona o escribe cliente' : 'ej. AWS, Namecheap, Adobe'}
                  className="w-full bg-[#06141B] border border-[#253745] rounded-xl pl-9 pr-3 py-2.5 text-[#CCD0CF] text-xs focus:outline-none focus:border-[#00E5FF]"
                />
                <datalist id="clients-list">
                  {clients.map((c) => (
                    <option key={c.id} value={c.empresa || c.nombre}>{c.nombre}</option>
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#9BA8AB] hover:text-white transition-colors text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                tipo === 'ingreso'
                  ? 'bg-[#00E5FF] text-[#06141B] hover:bg-[#00E5FF]/90 shadow-glow-cyan'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
            >
              <span>Registrar {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
