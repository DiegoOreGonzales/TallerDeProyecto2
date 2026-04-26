import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';

interface Docente {
  id: number;
  username: string;
  email: string;
  turno_preferido: string;
}

const Teachers: React.FC = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDocente, setNewDocente] = useState({ username: '', email: '', password: '', turno_preferido: 'COMPLETO', role: 'docente' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/users/docentes');
      const data = await response.json();
      setDocentes(data);
    } catch (error) {
      console.error('Error fetching docentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDocente),
      });
      if (response.ok) {
        fetchDocentes();
        setIsAdding(false);
        setNewDocente({ username: '', email: '', password: '', turno_preferido: 'COMPLETO', role: 'docente' });
      }
    } catch (error) {
      console.error('Error adding docente:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este docente?')) {
      try {
        await fetch(`http://localhost:8000/api/auth/users/${id}`, { method: 'DELETE' });
        fetchDocentes();
      } catch (error) {
        console.error('Error deleting docente:', error);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {isAdding && (
        <section className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold font-headline text-white">Registrar Nuevo Docente</h3>
            <button onClick={() => setIsAdding(false)} className="text-neutral-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Usuario</label>
              <input 
                type="text" 
                required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white placeholder:text-neutral-700 transition-all font-medium"
                placeholder="Ej: jperez"
                value={newDocente.username}
                onChange={e => setNewDocente({...newDocente, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email" 
                required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white placeholder:text-neutral-700 transition-all font-medium"
                placeholder="Ej: jperez@ucontinental.edu.pe"
                value={newDocente.email}
                onChange={e => setNewDocente({...newDocente, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Contraseña</label>
              <input 
                type="password" 
                required 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white placeholder:text-neutral-700 transition-all font-medium"
                placeholder="••••••"
                value={newDocente.password}
                onChange={e => setNewDocente({...newDocente, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Turno Preferido</label>
              <select 
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-white appearance-none font-medium"
                value={newDocente.turno_preferido}
                onChange={e => setNewDocente({...newDocente, turno_preferido: e.target.value})}
              >
                <option value="COMPLETO" className="bg-neutral-900">Completo (Mañana y Tarde)</option>
                <option value="MAÑANA" className="bg-neutral-900">Mañana (07:00 - 13:00)</option>
                <option value="TARDE" className="bg-neutral-900">Tarde (14:00 - 20:20)</option>
              </select>
            </div>
            <div className="flex items-end lg:col-span-4">
              <button type="submit" className="btn-primary w-full md:w-auto py-4 uppercase text-[10px] tracking-widest">
                Guardar Docente
              </button>
            </div>
          </form>
        </section>
      )}

      <CrudTable 
        title="Gestión de Docentes"
        description="Directorio y preferencias de disponibilidad del cuerpo docente."
        headers={['Usuario', 'Email', 'Turno Preferido']}
        data={docentes}
        onAdd={() => setIsAdding(true)}
        onDelete={handleDelete}
        renderRow={(docente: Docente) => (
          <>
            <td className="px-8 py-5">
              <span className="font-bold text-on-surface font-headline">{docente.username}</span>
            </td>
            <td className="px-8 py-5 text-neutral-400">{docente.email}</td>
            <td className="px-8 py-5">
              <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                docente.turno_preferido === 'MAÑANA' ? 'bg-blue-500/10 text-blue-400' : 
                docente.turno_preferido === 'TARDE' ? 'bg-orange-500/10 text-orange-400' : 
                'bg-green-500/10 text-green-400'
              }`}>
                {docente.turno_preferido}
              </span>
            </td>
          </>
        )}
      />
    </div>
  );
};

export default Teachers;
