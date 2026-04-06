import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Fixed on the left */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Main Content Area */}
      <main className="ml-64 p-8 min-h-screen transition-all duration-300">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight capitalize">
              {currentView === 'dashboard' ? 'Panel de Control' : currentView}
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-sm text-left">
              Universidad Continental • <span className="text-red-600 font-bold">Gestión Académica</span>
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-700">Administrador de Sistema</span>
              <span className="text-xs text-green-500 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Sistema en línea
              </span>
            </div>
            <button className="relative p-2.5 text-slate-400 hover:text-red-600 transition-all bg-slate-50 hover:bg-red-50 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xl">🔔</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200 mx-1"></div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 uppercase text-[10px] tracking-widest"
            >
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-200 flex justify-between items-center text-slate-400 text-xs font-medium">
          <p>© 2024 Universidad Continental | Todos los derechos reservados.</p>
          <div className="flex gap-6 uppercase tracking-widest">
            <a href="#" className="hover:text-red-500 transition-colors">Soporte</a>
            <a href="#" className="hover:text-red-500 transition-colors">Legal</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
