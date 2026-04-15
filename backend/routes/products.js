const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellers,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview
} = require('../controllers/productController');
const { protect, admin, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/:slug', getProduct);
router.get('/:slug/related', getRelatedProducts);

// Protected route for adding review
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
