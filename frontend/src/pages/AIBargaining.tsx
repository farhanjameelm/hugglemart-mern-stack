import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  CheckCircle,
  Cancel,
  ShoppingCart,
  TrendingUp,
  Lightbulb,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { aiBargainingService } from '../services/aiBargainingService';
import { productService } from '../services/productService';
import type { AIBargaining, Product } from '../types';
import { formatPrice } from '../utils/helpers';

const AIBargainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [bargainingSession, setBargainingSession] = useState<AIBargaining | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mock products data
        const mockProducts = [
          {
            _id: '1',
            name: 'Smartphone Pro Max',
            slug: 'smartphone-pro-max',
            price: 99999,
            finalPrice: 99999,
            originalPrice: 119999,
            discountPercentage: 17,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlNtYXJ0cGhvbmU8L3RleHQ+PC9zdmc+',
            rating: { average: 4.5, count: 234 },
            stock: 50,
            category: { name: 'Electronics', slug: 'electronics' },
          },
          {
            _id: '2',
            name: 'Laptop Ultra',
            slug: 'laptop-ultra',
            price: 149999,
            finalPrice: 149999,
            originalPrice: 179999,
            discountPercentage: 17,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkxhcHRvcDwvdGV4dD48L3N2Zz4=',
            rating: { average: 4.7, count: 189 },
            stock: 30,
            category: { name: 'Electronics', slug: 'electronics' },
          },
          {
            _id: '3',
            name: 'Designer T-Shirt',
            slug: 'designer-tshirt',
            price: 2999,
            finalPrice: 2999,
            originalPrice: 3999,
            discountPercentage: 25,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlQtU2hpcnQ8L3RleHQ+PC9zdmc+',
            rating: { average: 4.2, count: 567 },
            stock: 100,
            category: { name: 'Clothing', slug: 'clothing' },
          },
          {
            _id: '4',
            name: 'Premium Jeans',
            slug: 'premium-jeans',
            price: 4999,
            finalPrice: 4999,
            originalPrice: 6999,
            discountPercentage: 29,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkplYW5zPC90ZXh0Pjwvc3ZnPg==',
            rating: { average: 4.6, count: 234 },
            stock: 75,
            category: { name: 'Clothing', slug: 'clothing' },
          },
          {
            _id: '5',
            name: 'Smart Garden Kit',
            slug: 'smart-garden-kit',
            price: 7999,
            finalPrice: 7999,
            originalPrice: 9999,
            discountPercentage: 20,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhiYzM0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkdhcmRlbiBLaXQ8L3RleHQ+PC9zdmc+',
            rating: { average: 4.3, count: 123 },
            stock: 40,
            category: { name: 'Home & Garden', slug: 'home-garden' },
          },
          {
            _id: '6',
            name: 'Yoga Mat Premium',
            slug: 'yoga-mat-premium',
            price: 1999,
            finalPrice: 1999,
            originalPrice: 2999,
            discountPercentage: 33,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPllvZ2EgTWF0PC90ZXh0Pjwvc3ZnPg==',
            rating: { average: 4.8, count: 456 },
            stock: 200,
            category: { name: 'Sports & Fitness', slug: 'sports-fitness' },
          },
        ];
        
        setProducts(mockProducts);
        
        // Check if a specific product is requested via URL
        const urlParams = new URLSearchParams(window.location.search);
        const productSlug = urlParams.get('product');
        if (productSlug) {
          const product = mockProducts.find(p => p.slug === productSlug);
          if (product) {
            setSelectedProduct(product);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const startBargaining = async (product: any) => {
    setSelectedProduct(product);
    setSessionLoading(true);
    
    try {
      // Mock bargaining session
      setBargainingSession({
        _id: 'session-' + Date.now(),
        user: 'guest',
        product: product._id,
        originalPrice: product.price,
        finalPrice: product.finalPrice || product.price,
        discountPercentage: 0,
        status: 'active',
        conversation: [],
        maxDiscountAllowed: 30,
        negotiationStrategy: 'moderate',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productDetails: product
      });
      
      setMessages([
        {
          type: 'ai',
          content: `Hello! I'm your AI bargaining assistant. I can help you get a better deal on the ${product.name}. The current price is ${formatPrice(product.finalPrice || product.price)}. What's your budget or what price would you like to offer?`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error starting bargaining:', error);
    } finally {
      setSessionLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !bargainingSession) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Extract price from user message
      const priceMatch = message.match(/(\d+)/);
      const userOffer = priceMatch ? parseInt(priceMatch[1]) : null;
      
      let aiResponse = '';
      
      if (userOffer) {
        const originalPrice = bargainingSession.originalPrice;
        const maxDiscount = originalPrice * (bargainingSession.maxDiscountAllowed / 100);
        const minAcceptablePrice = originalPrice - maxDiscount;
        
        if (userOffer >= minAcceptablePrice) {
          // Accept the offer
          aiResponse = `Great! I can accept your offer of ${formatPrice(userOffer)}. That's a good deal! Would you like to proceed with this price?`;
          setBargainingSession({
            ...bargainingSession,
            finalPrice: userOffer,
            discountPercentage: Math.round(((originalPrice - userOffer) / originalPrice) * 100)
          });
        } else if (userOffer < minAcceptablePrice * 0.7) {
          // Reject low offer
          aiResponse = `I appreciate your offer of ${formatPrice(userOffer)}, but that's quite low. The best I can do is around ${formatPrice(minAcceptablePrice)}. Can we meet somewhere in the middle?`;
        } else {
          // Counter offer
          const counterOffer = Math.round(minAcceptablePrice + ((userOffer - minAcceptablePrice) * 0.5));
          aiResponse = `I understand you'd like to pay ${formatPrice(userOffer)}. How about we meet at ${formatPrice(counterOffer)}? That's the best I can offer while still ensuring quality.`;
        }
      } else {
        // General response
        aiResponse = `I'd be happy to help you get a better deal! Could you let me know what price you have in mind? The current price is ${formatPrice(bargainingSession.originalPrice)}.`;
      }

      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          content: "I'm having trouble processing your request. Could you try again?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const completeBargaining = async () => {
    if (!bargainingSession) return;

    setLoading(true);
    try {
      // Simulate completion
      await new Promise(resolve => setTimeout(resolve, 1000));

      const finalPrice = bargainingSession.finalPrice || selectedProduct?.finalPrice || selectedProduct?.price || 0;
      const discount = bargainingSession.discountPercentage || 0;

      setBargainingSession({
        ...bargainingSession,
        status: 'completed'
      });

      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content: `Bargaining completed! Final price: ${formatPrice(finalPrice)} with ${discount}% discount. You can now add this to your cart at the negotiated price.`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error completing bargaining:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBargaining = () => {
    setSelectedProduct(null);
    setBargainingSession(null);
    setMessages([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        <SmartToy sx={{ mr: 2, verticalAlign: 'middle' }} />
        AI Bargaining Assistant
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Let our AI help you negotiate better prices on your favorite products. Start a conversation and get the best deal!
      </Typography>

      {!selectedProduct ? (
        <>
          {/* Product Selection */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Select a product to start bargaining:
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {products.map((product) => (
              <Card key={product._id} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={product.thumbnail}
                      alt={product.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.category?.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {product.discountPercentage > 0 && (
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {formatPrice(product.price)}
                      </Typography>
                    )}
                    <Typography variant="h6" color="primary">
                      {formatPrice(product.finalPrice || product.price)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<TrendingUp />}
                    onClick={() => startBargaining(product)}
                    disabled={sessionLoading}
                  >
                    {sessionLoading ? <CircularProgress size={20} /> : 'Start Bargaining'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>

          {products.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SmartToy sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No products available for bargaining.
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <>
          {/* Bargaining Interface */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 2fr' }, gap: 3 }}>
            {/* Product Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bargaining for: {selectedProduct.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Avatar
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.name}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Original Price:
                  </Typography>
                  <Typography variant="h6" sx={{ textDecoration: 'line-through' }}>
                    {formatPrice(selectedProduct.price)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Price:
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatPrice(selectedProduct.finalPrice || selectedProduct.price)}
                  </Typography>
                </Box>

                {bargainingSession && (bargainingSession.discountPercentage || 0) > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Discount:
                    </Typography>
                    <Chip
                      label={`${bargainingSession.discountPercentage}% OFF`}
                      color="success"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" color="success.main">
                      {formatPrice(bargainingSession.finalPrice || 0)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={completeBargaining}
                    disabled={!bargainingSession || loading}
                    fullWidth
                  >
                    Complete Deal
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={cancelBargaining}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>

                {bargainingSession && bargainingSession.status === 'completed' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCart />}
                    sx={{ mt: 2 }}
                    fullWidth
                    onClick={() => {
                      if (selectedProduct) {
                        // Create a copy of the product with the negotiated price
                        const productWithBargainedPrice = {
                          ...selectedProduct,
                          finalPrice: bargainingSession.finalPrice || selectedProduct.price,
                          originalPrice: selectedProduct.price
                        };
                        addToCart(selectedProduct._id, 1);
                        navigate('/cart');
                      }
                    }}
                  >
                    Add to Cart at {formatPrice(bargainingSession.finalPrice || selectedProduct?.price || 0)}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card sx={{ display: 'flex', flexDirection: 'column', height: 500 }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  <SmartToy sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Bargaining Chat
                </Typography>

                {/* Messages */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                  {messages.map((msg, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Avatar sx={{ bgcolor: msg.type === 'ai' ? 'primary.main' : 'secondary.main' }}>
                          {msg.type === 'ai' ? <SmartToy /> : <Person />}
                        </Avatar>
                        <Paper sx={{ p: 2, maxWidth: '70%', bgcolor: msg.type === 'ai' ? 'white' : 'primary.light' }}>
                          <Typography variant="body2">{msg.content}</Typography>
                        </Paper>
                      </Box>
                    </Box>
                  ))}
                  {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <SmartToy />
                      </Avatar>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={loading || !bargainingSession}
                  />
                  <IconButton
                    color="primary"
                    onClick={sendMessage}
                    disabled={!message.trim() || loading || !bargainingSession}
                  >
                    <Send />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Bargaining Tips */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <Lightbulb sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Bargaining Tips:</strong> Be reasonable with your offers, mention any competing prices you've seen, and be polite. The AI will consider multiple factors to give you the best possible deal!
            </Typography>
          </Alert>
        </>
      )}
    </Container>
  );
};

export default AIBargainingPage;
