import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme 
} from '@mui/material/styles';
import { 
  Box, 
  CssBaseline 
} from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AIBargainingPage from './pages/AIBargaining';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import BargainingTips from './pages/BargainingTips';
import AdminPanel from './pages/AdminPanel';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Layout component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router>
              <Layout>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/ai-bargaining" element={<AIBargainingPage />} />
                <Route path="/bargaining-tips" element={<BargainingTips />} />
                <Route path="/about" element={<div>About Page - Coming Soon!</div>} />
                <Route path="/contact" element={<div>Contact Page - Coming Soon!</div>} />
                <Route path="/faq" element={<div>FAQ Page - Coming Soon!</div>} />
                <Route path="/privacy" element={<div>Privacy Policy Page - Coming Soon!</div>} />
                <Route path="/terms" element={<div>Terms Page - Coming Soon!</div>} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<div>Forgot Password Page - Coming Soon!</div>} />
                <Route path="/reset-password/:token" element={<div>Reset Password Page - Coming Soon!</div>} />
                <Route path="/profile" element={<div>Profile Page - Coming Soon!</div>} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<div>Order Detail Page - Coming Soon!</div>} />
                <Route path="/wishlist" element={<div>Wishlist Page - Coming Soon!</div>} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/products" element={<div>Admin Products - Coming Soon!</div>} />
                <Route path="/admin/orders" element={<div>Admin Orders - Coming Soon!</div>} />
                <Route path="/admin/users" element={<div>Admin Users - Coming Soon!</div>} />
                <Route path="/admin/analytics" element={<div>Admin Analytics - Coming Soon!</div>} />
                <Route path="/admin/settings" element={<div>Admin Settings - Coming Soon!</div>} />
                {/* <Route path="/status" element={<SystemStatus />} /> */}
                
                {/* Fallback */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
              </Layout>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
