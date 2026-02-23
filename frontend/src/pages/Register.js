import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import '../styles/auth.css';
// ===== VALIDACIÓN =====
const PASSWORD_REGEX = {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /[0-9]/,
    SPECIAL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALIDATION_RULES = {
    USERNAME: {
        MIN_LENGTH: 3,
        ERROR_REQUIRED: 'El usuario es requerido',
        ERROR_MIN_LENGTH: 'El usuario debe tener al menos 3 caracteres',
    },
    EMAIL: {
        ERROR_REQUIRED: 'El email es requerido',
        ERROR_INVALID: 'El email no es válido',
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        ERROR_REQUIRED: 'La contraseña es requerida',
        ERROR_MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
        ERROR_UPPERCASE: 'Debe contener una mayúscula',
        ERROR_LOWERCASE: 'Debe contener una minúscula',
        ERROR_NUMBER: 'Debe contener un número',
        ERROR_SPECIAL: 'Debe contener un carácter especial',
    },
    CONFIRM_PASSWORD: {
        ERROR_MISMATCH: 'Las contraseñas no coinciden',
    },
};
// ===== UTILIDADES DE VALIDACIÓN =====
const validateUsername = (username) => {
    if (!username.trim())
        return VALIDATION_RULES.USERNAME.ERROR_REQUIRED;
    if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
        return VALIDATION_RULES.USERNAME.ERROR_MIN_LENGTH;
    }
    return undefined;
};
const validateEmail = (email) => {
    if (!email.trim())
        return VALIDATION_RULES.EMAIL.ERROR_REQUIRED;
    if (!EMAIL_REGEX.test(email))
        return VALIDATION_RULES.EMAIL.ERROR_INVALID;
    return undefined;
};
const validatePassword = (password) => {
    if (!password)
        return VALIDATION_RULES.PASSWORD.ERROR_REQUIRED;
    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
        return VALIDATION_RULES.PASSWORD.ERROR_MIN_LENGTH;
    }
    if (!PASSWORD_REGEX.UPPERCASE.test(password)) {
        return VALIDATION_RULES.PASSWORD.ERROR_UPPERCASE;
    }
    if (!PASSWORD_REGEX.LOWERCASE.test(password)) {
        return VALIDATION_RULES.PASSWORD.ERROR_LOWERCASE;
    }
    if (!PASSWORD_REGEX.NUMBER.test(password)) {
        return VALIDATION_RULES.PASSWORD.ERROR_NUMBER;
    }
    if (!PASSWORD_REGEX.SPECIAL.test(password)) {
        return VALIDATION_RULES.PASSWORD.ERROR_SPECIAL;
    }
    return undefined;
};
const validatePasswordMatch = (password, confirmPassword) => {
    return password !== confirmPassword ? VALIDATION_RULES.CONFIRM_PASSWORD.ERROR_MISMATCH : undefined;
};
// ===== COMPONENTE =====
const Register = () => {
    const navigate = useNavigate();
    const { register, isLoading, error } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
        else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        // Limpiar error del campo cuando el usuario empieza a escribir
        setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    };
    const validateFormData = () => {
        const errors = {};
        const usernameError = validateUsername(formData.username);
        if (usernameError)
            errors.username = usernameError;
        const emailError = validateEmail(formData.email);
        if (emailError)
            errors.email = emailError;
        const passwordError = validatePassword(formData.password);
        if (passwordError)
            errors.password = passwordError;
        const confirmPasswordError = validatePasswordMatch(formData.password, confirmPassword);
        if (confirmPasswordError)
            errors.confirmPassword = confirmPasswordError;
        return errors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateFormData();
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        try {
            await register(formData);
            navigate('/dashboard');
        }
        catch (err) {
            // El error se maneja en el contexto de autenticación
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-form", children: [_jsx("h2", { children: "\uD83C\uDF89 Crear Cuenta" }), _jsx("p", { children: "\u00DAnete a nosotros para gestionar tus pedidos f\u00E1cilmente" }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "username", children: "\uD83D\uDC64 Usuario" }), _jsx("input", { type: "text", id: "username", name: "username", value: formData.username, onChange: handleChange, disabled: isLoading, placeholder: "M\u00EDnimo 3 caracteres", autoComplete: "username" }), validationErrors.username && (_jsxs("span", { className: "field-error", children: ["\u274C ", validationErrors.username] }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "\uD83D\uDCE7 Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, disabled: isLoading, placeholder: "ejemplo@correo.com", autoComplete: "email" }), validationErrors.email && (_jsxs("span", { className: "field-error", children: ["\u274C ", validationErrors.email] }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "\uD83D\uDD11 Contrase\u00F1a" }), _jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, disabled: isLoading, placeholder: "M\u00EDn. 8 caracteres (May\u00FAs., min\u00FAs., n\u00FAmero, s\u00EDmbolo)", autoComplete: "new-password" }), validationErrors.password && (_jsxs("span", { className: "field-error", children: ["\u274C ", validationErrors.password] }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirmPassword", children: "\uD83D\uDD10 Confirmar Contrase\u00F1a" }), _jsx("input", { type: "password", id: "confirmPassword", name: "confirmPassword", value: confirmPassword, onChange: handleChange, disabled: isLoading, placeholder: "Confirme su contrase\u00F1a", autoComplete: "new-password" }), validationErrors.confirmPassword && (_jsxs("span", { className: "field-error", children: ["\u274C ", validationErrors.confirmPassword] }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn-primary", children: isLoading ? '⏳ Registrando...' : '✨ Crear Cuenta' })] }), _jsxs("p", { className: "auth-link", children: ["\u00BFYa tienes cuenta? ", _jsx(Link, { to: "/login", children: "Inicia sesi\u00F3n aqu\u00ED" })] })] }) }));
};
export default Register;
