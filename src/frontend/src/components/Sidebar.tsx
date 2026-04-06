import React from 'react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel', icon: '📊' },
    { id: 'cursos', label: 'Cursos', icon: '📚' },
    { id: 'aulas', label: 'Aulas', icon: '🏢' },
    { id: 'secciones', label: 'Secciones', icon: '👥' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-white p-6 shadow-2xl z-50">
      <div className="flex flex-col h-full">
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 animate-in fade-in duration-700">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-900/40">
            C
          </div>
          <span className="font-black text-lg tracking-tight uppercase">Continental</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`text-xl transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
              {currentView === item.id && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Profile/About */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center font-bold text-xs border border-white/10">
                AD
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-tighter">Admin User</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Continental OS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
