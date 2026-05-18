import React, { useState } from 'react';

interface LoginProps {
  onLogin: (role: string, name: string, cycle: number | null, shift: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        onLogin(data.user_role, data.user_name, data.user_cycle, data.user_shift);
      } else {
        const err = await response.json();
        setError(err.detail || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#131313] text-on-surface min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500/20 blur-[80px]"></div>
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[80px]"></div>
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 border-4 border-orange-500/10 rotate-12 opacity-10"></div>
      </div>

      <main className="relative z-10 w-full max-w-[420px] px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo UC Real */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-uc.png" 
              alt="Universidad Continental" 
              className="h-16 object-contain brightness-0 invert"
            />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">SGOHA</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">Sistema de Generación Óptima de Horarios</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel border border-white/5 rounded-xl p-8 shadow-2xl shadow-black/50">
          <h2 className="text-xl font-bold text-white mb-8 tracking-tight">Iniciar Sesión</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="username">Usuario</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-orange-500 transition-colors text-xl">person</span>
                  <input 
                    className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-orange-500/50 text-white rounded-lg py-3.5 pl-12 pr-4 placeholder:text-neutral-600 transition-all" 
                    id="username" 
                    placeholder="admin / estudiante / docente" 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">Contraseña</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-orange-500 transition-colors text-xl">lock</span>
                  <input 
                    className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-orange-500/50 text-white rounded-lg py-3.5 pl-12 pr-12 placeholder:text-neutral-600 transition-all" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                <p className="text-red-400 text-xs font-bold">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-orange-400 to-[#D15800] text-white font-bold py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(255,107,0,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(255,107,0,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                ) : null}
                <span>{loading ? 'Verificando...' : 'Ingresar al Sistema'}</span>
                {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <div className="h-px bg-white/5 flex-grow"></div>
            <span className="text-[10px] font-bold text-on-surface-variant px-4 tracking-tighter uppercase">Autenticación UC</span>
            <div className="h-px bg-white/5 flex-grow"></div>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[11px] text-neutral-500 font-medium tracking-tight">
             © 2026 Universidad Continental. Todos los derechos reservados.
          </p>
        </footer>
      </main>
      
      <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 opacity-50"></div>
    </div>
  );
};

export default Login;
