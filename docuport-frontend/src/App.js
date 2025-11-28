// App.jsx
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Welcome from './pages/Welcome';
import OTPLogin from './pages/OTPLogin';

import { AuthProvider, useAuth } from './context/AuthContext'; // ✅ new

function AppRoutes() {
  const { user, setUser } = useAuth(); // ✅ use context
  const navigate = useNavigate();
  const location = useLocation();

  // 🔄 Load user from localStorage on refresh
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedEmail = localStorage.getItem('user_email');
    if (storedUserId && storedEmail) {
      setUser({ id: storedUserId, email: storedEmail });
    }
  }, [setUser]);


  const handleLogin = (id, email) => {
    localStorage.setItem('user_id', id);
    localStorage.setItem('user_email', email);
    setUser({ id, email });
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    setUser(null);
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div>
      {/* Navbar only if not on welcome page */}
      {location.pathname !== '/' && (
        <nav className="p-4 bg-blue-600 text-white flex justify-between">
          <span>{user ? `Welcome, ${user.email}` : 'DocuPort'}</span>

          <div className="flex gap-2">
            <button
              onClick={handleHome}
              className="bg-green-500 px-3 py-1 rounded"
            >
              Home
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Welcome />} />

        {/* Modified login logic happens inside Welcome.jsx */}
        <Route path="/login" element={<OTPLogin onLogin={handleLogin} />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
