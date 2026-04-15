import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  LocalShipping,
  Payment,
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  Home,
  ArrowBack,
  Refresh,
  Download,
  Receipt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    thumbnail: string;
  };
  quantity: number;
  price: number;
  finalPrice?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  deliveredAt?: string;
  trackingNumber?: string;
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');

  // Mock orders data
  const mockOrders: Order[] = [
    {
      _id: '1',
      orderNumber: 'ORD-2024-001',
      status: 'delivered',
      totalAmount: 15997,
      subtotal: 13997,
      shipping: 500,
      tax: 2000,
      items: [
        {
          _id: '1',
          product: {
            _id: '1',
            name: 'Smartphone Pro Max',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSJBcmlhbCI+PHRleHQgeD0iNTAlIHR4eHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCI+U21hcnRvbmU+PC9zdmc+',
          },
          quantity: 1,
          price: 9999,
          finalPrice: 9999,
        },
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
      },
      paymentMethod: 'Credit Card',
      createdAt: '2024-01-15T10:30:00Z',
      deliveredAt: '2024-01-18T14:20:00Z',
      trackingNumber: 'TRK123456789',
    },
    {
      _id: '2',
      orderNumber: 'ORD-2024-002',
      status: 'shipped',
      totalAmount: 5998,
      subtotal: 5498,
      shipping: 200,
      tax: 300,
      items: [
        {
          _id: '3',
          product: {
            _id: '3',
            name: 'Designer T-Shirt',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRjYWY1MCI+PHRleHQgeD0iNTAlIHR4eHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCI+PHRleHQgeD0iNTAlIHR4eHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCI+U21hcnRvbmU+PC9zdmc+',
          },
          quantity: 2,
          price: 2999,
          finalPrice: 2499,
        },
      ],
      shippingAddress: {
        firstName: 'Jane',
        lastName: 'Smith',
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        country: 'India',
      },
      paymentMethod: 'UPI',
      createdAt: '2024-01-20T15:45:00Z',
      trackingNumber: 'TRK987654321',
    },
    {
      _id: '3',
      orderNumber: 'ORD-2024-003',
      status: 'processing',
      totalAmount: 12997,
      subtotal: 11997,
      shipping: 500,
      tax: 500,
      items: [
        {
          _id: '2',
          product: {
            _id: '2',
            name: 'Laptop Ultra',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIHRleHRBbmNob3I9Im1pZGRsZSIgZmlsbD0iIzIxOTZmMyIvPjwvc3ZnPg==',
          },
          quantity: 1,
          price: 14999,
          finalPrice: 11997,
        },
      ],
      shippingAddress: {
        firstName: 'Mike',
        lastName: 'Johnson',
        street: '789 Oak Street',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',
      },
      paymentMethod: 'Cash on Delivery',
      createdAt: '2024-01-22T09:15:00Z',
    },
  ];

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle />;
      case 'shipped':
        return <LocalShipping />;
      case 'processing':
        return <Schedule />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Pending />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    if (tabValue === 0) return true; // All orders
    if (tabValue === 1) return order.status === 'delivered';
    if (tabValue === 2) return ['pending', 'processing', 'shipped'].includes(order.status);
    if (tabValue === 3) return order.status === 'cancelled';
    return true;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError('');
    // Simulate refresh
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="contained" onClick={handleRefresh} startIcon={<Refresh />}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component="button" onClick={() => navigate('/')} sx={{ textDecoration: 'none' }}>
            <Home sx={{ mr: 1 }} />
            Home
          </Link>
          <Typography color="text.primary">Orders</Typography>
        </Breadcrumbs>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            My Orders
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All Orders (${orders.length})`} />
          <Tab label={`Delivered (${orders.filter(o => o.status === 'delivered').length})`} />
          <Tab label={`In Progress (${orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length})`} />
          <Tab label={`Cancelled (${orders.filter(o => o.status === 'cancelled').length})`} />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {filteredOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0 
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : `No ${tabValue === 1 ? 'delivered' : tabValue === 2 ? 'in-progress' : 'cancelled'} orders found.`
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order._id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleViewOrder(order)}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {order.orderNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(order.createdAt)}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(order.totalAmount)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {order.items.slice(0, 2).map((item) => (
                          <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                            <Avatar
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Typography variant="body2" noWrap>
                              {item.product.name} × {item.quantity}
                            </Typography>
                          </Box>
                        ))}
                        {order.items.length > 2 && (
                          <Typography variant="body2" color="text.secondary">
                            +{order.items.length - 2} more
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right', minWidth: { md: 150 } }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Order Details</Typography>
              <IconButton onClick={handleCloseDialog}>
                <Cancel />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order #{selectedOrder.orderNumber}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(selectedOrder.status)}
                    label={getStatusText(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status) as any}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress.street}
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress.country}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">{formatPrice(selectedOrder.subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Shipping:</Typography>
                      <Typography variant="body2">{formatPrice(selectedOrder.shipping)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Tax:</Typography>
                      <Typography variant="body2">{formatPrice(selectedOrder.tax)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" color="primary.main">
                        {formatPrice(selectedOrder.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <List>
                  {selectedOrder.items.map((item) => (
                    <ListItem key={item._id} sx={{ px: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Avatar
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          sx={{ width: 60, height: 60 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price: {formatPrice(item.price)}
                          </Typography>
                          {item.finalPrice && item.finalPrice !== item.price && (
                            <Typography variant="body2" color="success.main">
                              Final Price: {formatPrice(item.finalPrice)}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="h6" color="primary.main">
                          {formatPrice((item.finalPrice || item.price) * item.quantity)}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>

              {selectedOrder.trackingNumber && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Tracking Information
                  </Typography>
                  <Typography variant="body2">
                    Tracking Number: <strong>{selectedOrder.trackingNumber}</strong>
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>
                Close
              </Button>
              <Button variant="contained" startIcon={<Download />}>
                Download Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Orders;
