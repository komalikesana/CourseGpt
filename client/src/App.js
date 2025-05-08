import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LessonGenerator from './components/LessonGenerator';
import ModuleOrganizer from './components/ModuleOrganizer';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('lessonGenerator');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    navigate('/lesson');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {isAuthenticated && (
          <Navbar setActiveSection={setActiveSection} handleLogout={handleLogout} />
        )}

        {/* Routes */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/lesson" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/lesson" />
                ) : (
                  <Signup onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/lesson"
              element={
                isAuthenticated ? (
                  activeSection === 'lessonGenerator' ? (
                    <LessonGenerator />
                  ) : (
                    <ModuleOrganizer />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/module"
              element={
                isAuthenticated ? (
                  activeSection === 'lessonGenerator' ? (
                    <LessonGenerator />
                  ) : (
                    <ModuleOrganizer />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/lesson" : "/login"} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;