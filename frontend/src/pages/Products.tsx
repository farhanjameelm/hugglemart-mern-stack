import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Rating,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  FilterList,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../types';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating' | 'name'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mock products with proper images
        const mockProducts = [
          {
            _id: '1',
            name: 'Smartphone Pro Max',
            slug: 'smartphone-pro-max',
            description: 'Latest flagship smartphone with advanced features',
            shortDescription: 'Premium smartphone with cutting-edge technology',
            price: 99999,
            finalPrice: 99999,
            originalPrice: 119999,
            discountPercentage: 17,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlNtYXJ0cGhvbmU8L3RleHQ+PC9zdmc+',
            images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlNtYXJ0cGhvbmU8L3RleHQ+PC9zdmc+'],
            rating: { average: 4.5, count: 234 },
            stock: 50,
            minOrderQuantity: 1,
            maxOrderQuantity: 5,
            tags: ['smartphone', 'electronics', 'premium'],
            features: ['5G', '128GB Storage', 'Dual Camera'],
            specifications: [],
            reviews: [],
            brand: 'TechBrand',
            sku: 'PHONE-001',
            isActive: true,
            isFeatured: true,
            isNewArrival: false,
            isBestSeller: true,
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
          {
            _id: '7',
            name: 'Bestseller Novel',
            slug: 'bestseller-novel',
            price: 599,
            finalPrice: 599,
            originalPrice: 799,
            discountPercentage: 25,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPkJvb2s8L3RleHQ+PC9zdmc+',
            rating: { average: 4.4, count: 789 },
            stock: 150,
            category: { name: 'Books & Media', slug: 'books-media' },
          },
          {
            _id: '8',
            name: 'Educational Puzzle Set',
            slug: 'educational-puzzle-set',
            price: 1499,
            finalPrice: 1499,
            originalPrice: 1999,
            discountPercentage: 25,
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U5MWU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPlB1enpsZTwvdGV4dD48L3N2Zz4=',
            rating: { average: 4.6, count: 234 },
            stock: 80,
            category: { name: 'Toys & Games', slug: 'toys-games' },
          },
        ];

        // Filter products based on search, category, price range, and rating
        let filteredProducts = mockProducts.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = !category || product.category.slug === category;
          const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
          const matchesRating = product.rating.average >= rating;
          
          return matchesSearch && matchesCategory && matchesPrice && matchesRating;
        });

        // Sort products
        filteredProducts.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'rating':
              return b.rating.average - a.rating.average;
            case 'name':
              return a.name.localeCompare(b.name);
            case 'newest':
            default:
              return 0; // Keep original order
          }
        });

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
}, [searchQuery, category, sortBy, priceRange, rating]);

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
          <Rating value={product.rating.average} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({product.rating.count})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip
            label={product.category?.name || 'Uncategorized'}
            size="small"
            color="primary"
            variant="outlined"
          />
          {product.stock > 0 ? (
            <Chip
              label="In Stock"
              size="small"
              color="success"
              sx={{ ml: 1 }}
            />
          ) : (
            <Chip
              label="Out of Stock"
              size="small"
              color="error"
              sx={{ ml: 1 }}
            />
          )}
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
            disabled={product.stock === 0}
            sx={{ flex: 1 }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        All Products
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1 }} />
          Filters
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="home">Home & Garden</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Min Rating</InputLabel>
            <Select
              value={rating}
              label="Min Rating"
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <MenuItem value={0}>All Ratings</MenuItem>
              <MenuItem value={4}>4+ Stars</MenuItem>
              <MenuItem value={3}>3+ Stars</MenuItem>
              <MenuItem value={2}>2+ Stars</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={100}
          />
        </Box>
      </Box>

      {/* Products Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Box key={`skeleton-${index}`}>
                <ProductSkeleton />
              </Box>
            ))
          : products.map((product) => (
              <Box key={product._id}>
                <ProductCard product={product} />
              </Box>
            ))}
      </Box>

      {!loading && products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
            setSearchQuery('');
            setCategory('');
            setSortBy('newest');
            setPriceRange([0, 10000]);
            setRating(0);
          }}>
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Products;
