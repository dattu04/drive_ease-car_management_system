import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AuthService from "./services/AuthService";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Setup interceptors and check authentication on mount
  useEffect(() => {
    try {
      // Check if AuthService.setupInterceptors exists before calling it
      if (typeof AuthService.setupInterceptors === 'function') {
        AuthService.setupInterceptors();
      }
      
      const currentUser = AuthService.getCurrentUser();
      console.log("Current user from storage:", currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error("Error during initialization:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Add a listener for localStorage changes to update user state
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error handling storage change:", error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Function to update user state when login/logout occurs
  const handleLogin = (userData) => {
    console.log("Login successful, setting user:", userData);
    setUser(userData);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register onRegisterSuccess={handleLogin} />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;