import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/types';
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
const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) return VALIDATION_RULES.USERNAME.ERROR_REQUIRED;
  if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    return VALIDATION_RULES.USERNAME.ERROR_MIN_LENGTH;
  }
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return VALIDATION_RULES.EMAIL.ERROR_REQUIRED;
  if (!EMAIL_REGEX.test(email)) return VALIDATION_RULES.EMAIL.ERROR_INVALID;
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

const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | undefined => {
  return password !== confirmPassword ? VALIDATION_RULES.CONFIRM_PASSWORD.ERROR_MISMATCH : undefined;
};

// ===== COMPONENTE =====
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Limpiar error del campo cuando el usuario empieza a escribir
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateFormData = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validatePasswordMatch(formData.password, confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFormData();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // El error se maneja en el contexto de autenticación
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🎉 Crear Cuenta</h2>
        <p>Únete a nosotros para gestionar tus pedidos fácilmente</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div className="form-group">
            <label htmlFor="username">👤 Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Mínimo 3 caracteres"
              autoComplete="username"
            />
            {validationErrors.username && (
              <span className="field-error">❌ {validationErrors.username}</span>
            )}
          </div>

          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
            />
            {validationErrors.email && (
              <span className="field-error">❌ {validationErrors.email}</span>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password">🔑 Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Mín. 8 caracteres (Mayús., minús., número, símbolo)"
              autoComplete="new-password"
            />
            {validationErrors.password && (
              <span className="field-error">❌ {validationErrors.password}</span>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">🔐 Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Confirme su contraseña"
              autoComplete="new-password"
            />
            {validationErrors.confirmPassword && (
              <span className="field-error">❌ {validationErrors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? '⏳ Registrando...' : '✨ Crear Cuenta'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
