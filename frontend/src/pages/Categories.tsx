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
  Skeleton,
  Grid,
} from '@mui/material';
import {
  Category as CategoryIcon,
  ShoppingCart,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { Category } from '../types';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // We'll need to create a category service, for now using mock data
        const mockCategories: Category[] = [
          {
            _id: '1',
            name: 'Electronics',
            slug: 'electronics',
            description: 'Latest gadgets and electronic devices',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iODAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiPkVsZWN0cm9uaWNzPC90ZXh0Pjwvc3ZnPg==',
            isActive: true,
            sortOrder: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '2',
            name: 'Clothing',
            slug: 'clothing',
            description: 'Fashion apparel for all occasions',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iODAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiPkNsb3RoaW5nPC90ZXh0Pjwvc3ZnPg==',
            isActive: true,
            sortOrder: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '3',
            name: 'Home & Garden',
            slug: 'home-garden',
            description: 'Everything for your home and garden',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhiYzM0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iODAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiPkhvbWUgJiBHYXJkZW48L3RleHQ+PC9zdmc+',
            isActive: true,
            sortOrder: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '4',
            name: 'Sports & Fitness',
            slug: 'sports-fitness',
            description: 'Sports equipment and fitness gear',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iODAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiPlNwb3J0cyAmIEZpdG5lc3M8L3RleHQ+PC9zdmc+',
            isActive: true,
            sortOrder: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '5',
            name: 'Books & Media',
            slug: 'books-media',
            description: 'Books, movies, and digital media',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjUwJSIgeT0iODAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiPkJvb2tzICYgTWVkaWE8L3RleHQ+PC9zdmc+',
            isActive: true,
            sortOrder: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '6',
            name: 'Toys & Games',
            slug: 'toys-games',
            description: 'Fun toys and games for all ages',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U5MWU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iODAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiPlRveXMgJiBHYW1lczwvdGV4dD48L3N2Zz4=',
            isActive: true,
            sortOrder: 6,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const CategoryCard: React.FC<{ category: Category }> = ({ category }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => navigate(`/category/${category.slug}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={category.image}
        alt={category.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CategoryIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {category.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {category.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            label="156 Products"
            size="small"
            color="primary"
            variant="outlined"
          />
          {category.isActive && (
            <Chip
              label="Active"
              size="small"
              color="success"
            />
          )}
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/category/${category.slug}`);
          }}
        >
          Browse Products
        </Button>
      </CardContent>
    </Card>
  );

  const CategorySkeleton: React.FC = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={36} />
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Shop by Category
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore our wide range of categories and find exactly what you're looking for.
      </Typography>

      {/* Categories Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Box key={`skeleton-${index}`}>
                <CategorySkeleton />
              </Box>
            ))
          : categories.map((category) => (
              <Box key={category._id}>
                <CategoryCard category={category} />
              </Box>
            ))}
      </Box>

      {!loading && categories.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No categories available at the moment.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please check back later for new categories.
          </Typography>
        </Box>
      )}

      {/* Featured Categories */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Featured Categories
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Check out our most popular categories with special discounts and offers.
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {['Electronics', 'Clothing', 'Home & Garden'].map((name) => (
            <Button
              key={name}
              variant="contained"
              color="primary"
              onClick={() => navigate(`/category/${name.toLowerCase().replace(' & ', '-')}`)}
            >
              {name}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Categories;
