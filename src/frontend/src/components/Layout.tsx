import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
  userRole: 'admin' | 'student';
  userName: string;
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setCurrentView, 
  onLogout, 
  userRole, 
  userName,
  activeSubTab = 'general',
  onSubTabChange
}) => {
  return (
    <div className="min-h-screen bg-neutral-900 border-x border-white/5">
      {/* Sidebar - Fixed on the left */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} userRole={userRole} onLogout={onLogout} />
      
      {/* Main Content Area */}
      <main className="ml-72 min-h-screen">
        {/* TopAppBar - Sticky glass panel */}
        <header className="sticky top-0 z-40 w-full px-8 py-4 flex justify-between items-center glass-panel shadow-2xl shadow-orange-900/5">
          <div className="flex items-center gap-8">
            <h2 className="text-3xl font-bold font-headline tracking-tight text-white uppercase italic">
              {currentView === 'dashboard' ? 'Ciclo 2024-II' : currentView}
            </h2>
            {userRole === 'admin' && currentView === 'cursos' && (
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => onSubTabChange?.('general')}
                  className={`${activeSubTab === 'general' ? 'text-orange-500 font-bold border-b-2 border-orange-500' : 'text-neutral-400 font-medium hover:text-white'} pb-1 text-sm font-label transition-all`}
                >
                  General
                </button>
                <button 
                  onClick={() => onSubTabChange?.('facultades')}
                  className={`${activeSubTab === 'facultades' ? 'text-orange-500 font-bold border-b-2 border-orange-500' : 'text-neutral-400 font-medium hover:text-white'} pb-1 text-sm font-label transition-all`}
                >
                  Facultades
                </button>
                <button 
                  onClick={() => onSubTabChange?.('estadisticas')}
                  className={`${activeSubTab === 'estadisticas' ? 'text-orange-500 font-bold border-b-2 border-orange-500' : 'text-neutral-400 font-medium hover:text-white'} pb-1 text-sm font-label transition-all`}
                >
                  Estadísticas
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-500 text-xl">search</span>
              <input 
                className="bg-white/5 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-orange-500 w-64 transition-all duration-300 focus:w-80 text-white placeholder:text-neutral-600" 
                placeholder="Buscar registros..." 
                type="text"
              />
            </div>
            
            {/* User Info - NEW: Showing the username */}
            <div className="flex flex-col items-end px-2">
              <span className="text-sm font-black text-white tracking-widest uppercase">{userName}</span>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">{userRole}</span>
            </div>

            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-orange-500/20 ml-2 cursor-pointer hover:border-orange-500 transition-all">
              <img 
                className="w-full h-full object-cover" 
                alt="Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZK_r32kKnQ32V4LO9qUMeIG8Sx5y1b5075rSYkyQH0hcDHSYxbuyXZwWUA2moj9cniEFfhaa0r02ls8JNESmj7n_8Th-rwr9jQupozzD411W4Kl3xyLtGZHqVgJzIsM8p6QrJ27iJk-v8jbTRmGfIblP-3kBNWUpIZQwVo4KjQh5y0-4VJKZm1-kQXAJLo96XSV8_yUvZu5exOl661_b7hANeI-Wa6Xvh0MaQToxi329p3o6dt5PnmeI_8qssjjajZbaCx9ATdTQ"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>

        {/* Footer */}
        <footer className="p-8 mt-auto border-t border-white/5 text-center">
          <p className="text-[11px] text-neutral-500 font-medium tracking-tight uppercase">
             © 2026 Universidad Continental | Transformación Digital
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
