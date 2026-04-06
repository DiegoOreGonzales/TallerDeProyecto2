import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';

interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
}

const Courses: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCurso, setNewCurso] = useState({ codigo: '', nombre: '', creditos: 4 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cursos/');
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/cursos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCurso),
      });
      if (response.ok) {
        fetchCursos();
        setIsAdding(false);
        setNewCurso({ codigo: '', nombre: '', creditos: 4 });
      }
    } catch (error) {
      console.error('Error adding curso:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este curso?')) {
      try {
        await fetch(`http://localhost:8000/api/cursos/${id}`, { method: 'DELETE' });
        fetchCursos();
      } catch (error) {
        console.error('Error deleting curso:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {isAdding && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Registrar Nuevo Curso</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Código</label>
              <input 
                type="text" 
                required 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                placeholder="Ej: INF-101"
                value={newCurso.codigo}
                onChange={e => setNewCurso({...newCurso, codigo: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del Curso</label>
              <input 
                type="text" 
                required 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                placeholder="Ej: Programación Avanzada"
                value={newCurso.nombre}
                onChange={e => setNewCurso({...newCurso, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Créditos</label>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  required 
                  className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                  value={newCurso.creditos}
                  onChange={e => setNewCurso({...newCurso, creditos: parseInt(e.target.value)})}
                />
                <button type="submit" className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <CrudTable 
        title="Gestión de Cursos"
        description="Listado maestro de asignaturas disponibles para el periodo académico."
        headers={['Código', 'Nombre', 'Créditos']}
        data={cursos}
        onAdd={() => setIsAdding(true)}
        onDelete={handleDelete}
        renderRow={(curso: Curso) => (
          <>
            <td className="px-8 py-5">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black tracking-wider uppercase border border-slate-200">
                {curso.codigo}
              </span>
            </td>
            <td className="px-8 py-5 font-bold text-slate-700">{curso.nombre}</td>
            <td className="px-8 py-5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${curso.creditos > 3 ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                <span className="text-sm font-medium text-slate-600">{curso.creditos} créditos</span>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
};

export default Courses;
