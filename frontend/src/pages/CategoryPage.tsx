import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

// Mock data for demonstration
const mockProducts = {
  electronics: [
    {
      _id: '1',
      name: 'Smartphone Pro Max',
      slug: 'smartphone-pro-max',
      price: 99999,
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
      originalPrice: 179999,
      discountPercentage: 17,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkxhcHRvcDwvdGV4dD48L3N2Zz4=',
      rating: { average: 4.7, count: 189 },
      stock: 30,
      category: { name: 'Electronics', slug: 'electronics' },
    },
  ],
  clothing: [
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
      category: { name: 'Clothing', slug: 'clothing' },
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
      category: { name: 'Clothing', slug: 'clothing' },
    },
  ],
  'home-garden': [
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
      category: { name: 'Home & Garden', slug: 'home-garden' },
    },
  ],
  'sports-fitness': [
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
      category: { name: 'Sports & Fitness', slug: 'sports-fitness' },
    },
  ],
  'books-media': [
    {
      _id: '7',
      name: 'Bestseller Novel',
      slug: 'bestseller-novel',
      price: 599,
      originalPrice: 799,
      discountPercentage: 25,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkJvb2s8L3RleHQ+PC9zdmc+',
      rating: { average: 4.4, count: 789 },
      stock: 150,
      category: { name: 'Books & Media', slug: 'books-media' },
    },
  ],
  'toys-games': [
    {
      _id: '8',
      name: 'Educational Puzzle Set',
      slug: 'educational-puzzle-set',
      price: 1499,
      originalPrice: 1999,
      discountPercentage: 25,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U5MWU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlB1enpsZTwvdGV4dD48L3N2Zz4=',
      rating: { average: 4.6, count: 234 },
      stock: 80,
      category: { name: 'Toys & Games', slug: 'toys-games' },
    },
  ],
};

const categoryInfo = {
  electronics: {
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices for modern living',
    color: '#2196f3',
  },
  clothing: {
    name: 'Clothing',
    description: 'Fashionable apparel for all seasons and styles',
    color: '#4caf50',
  },
  'home-garden': {
    name: 'Home & Garden',
    description: 'Everything you need for your home and garden',
    color: '#8bc34a',
  },
  'sports-fitness': {
    name: 'Sports & Fitness',
    description: 'Equipment and gear for active lifestyle',
    color: '#ff9800',
  },
  'books-media': {
    name: 'Books & Media',
    description: 'Books, music, and entertainment for everyone',
    color: '#9c27b0',
  },
  'toys-games': {
    name: 'Toys & Games',
    description: 'Fun and educational toys and games for all ages',
    color: '#e91e63',
  },
};

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const categoryProducts = mockProducts[slug as keyof typeof mockProducts] || [];
        setProducts(categoryProducts);
        
        if (categoryProducts.length === 0) {
          setError('No products found in this category');
        }
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const category = categoryInfo[slug as keyof typeof categoryInfo];

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
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Typography variant="h4" align="center">
          Category not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Category Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: category?.color }}>
          {category?.name || 'Category'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {category?.description || 'Browse products in this category'}
        </Typography>
        <Chip 
          label={`${products.length} Products`} 
          variant="outlined" 
          sx={{ 
            borderColor: category?.color, 
            color: category?.color,
            fontWeight: 'bold'
          }} 
        />
      </Box>

      {/* Products Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {products.map((product) => (
          <Card key={product._id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image={product.thumbnail}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Star sx={{ color: '#ffc107', fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {product.rating.average} ({product.rating.count})
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  ₹{product.price.toLocaleString()}
                </Typography>
                {product.originalPrice && (
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString()}
                  </Typography>
                )}
                {product.discountPercentage > 0 && (
                  <Chip 
                    label={`${product.discountPercentage}% OFF`} 
                    color="success" 
                    size="small" 
                  />
                )}
              </Box>
            </CardContent>
            <CardActions>
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
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
            </CardActions>
          </Card>
        ))}
      </Box>

      {products.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products available in this category yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later or browse other categories.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CategoryPage;
