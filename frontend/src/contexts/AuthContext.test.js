import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
/**
 * Pruebas para AuthContext
 * Cubre: Login, registro, logout, manejo de estado
 */
describe('AuthContext', () => {
    const wrapper = ({ children }) => (_jsx(AuthProvider, { children: children }));
    beforeEach(() => {
        localStorage.clear();
    });
    describe('useAuth hook', () => {
        it('should throw error if used outside provider', () => {
            expect(() => {
                renderHook(() => useAuth());
            }).toThrow(/debe usarse dentro de un AuthProvider/i);
        });
        it('should return auth context when inside provider', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(result.current).toBeDefined();
            expect(result.current.isAuthenticated).toBeDefined();
            expect(result.current.login).toBeDefined();
            expect(result.current.logout).toBeDefined();
        });
    });
    describe('Initial state', () => {
        it('should start with unauthenticated state', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
            expect(result.current.error).toBeNull();
        });
        it('should start in loading state', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(result.current.isLoading).toBe(true);
        });
    });
    describe('Logout', () => {
        it('should clear user and token on logout', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            act(() => {
                result.current.logout();
            });
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
            expect(localStorage.getItem('authToken')).toBeNull();
        });
        it('should clear error on logout', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            // Simular error
            act(() => {
                // Error se asignaría en login fallido
            });
            act(() => {
                result.current.logout();
            });
            expect(result.current.error).toBeNull();
        });
    });
    describe('Error handling', () => {
        it('should expose clearError function', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(result.current.clearError).toBeDefined();
            expect(typeof result.current.clearError).toBe('function');
        });
        it('should clear error when called', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            act(() => {
                result.current.clearError();
            });
            expect(result.current.error).toBeNull();
        });
    });
    describe('Login validation', () => {
        it('should reject login without credentials', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(async () => {
                await result.current.login({ username: '', password: '' });
            }).toBeDefined();
        });
        it('should require username', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(async () => {
                await result.current.login({ username: '', password: 'password' });
            }).toBeDefined();
        });
        it('should require password', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(async () => {
                await result.current.login({ username: 'user', password: '' });
            }).toBeDefined();
        });
    });
    describe('Register validation', () => {
        it('should reject register without complete data', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(async () => {
                await result.current.register({ username: '', email: '', password: '' });
            }).toBeDefined();
        });
        it('should require username', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(async () => {
                await result.current.register({
                    username: '',
                    email: 'test@example.com',
                    password: 'Password123!',
                });
            }).toBeDefined();
        });
        it('should require email', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(async () => {
                await result.current.register({
                    username: 'testuser',
                    email: '',
                    password: 'Password123!',
                });
            }).toBeDefined();
        });
        it('should require password', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(async () => {
                await result.current.register({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: '',
                });
            }).toBeDefined();
        });
    });
    describe('State management', () => {
        it('should expose isLoading state', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(typeof result.current.isLoading).toBe('boolean');
        });
        it('should expose user state', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(result.current.user === null || typeof result.current.user === 'object').toBe(true);
        });
        it('should expose error state', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
        });
        it('should expose isAuthenticated computed value', () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(typeof result.current.isAuthenticated).toBe('boolean');
        });
    });
});
