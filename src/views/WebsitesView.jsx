import React, { useState, useMemo } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { Plus, Globe, ExternalLink, Copy, Check, Trash2, Edit3, Sparkles, Tag, User, Search } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const WebsitesView = ({ onOpenNewWebsite, onEditWebsite }) => {
  const websites = useFinancialStore((state) => state.websites);
  const deleteWebsite = useFinancialStore((state) => state.deleteWebsite);
  const addToast = useFinancialStore((state) => state.addToast);

  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Categorías presentes
  const categories = useMemo(() => {
    const list = ['Todas', ...new Set(websites.map((w) => w.categoria).filter(Boolean))];
    return list;
  }, [websites]);

  // Filtrado
  const filteredWebsites = useMemo(() => {
    return websites.filter((w) => {
      const matchCat = activeCategory === 'Todas' || w.categoria === activeCategory;
      const matchSearch = !searchQuery.trim() ||
        w.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.descripcion && w.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [websites, activeCategory, searchQuery]);

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('📋 Enlace copiado al portapapeles', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            Catálogo de Páginas Web Creadas
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#111111] text-[#A1A1AA] border border-[#242424]">
              {websites.length} sitios
            </span>
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Repositorio visual de proyectos desarrollados por Lemus Studio para reciclaje de código y componentes
          </p>
        </div>

        <button
          onClick={onOpenNewWebsite}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#E4E4E7] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Sitio Web</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Pills de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-[#0D0D0D] text-[#A1A1AA] border-[#242424] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input de Búsqueda */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, cliente o notas..."
            className="w-full bg-[#0D0D0D] border border-[#242424] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Grid de Sitios Web */}
      {filteredWebsites.length === 0 ? (
        <div className="dashboard-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-[#242424] flex items-center justify-center text-[#A1A1AA] mb-3">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-white">No hay sitios registrados en esta sección</h3>
          <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
            Comienza guardando tus páginas web desarrolladas con su enlace y notas de qué componentes puedes reciclar en futuros clientes.
          </p>
          <button
            onClick={onOpenNewWebsite}
            className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#E4E4E7]"
          >
            + Registrar Primer Sitio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWebsites.map((web) => (
            <div
              key={web.id}
              className="dashboard-card p-5 flex flex-col justify-between space-y-4 group hover:border-[#3D3D3D] transition-all"
            >
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] text-white border border-[#2A2A2A] inline-block mb-1">
                      {web.categoria}
                    </span>
                    <h3 className="text-sm font-bold text-white font-display truncate group-hover:text-white transition-colors">
                      {web.titulo}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-white" />
                      <span className="truncate">{web.cliente}</span>
                    </p>
                  </div>
                </div>

                {/* Enlace con botón de apertura externa y copia */}
                <div className="bg-[#050505] p-2.5 rounded-xl border border-[#242424] flex items-center justify-between gap-2 mt-2">
                  <a
                    href={web.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#E4E4E7] hover:text-white hover:underline truncate flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#A1A1AA]" />
                    <span className="truncate">{web.url.replace(/^https?:\/\//, '')}</span>
                  </a>

                  <button
                    onClick={() => handleCopyLink(web.url, web.id)}
                    title="Copiar enlace"
                    className="p-1 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A] transition-colors shrink-0"
                  >
                    {copiedId === web.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Componentes Reciclables / Notas */}
                {web.descripcion && (
                  <div className="mt-3 bg-[#111111]/70 p-3 rounded-xl border border-[#242424]/80 text-xs">
                    <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span>Componentes Reciclables:</span>
                    </span>
                    <p className="text-[11px] text-[#D4D4D8] leading-relaxed line-clamp-3">
                      {web.descripcion}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer con fecha de creación y acciones */}
              <div className="pt-3 border-t border-[#242424] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#71717A] font-mono">
                  {formatDate(web.fecha)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditWebsite(web)}
                    title="Editar información"
                    className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1F1F1F] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${web.titulo}" del catálogo de sitios?`)) {
                        deleteWebsite(web.id);
                      }
                    }}
                    title="Eliminar sitio"
                    className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
