import api from './api';
import { Cart, CartItem, ApiResponse } from '../types';

export interface AddToCartData {
  productId: string;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface RemoveFromCartData {
  productId: string;
  selectedSize?: string;
  selectedColor?: string;
}

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (data: AddToCartData): Promise<ApiResponse<Cart>> => {
    const response = await api.post('/cart/add', data);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (data: UpdateCartItemData): Promise<ApiResponse<Cart>> => {
    const response = await api.put('/cart/update', data);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (data: RemoveFromCartData): Promise<ApiResponse<Cart>> => {
    const response = await api.delete('/cart/remove', { data });
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // Get cart summary
  getCartSummary: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/cart/summary');
    return response.data;
  },

  // Validate cart items
  validateCart: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/cart/validate');
    return response.data;
  },
};
