import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';
class AuthService {
    constructor() {
        Object.defineProperty(this, "apiClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiClient = axios.create({
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
        });
        // Agregar token JWT a todas las peticiones
        this.apiClient.interceptors.request.use((config) => {
            const token = this.getToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        // Manejar errores de autenticación (token expirado)
        this.apiClient.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                this.logout();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    async register(data) {
        try {
            const response = await this.apiClient.post('/auth/register', data);
            if (response.data.token) {
                this.setToken(response.data.token);
            }
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async login(data) {
        try {
            const response = await this.apiClient.post('/auth/login', data);
            if (response.data.token) {
                this.setToken(response.data.token);
            }
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getProfile() {
        try {
            const response = await this.apiClient.get('/auth/profile');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    setToken(token) {
        localStorage.setItem('auth_token', token);
    }
    getToken() {
        return localStorage.getItem('auth_token');
    }
    logout() {
        localStorage.removeItem('auth_token');
    }
    isAuthenticated() {
        return !!this.getToken();
    }
    handleError(error) {
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            return new Error(Array.isArray(errors) ? errors.join(', ') : String(errors));
        }
        return new Error(error.message || 'Error de autenticación');
    }
}
export default new AuthService();
