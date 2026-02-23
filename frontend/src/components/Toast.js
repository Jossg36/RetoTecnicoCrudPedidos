import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import '../styles/toast.css';
export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type = 'info', duration = 4000) => {
        const id = Date.now().toString();
        const toast = { id, message, type, duration };
        setToasts((prev) => [...prev, toast]);
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
        return id;
    };
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    return { toasts, addToast, removeToast };
};
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (_jsxs("div", { className: `toast toast-${type}`, role: "alert", children: [_jsxs("div", { className: "toast-content", children: [_jsxs("span", { className: "toast-icon", children: [type === 'success' && '✓', type === 'error' && '✕', type === 'warning' && '⚠', type === 'info' && 'ℹ'] }), _jsx("span", { className: "toast-message", children: message })] }), _jsx("button", { className: "toast-close", onClick: onClose, "aria-label": "Cerrar notificaci\u00F3n", children: "\u00D7" })] }));
};
const ToastContainer = ({ toasts, onRemove }) => {
    return (_jsx("div", { className: "toast-container", children: toasts.map((toast) => (_jsx(Toast, { ...toast, onClose: () => onRemove(toast.id) }, toast.id))) }));
};
export default ToastContainer;
