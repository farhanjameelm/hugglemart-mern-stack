import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartState, CartItem } from '../types';
import { cartService } from '../services/cartService';

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number, selectedSize?: string, selectedColor?: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => Promise<void>;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...state, cart: null, loading: false, error: null };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const refetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get cart from localStorage
      const existingCart = localStorage.getItem('cart');
      let cartItems: any[] = existingCart ? JSON.parse(existingCart) : [];
      
      if (cartItems.length > 0) {
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            _id: 'cart-' + Date.now(),
            user: 'guest',
            items: cartItems,
            totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: cartItems.reduce((sum, item) => sum + (item.product.finalPrice || item.product.price) * item.quantity, 0),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } 
        });
      } else {
        dispatch({ type: 'SET_CART', payload: {
          _id: 'empty-cart',
          user: 'guest',
          items: [],
          totalItems: 0,
          totalAmount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch cart' });
    }
  };

  useEffect(() => {
    refetchCart();
  }, []);

  const addToCart = async (
    productId: string,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem('cart');
      let cartItems: any[] = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(item => 
        item.productId === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        // Mock product data - in real app, you'd fetch this from API
        const mockProducts = {
          '1': { _id: '1', name: 'Smartphone Pro Max', price: 99999, finalPrice: 99999, thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlNtYXJ0cGhvbmU8L3RleHQ+PC9zdmc+', discountPercentage: 17 },
          '2': { _id: '2', name: 'Laptop Ultra', price: 149999, finalPrice: 149999, thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkxhcHRvcDwvdGV4dD48L3N2Zz4=', discountPercentage: 17 },
          '3': { _id: '3', name: 'Designer T-Shirt', price: 2999, finalPrice: 2999, thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlQtU2hpcnQ8L3RleHQ+PC9zdmc+', discountPercentage: 25 },
          '4': { _id: '4', name: 'Premium Jeans', price: 4999, finalPrice: 4999, thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkplYW5zPC90ZXh0Pjwvc3ZnPg==', discountPercentage: 29 },
          '5': { _id: '5', name: 'Smart Garden Kit', price: 7999, finalPrice: 7999, thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhiYzM0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkdhcmRlbiBLaXQ8L3RleHQ+PC9zdmc+', discountPercentage: 20 },
          '6': { _id: '6', name: 'Yoga Mat Premium', price: 1999, finalPrice: 1999, thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPllvZ2EgTWF0PC90ZXh0Pjwvc3ZnPg==', discountPercentage: 33 },
        };
        
        const product = mockProducts[productId as keyof typeof mockProducts];
        if (!product) {
          dispatch({ type: 'SET_ERROR', payload: 'Product not found' });
          return;
        }
        
        cartItems.push({
          productId,
          product,
          quantity,
          selectedSize,
          selectedColor,
          addedAt: new Date().toISOString()
        });
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Update state
      dispatch({ 
        type: 'SET_CART', 
        payload: { 
          _id: 'cart-' + Date.now(),
          user: 'guest',
          items: cartItems,
          totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: cartItems.reduce((sum, item) => sum + (item.product.finalPrice || item.product.price) * item.quantity, 0),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to cart' });
    }
  };

  const updateCartItem = async (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.updateCartItem({
        productId,
        quantity,
        selectedSize,
        selectedColor,
      });
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update cart' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart' });
    }
  };

  const removeFromCart = async (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.removeFromCart({
        productId,
        selectedSize,
        selectedColor,
      });
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to remove from cart' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from cart' });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.clearCart();
      
      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to clear cart' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    }
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
