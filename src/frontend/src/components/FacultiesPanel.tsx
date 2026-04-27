import React from 'react';

const FacultiesPanel: React.FC = () => {
  const careers = [
    "Arquitectura",
    "Arquitectura y Diseño de Interiores",
    "Ingeniería Ambiental",
    "Ingeniería Civil",
    "Ingeniería de Minas",
    "Ingeniería de Sistemas e Informática",
    "Ingeniería Eléctrica",
    "Ingeniería Empresarial",
    "Ingeniería Industrial",
    "Ingeniería Mecánica",
    "Ingeniería Mecatrónica"
  ];

  return (
    <div className="bg-surface-container-low p-10 rounded-[2rem] border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full"></div>
      
      <div className="mb-10 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[2px] bg-orange-500 rounded-full"></span>
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Directorio Académico</span>
        </div>
        <h2 className="text-3xl font-bold font-headline text-white tracking-tight">Facultad de Ingeniería</h2>
        <p className="text-neutral-500 text-sm mt-2 max-w-xl">
          Gestión y consulta de programas académicos pertenecientes a la facultad. 
          Seleccione una carrera para ver su configuración detallada.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {careers.map((career, index) => (
          <a 
            key={index} 
            href="#" 
            className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-orange-500/30 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <span className="material-symbols-outlined text-orange-500 text-xl font-light">account_tree</span>
              </div>
              <span className="text-neutral-300 group-hover:text-white transition-colors text-sm font-semibold tracking-tight">
                {career}
              </span>
            </div>
            <span className="material-symbols-outlined text-neutral-700 group-hover:text-orange-500 group-hover:translate-x-1 transition-all text-lg">arrow_forward_ios</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FacultiesPanel;
