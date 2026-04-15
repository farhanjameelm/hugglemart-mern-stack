import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Link,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('Backend server is not running. Use demo credentials or start the backend.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
        {/* Left Side - Login Form */}
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Welcome Back!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your Huggle Mart account to access your orders, wishlist, and personalized recommendations.
          </Typography>

          <Card sx={{ maxWidth: 500 }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Link component={RouterLink} to="/forgot-password">
                    Forgot your password?
                  </Link>
                </Box>

                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Working Demo Account:</strong><br />
                    Email: demo@hugglemart.com<br />
                    Password: demo123<br />
                    <small>Account created and ready to use!</small>
                  </Typography>
                </Alert>

                <Divider sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  component={RouterLink}
                  to="/register"
                >
                  Create New Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>

        {/* Right Side - Features */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Why Choose Huggle Mart?
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  AI-Powered Bargaining
                </Typography>
                <Typography variant="body2">
                  Get the best prices with our intelligent AI negotiation system that helps you save money on every purchase.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Wide Product Selection
                </Typography>
                <Typography variant="body2">
                  Browse through thousands of products across multiple categories with detailed descriptions and reviews.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Secure Shopping
                </Typography>
                <Typography variant="body2">
                  Shop with confidence using our secure payment system and protected personal information.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Fast Delivery
                </Typography>
                <Typography variant="body2">
                  Quick and reliable delivery to your doorstep with real-time tracking updates.
                </Typography>
              </Box>

              <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  New Customer?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Join thousands of satisfied customers who are already saving money with AI bargaining.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  component={RouterLink}
                  to="/register"
                >
                  Sign Up Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
 