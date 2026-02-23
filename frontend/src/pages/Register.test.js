import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '@/pages/Register';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
/**
 * Pruebas para componente Register
 * Cubre: Validación de registro, password complexity, confirmación
 */
describe('Register Component', () => {
    const renderRegister = () => {
        return render(_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(Register, {}) }) }));
    };
    it('should render registration form with all fields', () => {
        renderRegister();
        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });
    it('should validate username length', async () => {
        renderRegister();
        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/usuario/i);
        await user.type(usernameInput, 'ab'); // 2 caracteres
        const submitButton = screen.getByRole('button', { name: /registrarse/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument();
        });
    });
    it('should validate email format', async () => {
        renderRegister();
        const user = userEvent.setup();
        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'invalid-email');
        const submitButton = screen.getByRole('button', { name: /registrarse/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/email no es válido/i)).toBeInTheDocument();
        });
    });
    it('should validate password minimum length', async () => {
        renderRegister();
        const user = userEvent.setup();
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        await user.type(passwordInput, 'Short1!'); // 7 caracteres
        const submitButton = screen.getByRole('button', { name: /registrarse/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument();
        });
    });
    it('should require uppercase in password', async () => {
        renderRegister();
        const user = userEvent.setup();
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        await user.type(passwordInput, 'lowercase123!');
        const submitButton = screen.getByRole('button', { name: /registrarse/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/mayúscula/i)).toBeInTheDocument();
        });
    });
    it('should require lowercase in password', async () => {
        renderRegister();
        const user = userEvent.setup();
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        await user.type(passwordInput, 'UPPERCASE123!');
        const submitButton = screen.getByRole('button', { name: /registrarse/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/minúscula/i)).toBeInTheDocument();
        });
    });
    it('should require number in password', async () => {
        renderRegister();
        const user = userEvent.setup();
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        await user.type(passwordInput, 'NoNumbers!');
        const submitButton = screen.getByRole('button', { name: /registrarse/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/número/i)).toBeInTheDocument();
        });
    });
    it('should validate password confirmation match', async () => {
        renderRegister();
        const user = userEvent.setup();
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
        await user.type(passwordInput, 'SecurePass123!');
        await user.type(confirmInput, 'DifferentPass123!');
        const submitButton = screen.getByRole('button', { name: /registrarse/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
        });
    });
    it('should show success with valid data', async () => {
        renderRegister();
        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/usuario/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        const confirmInput = screen.getByLabelText(/confirmar contraseña/i);
        await user.type(usernameInput, 'validuser');
        await user.type(emailInput, 'valid@example.com');
        await user.type(passwordInput, 'SecurePass123!');
        await user.type(confirmInput, 'SecurePass123!');
        // No debe haber errores
        await waitFor(() => {
            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        });
    });
    it('should show login link', () => {
        renderRegister();
        expect(screen.getByText(/¿Ya tiene cuenta/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /inicie sesión/i })).toBeInTheDocument();
    });
});
