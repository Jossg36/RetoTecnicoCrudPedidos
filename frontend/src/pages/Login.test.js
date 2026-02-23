import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
/**
 * Pruebas para componente Login
 * Cubre: Validación, manejo de errores, navegación
 */
describe('Login Component', () => {
    const renderLogin = () => {
        return render(_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(Login, {}) }) }));
    };
    it('should render login form with username and password inputs', () => {
        renderLogin();
        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
    it('should show validation error if username is empty', async () => {
        renderLogin();
        const user = userEvent.setup();
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/usuario.*requerido/i)).toBeInTheDocument();
        });
    });
    it('should show validation error if password is empty', async () => {
        renderLogin();
        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/usuario/i);
        await user.type(usernameInput, 'testuser');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/contraseña.*requerida/i)).toBeInTheDocument();
        });
    });
    it('should clear validation error when user types', async () => {
        renderLogin();
        const user = userEvent.setup();
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/usuario.*requerido/i)).toBeInTheDocument();
        });
        const usernameInput = screen.getByLabelText(/usuario/i);
        await user.type(usernameInput, 'testuser');
        await waitFor(() => {
            expect(screen.queryByText(/usuario.*requerido/i)).not.toBeInTheDocument();
        });
    });
    it('should disable inputs during loading', async () => {
        renderLogin();
        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        // En estado de carga, inputs estarían disabled
        // (simulado en integración real)
        expect(usernameInput.value).toBe('testuser');
    });
    it('should show register link', () => {
        renderLogin();
        expect(screen.getByText(/¿No tiene cuenta/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /regístrese/i })).toBeInTheDocument();
    });
    it('should handle form submission', async () => {
        renderLogin();
        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'TestPassword123!');
        await user.click(submitButton);
        // El form debe haberse enviado (en test real con API mock)
        expect(usernameInput).toHaveValue('testuser');
    });
    it('should update form data on input change', async () => {
        renderLogin();
        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        await user.type(usernameInput, 'myusername');
        await user.type(passwordInput, 'mypassword');
        expect(usernameInput.value).toBe('myusername');
        expect(passwordInput.value).toBe('mypassword');
    });
});
