const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = { isActive: true };

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Rating filter
        if (req.query.minRating) {
            filter['rating.average'] = { $gte: parseFloat(req.query.minRating) };
        }

        // Search filter
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { tags: { $in: [new RegExp(req.query.search, 'i')] } }
            ];
        }

        // Featured, new arrival, best seller filters
        if (req.query.featured) filter.isFeatured = true;
        if (req.query.newArrival) filter.isNewArrival = true;
        if (req.query.bestSeller) filter.isBestSeller = true;

        // Sort options
        let sort = {};
        switch (req.query.sort) {
            case 'price-low':
                sort = { price: 1 };
                break;
            case 'price-high':
                sort = { price: -1 };
                break;
            case 'rating':
                sort = { 'rating.average': -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'name':
                sort = { name: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Execute query with pagination
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching products',
            error: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ 
            slug: req.params.slug, 
            isActive: true 
        })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('reviews.user', 'firstName lastName');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching product',
            error: error.message
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        
        const products = await Product.find({ 
            isActive: true, 
            isFeatured: true 
        })
        .populate('category', 'name slug')
        .sort({ 'rating.average': -1, createdAt: -1 })
        .limit(limit);

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching featured products',
            error: error.message
        });
    }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        
        const products = await Product.find({ 
            isActive: true, 
            isNewArrival: true 
        })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit);

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching new arrivals',
            error: error.message
        });
    }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        
        const products = await Product.find({ 
            isActive: true, 
            isBestSeller: true 
        })
        .populate('category', 'name slug')
        .sort({ 'rating.count': -1, 'rating.average': -1 })
        .limit(limit);

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching best sellers',
            error: error.message
        });
    }
};

// @desc    Get related products
// @route   GET /api/products/:slug/related
// @access  Public
const getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const limit = parseInt(req.query.limit) || 4;
        
        const products = await Product.find({
            _id: { $ne: product._id },
            category: product.category,
            isActive: true
        })
        .populate('category', 'name slug')
        .sort({ 'rating.average': -1 })
        .limit(limit);

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching related products',
            error: error.message
        });
    }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        
        // Generate SKU if not provided
        if (!productData.sku) {
            const category = await Category.findById(productData.category);
            const categoryCode = category ? category.slug.substring(0, 3).toUpperCase() : 'GEN';
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            productData.sku = `HM-${categoryCode}-${randomNum}`;
        }

        const product = await Product.create(productData);
        
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating product',
            error: error.message
        });
    }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating product',
            error: error.message
        });
    }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting product',
            error: error.message
        });
    }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user.id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Product already reviewed'
            });
        }

        // Add review
        const review = {
            user: req.user.id,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error adding review',
            error: error.message
        });
    }
};

module.exports = {
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
};
