const AIBargaining = require('../models/AIBargaining');
const Product = require('../models/Product');
const aiBargainingService = require('../utils/aiBargainingService');

// @desc    Start bargaining session
// @route   POST /api/ai-bargaining/start
// @access  Private
const startBargaining = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if active bargaining already exists
        const existingBargaining = await AIBargaining.findActiveBargaining(userId, productId);
        if (existingBargaining) {
            return res.status(400).json({
                success: false,
                message: 'Active bargaining session already exists',
                bargaining: existingBargaining
            });
        }

        // Create new bargaining session
        const bargaining = await AIBargaining.create({
            user: userId,
            product: productId,
            originalPrice: product.price,
            maxDiscountAllowed: 30, // Can be customized per product
            negotiationStrategy: 'moderate'
        });

        // Add initial AI greeting
        const initialMessage = `Hello! I'm your bargaining assistant for the ${product.name}. The current price is ${product.price}. Feel free to make me an offer, and I'll do my best to find a price that works for both of us! What would you like to offer?`;
        
        await bargaining.addAIResponse(initialMessage);

        res.status(201).json({
            success: true,
            message: 'Bargaining session started',
            bargaining: await bargaining.populate('product', 'name slug thumbnail')
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error starting bargaining',
            error: error.message
        });
    }
};

// @desc    Send bargaining message
// @route   POST /api/ai-bargaining/:bargainingId/message
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { message, priceOffered } = req.body;
        const { bargainingId } = req.params;
        const userId = req.user.id;

        // Find bargaining session
        const bargaining = await AIBargaining.findById(bargainingId)
            .populate('product', 'name price');

        if (!bargaining) {
            return res.status(404).json({
                success: false,
                message: 'Bargaining session not found'
            });
        }

        // Check if user owns this bargaining session
        if (bargaining.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if bargaining is still active
        if (bargaining.status !== 'active' || bargaining.isExpired()) {
            return res.status(400).json({
                success: false,
                message: 'Bargaining session is no longer active'
            });
        }

        // Add user message
        await bargaining.addMessage('user', message, priceOffered);

        // Generate AI response
        const aiResponse = await aiBargainingService.generateBargainingResponse(
            bargaining.product.name,
            bargaining.originalPrice,
            priceOffered,
            bargaining.conversation,
            bargaining.maxDiscountAllowed
        );

        // Add AI response
        await bargaining.addAIResponse(
            aiResponse.message,
            aiResponse.suggestedDiscount
        );

        // Check if bargain should be accepted
        if (aiBargainingService.isBargainAcceptable(
            priceOffered,
            bargaining.originalPrice,
            bargaining.maxDiscountAllowed,
            bargaining.conversation
        )) {
            await bargaining.completeBargaining(
                aiResponse.suggestedPrice,
                aiResponse.suggestedDiscount
            );
        }

        // Return updated bargaining session
        const updatedBargaining = await AIBargaining.findById(bargainingId)
            .populate('product', 'name slug thumbnail price');

        res.status(200).json({
            success: true,
            bargaining: updatedBargaining
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error sending message',
            error: error.message
        });
    }
};

// @desc    Get bargaining session
// @route   GET /api/ai-bargaining/:bargainingId
// @access  Private
const getBargaining = async (req, res) => {
    try {
        const { bargainingId } = req.params;
        const userId = req.user.id;

        const bargaining = await AIBargaining.findById(bargainingId)
            .populate('product', 'name slug thumbnail price originalPrice images')
            .populate('user', 'firstName lastName email');

        if (!bargaining) {
            return res.status(404).json({
                success: false,
                message: 'Bargaining session not found'
            });
        }

        // Check if user owns this bargaining session or is admin
        if (bargaining.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            bargaining
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching bargaining',
            error: error.message
        });
    }
};

// @desc    Get user's bargaining history
// @route   GET /api/ai-bargaining/history
// @access  Private
const getBargainingHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const bargainings = await AIBargaining.find({ user: userId })
            .populate('product', 'name slug thumbnail')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AIBargaining.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            count: bargainings.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            bargainings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching bargaining history',
            error: error.message
        });
    }
};

// @desc    Complete bargaining (accept offer)
// @route   POST /api/ai-bargaining/:bargainingId/complete
// @access  Private
const completeBargaining = async (req, res) => {
    try {
        const { bargainingId } = req.params;
        const { finalPrice, discountPercentage } = req.body;
        const userId = req.user.id;

        const bargaining = await AIBargaining.findById(bargainingId);

        if (!bargaining) {
            return res.status(404).json({
                success: false,
                message: 'Bargaining session not found'
            });
        }

        // Check if user owns this bargaining session
        if (bargaining.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if bargaining is still active
        if (bargaining.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Bargaining session is not active'
            });
        }

        // Complete bargaining
        await bargaining.completeBargaining(finalPrice, discountPercentage);

        res.status(200).json({
            success: true,
            message: 'Bargaining completed successfully',
            bargaining: await bargaining.populate('product', 'name slug thumbnail')
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error completing bargaining',
            error: error.message
        });
    }
};

// @desc    Cancel bargaining session
// @route   DELETE /api/ai-bargaining/:bargainingId
// @access  Private
const cancelBargaining = async (req, res) => {
    try {
        const { bargainingId } = req.params;
        const userId = req.user.id;

        const bargaining = await AIBargaining.findById(bargainingId);

        if (!bargaining) {
            return res.status(404).json({
                success: false,
                message: 'Bargaining session not found'
            });
        }

        // Check if user owns this bargaining session
        if (bargaining.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Only allow cancellation of active sessions
        if (bargaining.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel completed bargaining session'
            });
        }

        bargaining.status = 'cancelled';
        await bargaining.save();

        res.status(200).json({
            success: true,
            message: 'Bargaining session cancelled'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error cancelling bargaining',
            error: error.message
        });
    }
};

// @desc    Get all bargaining sessions (Admin only)
// @route   GET /api/ai-bargaining/admin/all
// @access  Private/Admin
const getAllBargainings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.user) filter.user = req.query.user;
        if (req.query.product) filter.product = req.query.product;

        const bargainings = await AIBargaining.find(filter)
            .populate('user', 'firstName lastName email')
            .populate('product', 'name slug price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AIBargaining.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: bargainings.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            bargainings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching bargainings',
            error: error.message
        });
    }
};

module.exports = {
    startBargaining,
    sendMessage,
    getBargaining,
    getBargainingHistory,
    completeBargaining,
    cancelBargaining,
    getAllBargainings
};
