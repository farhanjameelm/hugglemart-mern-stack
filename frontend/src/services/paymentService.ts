import api from './api';
import { PaymentIntent, PaymentMethod, ApiResponse } from '../types';

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
}

export interface ConfirmPaymentData {
  paymentIntentId: string;
}

export interface CreateRefundData {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (data: CreatePaymentIntentData): Promise<ApiResponse<PaymentIntent>> => {
    const response = await api.post('/payment/create-payment-intent', data);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (data: ConfirmPaymentData): Promise<ApiResponse<any>> => {
    const response = await api.post('/payment/confirm', data);
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    const response = await api.get('/payment/methods');
    return response.data;
  },

  // Create refund (Admin only)
  createRefund: async (data: CreateRefundData): Promise<ApiResponse<any>> => {
    const response = await api.post('/payment/refund', data);
    return response.data;
  },

  // Process COD order
  processCOD: async (orderId: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/payment/cod', { orderId });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentIntentId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/payment/status/${paymentIntentId}`);
    return response.data;
  },
};
