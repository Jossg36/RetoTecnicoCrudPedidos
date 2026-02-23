import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '@/services/authService';
// ===== CONTEXTO =====
const AuthContext = createContext(undefined);
// ===== PROVIDER =====
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Inicializar sesión desde token guardado al montar el proveedor
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const profile = await authService.getProfile();
                    setUser(profile || null);
                }
            }
            catch (err) {
                console.error('Error al inicializar autenticación:', err);
                authService.logout();
            }
            finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, []);
    const login = useCallback(async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            if (response.user) {
                setUser(response.user);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setError(message);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const register = useCallback(async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.register(data);
            if (response.user) {
                setUser(response.user);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error al registrarse';
            setError(message);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setError(null);
    }, []);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    const value = {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!user,
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
// ===== HOOK =====
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider. ' +
            'Envuelve tu aplicación con AuthProvider.');
    }
    return context;
};
