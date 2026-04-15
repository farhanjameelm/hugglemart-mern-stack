import { CURRENCY } from './constants';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceWithSymbol = (price: number): string => {
  return `${CURRENCY}${price.toLocaleString('en-IN')}`;
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateObj);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `HM${year}${month}${day}${random}`;
};

export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const calculateFinalPrice = (price: number, discountPercentage: number): number => {
  return Math.round(price * (1 - discountPercentage / 100));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

export const getColorFromInitials = (initials: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  ];
  
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  Array.from(params.entries()).forEach(([key, value]) => {
    result[key] = value;
  });
  
  return result;
};

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

export const getLocalStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error(`Error parsing localStorage item "${key}":`, error);
    return defaultValue || null;
  }
};

export const setLocalStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
  }
};

export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
  }
};
