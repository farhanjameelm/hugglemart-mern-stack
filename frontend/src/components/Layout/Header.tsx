import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
  Close,
  Home,
  Category,
  Store,
  Chat,
  Info,
  ContactPhone,
  Logout,
  Person,
  ShoppingBag,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { NAVIGATION_LINKS, USER_NAVIGATION_LINKS } from '../../utils/constants';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const totalItems = cart?.totalItems || 0;

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Huggle Mart
        </Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {NAVIGATION_LINKS.map((link) => (
          <ListItem
            key={link.path}
            onClick={() => handleNavigation(link.path)}
            sx={{ 
              cursor: 'pointer',
              bgcolor: location.pathname === link.path ? 'action.selected' : 'transparent'
            }}
          >
            <ListItemIcon>
              {link.path === '/' && <Home />}
              {link.path === '/products' && <ShoppingBag />}
              {link.path === '/categories' && <Category />}
              {link.path === '/ai-bargaining' && <Chat />}
              {link.path === '/bargaining-tips' && <Info />}
              {link.path === '/contact' && <ContactPhone />}
            </ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItem>
        ))}
        
        {isAuthenticated && (
          <>
            <Divider />
            {USER_NAVIGATION_LINKS.map((link) => (
              <ListItem
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>
                  {link.path === '/profile' && <Person />}
                  {link.path === '/orders' && <ShoppingBag />}
                  {link.path === '/wishlist' && <Store />}
                  {link.path === '/settings' && <Settings />}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          {/* Mobile menu icon */}
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
            onClick={() => navigate('/')}
          >
            🛍️ Huggle Mart
          </Typography>

          {/* Search bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              maxWidth: 400, 
              mx: 2,
              flexGrow: 1
            }}
          >
            <TextField
              fullWidth
              size="small"
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
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
              }}
            />
          </Box>

          {/* Navigation links - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/products')}>
              Products
            </Button>
            <Button color="inherit" onClick={() => navigate('/categories')}>
              Categories
            </Button>
            <Button color="inherit" onClick={() => navigate('/ai-bargaining')}>
              AI Bargain
            </Button>
          </Box>

          {/* Cart icon */}
          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            sx={{ ml: 1 }}
          >
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* User menu */}
          {isAuthenticated ? (
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff' }}>
                {user?.firstName?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          ) : (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{ ml: 1, borderColor: 'white' }}
            >
              Login
            </Button>
          )}

          {/* User dropdown menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            sx={{ '& .MuiPaper-root': { mt: 1 } }}
          >
            <MenuItem onClick={() => { handleNavigation('/profile'); handleUserMenuClose(); }}>
              <Person sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleNavigation('/orders'); handleUserMenuClose(); }}>
              <ShoppingBag sx={{ mr: 1 }} />
              Orders
            </MenuItem>
            <MenuItem onClick={() => { handleNavigation('/wishlist'); handleUserMenuClose(); }}>
              <Store sx={{ mr: 1 }} />
              Wishlist
            </MenuItem>
            <MenuItem onClick={() => { handleNavigation('/settings'); handleUserMenuClose(); }}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile search bar */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2, bgcolor: '#f5f5f5' }}>
        <Box component="form" onSubmit={handleSearch}>
          <TextField
            fullWidth
            size="small"
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
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;
