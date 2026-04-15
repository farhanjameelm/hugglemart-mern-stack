export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const APP_NAME = 'Huggle Mart';

export const CURRENCY = '₹';
export const CURRENCY_CODE = 'INR';

export const SHIPPING_COST = 50;
export const FREE_SHIPPING_THRESHOLD = 500;
export const TAX_RATE = 0.18; // 18% GST

export const PAGINATION_LIMITS = [12, 24, 48];

export const PRODUCT_RATINGS = [1, 2, 3, 4, 5];

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  UPI: 'upi',
  WALLET: 'wallet',
} as const;

export const ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work',
  OTHER: 'other',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const BARGAINING_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name: A to Z' },
];

export const PRICE_RANGES = [
  { min: 0, max: 500, label: 'Under ₹500' },
  { min: 500, max: 1000, label: '₹500 - ₹1000' },
  { min: 1000, max: 2000, label: '₹1000 - ₹2000' },
  { min: 2000, max: 5000, label: '₹2000 - ₹5000' },
  { min: 5000, max: 10000, label: '₹5000 - ₹10000' },
  { min: 10000, max: Infinity, label: 'Above ₹10000' },
];

export const RATING_FILTERS = [
  { value: 4, label: '4★ & above' },
  { value: 3, label: '3★ & above' },
  { value: 2, label: '2★ & above' },
  { value: 1, label: '1★ & above' },
];

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/hugglemart',
  TWITTER: 'https://twitter.com/hugglemart',
  INSTAGRAM: 'https://instagram.com/hugglemart',
  LINKEDIN: 'https://linkedin.com/company/hugglemart',
};

export const CONTACT_INFO = {
  EMAIL: 'support@hugglemart.com',
  PHONE: '+91-XXXXXXXXXX',
  ADDRESS: '123 Main Street, City, State 123456, India',
};

export const NAVIGATION_LINKS = [
  { path: '/', label: 'Home', exact: true },
  { path: '/products', label: 'Products', exact: false },
  { path: '/categories', label: 'Categories', exact: false },
  { path: '/ai-bargaining', label: 'AI Bargaining', exact: false },
  { path: '/bargaining-tips', label: 'Bargaining Tips', exact: false },
  { path: '/about', label: 'About', exact: false },
  { path: '/contact', label: 'Contact', exact: false },
];

export const USER_NAVIGATION_LINKS = [
  { path: '/profile', label: 'Profile', exact: false },
  { path: '/orders', label: 'Orders', exact: false },
  { path: '/wishlist', label: 'Wishlist', exact: false },
  { path: '/settings', label: 'Settings', exact: false },
];

export const ADMIN_NAVIGATION_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard', exact: false },
  { path: '/admin/products', label: 'Products', exact: false },
  { path: '/admin/orders', label: 'Orders', exact: false },
  { path: '/admin/users', label: 'Users', exact: false },
  { path: '/admin/categories', label: 'Categories', exact: false },
  { path: '/admin/bargaining', label: 'Bargaining', exact: false },
];

export const DEFAULT_IMAGE = '/images/default-product.jpg';

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  CART_ADD_SUCCESS: 'Product added to cart!',
  CART_REMOVE_SUCCESS: 'Product removed from cart!',
  CART_UPDATE_SUCCESS: 'Cart updated successfully!',
  WISHLIST_ADD_SUCCESS: 'Product added to wishlist!',
  WISHLIST_REMOVE_SUCCESS: 'Product removed from wishlist!',
  ORDER_CREATE_SUCCESS: 'Order placed successfully!',
  REVIEW_ADD_SUCCESS: 'Review added successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
  ADDRESS_ADD_SUCCESS: 'Address added successfully!',
  ADDRESS_UPDATE_SUCCESS: 'Address updated successfully!',
  ADDRESS_DELETE_SUCCESS: 'Address deleted successfully!',
};
