const mongoose = require('mongoose');

const aiBargainingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    originalPrice: {
        type: Number,
        required: true,
        min: [0, 'Original price cannot be negative']
    },
    finalPrice: {
        type: Number,
        min: [0, 'Final price cannot be negative']
    },
    discountPercentage: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'expired', 'cancelled'],
        default: 'active'
    },
    conversation: [{
        role: {
            type: String,
            enum: ['user', 'ai'],
            required: true
        },
        message: {
            type: String,
            required: true,
            maxlength: [1000, 'Message cannot exceed 1000 characters']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        priceOffered: {
            type: Number,
            min: [0, 'Price offered cannot be negative']
        },
        aiResponse: {
            type: String,
            maxlength: [1000, 'AI response cannot exceed 1000 characters']
        },
        discountOffered: {
            type: Number,
            min: [0, 'Discount offered cannot be negative'],
            max: [100, 'Discount offered cannot exceed 100%']
        }
    }],
    maxDiscountAllowed: {
        type: Number,
        min: [0, 'Max discount cannot be negative'],
        max: [100, 'Max discount cannot exceed 100%'],
        default: 30
    },
    negotiationStrategy: {
        type: String,
        enum: ['aggressive', 'moderate', 'flexible'],
        default: 'moderate'
    },
    expiresAt: {
        type: Date,
        default: function() {
            return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to add message to conversation
aiBargainingSchema.methods.addMessage = function(role, message, priceOffered = null) {
    this.conversation.push({
        role,
        message,
        priceOffered,
        timestamp: new Date()
    });
    
    // Update status if expired
    if (this.expiresAt < new Date()) {
        this.status = 'expired';
    }
    
    return this.save();
};

// Method to add AI response
aiBargainingSchema.methods.addAIResponse = function(aiMessage, discountOffered = null) {
    const lastMessage = this.conversation[this.conversation.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        lastMessage.aiResponse = aiMessage;
        lastMessage.discountOffered = discountOffered;
    }
    
    this.conversation.push({
        role: 'ai',
        message: aiMessage,
        discountOffered,
        timestamp: new Date()
    });
    
    return this.save();
};

// Method to complete bargaining
aiBargainingSchema.methods.completeBargaining = function(finalPrice, discountPercentage) {
    this.finalPrice = finalPrice;
    this.discountPercentage = discountPercentage;
    this.status = 'completed';
    return this.save();
};

// Method to check if bargaining is expired
aiBargainingSchema.methods.isExpired = function() {
    return this.expiresAt < new Date();
};

// Virtual for time remaining
aiBargainingSchema.virtual('timeRemaining').get(function() {
    const now = new Date();
    const expiresAt = new Date(this.expiresAt);
    const diff = expiresAt - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
});

// Static method to find active bargaining for user and product
aiBargainingSchema.statics.findActiveBargaining = function(userId, productId) {
    return this.findOne({
        user: userId,
        product: productId,
        status: 'active',
        expiresAt: { $gt: new Date() }
    }).populate('product');
};

module.exports = mongoose.model('AIBargaining', aiBargainingSchema);
