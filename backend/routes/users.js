const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserOrders,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getUserStats,
    deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All user routes are protected
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/orders', protect, getUserOrders);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/stats', protect, getUserStats);
router.delete('/account', protect, deleteAccount);

// Address routes
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

module.exports = router;
