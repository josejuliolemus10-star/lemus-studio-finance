import React, { useState, useEffect } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { X, Globe, User, Tag, Link2, Sparkles, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import { getTodayString } from '../utils/formatters';

export const ModalWebsite = ({ isOpen, onClose, websiteToEdit = null }) => {
  const addWebsite = useFinancialStore((state) => state.addWebsite);
  const updateWebsite = useFinancialStore((state) => state.updateWebsite);
  const deleteWebsite = useFinancialStore((state) => state.deleteWebsite);
  const clients = useFinancialStore((state) => state.clients);

  const [titulo, setTitulo] = useState('');
  const [cliente, setCliente] = useState('');
  const [url, setUrl] = useState('');
  const [categoria, setCategoria] = useState('Landing Page');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(getTodayString());
  const [error, setError] = useState('');

  // Sincronizar inmediatamente los campos cada vez que el modal se abre o cambia el sitio a editar
  useEffect(() => {
    if (isOpen) {
      setTitulo(websiteToEdit?.titulo || '');
      setCliente(websiteToEdit?.cliente || '');
      setUrl(websiteToEdit?.url || '');
      setCategoria(websiteToEdit?.categoria || 'Landing Page');
      setDescripcion(websiteToEdit?.descripcion || '');
      setFecha(websiteToEdit?.fecha || getTodayString());
      setError('');
    }
  }, [isOpen, websiteToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Por favor indica el título del sitio web');
      return;
    }
    if (!url.trim()) {
      setError('Por favor ingresa la URL o enlace del sitio');
      return;
    }

    // Asegurar formato https://
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    if (websiteToEdit) {
      updateWebsite(websiteToEdit.id, {
        titulo: titulo.trim(),
        cliente: cliente.trim() || 'Proyecto Propio',
        url: finalUrl,
        categoria,
        descripcion: descripcion.trim(),
        fecha,
      });
    } else {
      addWebsite({
        titulo: titulo.trim(),
        cliente: cliente.trim() || 'Proyecto Propio',
        url: finalUrl,
        categoria,
        descripcion: descripcion.trim(),
        fecha,
      });
    }

    setTitulo('');
    setCliente('');
    setUrl('');
    setDescripcion('');
    setError('');
    onClose();
  };

  const handleDelete = () => {
    if (websiteToEdit) {
      deleteWebsite(websiteToEdit.id);
      onClose();
    }
  };

  const categories = [
    'Inmobiliaria',
    'E-Commerce',
    'Landing Page',
    'Corporativa',
    'Restaurante / Menú',
    'Portafolio',
    'SaaS / Web App',
    'Médico / Salud',
    'Otro'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0D0D0D] border border-[#242424] rounded-2xl shadow-2xl p-6 relative text-white overflow-hidden">
        {/* Glow sutil */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                {websiteToEdit ? 'Editar Sitio Web' : 'Registrar Sitio Web Creado'}
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Guarda enlaces y componentes reciclables de Lemus Studio
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

          {/* Título de la Web */}
          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5">Título del Sitio Web *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="ej. Portal Inmobiliario Santander"
              className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-[#71717A] focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Para Quién & Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A1A1AA] font-medium mb-1.5">¿Para quién se hizo? (Cliente)</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  list="client-website-options"
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="ej. Inmobiliaria Santander"
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-xs placeholder-[#71717A] focus:outline-none focus:border-white transition-colors"
                />
                <datalist id="client-website-options">
                  {clients.map((c) => (
                    <option key={c.id} value={c.empresa || c.nombre} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-[#A1A1AA] font-medium mb-1.5">Categoría de la Web</label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* URL / Enlace */}
          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5">Enlace / URL de la Web *</label>
            <div className="relative">
              <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ej. santander-inmuebles.gt o https://..."
                className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-9 pr-3.5 py-2.5 text-white text-xs font-mono placeholder-[#71717A] focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Notas para Reciclaje / Componentes Destacados */}
          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Componentes Reciclables / Funcionalidades Reutilizables</span>
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="ej. Hero con buscador avanzado, cotizador interactivo en cuotas, carrito con pasarela BAC, navbar flotante animado..."
              className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white text-xs placeholder-[#71717A] focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          {/* Fecha de Entrega/Lanzamiento */}
          <div>
            <label className="block text-[#A1A1AA] font-medium mb-1.5">Fecha de Creación o Entrega</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-[#050505] border border-[#242424] rounded-xl pl-9 pr-3.5 py-2 text-white text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#242424]">
            {websiteToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 text-xs font-medium transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Sitio</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[#A1A1AA] hover:text-white transition-colors text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
              >
                {websiteToEdit ? 'Guardar Cambios' : 'Agregar al Catálogo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
