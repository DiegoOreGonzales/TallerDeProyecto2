import React, { useState, useEffect } from 'react';

interface Horario {
  nombre_curso: string;
  nombre_aula: string;
  dia: number;
  slot: number;
}

interface DashboardProps {
  role: 'admin' | 'student';
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchHorarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/scheduler/generate', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.data) {
        setHorarios(data.data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const generateHorario = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch('http://localhost:8000/api/scheduler/generate', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.data) {
        setHorarios(data.data);
        setMessage("¡Nuevo horario optimizado generado con éxito!");
      } else {
        setMessage("Error: " + data.detail);
      }
    } catch (error) {
      setMessage("Error conectando al servidor de optimización");
    }
    setLoading(false);
  };

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const slots = [
    "07:00", "08:35", "10:10", "11:45", "14:00", "15:35", "17:10", "18:45", "20:20"
  ];

  return (
    <div className="space-y-8">
      {/* Stats / Welcome Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
            📚
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Cursos</p>
            <h3 className="text-2xl font-black text-slate-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl font-bold">
            🏢
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Aulas</p>
            <h3 className="text-2xl font-black text-slate-800">8</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Estado</p>
            <h3 className="text-2xl font-black text-slate-800">Óptimo</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Bienvenido, {role === 'admin' ? 'Administrador' : 'Estudiante'}
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {role === 'admin' 
              ? 'Gestión completa del sistema y optimización de horarios.' 
              : 'Consulta tu horario de clases y disponibilidad de aulas.'}
          </p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={generateHorario}
            disabled={loading}
            className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 flex items-center gap-3 ${
              loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><span>⚡</span> Generar Optimización</>
            )}
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
          message.includes("Error") 
            ? 'bg-red-50 border-red-100 text-red-700' 
            : 'bg-green-50 border-green-100 text-green-700'
        }`}>
          <div className="flex items-center gap-3 font-bold text-sm">
            <span>{message.includes("Error") ? '❌' : '✅'}</span>
            {message}
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 border-b border-r border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center w-24">Hora</th>
                {days.map(day => (
                  <th key={day} className="p-4 border-b border-slate-100 text-slate-700 font-bold text-xs text-center uppercase tracking-wider">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, sIdx) => (
                <tr key={slot} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 border-b border-r border-slate-50 bg-slate-50/20 text-slate-500 font-bold text-xs text-center whitespace-nowrap">
                    {slot}
                  </td>
                  {days.map((_, dIdx) => {
                    const item = horarios.find(h => h.dia === dIdx && h.slot === sIdx);
                    return (
                      <td key={dIdx} className="p-1.5 border-b border-slate-50 w-1/7 min-w-[140px]">
                        {item ? (
                          <div className="h-full w-full p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200/50 shadow-sm animate-in zoom-in-95 duration-300 flex flex-col justify-center items-center text-center">
                            <span className="font-bold text-red-900 text-[11px] leading-tight mb-1 uppercase tracking-tight">{item.nombre_curso}</span>
                            <span className="text-[9px] font-black text-red-600 uppercase bg-white/50 px-2 rounded-md border border-red-200/30">{item.nombre_aula}</span>
                          </div>
                        ) : (
                          <div className="h-16 w-full border border-dashed border-slate-100 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-slate-300 text-[10px] font-bold uppercase">Libre</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
