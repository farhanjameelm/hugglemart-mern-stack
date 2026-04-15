import api from './api';
import { User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};
