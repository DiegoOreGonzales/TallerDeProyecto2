import React from 'react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, userRole, onLogout }) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'monitoring' },
    { id: 'cursos', label: 'Cursos', icon: 'book' },
    { id: 'aulas', label: 'Aulas', icon: 'domain' },
    { id: 'secciones', label: 'Secciones', icon: 'groups' },
    { id: 'docentes', label: 'Docentes', icon: 'school' },
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Mi Horario', icon: 'calendar_month' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 border-r border-white/10 glass-panel z-50 flex flex-col py-6 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.5)]">
      {/* Logo UC */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src="/logo-uc.png" 
            alt="UC" 
            className="h-8 object-contain brightness-0 invert opacity-70"
          />
        </div>
        <h1 className="text-2xl font-black text-orange-500 tracking-tighter font-headline">SGOHA</h1>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mt-0.5">
          Generación de Horarios
        </p>
      </div>

      {/* Sección de rol */}
      <div className="px-6 mb-6">
        <div className="px-4 py-2.5 bg-surface-container-high rounded-xl border border-white/5">
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            userRole === 'admin' ? 'text-orange-500' : userRole === 'docente' ? 'text-blue-400' : 'text-green-400'
          }`}>
            {userRole === 'admin' ? '🔑 Administrador' : userRole === 'docente' ? '👨‍🏫 Docente' : '🎓 Estudiante'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-4 px-8 py-3.5 transition-all duration-300 ease-out hover:translate-x-1 group relative ${
              currentView === item.id
                ? 'bg-gradient-to-r from-orange-500/10 to-transparent text-orange-500 border-l-4 border-orange-500'
                : 'text-neutral-500 hover:text-neutral-200'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${currentView === item.id ? 'fill-1' : ''}`}>
              {item.icon}
            </span>
            <span className="font-medium font-headline text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="px-6 mt-auto space-y-3">
        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 text-neutral-500 px-2 py-3 hover:text-red-400 transition-colors duration-300 group"
          >
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">logout</span>
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
