const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name slug thumbnail price stock images colors sizes');

        if (!cart) {
            // Create empty cart for user
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching cart',
            error: error.message
        });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

        // Check if product exists and is active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or not available'
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Check if size/color is available (if specified)
        if (selectedSize && product.sizes) {
            const size = product.sizes.find(s => s.name === selectedSize);
            if (!size || size.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected size not available or insufficient stock'
                });
            }
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        // Add item to cart
        await cart.addItem({
            product: productId,
            price: product.price,
            selectedSize,
            selectedColor
        }, quantity);

        // Populate cart with product details
        await cart.populate('items.product', 'name slug thumbnail price stock images colors sizes');

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error adding item to cart',
            error: error.message
        });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity, selectedSize, selectedColor } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Get cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Update item quantity
        await cart.updateItemQuantity(productId, quantity, selectedSize, selectedColor);

        // Populate cart with product details
        await cart.populate('items.product', 'name slug thumbnail price stock images colors sizes');

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating cart',
            error: error.message
        });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { productId, selectedSize, selectedColor } = req.body;

        // Get cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Remove item from cart
        await cart.removeItem(productId, selectedSize, selectedColor);

        // Populate cart with product details
        await cart.populate('items.product', 'name slug thumbnail price stock images colors sizes');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error removing item from cart',
            error: error.message
        });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
    try {
        // Get cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Clear cart
        await cart.clearCart();

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error clearing cart',
            error: error.message
        });
    }
};

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
const getCartSummary = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name slug thumbnail price stock');

        if (!cart) {
            return res.status(200).json({
                success: true,
                summary: {
                    totalItems: 0,
                    totalAmount: 0,
                    items: []
                }
            });
        }

        const summary = {
            totalItems: cart.totalItems,
            totalAmount: cart.totalAmount,
            items: cart.items.map(item => ({
                id: item._id,
                product: {
                    id: item.product._id,
                    name: item.product.name,
                    slug: item.product.slug,
                    thumbnail: item.product.thumbnail
                },
                quantity: item.quantity,
                price: item.price,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                subtotal: item.price * item.quantity
            }))
        };

        res.status(200).json({
            success: true,
            summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching cart summary',
            error: error.message
        });
    }
};

// @desc    Validate cart items (check stock availability)
// @route   GET /api/cart/validate
// @access  Private
const validateCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name stock');

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                isValid: true,
                issues: []
            });
        }

        const issues = [];
        let isValid = true;

        for (const item of cart.items) {
            const product = item.product;
            
            // Check if product is still active
            if (!product.isActive) {
                issues.push({
                    productId: product._id,
                    productName: product.name,
                    issue: 'Product is no longer available',
                    severity: 'error'
                });
                isValid = false;
                continue;
            }

            // Check stock
            if (product.stock < item.quantity) {
                issues.push({
                    productId: product._id,
                    productName: product.name,
                    issue: `Only ${product.stock} items available in stock`,
                    severity: product.stock === 0 ? 'error' : 'warning',
                    availableStock: product.stock
                });
                if (product.stock === 0) isValid = false;
            }

            // Check size availability if specified
            if (item.selectedSize && product.sizes) {
                const size = product.sizes.find(s => s.name === item.selectedSize);
                if (!size || size.stock < item.quantity) {
                    issues.push({
                        productId: product._id,
                        productName: product.name,
                        issue: `Selected size ${item.selectedSize} is not available`,
                        severity: 'error'
                    });
                    isValid = false;
                }
            }
        }

        res.status(200).json({
            success: true,
            isValid,
            issues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error validating cart',
            error: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    validateCart
};
