import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Grid,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Lightbulb,
  TrendingUp,
  Warning,
  ThumbUp,
  ThumbDown,
  Star,
  Schedule,
  AttachMoney,
  Forum,
  Psychology,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BargainingTips: React.FC = () => {
  const navigate = useNavigate();

  const doItems = [
    {
      icon: <ThumbUp />,
      title: 'Be Polite and Respectful',
      description: 'Always maintain a friendly tone. Good manners go a long way in getting better deals.',
    },
    {
      icon: <AttachMoney />,
      title: 'Know the Market Price',
      description: 'Research the product\'s regular price before negotiating. Knowledge is power.',
    },
    {
      icon: <Star />,
      title: 'Be a Regular Customer',
      description: 'Loyalty often earns you better prices and preferential treatment.',
    },
    {
      icon: <Schedule />,
      title: 'Time Your Bargaining',
      description: 'Shop during off-peak hours or end-of-season sales for better deals.',
    },
    {
      icon: <Psychology />,
      title: 'Be Patient',
      description: 'Don\'t rush the process. Take your time to build rapport with the seller.',
    },
    {
      icon: <Forum />,
      title: 'Start a Conversation',
      description: 'Build rapport before discussing price. Ask about the product first.',
    },
  ];

  const dontItems = [
    {
      icon: <ThumbDown />,
      title: 'Don\'t Be Aggressive',
      description: 'Aggressive behavior rarely works and may offend the seller.',
    },
    {
      icon: <Warning />,
      title: 'Don\'t Make Unrealistic Offers',
      description: 'Extremely lowball offers insult sellers and waste everyone\'s time.',
    },
    {
      icon: <Cancel />,
      title: 'Don\'t Lie About Competitors',
      description: 'Don\'t make up fake competitor prices. Sellers can often verify this.',
    },
    {
      icon: <Schedule />,
      title: 'Don\'t Bargain During Busy Times',
      description: 'Avoid peak hours when sellers are stressed and have less time.',
    },
    {
      icon: <TrendingUp />,
      title: 'Don\'t Show Desperation',
      description: 'Act like you can walk away. Neediness weakens your position.',
    },
    {
      icon: <Security />,
      title: 'Don\'t Compromise Quality',
      description: 'Never sacrifice product quality for a slightly lower price.',
    },
  ];

  const aiTips = [
    {
      title: 'AI Analyzes Market Data',
      description: 'Our AI considers current market trends, competitor prices, and historical data.',
    },
    {
      title: 'Smart Negotiation Logic',
      description: 'The AI uses proven bargaining strategies and psychology to get you the best deal.',
    },
    {
      title: 'Real-time Adaptation',
      description: 'AI adjusts its approach based on seller responses and negotiation progress.',
    },
    {
      title: 'Fair Price Calculation',
      description: 'AI ensures you get a genuine discount while maintaining seller profitability.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        <Lightbulb sx={{ mr: 2, verticalAlign: 'middle' }} />
        DO & DON\'T of Smart Bargaining
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Master the art of bargaining with our comprehensive guide. Learn the psychology behind successful negotiations and how our AI can help you get the best deals.
      </Typography>

      {/* DO's Section */}
      <Card sx={{ mb: 4, bgcolor: 'success.light', border: '2px solid', borderColor: 'success.main' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ color: 'success.dark', fontWeight: 'bold' }}>
            <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
            DO These for Successful Bargaining
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            {doItems.map((item, index) => (
              <Card key={index} sx={{ bgcolor: 'white', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <ListItemIcon sx={{ color: 'success.main', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={item.description}
                      slotProps={{
                        primary: {
                          sx: { fontWeight: 'bold', color: 'success.dark' }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* DON'Ts Section */}
      <Card sx={{ mb: 4, bgcolor: 'error.light', border: '2px solid', borderColor: 'error.main' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ color: 'error.dark', fontWeight: 'bold' }}>
            <Cancel sx={{ mr: 1, verticalAlign: 'middle' }} />
            DON\'T Do These - Common Mistakes
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            {dontItems.map((item, index) => (
              <Card key={index} sx={{ bgcolor: 'white', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={item.description}
                      slotProps={{
                        primary: {
                          sx: { fontWeight: 'bold', color: 'error.dark' }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* AI Bargaining Tips */}
      <Card sx={{ mb: 4, bgcolor: 'primary.light', border: '2px solid', borderColor: 'primary.main' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
            <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
            How Our AI Bargaining Assistant Helps
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            {aiTips.map((tip, index) => (
              <Card key={index} sx={{ bgcolor: 'white' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tip.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Bargaining Formula
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText primary="Research price before negotiating" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText primary="Start with 70-80% of asking price" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText primary="Be willing to walk away" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText primary="Bundle multiple items for better deals" />
          </ListItem>
        </List>
      </Alert>

      {/* Call to Action */}
      <Card sx={{ bgcolor: 'grey.100' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Try AI Bargaining?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Put these tips into practice with our intelligent AI assistant that negotiates on your behalf.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/ai-bargaining')}
            >
              Start AI Bargaining
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BargainingTips;
