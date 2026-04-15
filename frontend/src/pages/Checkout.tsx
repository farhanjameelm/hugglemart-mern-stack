import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Payment,
  CheckCircle,
  Add,
  Remove,
  Delete,
  CreditCard,
  AccountBalance,
  PhoneAndroid,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'card' | 'upi' | 'cod';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);

  const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

  const SHIPPING_COST = 50;
  const FREE_SHIPPING_THRESHOLD = 500;
  const TAX_RATE = 0.18;

  const subtotal = cart?.items?.reduce((sum, item) => sum + ((item.product.finalPrice || item.product.price) * item.quantity), 0) || 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate shipping address
      const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zipCode'];
      const missing = required.filter(field => !shippingAddress[field as keyof ShippingAddress]);
      if (missing.length > 0) {
        alert('Please fill in all required fields');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart
    localStorage.removeItem('cart');
    
    setOrderPlaced(true);
    setProcessing(false);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    // This would normally update the cart
    console.log('Update quantity:', productId, newQuantity);
  };

  const removeItem = (productId: string) => {
    // This would normally remove from cart
    console.log('Remove item:', productId);
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

  if (orderPlaced) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Thank you for your order. We'll send you an email with the order details and tracking information.
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mb: 4 }}>
              Order Total: {formatPrice(total)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/products')}
                sx={{ flex: 1 }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/orders')}
                sx={{ flex: 1 }}
              >
                View Orders
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/cart')}
          sx={{ mb: 2 }}
        >
          Back to Cart
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Main Content */}
        <Box sx={{ flex: 2 }}>
          {activeStep === 0 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Shipping Address
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      required
                    />
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      required
                    />
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      >
                        <MenuItem value="India">India</MenuItem>
                        <MenuItem value="United States">United States</MenuItem>
                        <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ minWidth: 150 }}
                  >
                    Continue
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Payment Method
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <FormControl component="fieldset">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Paper
                        sx={{
                          p: 2,
                          border: paymentMethod.type === 'card' ? 2 : 1,
                          borderColor: paymentMethod.type === 'card' ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                        }}
                        onClick={() => setPaymentMethod({ type: 'card' })}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCard sx={{ mr: 2, color: 'primary.main' }} />
                          <Typography variant="h6">Credit/Debit Card</Typography>
                        </Box>
                      </Paper>

                      <Paper
                        sx={{
                          p: 2,
                          border: paymentMethod.type === 'upi' ? 2 : 1,
                          borderColor: paymentMethod.type === 'upi' ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                        }}
                        onClick={() => setPaymentMethod({ type: 'upi' })}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneAndroid sx={{ mr: 2, color: 'primary.main' }} />
                          <Typography variant="h6">UPI Payment</Typography>
                        </Box>
                      </Paper>

                      <Paper
                        sx={{
                          p: 2,
                          border: paymentMethod.type === 'cod' ? 2 : 1,
                          borderColor: paymentMethod.type === 'cod' ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                        }}
                        onClick={() => setPaymentMethod({ type: 'cod' })}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccountBalance sx={{ mr: 2, color: 'primary.main' }} />
                          <Typography variant="h6">Cash on Delivery</Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </FormControl>
                </Box>

                {paymentMethod.type === 'card' && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          value={paymentMethod.cardNumber || ''}
                          onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          placeholder="MM/YY"
                          value={paymentMethod.cardExpiry || ''}
                          onChange={(e) => setPaymentMethod({ ...paymentMethod, cardExpiry: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="CVV"
                          placeholder="123"
                          value={paymentMethod.cardCvv || ''}
                          onChange={(e) => setPaymentMethod({ ...paymentMethod, cardCvv: e.target.value })}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                {paymentMethod.type === 'upi' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="UPI ID"
                      placeholder="yourname@upi"
                      value={paymentMethod.upiId || ''}
                      onChange={(e) => setPaymentMethod({ ...paymentMethod, upiId: e.target.value })}
                    />
                  </Box>
                )}

                {paymentMethod.type === 'cod' && (
                  <Box sx={{ mb: 3 }}>
                    <Alert severity="info">
                      Pay with cash when your order is delivered. Additional charges may apply for COD.
                    </Alert>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ minWidth: 150 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ minWidth: 150 }}
                  >
                    Continue
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Review Order
                </Typography>

                {/* Order Items */}
                <Box sx={{ mb: 3 }}>
                  {cart?.items?.map((item) => (
                    <Box key={item.product._id} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
                      <Box
                        component="img"
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity} × {formatPrice(item.product.finalPrice || item.product.price)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary">
                        {formatPrice((item.product.finalPrice || item.product.price) * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Shipping Address */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shippingAddress.firstName} {shippingAddress.lastName}<br />
                    {shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                    {shippingAddress.country}<br />
                    {shippingAddress.phone}
                  </Typography>
                </Box>

                {/* Payment Method */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {paymentMethod.type === 'card' && 'Credit/Debit Card'}
                    {paymentMethod.type === 'upi' && 'UPI Payment'}
                    {paymentMethod.type === 'cod' && 'Cash on Delivery'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ minWidth: 150 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    startIcon={processing ? <CircularProgress size={20} /> : null}
                    sx={{ minWidth: 150 }}
                  >
                    {processing ? 'Processing...' : 'Place Order'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Order Summary */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {cart?.items?.map((item) => (
                  <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {item.product.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice((item.product.finalPrice || item.product.price) * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">{formatPrice(tax)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(total)}
                </Typography>
              </Box>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                </Alert>
              )}

              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  You qualify for free shipping!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Checkout;
