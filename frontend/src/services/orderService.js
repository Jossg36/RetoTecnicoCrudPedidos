import axios from 'axios';
import authService from './authService';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';
class OrderService {
    constructor() {
        Object.defineProperty(this, "apiClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiClient = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add token to requests
        this.apiClient.interceptors.request.use((config) => {
            const token = authService.getToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        // Handle 401 responses
        this.apiClient.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    async createOrder(data) {
        try {
            const response = await this.apiClient.post('/orders', data);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getOrder(id) {
        try {
            const response = await this.apiClient.get(`/orders/${id}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getMyOrders() {
        try {
            const response = await this.apiClient.get('/orders');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async updateOrder(id, data) {
        try {
            const response = await this.apiClient.put(`/orders/${id}`, data);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async deleteOrder(id) {
        try {
            await this.apiClient.delete(`/orders/${id}`);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            return new Error(Array.isArray(errors) ? errors.join(', ') : String(errors));
        }
        return new Error(error.message || 'Error al procesar la solicitud');
    }
}
export default new OrderService();
