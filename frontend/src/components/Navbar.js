import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import '../styles/navbar.css';
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowLogoutConfirm(false);
    };
    const isAuthenticated = !!user;
    return (_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-container", children: [_jsxs("div", { className: "navbar-brand", children: [_jsx("div", { className: "brand-icon", children: "\uD83D\uDCE6" }), _jsx("h1", { children: "Order Manager" })] }), isAuthenticated ? (_jsxs("div", { className: "navbar-content", children: [_jsxs("div", { className: "user-profile", children: [_jsx("div", { className: "user-avatar", children: user.username.charAt(0).toUpperCase() }), _jsxs("div", { className: "user-details", children: [_jsx("div", { className: "user-name", children: user.username }), _jsxs("div", { className: "user-role", children: ["\uD83D\uDC64 ", user.role === 'Admin' ? 'Administrador' : 'Usuario'] })] })] }), _jsx("div", { className: "logout-container", children: !showLogoutConfirm ? (_jsx("button", { onClick: () => setShowLogoutConfirm(true), className: "btn-logout", title: "Cerrar sesi\u00F3n", children: "\uD83D\uDEAA Salir" })) : (_jsxs("div", { className: "logout-confirm", children: [_jsx("span", { children: "\u00BFCerrar sesi\u00F3n?" }), _jsx("button", { onClick: handleLogout, className: "btn-confirm-yes", children: "S\u00ED" }), _jsx("button", { onClick: () => setShowLogoutConfirm(false), className: "btn-confirm-no", children: "No" })] })) })] })) : null] }) }));
};
export default Navbar;
