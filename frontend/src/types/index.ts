export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderItemRequest {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  numeroPedido: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: string;
  description?: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  description: string;
  items: CreateOrderItemRequest[];
}

export interface UpdateOrderRequest {
  description: string;
  items?: CreateOrderItemRequest[];
}
