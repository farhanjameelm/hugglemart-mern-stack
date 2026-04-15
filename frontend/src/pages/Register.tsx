import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  HowToReg,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  newsletter: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    newsletter: false,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{ color: 'success.main', mb: 2 }}>
              <HowToReg sx={{ fontSize: 64 }} />
            </Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
              Registration Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Your account has been created successfully. You will be redirected to the login page shortly.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting in 3 seconds...
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 3 }}
            >
              Go to Login Now
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join us and start shopping with amazing deals
            </Typography>
          </Box>

          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
                />
              </Box>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="1234567890"
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || 'Must contain 8+ characters with uppercase, lowercase, and number'}
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading}
              />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="#" onClick={(e) => e.preventDefault()}>
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="#" onClick={(e) => e.preventDefault()}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {errors.agreeToTerms && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {errors.agreeToTerms}
                  </Typography>
                )}
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Send me promotional offers and newsletters"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
                startIcon={loading ? <CircularProgress size={20} /> : <HowToReg />}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate('/login')}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
