import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types';
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
const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) return VALIDATION_RULES.USERNAME.ERROR_REQUIRED;
  if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    return VALIDATION_RULES.USERNAME.ERROR_MIN_LENGTH;
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return VALIDATION_RULES.PASSWORD.ERROR_REQUIRED;
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

// ===== COMPONENTE =====
interface FieldErrors {
  username?: string;
  password?: string;
}

interface TouchedFields {
  username?: boolean;
  password?: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const validateField = (name: keyof LoginRequest, value: string): string | undefined => {
    return name === 'username' ? validateUsername(value) : validatePassword(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof TouchedFields]) {
      const error = validateField(name as keyof LoginRequest, value);
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
    setValidationError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name as keyof LoginRequest, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      // El error se maneja en el contexto de autenticación
    }
  };

  const isFormValid = !fieldErrors.username && !fieldErrors.password && !isLoading;
  const usernameValid = formData.username && !fieldErrors.username;
  const passwordValid = formData.password && !fieldErrors.password;

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🔐 Iniciar Sesión</h2>
        <p>Accede a tu cuenta para gestionar tus pedidos</p>

        {error && <div className="error-message">{error}</div>}
        {validationError && <div className="error-message">{validationError}</div>}

        <form onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div className="form-group">
            <label htmlFor="username">
              👤 Usuario
              {usernameValid && <span className="field-status valid"> ✓</span>}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              placeholder="Ejemplo: juan.perez"
              autoComplete="username"
              className={fieldErrors.username && touched.username ? 'input-error' : ''}
              aria-invalid={!!(fieldErrors.username && touched.username)}
              aria-describedby={
                fieldErrors.username && touched.username ? 'username-error' : 'username-help'
              }
            />
            {fieldErrors.username && touched.username && (
              <span className="field-error" id="username-error">
                ❌ {fieldErrors.username}
              </span>
            )}
            {!fieldErrors.username && !touched.username && (
              <span className="field-help" id="username-help">
                {FORM_MESSAGES.USERNAME_HINT}
              </span>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password">
              🔑 Contraseña
              {passwordValid && <span className="field-status valid"> ✓</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              placeholder={FORM_MESSAGES.PASSWORD_PLACEHOLDER}
              autoComplete="current-password"
              className={fieldErrors.password && touched.password ? 'input-error' : ''}
              aria-invalid={!!(fieldErrors.password && touched.password)}
              aria-describedby={
                fieldErrors.password && touched.password ? 'password-error' : 'password-help'
              }
            />
            {fieldErrors.password && touched.password && (
              <span className="field-error" id="password-error">
                ❌ {fieldErrors.password}
              </span>
            )}
            {!fieldErrors.password && !touched.username && (
              <span className="field-help" id="password-help">
                {VALIDATION_RULES.PASSWORD.HELP_TEXT}
              </span>
            )}
          </div>

          <button type="submit" disabled={!isFormValid} className="btn-primary">
            {isLoading ? '⏳ Conectando...' : '✨ Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-links">
          <p className="auth-link">
            ¿No tienes cuenta? <Link to="/register">Crear una nueva aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
