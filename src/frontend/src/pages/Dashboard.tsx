import React, { useState, useEffect } from 'react';

interface HorarioResult {
  seccion_id: number;
  seccion_codigo: string;
  aula_id: number;
  dia: number;
  slot: number;
  nombre_curso: string;
  nombre_aula: string;
  tipo_curso: string;
  periodo: number;
  creditos: number;
  turno_seccion: string;
}

interface Stats {
  cursos: number;
  aulas: number;
  secciones: number;
  docentes: number;
  horarios_generados: number;
}

interface DashboardProps {
  role: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [horarios, setHorarios] = useState<HorarioResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [stats, setStats] = useState<Stats>({ cursos: 0, aulas: 0, secciones: 0, docentes: 0, horarios_generados: 0 });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchHorarios(), fetchStats()]);
    } finally {
      setLoadingInitial(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scheduler/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchHorarios = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scheduler/');
      if (response.ok) {
        const result = await response.json();
        setHorarios(result.data);
      }
    } catch (err) {
      console.error("Error fetching horarios:", err);
    }
  };

  const showToast = (message: string, type: 'success'|'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const generateHorario = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/scheduler/generate', { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        setHorarios(result.data);
        fetchStats(); // Update stats after generating
        showToast("¡Optimización exitosa! Horario generado cumpliendo todas las restricciones.", "success");
      } else {
        const errData = await response.json();
        showToast(errData.detail || "Error al generar el horario", "error");
      }
    } catch (error) {
      showToast("Error de conexión con el motor de optimización.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const timeSlots = [
    { label: "07:00 - 08:30", index: 0, group: "MAÑANA" },
    { label: "08:35 - 10:05", index: 1, group: "MAÑANA" },
    { label: "10:10 - 11:40", index: 2, group: "MAÑANA" },
    { label: "11:45 - 13:15", index: 3, group: "MAÑANA" },
    { label: "14:00 - 15:30", index: 4, group: "TARDE" },
    { label: "15:35 - 17:05", index: 5, group: "TARDE" },
    { label: "17:10 - 18:40", index: 6, group: "TARDE" },
    { label: "18:45 - 20:15", index: 7, group: "TARDE" },
    { label: "20:20 - 21:50", index: 8, group: "TARDE" }
  ];

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-orange-500">sync</span>
        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Cargando plataforma...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 duration-300 ${
          toast.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-100' : 'bg-red-500/20 border border-red-500/50 text-red-100'
        }`}>
          <span className="material-symbols-outlined text-2xl">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <p className="font-medium text-sm">{toast.message}</p>
        </div>
      )}

      {/* KPI Stats (Only for Admin) */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Cursos Activos', value: stats.cursos, icon: 'book' },
            { label: 'Aulas Disponibles', value: stats.aulas, icon: 'domain' },
            { label: 'Docentes', value: stats.docentes, icon: 'school' },
            { label: 'Bloques Asignados', value: stats.horarios_generados, icon: 'check_circle', color: 'text-green-500' }
          ].map((stat, i) => (
            <div key={i} className="card-premium p-6 group">
              <div className="flex justify-between items-start mb-4">
                <span className={`material-symbols-outlined text-3xl ${stat.color || 'text-orange-500'} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions (Only for Admin) */}
      {role === 'admin' && (
        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-white/5">
          <button 
            onClick={generateHorario}
            disabled={loading}
            className="btn-primary flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
              {loading ? 'sync' : 'auto_fix'}
            </span>
            <span className="text-sm tracking-widest uppercase">{loading ? 'Optimizando con CP-SAT...' : 'Generar Nuevo Horario'}</span>
          </button>
          <div className="h-8 w-px bg-white/10 mx-2"></div>
          <button className="px-6 py-3 rounded-xl bg-white/5 text-neutral-400 font-bold uppercase text-xs tracking-widest hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 relative group disabled:opacity-50" disabled title="Próximamente">
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar PDF
          </button>
          <button className="px-6 py-3 rounded-xl bg-white/5 text-neutral-400 font-bold uppercase text-xs tracking-widest hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50" disabled title="Próximamente">
            <span className="material-symbols-outlined text-sm">tune</span>
            Configurar Reglas
          </button>
        </div>
      )}

      {/* Grid Schedule */}
      <div className="card-premium">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-bold font-headline text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-500">grid_on</span>
              Malla Horaria Oficial
            </h3>
            <p className="text-sm text-neutral-500 mt-1 font-medium">Asignación optimizada por CP-SAT según restricciones institucionales UC</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/50"></div>
              <span className="text-xs font-bold text-neutral-400 uppercase">Teoría</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500/50"></div>
              <span className="text-xs font-bold text-neutral-400 uppercase">Laboratorio</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 overflow-x-auto">
          {horarios.length === 0 ? (
            <div className="text-center py-20 bg-surface-container rounded-xl border border-white/5 border-dashed">
              <span className="material-symbols-outlined text-6xl text-neutral-700 mb-4">event_busy</span>
              <p className="text-neutral-500 font-medium text-lg">No hay horarios generados en el sistema.</p>
              {role === 'admin' && (
                <p className="text-neutral-600 text-sm mt-2">Haz clic en "Generar Nuevo Horario" para iniciar el motor de optimización.</p>
              )}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b border-white/5 text-xs font-black uppercase tracking-widest text-neutral-500 w-32 bg-surface-container-low">Hora</th>
                  {dias.map(dia => (
                    <th key={dia} className="p-4 text-left border-b border-white/5 text-sm font-black text-white bg-surface-container-low">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, slotIdx) => (
                  <tr key={slotIdx} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 border-b border-white/5 text-xs font-medium text-neutral-400 whitespace-nowrap bg-surface-container-low">
                      <div className="flex flex-col">
                        <span className="font-black text-orange-500/80">{time.label.split(' - ')[0]}</span>
                        <span className="text-[10px] text-neutral-600 uppercase tracking-widest">{time.group}</span>
                      </div>
                    </td>
                    {dias.map((_, diaIdx) => {
                      const celdaHorarios = horarios.filter(h => h.dia === diaIdx && h.slot === slotIdx);
                      return (
                        <td key={`${diaIdx}-${slotIdx}`} className="p-3 border-b border-white/5 border-l border-white/[0.02]">
                          {celdaHorarios.map((h, i) => (
                            <div key={i} className={`p-4 rounded-xl border mb-2 shadow-lg transition-transform hover:-translate-y-1 ${
                              h.tipo_curso === 'Laboratorio' 
                                ? 'bg-purple-500/10 border-purple-500/20 shadow-purple-900/20' 
                                : 'bg-blue-500/10 border-blue-500/20 shadow-blue-900/20'
                            }`}>
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-black/40 ${
                                  h.tipo_curso === 'Laboratorio' ? 'text-purple-300' : 'text-blue-300'
                                }`}>
                                  {h.seccion_codigo}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                  P{h.periodo}
                                </span>
                              </div>
                              <p className="font-bold text-sm text-white leading-tight mb-2 font-headline">{h.nombre_curso}</p>
                              <div className="flex justify-between items-center mt-auto">
                                <p className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                                  {h.nombre_aula}
                                </p>
                                <span className="text-[10px] text-neutral-500 uppercase font-bold bg-white/5 px-1.5 rounded">
                                  {h.turno_seccion}
                                </span>
                              </div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
