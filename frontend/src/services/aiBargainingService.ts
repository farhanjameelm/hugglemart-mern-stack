import api from './api';
import { AIBargaining, ApiResponse, PaginatedResponse } from '../types';

export interface StartBargainingData {
  productId: string;
}

export interface SendMessageData {
  message: string;
  priceOffered?: number;
}

export const aiBargainingService = {
  // Start bargaining session
  startBargaining: async (data: StartBargainingData): Promise<ApiResponse<AIBargaining>> => {
    const response = await api.post('/ai-bargaining/start', data);
    return response.data;
  },

  // Send bargaining message
  sendMessage: async (bargainingId: string, data: SendMessageData): Promise<ApiResponse<AIBargaining>> => {
    const response = await api.post(`/ai-bargaining/${bargainingId}/message`, data);
    return response.data;
  },

  // Get bargaining session
  getBargaining: async (bargainingId: string): Promise<ApiResponse<AIBargaining>> => {
    const response = await api.get(`/ai-bargaining/${bargainingId}`);
    return response.data;
  },

  // Get user's bargaining history
  getBargainingHistory: async (page?: number, limit?: number): Promise<PaginatedResponse<AIBargaining>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await api.get(`/ai-bargaining/history?${params.toString()}`);
    return response.data;
  },

  // Complete bargaining
  completeBargaining: async (bargainingId: string, finalPrice: number, discountPercentage: number): Promise<ApiResponse<AIBargaining>> => {
    const response = await api.post(`/ai-bargaining/${bargainingId}/complete`, {
      finalPrice,
      discountPercentage
    });
    return response.data;
  },

  // Cancel bargaining session
  cancelBargaining: async (bargainingId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/ai-bargaining/${bargainingId}`);
    return response.data;
  },

  // Get all bargaining sessions (Admin only)
  getAllBargainings: async (page?: number, limit?: number, filters?: any): Promise<PaginatedResponse<AIBargaining>> => {
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

    const response = await api.get(`/ai-bargaining/admin/all?${params.toString()}`);
    return response.data;
  },
};
