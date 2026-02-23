import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import ToastContainer, { useToast } from '@/components/Toast';
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
export const ToastContext = React.createContext(null);
const App = () => {
    const toast = useToast();
    return (_jsx(Router, { children: _jsx(AuthProvider, { children: _jsx(ToastContext.Provider, { value: toast, children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', minHeight: '100vh' }, children: [_jsx(Navbar, {}), _jsx("div", { style: { flex: 1 }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPassword, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) }), _jsx(ToastContainer, { toasts: toast.toasts, onRemove: toast.removeToast })] }) }) }) }));
};
export default App;
