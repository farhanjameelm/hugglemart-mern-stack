import api from './api';
import { Order, ApiResponse, PaginatedResponse } from '../types';

export interface CreateOrderData {
  shippingAddress: any;
  billingAddress?: any;
  paymentMethod: 'cod' | 'card' | 'upi' | 'wallet';
  paymentId?: string;
  notes?: string;
  isBargained?: boolean;
  bargainHistory?: any[];
}

export const orderService = {
  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<ApiResponse<Order>> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getOrders: async (page?: number, limit?: number, status?: string): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);

    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  // Get single order
  getOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Update order status (Admin only)
  updateOrderStatus: async (orderId: string, status: string, note?: string, trackingNumber?: string): Promise<ApiResponse<Order>> => {
    const response = await api.put(`/orders/${orderId}/status`, {
      status,
      note,
      trackingNumber
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Get order statistics (Admin only)
  getOrderStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async (page?: number, limit?: number, filters?: any): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/orders/admin/all?${params.toString()}`);
    return response.data;
  },
};
