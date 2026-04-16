import React from 'react';

interface HoraPedagogica {
  hp: number;
  inicio: string;
  fin: string;
}

interface HorarioEntry {
  seccion_id: number;
  seccion_codigo: string;
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

interface ScheduleDetailModalProps {
  entries: HorarioEntry[];
  onClose: () => void;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({ entries, onClose }) => {
  if (entries.length === 0) return null;

  const course = entries[0];
  const totalHP = entries.length * 2; // 2 horas pedagógicas por bloque

  // Agrupar por día
  const byDay: Record<string, HorarioEntry[]> = {};
  entries.forEach(e => {
    const key = e.dia_nombre || `Día ${e.dia}`;
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(e);
  });
  // Ordenar bloques dentro de cada día
  Object.values(byDay).forEach(arr => arr.sort((a, b) => a.slot - b.slot));

  const isLab = course.tipo_curso === 'Laboratorio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b border-white/5 ${isLab ? 'bg-purple-500/5' : 'bg-blue-500/5'}`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md ${
                  isLab ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {course.codigo_curso}
                </span>
                <span className="text-[10px] font-bold text-neutral-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                  P{course.periodo}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                  isLab ? 'text-purple-400 bg-purple-500/10' : 'text-blue-400 bg-blue-500/10'
                }`}>
                  {course.tipo_curso}
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">{course.nombre_curso}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-neutral-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-white/5">
          <div className="bg-white/[0.03] p-3 rounded-xl">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Créditos</p>
            <p className="text-2xl font-black text-white">{course.creditos}</p>
          </div>
          <div className="bg-white/[0.03] p-3 rounded-xl">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Horas Ped./Sem</p>
            <p className="text-2xl font-black text-white">{totalHP}</p>
          </div>
          <div className="bg-white/[0.03] p-3 rounded-xl">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Turno</p>
            <p className="text-lg font-bold text-orange-400">{course.turno_seccion}</p>
          </div>
          <div className="bg-white/[0.03] p-3 rounded-xl">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Sección</p>
            <p className="text-lg font-bold text-white">{course.seccion_codigo}</p>
          </div>
        </div>

        {/* Docente & Aula */}
        <div className="px-6 py-4 border-b border-white/5 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-500 text-lg">person</span>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Docente</p>
              <p className="text-sm font-bold text-white">{course.docente_nombre}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-500 text-lg">location_on</span>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Aula</p>
              <p className="text-sm font-bold text-white">{course.nombre_aula}</p>
            </div>
          </div>
        </div>

        {/* Sesiones por Día */}
        <div className="p-6">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Distribución Semanal de Sesiones
          </h3>
          <div className="space-y-4">
            {Object.entries(byDay).map(([dayName, dayEntries]) => (
              <div key={dayName} className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
                  <h4 className="text-sm font-black text-orange-400 uppercase tracking-wide">{dayName}</h4>
                </div>
                <div className="p-4 space-y-3">
                  {dayEntries.map((entry, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      {/* Bloque Principal */}
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-12 rounded-full ${isLab ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-black text-sm">
                              {entry.hora_inicio} — {entry.hora_fin}
                            </span>
                            <span className="text-[10px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded font-bold">
                              Bloque {entry.slot + 1}
                            </span>
                          </div>
                          {/* Horas Pedagógicas Detalladas */}
                          <div className="flex flex-wrap gap-2">
                            {entry.horas_pedagogicas?.map((hp, hpIdx) => (
                              <div key={hpIdx} className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5">
                                <span className={`text-[9px] font-black ${isLab ? 'text-purple-400' : 'text-blue-400'}`}>
                                  HP{hp.hp}
                                </span>
                                <span className="text-[11px] font-bold text-neutral-300">
                                  {hp.inicio} – {hp.fin}
                                </span>
                                <span className="text-[9px] text-neutral-600 font-medium">
                                  (40 min)
                                </span>
                              </div>
                            ))}
                            {entry.horas_pedagogicas && entry.horas_pedagogicas.length > 1 && (
                              <div className="flex items-center gap-1 text-[9px] text-neutral-600">
                                <span className="material-symbols-outlined text-[12px]">coffee</span>
                                <span className="font-medium">Receso: 10 min</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <p className="text-[10px] text-neutral-600 font-medium">
            {entries.length} bloque(s) · {totalHP} horas pedagógicas semanales · {Object.keys(byDay).length} día(s) activo(s)
          </p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
