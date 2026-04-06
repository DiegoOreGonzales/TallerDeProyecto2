import React, { useState } from 'react';

interface LoginProps {
  onLogin: (role: 'admin' | 'student') => void;
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

    // Simulating a login delay and role assignment
    // In a real app, this would call the backend /auth/login endpoint
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin('admin');
      } else if (username === 'estudiante' && password === 'ucontinental') {
        onLogin('student');
      } else {
        setError('Credenciales incorrectas. Pruebe con admin/admin o estudiante/ucontinental');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-800/10 blur-[120px]"></div>

      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-xl mb-6">
            <span className="text-white text-4xl block">🎓</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Portal Académico</h1>
          <p className="text-slate-400 font-medium">Universidad Continental</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2 ml-1" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
              placeholder="Ej: admin o estudiante"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2 ml-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-shake">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Ingresar al Sistema"
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
            Dirección de Transformación Digital
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
