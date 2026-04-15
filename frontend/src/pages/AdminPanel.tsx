import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingCart,
  Store,
  TrendingUp,
  TrendingDown,
  Star,
  RateReview,
  Visibility,
  Edit,
  Delete,
  Refresh,
  Assessment,
  AttachMoney,
  Inventory,
  Category,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalSales: 125430,
    totalOrders: 1847,
    totalUsers: 3421,
    totalProducts: 892,
    pendingOrders: 23,
    lowStock: 15,
    recentReviews: 8,
    monthlyGrowth: 12.5,
  });

  const [recentOrders] = useState([
    { id: 'ORD-001', customer: 'John Doe', amount: 2599, status: 'completed', date: '2024-04-14' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 1899, status: 'pending', date: '2024-04-14' },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: 3299, status: 'processing', date: '2024-04-13' },
    { id: 'ORD-004', customer: 'Alice Brown', amount: 999, status: 'completed', date: '2024-04-13' },
    { id: 'ORD-005', customer: 'Charlie Wilson', amount: 4599, status: 'cancelled', date: '2024-04-12' },
  ]);

  const [reviews] = useState([
    { id: 1, product: 'Wireless Headphones', customer: 'John Doe', rating: 5, comment: 'Excellent sound quality!', date: '2024-04-14' },
    { id: 2, product: 'Smart Watch', customer: 'Jane Smith', rating: 4, comment: 'Good value for money', date: '2024-04-14' },
    { id: 3, product: 'Laptop Stand', customer: 'Bob Johnson', rating: 3, comment: 'Average quality', date: '2024-04-13' },
    { id: 4, product: 'USB-C Hub', customer: 'Alice Brown', rating: 5, comment: 'Perfect for my setup', date: '2024-04-13' },
  ]);

  const [topProducts] = useState([
    { name: 'Wireless Headphones', sales: 342, revenue: 102600, trend: 'up' },
    { name: 'Smart Watch', sales: 289, revenue: 86700, trend: 'up' },
    { name: 'Laptop Stand', sales: 198, revenue: 39600, trend: 'down' },
    { name: 'USB-C Hub', sales: 167, revenue: 33400, trend: 'up' },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'processing': return <LocalShipping />;
      case 'cancelled': return <Cancel />;
      default: return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} sx={{ color: i < rating ? '#FFD700' : '#E0E0E0', fontSize: 16 }} />
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your Huggle Mart store, view analytics, and monitor performance
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney sx={{ mr: 1 }} />
              <Typography variant="h6">Total Sales</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ${stats.totalSales.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ mr: 1, fontSize: 16 }} />
              <Typography variant="body2">
                +{stats.monthlyGrowth}% this month
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ShoppingCart sx={{ mr: 1 }} />
              <Typography variant="h6">Total Orders</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.totalOrders}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Badge badgeContent={stats.pendingOrders} color="error">
                <Typography variant="body2">
                  {stats.pendingOrders} pending
                </Typography>
              </Badge>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <People sx={{ mr: 1 }} />
              <Typography variant="h6">Total Users</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.totalUsers}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Active customers
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Inventory sx={{ mr: 1 }} />
              <Typography variant="h6">Products</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.totalProducts}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingDown sx={{ mr: 1, fontSize: 16 }} />
              <Typography variant="body2">
                {stats.lowStock} low stock
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Recent Orders" icon={<ShoppingCart />} iconPosition="start" />
          <Tab label="Reviews" icon={<RateReview />} iconPosition="start" />
          <Tab label="Top Products" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Analytics" icon={<Assessment />} iconPosition="start" />
        </Tabs>

        {/* Recent Orders Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Recent Orders
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{order.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {order.customer.charAt(0)}
                        </Avatar>
                        {order.customer}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>${order.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Customer Reviews
          </Typography>
          <List>
            {reviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {review.product}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {review.customer} on {review.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      {renderStars(review.rating)}
                    </Box>
                  </Box>
                  <Typography variant="body1">{review.comment}</Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined">
                      Approve
                    </Button>
                    <Button size="small" variant="outlined" color="error">
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        </TabPanel>

        {/* Top Products Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Top Performing Products
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {topProducts.map((product, index) => (
              <Card key={product.name} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                      #{index + 1}
                    </Typography>
                    {product.trend === 'up' ? (
                      <TrendingUp sx={{ color: 'success.main' }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main' }} />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.sales} units sold
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    ${product.revenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Analytics Overview
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Advanced analytics and reporting features coming soon! This will include detailed sales reports, 
              customer behavior analysis, inventory tracking, and performance metrics.
            </Typography>
          </Alert>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Overview
                </Typography>
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Chart visualization coming soon
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Analytics
                </Typography>
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer insights coming soon
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </Button>
        <Button
          variant="outlined"
          startIcon={<Store />}
          onClick={() => navigate('/products')}
        >
          View Products
        </Button>
        <Button
          variant="outlined"
          startIcon={<Category />}
          onClick={() => navigate('/categories')}
        >
          Manage Categories
        </Button>
      </Box>
    </Container>
  );
};

export default AdminPanel;
