import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SOCIAL_LINKS, CONTACT_INFO } from '../../utils/constants';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#2c3e50',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {/* Company Info */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🛍️ Huggle Mart
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your trusted e-commerce platform for quality products with AI-powered bargaining.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                color="inherit"
                href={SOCIAL_LINKS.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                href={SOCIAL_LINKS.TWITTER}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                href={SOCIAL_LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                href={SOCIAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Home
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/products')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Products
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/categories')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Categories
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/ai-bargaining')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                AI Bargaining
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/bargaining-tips')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Bargaining Tips
              </Link>
            </Box>
          </Box>

          {/* Customer Service */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Service
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/about')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                About Us
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/contact')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Contact Us
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/faq')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                FAQ
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/privacy')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Privacy Policy
              </Link>
              <Link
                component="button"
                variant="body2"
                color="inherit"
                underline="none"
                onClick={() => handleNavigation('/terms')}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Terms & Conditions
              </Link>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  {CONTACT_INFO.EMAIL}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">
                  {CONTACT_INFO.PHONE}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn fontSize="small" sx={{ mt: 0.5 }} />
                <Typography variant="body2">
                  {CONTACT_INFO.ADDRESS}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 4 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Huggle Mart. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              component="button"
              variant="body2"
              color="inherit"
              underline="none"
              onClick={() => handleNavigation('/privacy')}
            >
              Privacy Policy
            </Link>
            <Link
              component="button"
              variant="body2"
              color="inherit"
              underline="none"
              onClick={() => handleNavigation('/terms')}
            >
              Terms & Conditions
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
