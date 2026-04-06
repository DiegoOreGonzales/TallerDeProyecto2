import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Classrooms from './pages/Classrooms';
import Sections from './pages/Sections';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'student'>('student');
  const [currentView, setCurrentView] = useState('dashboard');

  // Simple session persistence check
  useEffect(() => {
    const savedSession = localStorage.getItem('session_active');
    const savedRole = localStorage.getItem('user_role');
    if (savedSession === 'true' && savedRole) {
      setIsLoggedIn(true);
      setUserRole(savedRole as 'admin' | 'student');
    }
  }, []);

  const handleLogin = (role: 'admin' | 'student') => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('session_active', 'true');
    localStorage.setItem('user_role', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('session_active');
    localStorage.removeItem('user_role');
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard role={userRole} />;
      case 'cursos':
        return <Courses />;
      case 'aulas':
        return <Classrooms />;
      case 'secciones':
        return <Sections />;
      default:
        return <Dashboard role={userRole} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
}

export default App;
