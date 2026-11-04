import React, { useState, useMemo } from 'react';
import { useFinancialStore } from '../store/useFinancialStore';
import { Plus, Globe, ExternalLink, Copy, Check, Trash2, Edit3, Sparkles, Tag, User, Search, Code2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { ModalConfirmDelete } from '../components/ModalConfirmDelete';

export const WebsitesView = ({ onOpenNewWebsite, onEditWebsite, onOpenEditWebsite }) => {
  const handleEdit = onEditWebsite || onOpenEditWebsite;
  const websites = useFinancialStore((state) => state.websites);
  const deleteWebsite = useFinancialStore((state) => state.deleteWebsite);
  const addToast = useFinancialStore((state) => state.addToast);

  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Estado para modal de confirmación de eliminación con animación
  const [deletingId, setDeletingId] = useState(null);
  const [animatingDeleteId, setAnimatingDeleteId] = useState(null);
  const [websiteToDelete, setWebsiteToDelete] = useState(null);

  // Categorías
  const categories = useMemo(() => {
    return ['Todas', ...new Set(websites.map((w) => w.categoria).filter(Boolean))];
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

  const requestDelete = (web) => {
    setWebsiteToDelete(web);
    setDeletingId(web.id);
  };

  const confirmDelete = () => {
    if (!websiteToDelete) return;
    const id = websiteToDelete.id;
    // Disparar animación de salida antes de borrar
    setAnimatingDeleteId(id);
    setTimeout(() => {
      deleteWebsite(id);
      setAnimatingDeleteId(null);
      setDeletingId(null);
      setWebsiteToDelete(null);
    }, 320);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Modal de confirmación con animación */}
      <ModalConfirmDelete
        isOpen={Boolean(deletingId)}
        onClose={() => { setDeletingId(null); setWebsiteToDelete(null); }}
        onConfirm={confirmDelete}
        title={`¿Eliminar "${websiteToDelete?.titulo}"?`}
        message="¿Estás seguro de que deseas eliminar este sitio web de tu biblioteca de reciclaje? Esta acción no se puede deshacer."
      />

      {/* Cuadrito 1: Header de Páginas Web */}
      <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display">
              Catálogo de Páginas Web Creadas
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
              {websites.length} sitios
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Biblioteca visual de proyectos para consultar y reciclar componentes en nuevos clientes
          </p>
        </div>

        <button
          onClick={onOpenNewWebsite}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Sitio Web</span>
        </button>
      </div>

      {/* Cuadrito 2: Barra de Filtros y Buscador */}
      <div className="bg-white rounded-[24px] p-4 border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Chips de categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, cliente o notas..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Cuadrito 3: Grid de Sitios Web */}
      {filteredWebsites.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-neutral-200/80 p-12 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 mb-3 shadow-sm">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">No hay sitios registrados en esta sección</h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Comienza guardando tus páginas web desarrolladas con su enlace y notas de qué componentes puedes reciclar.
          </p>
          <button
            onClick={onOpenNewWebsite}
            className="mt-4 px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 shadow-sm transition"
          >
            + Registrar Primer Sitio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWebsites.map((web) => {
            const isDeleting = animatingDeleteId === web.id;
            return (
              <div
                key={web.id}
                className={`bg-white rounded-[28px] p-6 border border-neutral-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                  isDeleting ? 'item-deleting' : ''
                }`}
              >
                <div>
                  {/* Encabezado de la tarjeta */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-neutral-900 font-display truncate">
                        {web.titulo}
                      </h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate font-medium">{web.cliente}</span>
                      </p>
                    </div>

                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 shrink-0">
                      {web.categoria}
                    </span>
                  </div>

                  {/* Enlace elegante con botón para abrir y copiar */}
                  <div className="bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/70 p-3 rounded-2xl flex items-center justify-between gap-2 transition group/link">
                    <a
                      href={web.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-neutral-800 hover:text-black hover:underline truncate flex items-center gap-2"
                    >
                      <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{web.url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400 group-hover/link:text-black shrink-0" />
                    </a>

                    <button
                      onClick={() => handleCopyLink(web.url, web.id)}
                      title="Copiar enlace"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-white transition-all shadow-none hover:shadow-sm shrink-0"
                    >
                      {copiedId === web.id ? <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Componentes Reciclables / Notas en cuadrito elegante */}
                  {web.descripcion && (
                    <div className="mt-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-neutral-700 font-bold text-[11px]">
                        <Code2 className="w-3.5 h-3.5 text-neutral-900" />
                        <span>Componentes Reciclables:</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {web.descripcion}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer con fecha de creación y acciones */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {formatDate(web.fecha)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (typeof handleEdit === 'function') {
                          handleEdit(web);
                        }
                      }}
                      title="Editar información"
                      className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition active:scale-95"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => requestDelete(web)}
                      title="Eliminar sitio"
                      className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
