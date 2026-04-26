import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';

interface Seccion {
  id: number;
  codigo: string;
  curso_id: number;
  docente_id: number;
  capac_estimada: number;
  curso?: { nombre: string; codigo: string };
  docente?: { username: string };
}

interface Curso { id: number; nombre: string; codigo: string }
interface User { id: number; username: string }

const Sections: React.FC = () => {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [docentes, setDocentes] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSeccion, setNewSeccion] = useState({ 
    codigo: '', 
    curso_id: 0, 
    docente_id: 0, 
    capac_estimada: 40 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [secRes, curRes, docRes] = await Promise.all([
        fetch('http://localhost:8000/api/secciones/'),
        fetch('http://localhost:8000/api/cursos/'),
        fetch('http://localhost:8000/api/auth/users')
      ]);
      
      if (secRes.ok) setSecciones(await secRes.json());
      if (curRes.ok) setCursos(await curRes.json());
      
      if (docRes.ok) {
        setDocentes(await docRes.json());
      } else {
        setDocentes([{ id: 1, username: 'admin' }, { id: 2, username: 'docente_demo' }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/secciones/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeccion),
      });
      if (response.ok) {
        fetchData();
        setIsAdding(false);
        setNewSeccion({ codigo: '', curso_id: 0, docente_id: 0, capac_estimada: 40 });
      }
    } catch (error) {
      console.error('Error adding seccion:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Desea eliminar esta sección?')) {
      try {
        await fetch(`http://localhost:8000/api/secciones/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting seccion:', error);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {isAdding && (
        <section className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-headline text-white">Nueva Sección Académica</h3>
            <button onClick={() => setIsAdding(false)} className="text-neutral-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Código (NRC)</label>
              <input 
                type="text" required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white placeholder:text-neutral-700 transition-all font-medium"
                placeholder="Ej: NRC-1234"
                value={newSeccion.codigo}
                onChange={e => setNewSeccion({...newSeccion, codigo: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Curso</label>
              <select 
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white transition-all font-medium appearance-none"
                value={newSeccion.curso_id}
                onChange={e => setNewSeccion({...newSeccion, curso_id: parseInt(e.target.value)})}
              >
                <option value="" className="bg-neutral-900">Seleccione Curso</option>
                {cursos.map(c => <option key={c.id} value={c.id} className="bg-neutral-900">{c.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Docente</label>
              <select 
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white transition-all font-medium appearance-none"
                value={newSeccion.docente_id}
                onChange={e => setNewSeccion({...newSeccion, docente_id: parseInt(e.target.value)})}
              >
                <option value="" className="bg-neutral-900">Seleccione Docente</option>
                {docentes.map(d => <option key={d.id} value={d.id} className="bg-neutral-900">{d.username}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Capacidad Estimada</label>
              <input 
                type="number" required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white transition-all font-medium"
                value={newSeccion.capac_estimada}
                onChange={e => setNewSeccion({...newSeccion, capac_estimada: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full uppercase text-[10px] tracking-widest py-4">
                Crear Sección
              </button>
            </div>
          </form>
        </section>
      )}

      <CrudTable 
        title="Secciones y Grupos"
        description="Vinculación de cursos con docentes y planificación de aforo."
        headers={['NRC / Código', 'Curso Asignado', 'Docente Responsable', 'Capacidad']}
        data={secciones}
        onAdd={() => setIsAdding(true)}
        onDelete={handleDelete}
        renderRow={(sec: Seccion) => (
          <>
            <td className="px-8 py-5">
              <span className="font-black text-orange-500 tracking-tighter text-lg">{sec.codigo}</span>
            </td>
            <td className="px-8 py-5">
              <div className="text-sm font-bold text-on-surface font-headline">{sec.curso?.nombre || `Curso ${sec.curso_id}`}</div>
              <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter opacity-60">{sec.curso?.codigo}</div>
            </td>
            <td className="px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
                <span className="text-sm text-on-surface-variant font-medium font-label">{sec.docente?.username || `ID: ${sec.docente_id}`}</span>
              </div>
            </td>
            <td className="px-8 py-5">
              <div className="text-sm font-black text-on-surface">
                {sec.capac_estimada} 
                <span className="text-[10px] text-neutral-600 font-bold uppercase ml-1.5 tracking-tighter">Lugares</span>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
};

export default Sections;
