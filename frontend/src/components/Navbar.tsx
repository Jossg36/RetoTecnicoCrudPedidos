import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const isAuthenticated = !!user;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">📦</div>
          <h1>Order Manager</h1>
        </div>

        {isAuthenticated ? (
          <div className="navbar-content">
            <div className="user-profile">
              <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <div className="user-name">{user.username}</div>
                <div className="user-role">👤 {user.role === 'Admin' ? 'Administrador' : 'Usuario'}</div>
              </div>
            </div>

            <div className="logout-container">
              {!showLogoutConfirm ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="btn-logout"
                  title="Cerrar sesión"
                >
                  🚪 Salir
                </button>
              ) : (
                <div className="logout-confirm">
                  <span>¿Cerrar sesión?</span>
                  <button onClick={handleLogout} className="btn-confirm-yes">
                    Sí
                  </button>
                  <button onClick={() => setShowLogoutConfirm(false)} className="btn-confirm-no">
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
