import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';

class AuthService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    // Agregar token JWT a todas las peticiones
    this.apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = this.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Manejar errores de autenticación (token expirado)
    this.apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/register', data);
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/login', data);
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.apiClient.get<User>('/auth/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleError(error: any): Error {
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
