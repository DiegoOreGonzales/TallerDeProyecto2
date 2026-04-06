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
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-50/50 to-transparent">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">{description}</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 active:scale-95"
        >
          <span>➕</span> Nuevo Registro
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              {headers.map((header, index) => (
                <th key={index} className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">
                  {header}
                </th>
              ))}
              <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="group hover:bg-slate-50/30 transition-colors">
                  {renderRow(item)}
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="px-8 py-20 text-center text-slate-400 italic">
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-4xl opacity-20">📂</span>
                    <p className="font-medium">No se encontraron registros almacenados</p>
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
