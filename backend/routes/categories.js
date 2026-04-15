const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getFeaturedCategories
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getCategories);
router.get('/featured', getFeaturedCategories);
router.get('/:slug', getCategory);

// Admin routes
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
