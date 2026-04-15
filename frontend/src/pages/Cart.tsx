import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Delete,
  ArrowBack,
  LocalOffer,
  LocalShipping,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, error, addToCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const SHIPPING_COST = 50;
  const FREE_SHIPPING_THRESHOLD = 500;
  const TAX_RATE = 0.18;

  const subtotal = cart?.items?.reduce((sum, item) => sum + ((item.product.finalPrice || item.product.price) * item.quantity), 0) || 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax - promoDiscount;

  const handleQuantityChange = (productId: string, newQuantity: number, selectedSize?: string, selectedColor?: string) => {
    if (newQuantity > 0) {
      updateCartItem(productId, newQuantity, selectedSize, selectedColor);
    }
  };

  const handleRemoveItem = (productId: string, selectedSize?: string, selectedColor?: string) => {
    removeFromCart(productId, selectedSize, selectedColor);
  };

  const handleApplyPromo = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'save10') {
      setPromoDiscount(subtotal * 0.1);
    } else if (promoCode.toLowerCase() === 'save20') {
      setPromoDiscount(subtotal * 0.2);
    } else {
      setPromoDiscount(0);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        <ShoppingCart sx={{ mr: 2, verticalAlign: 'middle' }} />
        Shopping Cart
      </Typography>

      {!cart?.items || cart.items.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Looks like you haven't added anything to your cart yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '2fr 1fr' }, gap: 3 }}>
          {/* Cart Items */}
          <Box>
            {cart.items.map((item, index) => (
              <Card key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}-${index}`} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, height: 120, borderRadius: 1 }}
                      image={item.product.thumbnail}
                      alt={item.product.name}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {item.product.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        {item.selectedSize && (
                          <Chip label={`Size: ${item.selectedSize}`} size="small" variant="outlined" />
                        )}
                        {item.selectedColor && (
                          <Chip label={`Color: ${item.selectedColor}`} size="small" variant="outlined" />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" color="primary">
                          {formatPrice(item.product.finalPrice || item.product.price)}
                        </Typography>
                        {item.product.discountPercentage > 0 && (
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            {formatPrice(item.product.price)}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            size="small"
                            variant="standard"
                            slotProps={{
                              input: {
                                disableUnderline: true,
                                style: { width: 40, textAlign: 'center' }
                              }
                            }}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.product._id, newQuantity, item.selectedSize, item.selectedColor);
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                          >
                            <Add />
                          </IconButton>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          Total: {formatPrice((item.product.finalPrice || item.product.price) * item.quantity)}
                        </Typography>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.product._id, item.selectedSize, item.selectedColor)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Promo Code */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Promo Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </Button>
                </Box>
                {promoDiscount > 0 && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                        Promo code applied! You saved {formatPrice(promoDiscount)}
                      </Alert>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Order Summary */}
          <Box>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal ({cart.totalItems} items)</Typography>
                    <Typography variant="body2">{formatPrice(subtotal)}</Typography>
                  </Box>

                  {promoDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">Promo Discount</Typography>
                      <Typography variant="body2" color="success.main">-{formatPrice(promoDiscount)}</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2">
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </Typography>
                  </Box>

                  {shipping > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax (18%)</Typography>
                    <Typography variant="body2">{formatPrice(tax)}</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">{formatPrice(total)}</Typography>
                  </Box>
                </Box>

                {/* Benefits */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Security sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                    <Typography variant="caption">Secure Payment</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalShipping sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                    <Typography variant="caption">Fast Delivery</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalOffer sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                    <Typography variant="caption">Best Price Guarantee</Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  sx={{ mb: 2 }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Cart;
