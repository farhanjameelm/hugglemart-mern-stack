const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const {
            shippingAddress,
            billingAddress,
            paymentMethod,
            paymentId,
            notes,
            isBargained,
            bargainHistory
        } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name slug thumbnail price stock');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock availability
        for (const item of cart.items) {
            const product = item.product;
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
                });
            }
        }

        // Calculate order totals
        const subtotal = cart.totalAmount;
        const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above 500
        const tax = subtotal * 0.18; // 18% GST
        const discount = 0; // Can be calculated based on promotions
        const totalAmount = subtotal + shippingCost + tax - discount;

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                price: item.price,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                image: item.product.thumbnail
            })),
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            subtotal,
            shippingCost,
            tax,
            discount,
            totalAmount,
            paymentMethod,
            paymentId,
            notes,
            isBargained,
            bargainHistory,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        // Add initial status
        await order.addInitialStatus();

        // Update product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart
        await cart.clearCart();

        // Send order confirmation email
        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name');
        
        try {
            await sendEmail({
                email: populatedOrder.user.email,
                ...emailTemplates.orderConfirmation(populatedOrder)
            });
        } catch (emailError) {
            console.log('Failed to send order confirmation email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: await Order.findById(order._id)
                .populate('items.product', 'name slug thumbnail')
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating order',
            error: error.message
        });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = { user: req.user.id };
        if (req.query.status) filter.status = req.query.status;

        const orders = await Order.find(filter)
            .populate('items.product', 'name slug thumbnail')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching orders',
            error: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name slug thumbnail images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching order',
            error: error.message
        });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, note, trackingNumber } = req.body;
        const orderId = req.params.id;

        const order = await Order.findById(orderId).populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order status
        await order.updateStatus(status, note, req.user.id);

        // Update tracking number if provided
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
            await order.save();
        }

        // Send status update email
        try {
            await sendEmail({
                email: order.user.email,
                ...emailTemplates.orderStatusUpdate(order, status)
            });
        } catch (emailError) {
            console.log('Failed to send status update email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating order status',
            error: error.message
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Update order status
        await order.updateStatus('cancelled', reason, req.user.id);

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error cancelling order',
            error: error.message
        });
    }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    confirmedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
                    },
                    shippedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
                    },
                    deliveredOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get monthly revenue
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['delivered', 'shipped'] },
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            }
        ]);

        const result = stats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            pendingOrders: 0,
            confirmedOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0
        };

        result.monthlyRevenue = monthlyRevenue[0]?.revenue || 0;
        result.monthlyOrders = monthlyRevenue[0]?.orders || 0;

        res.status(200).json({
            success: true,
            stats: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching order statistics',
            error: error.message
        });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.user) filter.user = req.query.user;
        if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

        const orders = await Order.find(filter)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching orders',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderStats,
    getAllOrders
};
