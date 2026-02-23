import React, { useState } from 'react';
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

type MessageType = 'success' | 'error' | 'info';

// ===== VALIDACIÓN =====
const validateEmail = (email: string): string | undefined => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) return ERROR_MESSAGES.EMPTY_EMAIL;
  if (!EMAIL_REGEX.test(trimmedEmail)) return ERROR_MESSAGES.INVALID_EMAIL;
  return undefined;
};

// ===== COMPONENTE =====
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('info');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        // Intenta obtener mensaje del servidor
        try {
          const data = await response.json();
          setMessageType('error');
          setMessage(data.message || ERROR_MESSAGES.SERVER);
        } catch {
          setMessageType('error');
          setMessage(`Error ${response.status}: ${ERROR_MESSAGES.SERVER}`);
        }
      }
    } catch (error) {
      setMessageType('error');
      setMessage(ERROR_MESSAGES.CONNECTION);
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🔑 Recuperar Contraseña</h2>
        <p>Ingresa tu correo para recibir instrucciones de recuperación</p>

        {message && (
          <div className={`${messageType === 'success' ? 'success-message' : 
                          messageType === 'error' ? 'error-message' : 'info-message'}`}>
            {message}
          </div>
        )}

        {!message && (
          <div className="info-message">
            📧 Recibirás un email con un enlace para resetear tu contraseña. 
            El enlace expirará en 1 hora por seguridad.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">📧 Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={isLoading}
              placeholder="tu.email@ejemplo.com"
              autoComplete="email"
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? '⏳ Enviando...' : '📨 Enviar Enlace de Recuperación'}
          </button>
        </form>

        <p className="auth-link">
          ¿Recuerdas tu contraseña? <Link to="/login">Volver a Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
