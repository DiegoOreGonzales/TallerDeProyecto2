import React, { useState, useEffect } from 'react';
import ScheduleDetailModal from '../components/ScheduleDetailModal';

interface HoraPedagogica {
  hp: number;
  inicio: string;
  fin: string;
}

interface HorarioResult {
  seccion_id: number;
  seccion_codigo: string;
  aula_id: number;
  dia: number;
  dia_nombre: string;
  slot: number;
  hora_inicio: string;
  hora_fin: string;
  horas_pedagogicas: HoraPedagogica[];
  nombre_curso: string;
  nombre_aula: string;
  tipo_curso: string;
  periodo: number;
  creditos: number;
  turno_seccion: string;
  docente_nombre: string;
  codigo_curso: string;
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
  cycle: number | null;
  shift: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role, cycle, shift }) => {
  const [horarios, setHorarios] = useState<HorarioResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [stats, setStats] = useState<Stats>({ cursos: 0, aulas: 0, secciones: 0, docentes: 0, horarios_generados: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

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
        fetchStats();
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

  // Filtrar horarios según rol del usuario
  const filteredHorarios = (() => {
    if (role !== 'estudiante' || !cycle) return horarios;

    // Paso 1: filtrar por periodo del estudiante
    const byCycle = horarios.filter(h => h.periodo === cycle);

    if (shift !== 'COMPLETO') {
      // Turno fijo: mostrar solo secciones de ese turno
      return byCycle.filter(h => h.turno_seccion === shift);
    }

    // Turno COMPLETO: elegir UNA sola sección por código de curso
    // Preferencia: MAÑANA primero; si no existe, usar TARDE
    // Esto evita que el mismo curso aparezca duplicado (mañana + tarde)
    const seccionesUnicas: Record<string, string> = {}; // codigo_curso → seccion_codigo elegida

    // 1. Primero registrar qué secciones hay por curso
    const seccionesPorCurso: Record<string, { manana: string | null; tarde: string | null }> = {};
    byCycle.forEach(h => {
      if (!seccionesPorCurso[h.codigo_curso]) {
        seccionesPorCurso[h.codigo_curso] = { manana: null, tarde: null };
      }
      if (h.turno_seccion === 'MAÑANA') {
        seccionesPorCurso[h.codigo_curso].manana = h.seccion_codigo;
      } else if (h.turno_seccion === 'TARDE') {
        seccionesPorCurso[h.codigo_curso].tarde = h.seccion_codigo;
      }
    });

    // 2. Para cada curso elegir UNA sección (mañana si existe, si no tarde)
    Object.entries(seccionesPorCurso).forEach(([codigoCurso, secs]) => {
      seccionesUnicas[codigoCurso] = secs.manana ?? secs.tarde ?? '';
    });

    // 3. Filtrar: solo los bloques de la sección elegida para cada curso
    return byCycle.filter(h => seccionesUnicas[h.codigo_curso] === h.seccion_codigo);
  })();

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const timeSlots = [
    { label: "07:00 – 08:30", index: 0, group: "MAÑANA", hp1: "07:00–07:40", hp2: "07:50–08:30" },
    { label: "08:35 – 10:05", index: 1, group: "MAÑANA", hp1: "08:35–09:15", hp2: "09:25–10:05" },
    { label: "10:10 – 11:40", index: 2, group: "MAÑANA", hp1: "10:10–10:50", hp2: "11:00–11:40" },
    { label: "11:45 – 13:15", index: 3, group: "MAÑANA", hp1: "11:45–12:25", hp2: "12:35–13:15" },
    { label: "14:00 – 15:30", index: 4, group: "TARDE", hp1: "14:00–14:40", hp2: "14:50–15:30" },
    { label: "15:35 – 17:05", index: 5, group: "TARDE", hp1: "15:35–16:15", hp2: "16:25–17:05" },
    { label: "17:10 – 18:40", index: 6, group: "TARDE", hp1: "17:10–17:50", hp2: "18:00–18:40" },
    { label: "18:45 – 20:15", index: 7, group: "TARDE", hp1: "18:45–19:25", hp2: "19:35–20:15" },
    { label: "20:20 – 21:50", index: 8, group: "TARDE", hp1: "20:20–21:00", hp2: "21:10–21:50" }
  ];

  // Obtener todas las entradas de un curso por su seccion_codigo
  const getCourseEntries = (seccionCodigo: string): HorarioResult[] => {
    return filteredHorarios.filter(h => h.seccion_codigo === seccionCodigo);
  };

  // Vista Lista: agrupar por día
  const renderListView = () => {
    const byDay: Record<number, HorarioResult[]> = {};
    filteredHorarios.forEach(h => {
      if (!byDay[h.dia]) byDay[h.dia] = [];
      byDay[h.dia].push(h);
    });
    Object.values(byDay).forEach(arr => arr.sort((a, b) => a.slot - b.slot));

    return (
      <div className="space-y-6">
        {dias.map((dayName, diaIdx) => {
          const dayEntries = byDay[diaIdx] || [];
          if (dayEntries.length === 0) return null;
          return (
            <div key={diaIdx} className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
              <div className="px-6 py-3 bg-white/[0.02] border-b border-white/5">
                <h4 className="text-sm font-black text-orange-400 uppercase tracking-widest">{dayName}</h4>
              </div>
              <div className="divide-y divide-white/5">
                {dayEntries.map((h, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-stretch hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedCourse(h.seccion_codigo)}
                  >
                    {/* Barra de color */}
                    <div className={`w-1 ${h.tipo_curso === 'Laboratorio' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                    
                    {/* Hora */}
                    <div className="w-40 px-4 py-4 flex flex-col justify-center border-r border-white/5">
                      <span className="text-sm font-black text-white">{h.hora_inicio} — {h.hora_fin}</span>
                      <div className="flex gap-2 mt-1">
                        {h.horas_pedagogicas?.map((hp, hpIdx) => (
                          <span key={hpIdx} className="text-[9px] text-neutral-500 font-bold">
                            HP{hp.hp}: {hp.inicio}–{hp.fin}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Curso */}
                    <div className="flex-1 px-4 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${
                          h.tipo_curso === 'Laboratorio' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {h.seccion_codigo}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded">P{h.periodo}</span>
                      </div>
                      <p className="font-bold text-sm text-white">{h.nombre_curso}</p>
                    </div>

                    {/* Detalles */}
                    <div className="w-48 px-4 py-4 flex flex-col justify-center text-right">
                      <div className="flex items-center justify-end gap-1.5 mb-1">
                        <span className="material-symbols-outlined text-neutral-500 text-sm">location_on</span>
                        <span className="text-xs font-bold text-neutral-400">{h.nombre_aula}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="material-symbols-outlined text-neutral-500 text-sm">person</span>
                        <span className="text-xs font-medium text-neutral-500">{h.docente_nombre}</span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <div className="w-10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-neutral-600 text-sm">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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

      {/* Student Info Banner */}
      {role === 'estudiante' && cycle && (
        <div className="flex items-center gap-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl px-6 py-4">
          <span className="material-symbols-outlined text-orange-500 text-2xl">school</span>
          <div>
            <p className="text-sm font-bold text-white">Periodo {cycle} · Turno: {shift}</p>
            <p className="text-xs text-neutral-400">Mostrando únicamente los cursos de tu ciclo y turno.</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-white/5">
        {role === 'admin' && (
          <>
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
          </>
        )}

        {/* View Toggle */}
        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              viewMode === 'grid' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">grid_on</span>
            Grilla
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              viewMode === 'list' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">view_list</span>
            Agenda
          </button>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="card-premium">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-bold font-headline text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-500">{viewMode === 'grid' ? 'grid_on' : 'view_list'}</span>
              {viewMode === 'grid' ? 'Malla Horaria Oficial' : 'Vista de Agenda'}
            </h3>
            <p className="text-sm text-neutral-500 mt-1 font-medium">
              Asignación optimizada por CP-SAT · Horas pedagógicas de 40 min · Receso de 10 min
            </p>
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
          {filteredHorarios.length === 0 ? (
            <div className="text-center py-20 bg-surface-container rounded-xl border border-white/5 border-dashed">
              <span className="material-symbols-outlined text-6xl text-neutral-700 mb-4">event_busy</span>
              <p className="text-neutral-500 font-medium text-lg">No hay horarios generados en el sistema.</p>
              {role === 'admin' && (
                <p className="text-neutral-600 text-sm mt-2">Haz clic en "Generar Nuevo Horario" para iniciar el motor de optimización.</p>
              )}
            </div>
          ) : viewMode === 'list' ? (
            renderListView()
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b border-white/5 text-xs font-black uppercase tracking-widest text-neutral-500 w-44 bg-surface-container-low">
                    <div className="flex flex-col">
                      <span>Hora</span>
                      <span className="text-[8px] text-neutral-600 font-medium normal-case tracking-normal mt-0.5">HP = 40 min</span>
                    </div>
                  </th>
                  {dias.map(dia => (
                    <th key={dia} className="p-4 text-left border-b border-white/5 text-sm font-black text-white bg-surface-container-low">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, slotIdx) => (
                  <tr key={slotIdx} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="p-3 border-b border-white/5 text-xs font-medium text-neutral-400 whitespace-nowrap bg-surface-container-low w-44">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-orange-500/80 text-sm">{time.label}</span>
                        <span className="text-[10px] text-neutral-600 uppercase tracking-widest">{time.group}</span>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <span className="text-[9px] text-neutral-600">HP1: {time.hp1}</span>
                          <span className="text-[9px] text-neutral-600">HP2: {time.hp2}</span>
                        </div>
                      </div>
                    </td>
                    {dias.map((_, diaIdx) => {
                      const celdaHorarios = filteredHorarios.filter(h => h.dia === diaIdx && h.slot === slotIdx);
                      return (
                        <td key={`${diaIdx}-${slotIdx}`} className="p-2 border-b border-white/5 border-l border-white/[0.02] align-top">
                          {celdaHorarios.map((h, i) => (
                            <div 
                              key={i} 
                              className={`p-3 rounded-xl border mb-2 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                                h.tipo_curso === 'Laboratorio' 
                                  ? 'bg-purple-500/10 border-purple-500/20 shadow-purple-900/20 hover:border-purple-500/40' 
                                  : 'bg-blue-500/10 border-blue-500/20 shadow-blue-900/20 hover:border-blue-500/40'
                              }`}
                              onClick={() => setSelectedCourse(h.seccion_codigo)}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-black/40 ${
                                  h.tipo_curso === 'Laboratorio' ? 'text-purple-300' : 'text-blue-300'
                                }`}>
                                  {h.seccion_codigo}
                                </span>
                                <span className="text-[9px] font-bold text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                  P{h.periodo}
                                </span>
                              </div>
                              <p className="font-bold text-xs text-white leading-tight mb-1.5">{h.nombre_curso}</p>
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                                  {h.nombre_aula}
                                </p>
                                <span className="text-[9px] text-neutral-500 uppercase font-bold bg-white/5 px-1 rounded">
                                  {h.turno_seccion}
                                </span>
                              </div>
                              {h.docente_nombre && (
                                <p className="text-[9px] text-neutral-500 mt-1 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[10px]">person</span>
                                  {h.docente_nombre}
                                </p>
                              )}
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

      {/* Modal de Detalle */}
      {selectedCourse && (
        <ScheduleDetailModal 
          entries={getCourseEntries(selectedCourse)}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
