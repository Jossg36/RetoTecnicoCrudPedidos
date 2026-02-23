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
const VALIDATION_RULES = {
    USERNAME: {
        MIN_LENGTH: 3,
        ERROR_REQUIRED: 'El usuario es requerido',
        ERROR_MIN_LENGTH: 'El usuario debe tener al menos 3 caracteres',
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        ERROR_REQUIRED: 'La contraseña es requerida',
        ERROR_MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
        ERROR_UPPERCASE: 'Debe incluir al menos una mayúscula',
        ERROR_LOWERCASE: 'Debe incluir al menos una minúscula',
        ERROR_NUMBER: 'Debe incluir al menos un número',
        ERROR_SPECIAL: 'Debe incluir al menos un carácter especial (!@#$%^&*...)',
        HELP_TEXT: 'Ejemplo: SecurePass123! (mayúscula, minúscula, número, símbolo)',
    },
};
const FORM_MESSAGES = {
    USERNAME_HINT: 'Usa el usuario registrado en tu cuenta, no es el email',
    PASSWORD_PLACEHOLDER: 'Mín. 8 caracteres (Mayús., minús., número, símbolo)',
    FORM_ERROR: 'Por favor completa el formulario correctamente',
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
const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [validationError, setValidationError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const validateField = (name, value) => {
        return name === 'username' ? validateUsername(value) : validatePassword(value);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const error = validateField(name, value);
            setFieldErrors((prev) => ({ ...prev, [name]: error }));
        }
        setValidationError('');
    };
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setFieldErrors((prev) => ({ ...prev, [name]: error }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        // Validar todos los campos
        const usernameError = validateUsername(formData.username);
        const passwordError = validatePassword(formData.password);
        setTouched({ username: true, password: true });
        setFieldErrors({ username: usernameError, password: passwordError });
        if (usernameError || passwordError) {
            setValidationError(FORM_MESSAGES.FORM_ERROR);
            return;
        }
        try {
            await login(formData);
            navigate('/dashboard');
        }
        catch (err) {
            // El error se maneja en el contexto de autenticación
        }
    };
    const isFormValid = !fieldErrors.username && !fieldErrors.password && !isLoading;
    const usernameValid = formData.username && !fieldErrors.username;
    const passwordValid = formData.password && !fieldErrors.password;
    return (_jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-form", children: [_jsx("h2", { children: "\uD83D\uDD10 Iniciar Sesi\u00F3n" }), _jsx("p", { children: "Accede a tu cuenta para gestionar tus pedidos" }), error && _jsx("div", { className: "error-message", children: error }), validationError && _jsx("div", { className: "error-message", children: validationError }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "username", children: ["\uD83D\uDC64 Usuario", usernameValid && _jsx("span", { className: "field-status valid", children: " \u2713" })] }), _jsx("input", { type: "text", id: "username", name: "username", value: formData.username, onChange: handleChange, onBlur: handleBlur, disabled: isLoading, placeholder: "Ejemplo: juan.perez", autoComplete: "username", className: fieldErrors.username && touched.username ? 'input-error' : '', "aria-invalid": !!(fieldErrors.username && touched.username), "aria-describedby": fieldErrors.username && touched.username ? 'username-error' : 'username-help' }), fieldErrors.username && touched.username && (_jsxs("span", { className: "field-error", id: "username-error", children: ["\u274C ", fieldErrors.username] })), !fieldErrors.username && !touched.username && (_jsx("span", { className: "field-help", id: "username-help", children: FORM_MESSAGES.USERNAME_HINT }))] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "password", children: ["\uD83D\uDD11 Contrase\u00F1a", passwordValid && _jsx("span", { className: "field-status valid", children: " \u2713" })] }), _jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, onBlur: handleBlur, disabled: isLoading, placeholder: FORM_MESSAGES.PASSWORD_PLACEHOLDER, autoComplete: "current-password", className: fieldErrors.password && touched.password ? 'input-error' : '', "aria-invalid": !!(fieldErrors.password && touched.password), "aria-describedby": fieldErrors.password && touched.password ? 'password-error' : 'password-help' }), fieldErrors.password && touched.password && (_jsxs("span", { className: "field-error", id: "password-error", children: ["\u274C ", fieldErrors.password] })), !fieldErrors.password && !touched.username && (_jsx("span", { className: "field-help", id: "password-help", children: VALIDATION_RULES.PASSWORD.HELP_TEXT }))] }), _jsx("button", { type: "submit", disabled: !isFormValid, className: "btn-primary", children: isLoading ? '⏳ Conectando...' : '✨ Iniciar Sesión' })] }), _jsx("div", { className: "auth-links", children: _jsxs("p", { className: "auth-link", children: ["\u00BFNo tienes cuenta? ", _jsx(Link, { to: "/register", children: "Crear una nueva aqu\u00ED" })] }) })] }) }));
};
export default Login;
