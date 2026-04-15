import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Skeleton,
} from '@mui/material';
import { ShoppingCart, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

// Simplified mock data
const mockFeaturedProducts = [
  {
    _id: '1',
    name: 'Smartphone Pro Max',
    slug: 'smartphone-pro-max',
    description: 'Latest flagship smartphone with advanced features',
    shortDescription: 'Premium smartphone with cutting-edge technology',
    price: 99999,
    originalPrice: 119999,
    discountPercentage: 17,
    category: { _id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 1, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
    brand: 'TechBrand',
    sku: 'PHONE-001',
    images: ['https://via.placeholder.com/300x300/2196f3/ffffff?text=Smartphone'],
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlNtYXJ0cGhvbmU8L3RleHQ+PC9zdmc+',
    stock: 50,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    tags: ['smartphone', 'electronics', 'premium'],
    rating: { average: 4.5, count: 234 },
    reviews: [],
    features: ['5G', '128GB Storage', 'Dual Camera'],
    specifications: [],
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    _id: '2',
    name: 'Laptop Ultra',
    slug: 'laptop-ultra',
    price: 149999,
    originalPrice: 179999,
    discountPercentage: 17,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkxhcHRvcDwvdGV4dD48L3N2Zz4=',
    rating: { average: 4.7, count: 189 },
    stock: 30,
    category: { _id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 1, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
];

const mockNewArrivals = [
  {
    _id: '3',
    name: 'Designer T-Shirt',
    slug: 'designer-tshirt',
    price: 2999,
    originalPrice: 3999,
    discountPercentage: 25,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlQtU2hpcnQ8L3RleHQ+PC9zdmc+',
    rating: { average: 4.2, count: 567 },
    stock: 100,
    category: { _id: '2', name: 'Clothing', slug: 'clothing', isActive: true, sortOrder: 2, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  {
    _id: '4',
    name: 'Premium Jeans',
    slug: 'premium-jeans',
    price: 4999,
    originalPrice: 6999,
    discountPercentage: 29,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkplYW5zPC90ZXh0Pjwvc3ZnPg==',
    rating: { average: 4.6, count: 234 },
    stock: 75,
    category: { _id: '2', name: 'Clothing', slug: 'clothing', isActive: true, sortOrder: 2, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    createdAt: '2024-01-18T00:00:00.000Z',
    updatedAt: '2024-01-18T00:00:00.000Z',
  },
];

const mockBestSellers = [
  {
    _id: '5',
    name: 'Smart Garden Kit',
    slug: 'smart-garden-kit',
    price: 7999,
    originalPrice: 9999,
    discountPercentage: 20,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhiYzM0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkdhcmRlbiBLaXQ8L3RleHQ+PC9zdmc+',
    rating: { average: 4.3, count: 123 },
    stock: 40,
    category: { _id: '3', name: 'Home & Garden', slug: 'home-garden', isActive: true, sortOrder: 3, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
  },
  {
    _id: '6',
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    price: 1999,
    originalPrice: 2999,
    discountPercentage: 33,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPllvZ2EgTWF0PC90ZXh0Pjwvc3ZnPg==',
    rating: { average: 4.8, count: 456 },
    stock: 200,
    category: { _id: '4', name: 'Sports & Fitness', slug: 'sports-fitness', isActive: true, sortOrder: 4, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFeaturedProducts(mockFeaturedProducts);
        setNewArrivals(mockNewArrivals);
        setBestSellers(mockBestSellers);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ProductCard: React.FC<{ product: any }> = ({ product }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.thumbnail}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Star sx={{ color: '#ffc107', fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {product.rating.average.toFixed(1)} ({product.rating.count})
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          {product.discountPercentage > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                }}
              >
                {formatPrice(product.price)}
              </Typography>
              <Chip
                label={`${product.discountPercentage}% OFF`}
                color="error"
                size="small"
              />
            </Box>
          )}
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatPrice(product.finalPrice || product.price)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await addToCart(product._id, 1);
                alert(`${product.name} added to cart!`);
              } catch (error) {
                alert('Error adding to cart. Please try again.');
              }
            }}
            sx={{ flex: 1 }}
          >
            Add to Cart
          </Button>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ai-bargaining?product=${product.slug}`);
            }}
            sx={{ minWidth: 'auto' }}
          >
            AI Bargain
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const ProductSkeleton: React.FC = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={36} />
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          mb: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to Huggle Mart
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          Your trusted e-commerce platform with AI-powered bargaining for the best deals!
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
          onClick={() => navigate('/products')}
        >
          Start Shopping
        </Button>
      </Box>

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          🌟 Featured Products
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Box key={`skeleton-featured-${index}`}>
                  <ProductSkeleton />
                </Box>
              ))
            : featuredProducts.map((product) => (
                <Box key={product._id}>
                  <ProductCard product={product} />
                </Box>
              ))}
        </Box>
      </Box>

      {/* New Arrivals */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          ✨ New Arrivals
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Box key={`skeleton-new-${index}`}>
                  <ProductSkeleton />
                </Box>
              ))
            : newArrivals.map((product) => (
                <Box key={product._id}>
                  <ProductCard product={product} />
                </Box>
              ))}
        </Box>
      </Box>

      {/* Best Sellers */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          🔥 Best Sellers
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Box key={`skeleton-best-${index}`}>
                  <ProductSkeleton />
                </Box>
              ))
            : bestSellers.map((product) => (
                <Box key={product._id}>
                  <ProductCard product={product} />
                </Box>
              ))}
        </Box>
      </Box>

      {/* AI Bargaining CTA */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          mt: 4,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          🤖 Try AI Bargaining!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
          Let our AI help you get the best prices on your favorite products through smart negotiation!
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: 'secondary.main',
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
          onClick={() => navigate('/ai-bargaining')}
        >
          Start Bargaining
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
