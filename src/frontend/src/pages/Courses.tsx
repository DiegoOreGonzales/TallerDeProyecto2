import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';

interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  tipo: string;
}

const Courses: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCurso, setNewCurso] = useState({ codigo: '', nombre: '', creditos: 4, tipo: 'Teoría', periodo: 1 });
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<number | 'all'>('all');

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
        setNewCurso({ codigo: '', nombre: '', creditos: 4, tipo: 'Teoría', periodo: 1 });
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

  const filteredCursos = periodFilter === 'all' 
    ? cursos 
    : cursos.filter(c => (c as any).periodo === periodFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {isAdding && (
        <section className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-headline text-white">Registrar Nuevo Curso</h3>
            <button onClick={() => setIsAdding(false)} className="text-neutral-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Código</label>
              <input 
                type="text" 
                required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white placeholder:text-neutral-700 transition-all font-medium"
                placeholder="Ej: INF-101"
                value={newCurso.codigo}
                onChange={e => setNewCurso({...newCurso, codigo: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Nombre</label>
              <input 
                type="text" 
                required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white placeholder:text-neutral-700 transition-all font-medium"
                placeholder="Ej: Programación"
                value={newCurso.nombre}
                onChange={e => setNewCurso({...newCurso, nombre: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Tipo / Créditos</label>
              <div className="flex gap-4">
                <select 
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white appearance-none text-sm font-medium"
                  value={newCurso.tipo}
                  onChange={e => setNewCurso({...newCurso, tipo: e.target.value})}
                >
                  <option value="Teoría" className="bg-neutral-900">Teoría</option>
                  <option value="Laboratorio" className="bg-neutral-900">Laboratorio</option>
                </select>
                <input 
                  type="number" 
                  required 
                  className="w-24 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white transition-all text-center font-medium"
                  value={newCurso.creditos}
                  onChange={e => setNewCurso({...newCurso, creditos: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Periodo (Ciclo)</label>
              <input 
                type="number" min="1" max="10" required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white transition-all font-medium"
                value={newCurso.periodo}
                onChange={e => setNewCurso({...newCurso, periodo: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full py-4 uppercase text-[10px] tracking-widest">
                Guardar Curso
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-white/5">
        <span className="material-symbols-outlined text-neutral-500 ml-2">filter_list</span>
        <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Filtrar por Ciclo:</label>
        <select 
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs font-bold text-white focus:ring-1 focus:ring-orange-500 appearance-none min-w-[120px]"
          value={periodFilter}
          onChange={e => setPeriodFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
        >
          <option value="all" className="bg-neutral-900">Todos</option>
          {[1,2,3,4,5,6,7,8,9,10].map(p => (
            <option key={p} value={p} className="bg-neutral-900">Periodo {p}</option>
          ))}
        </select>
      </div>

      <CrudTable 
        title="Gestión de Cursos"
        description="Listado maestro de asignaturas disponibles para el periodo académico."
        headers={['Ciclo', 'Código', 'Nombre', 'Configuración']}
        data={filteredCursos}
        onAdd={() => setIsAdding(true)}
        onDelete={handleDelete}
        renderRow={(curso: Curso) => (
          <>
            <td className="px-8 py-5">
              <span className="text-sm font-black text-white bg-white/5 px-2 py-1 rounded">
                P{(curso as any).periodo}
              </span>
            </td>
            <td className="px-8 py-5">
              <span className="px-3 py-1 bg-white/5 text-orange-400 rounded-lg text-xs font-black tracking-widest uppercase border border-white/10">
                {curso.codigo}
              </span>
            </td>
            <td className="px-8 py-5 font-bold text-on-surface font-headline">{curso.nombre}</td>
            <td className="px-8 py-5">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                  curso.tipo === 'Laboratorio' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {curso.tipo}
                </span>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-tight">{curso.creditos} Créditos</span>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
};

export default Courses;
