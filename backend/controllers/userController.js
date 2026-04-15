const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching user profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, addresses } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, phone, addresses },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating profile',
            error: error.message
        });
    }
};

// @desc    Add address to user profile
// @route   POST /api/users/address
// @access  Private
const addAddress = async (req, res) => {
    try {
        const { type, street, city, state, zipCode, country, isDefault } = req.body;

        const user = await User.findById(req.user.id);

        // If this is default address, unset other default addresses
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        user.addresses.push({
            type,
            street,
            city,
            state,
            zipCode,
            country: country || 'India',
            isDefault
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error adding address',
            error: error.message
        });
    }
};

// @desc    Update address
// @route   PUT /api/users/address/:addressId
// @access  Private
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const addressData = req.body;

        const user = await User.findById(req.user.id);

        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // If this is default address, unset other default addresses
        if (addressData.isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Update address
        Object.assign(user.addresses[addressIndex], addressData);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating address',
            error: error.message
        });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/address/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user.id);

        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== addressId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting address',
            error: error.message
        });
    }
};

// @desc    Get user's order history
// @route   GET /api/users/orders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name slug thumbnail')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: req.user.id });

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
            message: 'Server error fetching user orders',
            error: error.message
        });
    }
};

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('wishlist', 'name slug thumbnail price rating images');

        res.status(200).json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching wishlist',
            error: error.message
        });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const user = await User.findById(req.user.id);

        // Check if product already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        user.wishlist.push(productId);
        await user.save();

        await user.populate('wishlist', 'name slug thumbnail price rating images');

        res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error adding to wishlist',
            error: error.message
        });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(
            item => item.toString() !== productId
        );

        await user.save();

        await user.populate('wishlist', 'name slug thumbnail price rating images');

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error removing from wishlist',
            error: error.message
        });
    }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get order statistics
        const orderStats = await Order.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    deliveredOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get wishlist count
        const user = await User.findById(userId);
        const wishlistCount = user.wishlist.length;

        const stats = orderStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0,
            pendingOrders: 0,
            deliveredOrders: 0
        };

        stats.wishlistCount = wishlistCount;

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching user statistics',
            error: error.message
        });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required to delete account'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Verify password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        // Delete user
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting account',
            error: error.message
        });
    }
};

module.exports = {
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
};
