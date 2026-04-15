const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const aiBargainingRoutes = require('./routes/aiBargaining');
const paymentRoutes = require('./routes/payment');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hugglemart')

  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai-bargaining', aiBargainingRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
