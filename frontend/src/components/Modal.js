import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import '../styles/modal.css';
const Modal = ({ isOpen, title, children, onClose, size = 'large' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsxs("div", { className: `modal modal-${size}`, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { children: title }), _jsx("button", { className: "modal-close", onClick: onClose, "aria-label": "Cerrar modal", children: "\u00D7" })] }), _jsx("div", { className: "modal-body", children: children })] }) }));
};
export default Modal;
