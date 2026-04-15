import api from './api';
import { Product, Category, ProductFilters, ApiResponse, PaginatedResponse } from '../types';

export const productService = {
  // Get all products with filters
  getProducts: async (filters: ProductFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by slug
  getProduct: async (slug: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit?: number): Promise<ApiResponse<Product[]>> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/featured${params}`);
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (limit?: number): Promise<ApiResponse<Product[]>> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/new-arrivals${params}`);
    return response.data;
  },

  // Get best sellers
  getBestSellers: async (limit?: number): Promise<ApiResponse<Product[]>> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/best-sellers${params}`);
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (slug: string, limit?: number): Promise<ApiResponse<Product[]>> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/${slug}/related${params}`);
    return response.data;
  },

  // Add product review
  addReview: async (productId: string, review: {
    rating: number;
    comment: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post(`/products/${productId}/reviews`, review);
    return response.data;
  },

  // Create product (Admin only)
  createProduct: async (productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (Admin only)
  updateProduct: async (productId: string, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (productId: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};
