import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';

interface Aula {
  id: number;
  nombre: string;
  capacidad: number;
  tipo: string;
}

const Classrooms: React.FC = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAula, setNewAula] = useState({ nombre: '', capacidad: 30, tipo: 'Teoría' });

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/aulas/');
      const data = await response.json();
      setAulas(data);
    } catch (error) {
      console.error('Error fetching aulas:', error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/aulas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAula),
      });
      if (response.ok) {
        fetchAulas();
        setIsAdding(false);
        setNewAula({ nombre: '', capacidad: 30, tipo: 'Teoría' });
      }
    } catch (error) {
      console.error('Error adding aula:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Desea eliminar esta aula?')) {
      try {
        await fetch(`http://localhost:8000/api/aulas/${id}`, { method: 'DELETE' });
        fetchAulas();
      } catch (error) {
        console.error('Error deleting aula:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {isAdding && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Configurar Nueva Aula</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre/Código</label>
              <input 
                type="text" required 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                placeholder="Ej: A-102"
                value={newAula.nombre}
                onChange={e => setNewAula({...newAula, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Capacidad</label>
              <input 
                type="number" required 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                value={newAula.capacidad}
                onChange={e => setNewAula({...newAula, capacidad: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                value={newAula.tipo}
                onChange={e => setNewAula({...newAula, tipo: e.target.value})}
              >
                <option value="Teoría">Teoría</option>
                <option value="Laboratorio">Laboratorio</option>
                <option value="Taller">Taller</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                Registrar Aula
              </button>
            </div>
          </form>
        </div>
      )}

      <CrudTable 
        title="Infraestructura y Aulas"
        description="Gestión de espacios físicos y laboratorios especializados."
        headers={['Identificación', 'Capacidad', 'Tipo de Ambiente']}
        data={aulas}
        onAdd={() => setIsAdding(true)}
        onDelete={handleDelete}
        renderRow={(aula: Aula) => (
          <>
            <td className="px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg shadow-inner">
                  🏢
                </div>
                <span className="font-bold text-slate-800">{aula.nombre}</span>
              </div>
            </td>
            <td className="px-8 py-5 text-slate-600 font-medium">{aula.capacidad} estudiantes</td>
            <td className="px-8 py-5">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                aula.tipo === 'Laboratorio' 
                ? 'bg-purple-50 text-purple-600 border-purple-100' 
                : 'bg-green-50 text-green-600 border-green-100'
              }`}>
                {aula.tipo}
              </span>
            </td>
          </>
        )}
      />
    </div>
  );
};

export default Classrooms;
