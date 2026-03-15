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
    <div className="space-y-8 animate-in fade-in duration-500">
      {isAdding && (
        <section className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-headline text-white">Configurar Nueva Aula</h3>
            <button onClick={() => setIsAdding(false)} className="text-neutral-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Nombre/Código</label>
              <input 
                type="text" required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white placeholder:text-neutral-700 transition-all font-medium"
                placeholder="Ej: A-102"
                value={newAula.nombre}
                onChange={e => setNewAula({...newAula, nombre: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Capacidad</label>
              <input 
                type="number" required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white transition-all font-medium"
                value={newAula.capacidad}
                onChange={e => setNewAula({...newAula, capacidad: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Tipo de Ambiente</label>
              <select 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white transition-all font-medium appearance-none"
                value={newAula.tipo}
                onChange={e => setNewAula({...newAula, tipo: e.target.value})}
              >
                <option value="Teoría" className="bg-neutral-900">Teoría</option>
                <option value="Laboratorio" className="bg-neutral-900">Laboratorio</option>
                <option value="Taller" className="bg-neutral-900">Taller</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                Registrar Aula
              </button>
            </div>
          </form>
        </section>
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
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined">meeting_room</span>
                </div>
                <span className="font-bold text-on-surface font-headline">{aula.nombre}</span>
              </div>
            </td>
            <td className="px-8 py-5 text-on-surface-variant font-medium font-label">{aula.capacidad} estudiantes</td>
            <td className="px-8 py-5">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                aula.tipo === 'Laboratorio' 
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                : 'bg-green-500/10 text-green-400 border-green-500/20'
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
