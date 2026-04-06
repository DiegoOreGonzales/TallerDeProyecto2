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
        fetch('http://localhost:8000/api/auth/users') // Assuming this endpoint exists for docentes
      ]);
      
      if (secRes.ok) setSecciones(await secRes.json());
      if (curRes.ok) setCursos(await curRes.json());
      
      // Mocking docentes if endpoint fails
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
    <div className="space-y-8">
      {isAdding && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Nueva Sección Académica</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Código</label>
              <input 
                type="text" required 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                placeholder="Ej: NRC-1234"
                value={newSeccion.codigo}
                onChange={e => setNewSeccion({...newSeccion, codigo: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Curso</label>
              <select 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                value={newSeccion.curso_id}
                onChange={e => setNewSeccion({...newSeccion, curso_id: parseInt(e.target.value)})}
              >
                <option value="">Seleccione Curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Docente</label>
              <select 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                value={newSeccion.docente_id}
                onChange={e => setNewSeccion({...newSeccion, docente_id: parseInt(e.target.value)})}
              >
                <option value="">Seleccione Docente</option>
                {docentes.map(d => <option key={d.id} value={d.id}>{d.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Capacidad</label>
              <input 
                type="number" required 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-slate-700"
                value={newSeccion.capac_estimada}
                onChange={e => setNewSeccion({...newSeccion, capac_estimada: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 uppercase text-[10px] tracking-widest">
                Crear Sección
              </button>
            </div>
          </form>
        </div>
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
            <td className="px-8 py-5 font-black text-red-600">{sec.codigo}</td>
            <td className="px-8 py-5">
              <div className="text-sm font-bold text-slate-700">{sec.curso?.nombre || `Curso ${sec.curso_id}`}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{sec.curso?.codigo}</div>
            </td>
            <td className="px-8 py-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">👤</div>
                <span className="text-sm text-slate-600 font-medium">{sec.docente?.username || `ID: ${sec.docente_id}`}</span>
              </div>
            </td>
            <td className="px-8 py-5">
              <div className="text-sm font-black text-slate-800">{sec.capac_estimada} <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Lugares</span></div>
            </td>
          </>
        )}
      />
    </div>
  );
};

export default Sections;
