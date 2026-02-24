import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Order, CreateOrderRequest, UpdateOrderRequest } from '@/types';
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class OrderService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = authService.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 responses
    this.apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          authService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      const response = await this.apiClient.post<Order>('/orders', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrder(id: number): Promise<Order> {
    try {
      const response = await this.apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await this.apiClient.get<Order[]>('/orders');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOrder(id: number, data: UpdateOrderRequest): Promise<Order> {
    try {
      const response = await this.apiClient.put<Order>(`/orders/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteOrder(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/orders/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin Methods
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await this.apiClient.get<Order[]>('/orders/admin/all');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approveOrder(id: number): Promise<Order> {
    try {
      const response = await this.apiClient.post<Order>(`/orders/${id}/approve`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async rejectOrder(id: number, reason: string): Promise<Order> {
    try {
      const response = await this.apiClient.post<Order>(`/orders/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
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
