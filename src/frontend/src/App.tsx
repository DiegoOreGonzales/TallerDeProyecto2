import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Classrooms from './pages/Classrooms';
import Sections from './pages/Sections';
import Teachers from './pages/Teachers';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('estudiante');
  const [userName, setUserName] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const savedSession = localStorage.getItem('session_active');
    const savedRole = localStorage.getItem('user_role');
    const savedName = localStorage.getItem('user_name');
    if (savedSession === 'true' && savedRole) {
      setIsLoggedIn(true);
      setUserRole(savedRole);
      setUserName(savedName || 'Usuario');
    }
  }, []);

  const handleLogin = (role: string, name: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    setCurrentView('dashboard');
    localStorage.setItem('session_active', 'true');
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_name', name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('estudiante');
    setUserName('');
    setCurrentView('dashboard');
    localStorage.removeItem('session_active');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('access_token');
  };

  // Protección de rutas: si no es admin, forzar dashboard
  const handleSetView = (view: string) => {
    const adminOnlyViews = ['cursos', 'aulas', 'secciones', 'docentes'];
    if (adminOnlyViews.includes(view) && userRole !== 'admin') {
      setCurrentView('dashboard');
      return;
    }
    setCurrentView(view);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard role={userRole} />;
      case 'cursos':
        return userRole === 'admin' ? <Courses /> : <Dashboard role={userRole} />;
      case 'aulas':
        return userRole === 'admin' ? <Classrooms /> : <Dashboard role={userRole} />;
      case 'secciones':
        return userRole === 'admin' ? <Sections /> : <Dashboard role={userRole} />;
      case 'docentes':
        return userRole === 'admin' ? <Teachers /> : <Dashboard role={userRole} />;
      default:
        return <Dashboard role={userRole} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setCurrentView={handleSetView} 
      onLogout={handleLogout} 
      userRole={userRole}
      userName={userName}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
