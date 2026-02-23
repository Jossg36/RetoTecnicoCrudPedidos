import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import ToastContainer, { useToast } from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import '@/styles/global.css';
import '@/styles/toast.css';
import '@/styles/skeleton.css';
import '@/styles/modal.css';
import '@/styles/validation.css';
import '@/styles/stats.css';
import '@/styles/empty-state.css';

// Context para Toast
export const ToastContext = React.createContext<ReturnType<typeof useToast> | null>(null);

const App: React.FC = () => {
  const toast = useToast();

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastContext.Provider value={toast}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <div style={{ flex: 1 }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
              <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
            </div>
          </ToastContext.Provider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
