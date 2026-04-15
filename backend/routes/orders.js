const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderStats,
    getAllOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/stats', protect, admin, getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/admin/all', protect, admin, getAllOrders);

module.exports = router;
