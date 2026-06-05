import React, { useState } from 'react';

interface CourseItem {
  nombre: string;
  creditos: number;
  codigo: string;
}

interface StudyCycle {
  numero: string;
  totalCreditos: number;
  cursos: CourseItem[];
}

// Plan de estudios - ARQUITECTURA
const ARCHITECTURE_PLAN: StudyCycle[] = [
  {
    numero: "01",
    totalCreditos: 23,
    cursos: [
      { nombre: "Comprensión y Producción de Textos 1", creditos: 3, codigo: "ARQ-101" },
      { nombre: "Laboratorio de Liderazgo e Innovación", creditos: 3, codigo: "ARQ-102" },
      { nombre: "Estrategias y Herramientas Digitales para el Aprendizaje", creditos: 4, codigo: "ARQ-103" },
      { nombre: "Matemática Básica", creditos: 4, codigo: "ARQ-104" },
      { nombre: "Taller de diseño arquitectónico 1: Fundamentos y Teoría", creditos: 3, codigo: "ARQ-105" },
      { nombre: "Antropología Urbana", creditos: 2, codigo: "ARQ-106" }
    ]
  },
  {
    numero: "02",
    totalCreditos: 21,
    cursos: [
      { nombre: "Comprensión y Producción de Textos 2", creditos: 4, codigo: "ARQ-201" },
      { nombre: "Electivo General 1", creditos: 3, codigo: "ARQ-202" },
      { nombre: "Física para Arquitectos 1", creditos: 3, codigo: "ARQ-203" },
      { nombre: "Seguridad en Arquitectura", creditos: 1, codigo: "ARQ-204" },
      { nombre: "Taller de diseño arquitectónico 2: Composición, Arquitectura y Territorio", creditos: 4, codigo: "ARQ-205" },
      { nombre: "Representación en Arquitectura 2", creditos: 4, codigo: "ARQ-206" },
      { nombre: "Sociología Urbana", creditos: 2, codigo: "ARQ-207" }
    ]
  },
  {
    numero: "03",
    totalCreditos: 23,
    cursos: [
      { nombre: "Estadística y Probabilidades", creditos: 4, codigo: "ARQ-301" },
      { nombre: "Electivo General 2", creditos: 3, codigo: "ARQ-302" },
      { nombre: "Laboratorio de Liderazgo e Innovación Intermedio", creditos: 2, codigo: "ARQ-303" },
      { nombre: "Taller de diseño arquitectónico 3: Urbano 1", creditos: 3, codigo: "ARQ-304" },
      { nombre: "Física para Arquitectos 2", creditos: 2, codigo: "ARQ-305" },
      { nombre: "Representación en Arquitectura 3", creditos: 4, codigo: "ARQ-306" },
      { nombre: "Ciudad, Territorio y Paisaje 1", creditos: 2, codigo: "ARQ-307" },
      { nombre: "Historia de la Arquitectura y el Arte 1", creditos: 3, codigo: "ARQ-308" }
    ]
  }
];

// Plan de estudios - INGENIERÍA DE SISTEMAS E INFORMÁTICA (Basado en la nueva imagen)
const SYSTEMS_PLAN: StudyCycle[] = [
  {
    numero: "01",
    totalCreditos: 23,
    cursos: [
      { nombre: "Comprensión y Producción de Textos 1", creditos: 3, codigo: "SIS-101" },
      { nombre: "Laboratorio de Liderazgo e Innovación", creditos: 3, codigo: "SIS-102" },
      { nombre: "Estrategias y Herramientas Digitales para el Aprendizaje", creditos: 4, codigo: "SIS-103" },
      { nombre: "Matemática Básica", creditos: 4, codigo: "SIS-104" },
      { nombre: "Matemática Discreta 1", creditos: 4, codigo: "SIS-105" },
      { nombre: "Técnicas de Programación", creditos: 2, codigo: "SIS-106" },
      { nombre: "Introducción a la Ingeniería de Sistemas e Informática", creditos: 3, codigo: "SIS-107" }
    ]
  },
  {
    numero: "02",
    totalCreditos: 24,
    cursos: [
      { nombre: "Comprensión y Producción de Textos 2", creditos: 4, codigo: "SIS-201" },
      { nombre: "Electivo General 1", creditos: 3, codigo: "SIS-202" },
      { nombre: "Álgebra Lineal y Geometría Analítica", creditos: 4, codigo: "SIS-203" },
      { nombre: "Modelado de Negocios", creditos: 3, codigo: "SIS-204" },
      { nombre: "Matemática Superior", creditos: 4, codigo: "SIS-205" },
      { nombre: "Matemática Discreta 2", creditos: 4, codigo: "SIS-206" },
      { nombre: "Programación Orientada a Objetos", creditos: 2, codigo: "SIS-207" }
    ]
  },
  {
    numero: "03",
    totalCreditos: 24,
    cursos: [
      { nombre: "Estadística y Probabilidades", creditos: 4, codigo: "SIS-301" },
      { nombre: "Electivo General 2", creditos: 3, codigo: "SIS-302" },
      { nombre: "Laboratorio de Liderazgo e Innovación Intermedio", creditos: 2, codigo: "SIS-303" },
      { nombre: "Cálculo Diferencial", creditos: 4, codigo: "SIS-304" },
      { nombre: "Física 1", creditos: 4, codigo: "SIS-305" },
      { nombre: "Base de Datos 1", creditos: 3, codigo: "SIS-306" },
      { nombre: "Diseño Web", creditos: 2, codigo: "SIS-307" },
      { nombre: "Estructura de Datos", creditos: 2, codigo: "SIS-308" }
    ]
  }
];

const CAREERS = [
  { nombre: "Arquitectura", habilitado: true },
  { nombre: "Arquitectura y Diseño de Interiores", habilitado: false },
  { nombre: "Ingeniería Ambiental", habilitado: false },
  { nombre: "Ingeniería Civil", habilitado: false },
  { nombre: "Ingeniería de Minas", habilitado: false },
  { nombre: "Ingeniería de Sistemas e Informática", habilitado: true },
  { nombre: "Ingeniería Eléctrica", habilitado: false },
  { nombre: "Ingeniería Empresarial", habilitado: false },
  { nombre: "Ingeniería Industrial", habilitado: false },
  { nombre: "Ingeniería Mecánica", habilitado: false },
  { nombre: "Ingeniería Mecatrónica", habilitado: false }
];

const Faculties: React.FC = () => {
  const userRole = localStorage.getItem('user_role') || 'estudiante';
  const userCareer = localStorage.getItem('user_career') || 'Ingeniería de Sistemas e Informática';

  // Lock selected career to assigned career for students and docentes, default to 'Arquitectura' for admins
  const initialCareer = userRole === 'admin' ? 'Arquitectura' : userCareer;
  const [selectedCareer, setSelectedCareer] = useState<string>(initialCareer);
  
  const [loadingImport, setLoadingImport] = useState(false);
  const [importedCareer, setImportedCareer] = useState<string | null>(null);

  const activePlan = selectedCareer === "Arquitectura" ? ARCHITECTURE_PLAN : SYSTEMS_PLAN;
  const planTitle = selectedCareer === "Arquitectura" ? "Arquitectura" : "Ingeniería de Sistemas e Informática";

  const handleImportSyllabus = async () => {
    setLoadingImport(true);
    try {
      const allCursos = activePlan.flatMap((cycle) => 
        cycle.cursos.map(c => ({
          codigo: c.codigo,
          nombre: c.nombre,
          creditos: c.creditos,
          tipo: c.nombre.toLowerCase().includes("programación") || c.nombre.toLowerCase().includes("datos") || c.nombre.toLowerCase().includes("taller") || c.nombre.toLowerCase().includes("laboratorio") || c.nombre.toLowerCase().includes("web") ? "Laboratorio" : "Teoría",
          periodo: parseInt(cycle.numero)
        }))
      );

      for (const curso of allCursos) {
        await fetch('http://localhost:8000/api/cursos/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(curso),
        });
      }
      setImportedCareer(selectedCareer);
      setTimeout(() => setImportedCareer(null), 5000);
    } catch (err) {
      console.error("Error al importar plan de estudios:", err);
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Banner de Especialidad para Estudiantes y Docentes */}
      {userRole !== 'admin' && (
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border border-purple-500/20 rounded-3xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-400">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Portal Académico Autorizado</span>
            <h3 className="text-lg font-black text-white mt-0.5">Especialidad Designada</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Como {userRole === 'docente' ? 'docente' : 'estudiante'} oficial de la Universidad Continental, tienes acceso exclusivo a la malla curricular de <strong className="text-purple-300 font-bold">{userCareer}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* 🏛️ Facultad de Ingeniería Box (Visible ONLY for admin matching Image 1) */}
      {userRole === 'admin' && (
        <div className="bg-surface-container-low rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="h-1.5 bg-gradient-to-r from-purple-600 to-indigo-500 w-full"></div>
          <div className="p-8">
            <h3 className="text-2xl font-black font-headline text-purple-400 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-purple-400">domain</span>
              Facultad de Ingeniería
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              {CAREERS.map((career, idx) => (
                <div 
                  key={idx}
                  onClick={() => career.habilitado && setSelectedCareer(career.nombre)}
                  className={`py-2 flex items-center gap-2 group ${
                    career.habilitado 
                      ? 'cursor-pointer text-purple-300 hover:text-white' 
                      : 'text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-all ${
                    selectedCareer === career.nombre 
                      ? 'bg-purple-400 scale-125' 
                      : 'bg-white/10 group-hover:bg-purple-500'
                  }`}></span>
                  <span className={`text-sm font-medium transition-all ${
                    selectedCareer === career.nombre 
                      ? 'font-black underline decoration-purple-500 decoration-2 underline-offset-4 text-white' 
                      : 'hover:underline hover:decoration-white/30 hover:underline-offset-4'
                  }`}>
                    {career.nombre}
                  </span>
                  {!career.habilitado && (
                    <span className="text-[9px] font-bold text-neutral-700 bg-white/[0.02] border border-white/5 px-1.5 py-0.5 rounded uppercase tracking-widest scale-90">
                      Próximamente
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📐 Plan de estudios Dinámico (Matching Image 2) */}
      {(selectedCareer === "Arquitectura" || selectedCareer === "Ingeniería de Sistemas e Informática") && (
        <div className="bg-surface-container-low rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden space-y-8 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
            <div>
              <h4 className="text-3xl font-black font-headline text-white flex flex-wrap items-center gap-3">
                <span className="text-purple-500 font-serif italic">{planTitle}:</span> Plan de estudios
              </h4>
              <p className="text-xs text-neutral-500 mt-1 font-medium tracking-wide">
                Plan curricular oficial de la Universidad Continental · Periodo Académico Integrado
              </p>
            </div>
            
            {userRole === 'admin' && (
              <button
                onClick={handleImportSyllabus}
                disabled={loadingImport}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${
                  importedCareer === selectedCareer 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-300' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {importedCareer === selectedCareer ? 'check_circle' : loadingImport ? 'sync' : 'cloud_upload'}
                </span>
                {importedCareer === selectedCareer ? '¡Plan Importado!' : loadingImport ? 'Importando Plan...' : `Cargar Plan de ${selectedCareer === 'Arquitectura' ? 'Arquitectura' : 'Sistemas'}`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activePlan.map((cycle, cycleIdx) => (
              <div key={cycleIdx} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors flex flex-col justify-between">
                
                <div>
                  {/* Cycle Title and Progress (matching image typography and layout) */}
                  <div className="flex justify-between items-baseline mb-4">
                    <h5 className="text-6xl font-black font-serif italic text-purple-500 tracking-tighter">
                      {cycle.numero}
                    </h5>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Plan de Estudios</span>
                      <span className="text-xs font-black text-purple-300">Total de créditos {cycle.totalCreditos}</span>
                    </div>
                  </div>

                  {/* Progress Purple Squares (Matching the horizontal blocks in Image 2) */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 rounded flex-1 transition-colors ${
                          i < (cycle.cursos.length)
                            ? 'bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.3)]' 
                            : 'bg-neutral-800'
                        }`}
                      ></div>
                    ))}
                  </div>

                  {/* Course List */}
                  <ul className="space-y-4">
                    {cycle.cursos.map((curso, cursoIdx) => (
                      <li key={cursoIdx} className="flex items-start justify-between gap-3 group">
                        <div className="flex items-start gap-2.5">
                          {/* Custom square bullet matches the modern layout */}
                          <span className="w-1.5 h-1.5 rounded bg-purple-500 mt-1.5 group-hover:scale-125 transition-transform"></span>
                          <span className="text-xs font-bold text-neutral-300 leading-relaxed group-hover:text-white transition-colors">
                            {curso.nombre}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest bg-white/5 border border-white/10 px-1.5 py-0.5 rounded whitespace-nowrap self-start mt-0.5">
                          C.{curso.creditos}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default Faculties;
