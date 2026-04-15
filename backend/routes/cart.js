const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    validateCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes are protected
router.get('/', protect, getCart);
router.get('/summary', protect, getCartSummary);
router.get('/validate', protect, validateCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
