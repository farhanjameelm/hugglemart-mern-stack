const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('parentCategory', 'name slug')
            .sort({ sortOrder: 1, name: 1 });

        // Build category tree
        const categoryTree = buildCategoryTree(categories);

        res.status(200).json({
            success: true,
            categories: categoryTree
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching categories',
            error: error.message
        });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ 
            slug: req.params.slug, 
            isActive: true 
        })
        .populate('parentCategory', 'name slug')
        .populate('subcategories', 'name slug image');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching category',
            error: error.message
        });
    }
};

// @desc    Create category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        
        // Generate slug if not provided
        if (!categoryData.slug) {
            categoryData.slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        const category = await Category.create(categoryData);
        
        res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating category',
            error: error.message
        });
    }
};

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating category',
            error: error.message
        });
    }
};

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has subcategories
        const hasSubcategories = await Category.exists({ parentCategory: req.params.id });
        if (hasSubcategories) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with subcategories'
            });
        }

        await category.remove();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting category',
            error: error.message
        });
    }
};

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
const getFeaturedCategories = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        
        const categories = await Category.find({ 
            isActive: true,
            image: { $exists: true, $ne: '' }
        })
        .sort({ sortOrder: 1, name: 1 })
        .limit(limit);

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching featured categories',
            error: error.message
        });
    }
};

// Helper function to build category tree
function buildCategoryTree(categories) {
    const categoryMap = {};
    const tree = [];

    // Create map of categories
    categories.forEach(category => {
        categoryMap[category._id.toString()] = {
            ...category.toObject(),
            subcategories: []
        };
    });

    // Build tree structure
    categories.forEach(category => {
        if (category.parentCategory) {
            const parentId = category.parentCategory._id.toString();
            if (categoryMap[parentId]) {
                categoryMap[parentId].subcategories.push(categoryMap[category._id.toString()]);
            }
        } else {
            tree.push(categoryMap[category._id.toString()]);
        }
    });

    return tree;
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getFeaturedCategories
};
