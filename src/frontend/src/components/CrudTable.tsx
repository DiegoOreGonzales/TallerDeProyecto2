import React from 'react';

interface CrudTableProps {
  title: string;
  description: string;
  headers: string[];
  data: any[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  renderRow: (item: any) => React.ReactNode;
  extraActions?: (item: any) => React.ReactNode;
}


const CrudTable: React.FC<CrudTableProps> = ({ 
  title, 
  description, 
  headers, 
  data, 
  onAdd, 
  onDelete, 
  renderRow,
  extraActions
}) => {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  // Lógica de filtrado local (RF-05)
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, searchTerm]);

  // Paginación
  const totalPages = React.useMemo(() => 
    Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE)), 
    [filteredData.length]
  );

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reiniciar página si el filtrado reduce los resultados
  React.useEffect(() => {
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  // Generar números de página con elipsis cuando hay muchas páginas
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="card-premium shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-orange-500/5 to-transparent">
        <div className="flex-1">
          <h2 className="text-2xl font-bold font-headline text-white tracking-tight">{title}</h2>
          <p className="text-on-surface-variant mt-1 font-medium text-sm">{description}</p>
        </div>
        
        {/* Barra de Búsqueda Integrada (RF-05) */}
        <div className="relative group min-w-[300px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-500 text-lg group-focus-within:text-orange-500 transition-colors">search</span>
          <input 
            type="text"
            placeholder="Filtrar registros..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-neutral-600"
          />
        </div>

        <button 
          onClick={onAdd}
          className="btn-primary flex items-center gap-2 group whitespace-nowrap"
        >
          <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add_circle</span>
          Nuevo Registro
        </button>
      </div>

      <div className="overflow-x-auto bg-surface-container-lowest/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              {headers.map((header, index) => (
                <th key={index} className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  {header}
                </th>
              ))}
              <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="group hover:bg-white/5 transition-colors">
                  {renderRow(item)}
                  <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                    {extraActions && extraActions(item)}
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined">delete_forever</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="px-8 py-20 text-center text-neutral-600 italic">
                  <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-4xl opacity-20">search_off</span>
                    <p className="font-medium font-headline">No se encontraron resultados para "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

      {/* Paginación UI */}
      {totalPages > 1 && (
        <div className="px-8 py-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.01]">
          <p className="text-xs text-neutral-500 font-medium">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} de {filteredData.length} registro(s)
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Página anterior"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            {getPageNumbers().map((pageNum, idx) =>
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-neutral-600 text-xs">...</span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[36px] h-9 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'text-neutral-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Página siguiente"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudTable;
