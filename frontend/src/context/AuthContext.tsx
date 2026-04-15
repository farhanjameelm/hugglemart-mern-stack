import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        // Clear any corrupted data
        if (token && token === 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        
        if (token && user) {
          try {
            // First try to use stored user data
            const userData = JSON.parse(user);
            if (userData && userData.email) {
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: userData, token },
              });
              
              // Then verify with backend (optional, don't block UI)
              try {
                const response = await authService.getCurrentUser();
                if (response.success && response.data) {
                  dispatch({
                    type: 'UPDATE_USER',
                    payload: response.data,
                  });
                }
              } catch (verifyError) {
                // Backend verification failed but user is still logged in locally
                console.log('Backend verification failed, using local data');
              }
            } else {
              // Invalid user data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          } catch (parseError) {
            // Invalid user data in localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login({ email, password });
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.register(userData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(userData);
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({ type: 'UPDATE_USER', payload: response.data });
      }
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
