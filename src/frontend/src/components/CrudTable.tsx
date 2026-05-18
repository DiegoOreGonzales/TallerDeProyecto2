import React from 'react';

interface CrudTableProps {
  title: string;
  description: string;
  headers: string[];
  data: any[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  renderRow: (item: any) => React.ReactNode;
}

const CrudTable: React.FC<CrudTableProps> = ({ 
  title, 
  description, 
  headers, 
  data, 
  onAdd, 
  onDelete, 
  renderRow 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

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
            onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="group hover:bg-white/5 transition-colors">
                  {renderRow(item)}
                  <td className="px-8 py-5 text-right">
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
    </div>
  );
};

export default CrudTable;
