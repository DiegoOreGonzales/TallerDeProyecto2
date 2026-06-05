import React from 'react';

const Faculties: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-surface-container-low p-12 rounded-3xl border border-white/5 shadow-2xl text-center">
        <div className="flex flex-col items-center gap-6 py-16">
          <span className="material-symbols-outlined text-7xl text-neutral-600">
            business
          </span>
          <h2 className="text-3xl font-bold font-headline text-white">
            Módulo de Facultades
          </h2>
          <p className="text-neutral-400 text-lg max-w-md">
            Esta funcionalidad estará disponible próximamente. 
            Permite gestionar las facultades y escuelas profesionales.
          </p>
          <span className="px-6 py-2 bg-orange-500/10 text-orange-400 rounded-full text-xs font-black uppercase tracking-widest">
            Próximamente
          </span>
        </div>
      </section>
    </div>
  );
};

export default Faculties;
