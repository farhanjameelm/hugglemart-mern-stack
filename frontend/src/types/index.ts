export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercentage: number;
  category: Category;
  subcategory?: Category;
  brand?: string;
  sku: string;
  images: string[];
  thumbnail: string;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  colors?: Color[];
  sizes?: Size[];
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  reviews: Review[];
  features: string[];
  specifications: Specification[];
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt: string;
  updatedAt: string;
  finalPrice?: number;
  discountAmount?: number;
  inStock?: boolean;
}

export interface Color {
  name: string;
  hexCode: string;
  image?: string;
}

export interface Size {
  name: string;
  price?: number;
  stock: number;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: Category;
  subcategories?: Category[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'card' | 'upi' | 'wallet';
  paymentId?: string;
  transactionId?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  isBargained: boolean;
  bargainHistory?: BargainHistory[];
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
  formattedTotalAmount?: string;
}

export interface BargainHistory {
  originalPrice: number;
  bargainedPrice: number;
  discountPercentage: number;
  timestamp: string;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface AIBargaining {
  _id: string;
  user: string;
  product: string;
  originalPrice: number;
  finalPrice?: number;
  discountPercentage?: number;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  conversation: ConversationMessage[];
  maxDiscountAllowed: number;
  negotiationStrategy: 'aggressive' | 'moderate' | 'flexible';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  timeRemaining?: string;
  productDetails?: Product;
}

export interface ConversationMessage {
  _id: string;
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
  priceOffered?: number;
  aiResponse?: string;
  discountOffered?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  [key: string]: T[] | any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  sort?: 'price-low' | 'price-high' | 'rating' | 'newest' | 'name';
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  pendingOrders: number;
  deliveredOrders: number;
  wishlistCount: number;
}
