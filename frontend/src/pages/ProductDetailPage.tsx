import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Rating,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  Add,
  Remove,
  Favorite,
  Share,
  LocalShipping,
  Security,
  Refresh,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';

// Mock product data
const mockProducts = {
  'smartphone-pro-max': {
    _id: '1',
    name: 'Smartphone Pro Max',
    slug: 'smartphone-pro-max',
    description: 'Experience the future with our flagship smartphone featuring cutting-edge technology, stunning display, and powerful performance.',
    price: 99999,
    originalPrice: 119999,
    discountPercentage: 17,
    category: { name: 'Electronics', slug: 'electronics' },
    brand: 'TechBrand',
    sku: 'PHONE-001',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlNtYXJ0cGhvbmU8L3RleHQ+PC9zdmc+',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlNtYXJ0cGhvbmU8L3RleHQ+PC9zdmc+',
    ],
    stock: 50,
    rating: { average: 4.5, count: 234 },
    features: ['5G Connectivity', '128GB Storage', 'Dual Camera System', '6.7" Display', 'All-day Battery'],
    specifications: [
      { label: 'Display', value: '6.7" OLED, 120Hz' },
      { label: 'Processor', value: 'Latest Snapdragon' },
      { label: 'RAM', value: '8GB' },
      { label: 'Storage', value: '128GB' },
      { label: 'Camera', value: '50MP + 12MP' },
      { label: 'Battery', value: '4500mAh' },
    ],
  },
  'laptop-ultra': {
    _id: '2',
    name: 'Laptop Ultra',
    slug: 'laptop-ultra',
    description: 'Ultra-thin laptop with powerful performance, stunning display, and all-day battery life. Perfect for professionals and creators.',
    price: 149999,
    originalPrice: 179999,
    discountPercentage: 17,
    category: { name: 'Electronics', slug: 'electronics' },
    brand: 'TechBrand',
    sku: 'LAPTOP-001',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkxhcHRvcDwvdGV4dD48L3N2Zz4=',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkxhcHRvcDwvdGV4dD48L3N2Zz4=',
    ],
    stock: 30,
    rating: { average: 4.7, count: 189 },
    features: ['15.6" 4K Display', 'Intel Core i7', '16GB RAM', '512GB SSD', 'Backlit Keyboard'],
    specifications: [
      { label: 'Display', value: '15.6" 4K OLED' },
      { label: 'Processor', value: 'Intel Core i7 12th Gen' },
      { label: 'RAM', value: '16GB DDR5' },
      { label: 'Storage', value: '512GB NVMe SSD' },
      { label: 'Graphics', value: 'RTX 3060' },
      { label: 'Battery', value: '12 hours' },
    ],
  },
  'designer-tshirt': {
    _id: '3',
    name: 'Designer T-Shirt',
    slug: 'designer-tshirt',
    description: 'Premium quality designer t-shirt made from organic cotton. Comfortable, stylish, and sustainable.',
    price: 2999,
    originalPrice: 3999,
    discountPercentage: 25,
    category: { name: 'Clothing', slug: 'clothing' },
    brand: 'FashionBrand',
    sku: 'SHIRT-001',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlQtU2hpcnQ8L3RleHQ+PC9zdmc+',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlQtU2hpcnQ8L3RleHQ+PC9zdmc+',
    ],
    stock: 100,
    rating: { average: 4.2, count: 567 },
    features: ['100% Organic Cotton', 'Machine Washable', 'Eco-friendly', 'Designer Brand'],
    specifications: [
      { label: 'Material', value: '100% Organic Cotton' },
      { label: 'Sizes', value: 'S, M, L, XL, XXL' },
      { label: 'Colors', value: 'Black, White, Navy, Gray' },
      { label: 'Care', value: 'Machine Washable' },
      { label: 'Fit', value: 'Regular Fit' },
      { label: 'Origin', value: 'Made in India' },
    ],
  },
  'premium-jeans': {
    _id: '4',
    name: 'Premium Jeans',
    slug: 'premium-jeans',
    description: 'High-quality denim jeans with perfect fit and durability. Classic style meets modern comfort.',
    price: 4999,
    originalPrice: 6999,
    discountPercentage: 29,
    category: { name: 'Clothing', slug: 'clothing' },
    brand: 'DenimCo',
    sku: 'JEANS-001',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkplYW5zPC90ZXh0Pjwvc3ZnPg==',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkplYW5zPC90ZXh0Pjwvc3ZnPg==',
    ],
    stock: 75,
    rating: { average: 4.6, count: 234 },
    features: ['Premium Denim', 'Classic Fit', 'Durable', 'Multiple Washes Available'],
    specifications: [
      { label: 'Material', value: '98% Cotton, 2% Elastane' },
      { label: 'Fit', value: 'Regular Fit' },
      { label: 'Rise', value: 'Mid Rise' },
      { label: 'Closure', value: 'Button Fly' },
      { label: 'Pockets', value: '5 Pocket Style' },
      { label: 'Care', value: 'Machine Wash Cold' },
    ],
  },
  'smart-garden-kit': {
    _id: '5',
    name: 'Smart Garden Kit',
    slug: 'smart-garden-kit',
    description: 'Complete smart gardening solution with automated watering, LED grow lights, and mobile app control.',
    price: 7999,
    originalPrice: 9999,
    discountPercentage: 20,
    category: { name: 'Home & Garden', slug: 'home-garden' },
    brand: 'GreenTech',
    sku: 'GARDEN-001',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhiYzM0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkdhcmRlbiBLaXQ8L3RleHQ+PC9zdmc+',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhiYzM0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkdhcmRlbiBLaXQ8L3RleHQ+PC9zdmc+',
    ],
    stock: 40,
    rating: { average: 4.3, count: 123 },
    features: ['Automated Watering', 'LED Grow Lights', 'Mobile App Control', 'Soil Moisture Sensor'],
    specifications: [
      { label: 'Size', value: '60cm x 40cm x 80cm' },
      { label: 'Water Tank', value: '5 Liters' },
      { label: 'LED Power', value: '20W Full Spectrum' },
      { label: 'Connectivity', value: 'WiFi + Bluetooth' },
      { label: 'App Support', value: 'iOS & Android' },
      { label: 'Power', value: 'USB-C Powered' },
    ],
  },
  'yoga-mat-premium': {
    _id: '6',
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Professional-grade yoga mat with superior grip, cushioning, and durability. Perfect for all yoga styles.',
    price: 1999,
    originalPrice: 2999,
    discountPercentage: 33,
    category: { name: 'Sports & Fitness', slug: 'sports-fitness' },
    brand: 'FitGear',
    sku: 'YOGA-001',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPllvZ2EgTWF0PC90ZXh0Pjwvc3ZnPg==',
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPllvZ2EgTWF0PC90ZXh0Pjwvc3ZnPg==',
    ],
    stock: 200,
    rating: { average: 4.8, count: 456 },
    features: ['Non-slip Surface', 'Extra Thick (6mm)', 'Eco-friendly Material', 'Carrying Strap Included'],
    specifications: [
      { label: 'Dimensions', value: '183cm x 61cm x 6mm' },
      { label: 'Material', value: 'TPE Eco-friendly' },
      { label: 'Weight', value: '1.2kg' },
      { label: 'Texture', value: 'Non-slip Surface' },
      { label: 'Colors', value: 'Purple, Blue, Green, Pink' },
      { label: 'Care', value: 'Wipe Clean' },
    ],
  },
};

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const productData = mockProducts[slug as keyof typeof mockProducts];
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product?.name} to cart!`);
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

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Product not found'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={`/category/${product.category.slug}`} color="inherit">
          {product.category.name}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <Box>
          <CardMedia
            component="img"
            height="400"
            image={product.images[selectedImage]}
            alt={product.name}
            sx={{ borderRadius: 2, mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
            {product.images.map((image: string, index: number) => (
              <Card
                key={index}
                sx={{
                  minWidth: 80,
                  cursor: 'pointer',
                  border: selectedImage === index ? 2 : 1,
                  borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                }}
                onClick={() => setSelectedImage(index)}
              >
                <CardMedia
                  component="img"
                  height="80"
                  image={image}
                  alt={`${product.name} ${index + 1}`}
                />
              </Card>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating.average} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {product.rating.average} ({product.rating.count} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              ${product.price.toLocaleString()}
            </Typography>
            {product.originalPrice && (
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${product.originalPrice.toLocaleString()}
              </Typography>
            )}
            {product.discountPercentage > 0 && (
              <Chip label={`${product.discountPercentage}% OFF`} color="success" />
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {product.features.map((feature: string, index: number) => (
                <Chip key={index} label={feature} variant="outlined" size="small" />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="body1">Quantity:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <Typography sx={{ mx: 2, minWidth: 40, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
              >
                <Add />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              sx={{ flexGrow: 1 }}
            >
              Add to Cart
            </Button>
            <IconButton>
              <Favorite />
            </IconButton>
            <IconButton>
              <Share />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Typography>
            {product.stock > 0 && (
              <Chip label="In Stock" color="success" size="small" />
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping color="action" />
              <Typography variant="body2">Free Shipping</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security color="action" />
              <Typography variant="body2">Secure Payment</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Refresh color="action" />
              <Typography variant="body2">30-Day Returns</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Specifications
        </Typography>
        <Card>
          <CardContent>
            <List>
              {product.specifications.map((spec: any, index: number) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={spec.label}
                      secondary={spec.value}
                      sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }}
                    />
                  </ListItem>
                  {index < product.specifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
