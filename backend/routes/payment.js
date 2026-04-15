const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
    getPaymentMethods,
    createRefund,
    stripeWebhook,
    processCOD,
    getPaymentStatus
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/methods', protect, getPaymentMethods);
router.post('/cod', protect, processCOD);
router.get('/status/:paymentIntentId', protect, getPaymentStatus);

// Admin routes
router.post('/refund', protect, admin, createRefund);

// Webhook (no auth required)
router.post('/webhook', stripeWebhook);

module.exports = router;
