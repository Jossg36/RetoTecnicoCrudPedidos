import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
// ===== CONFIGURACIÓN =====
const API_BASE = 'http://localhost:5000';
const FORGOT_PASSWORD_ENDPOINT = `${API_BASE}/api/auth/forgot-password`;
const REDIRECT_DELAY = 4000; // 4 segundos
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_MESSAGES = {
    EMPTY_EMAIL: 'Por favor ingresa tu correo electrónico',
    INVALID_EMAIL: 'Por favor ingresa un correo válido',
    CONNECTION: 'Error de conexión. Asegúrate que el servidor esté corriendo en localhost:5000',
    SERVER: 'Error del servidor. Por favor intenta más tarde.',
};
const SUCCESS_MESSAGE = 'Se ha enviado un enlace de recuperación a tu correo. ' +
    'Por favor revisa tu bandeja de entrada (y carpeta de spam).';
// ===== VALIDACIÓN =====
const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail)
        return ERROR_MESSAGES.EMPTY_EMAIL;
    if (!EMAIL_REGEX.test(trimmedEmail))
        return ERROR_MESSAGES.INVALID_EMAIL;
    return undefined;
};
// ===== COMPONENTE =====
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [isLoading, setIsLoading] = useState(false);
    const handleEmailChange = (value) => {
        setEmail(value);
        setMessage('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        // Validar email
        const validationError = validateEmail(email);
        if (validationError) {
            setMessageType('error');
            setMessage(validationError);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (response.ok) {
                const data = await response.json();
                setMessageType('success');
                setMessage(data.message || SUCCESS_MESSAGE);
                setEmail('');
                // Redirigir después del delay
                setTimeout(() => navigate('/login'), REDIRECT_DELAY);
            }
            else {
                // Intenta obtener mensaje del servidor
                try {
                    const data = await response.json();
                    setMessageType('error');
                    setMessage(data.message || ERROR_MESSAGES.SERVER);
                }
                catch {
                    setMessageType('error');
                    setMessage(`Error ${response.status}: ${ERROR_MESSAGES.SERVER}`);
                }
            }
        }
        catch (error) {
            setMessageType('error');
            setMessage(ERROR_MESSAGES.CONNECTION);
            console.error('Fetch error:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-form", children: [_jsx("h2", { children: "\uD83D\uDD11 Recuperar Contrase\u00F1a" }), _jsx("p", { children: "Ingresa tu correo para recibir instrucciones de recuperaci\u00F3n" }), message && (_jsx("div", { className: `${messageType === 'success' ? 'success-message' :
                        messageType === 'error' ? 'error-message' : 'info-message'}`, children: message })), !message && (_jsx("div", { className: "info-message", children: "\uD83D\uDCE7 Recibir\u00E1s un email con un enlace para resetear tu contrase\u00F1a. El enlace expirar\u00E1 en 1 hora por seguridad." })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "\uD83D\uDCE7 Correo Electr\u00F3nico" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => handleEmailChange(e.target.value), disabled: isLoading, placeholder: "tu.email@ejemplo.com", autoComplete: "email" })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn-primary", children: isLoading ? '⏳ Enviando...' : '📨 Enviar Enlace de Recuperación' })] }), _jsxs("p", { className: "auth-link", children: ["\u00BFRecuerdas tu contrase\u00F1a? ", _jsx(Link, { to: "/login", children: "Volver a Iniciar Sesi\u00F3n" })] })] }) }));
};
export default ForgotPassword;
