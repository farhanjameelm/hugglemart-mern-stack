const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    selectedSize: {
        type: String,
        trim: true
    },
    selectedColor: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    }
});

const shippingAddressSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: 'India'
    }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },
    billingAddress: {
        type: shippingAddressSchema,
        required: true
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative']
    },
    shippingCost: {
        type: Number,
        required: true,
        min: [0, 'Shipping cost cannot be negative'],
        default: 0
    },
    tax: {
        type: Number,
        required: true,
        min: [0, 'Tax cannot be negative'],
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        min: [0, 'Discount cannot be negative'],
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'upi', 'wallet'],
        required: true
    },
    paymentId: {
        type: String,
        trim: true
    },
    transactionId: {
        type: String,
        trim: true
    },
    trackingNumber: {
        type: String,
        trim: true
    },
    estimatedDelivery: {
        type: Date
    },
    actualDelivery: {
        type: Date
    },
    notes: {
        type: String,
        maxlength: [500, 'Order notes cannot exceed 500 characters']
    },
    isBargained: {
        type: Boolean,
        default: false
    },
    bargainHistory: [{
        originalPrice: Number,
        bargainedPrice: Number,
        discountPercentage: Number,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: {
            type: String,
            trim: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
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

// Generate order number before saving
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `HM${year}${month}${day}${random}`;
    }
    next();
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
    this.totalAmount = this.subtotal + this.shippingCost + this.tax - this.discount;
    next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        note,
        updatedBy,
        timestamp: new Date()
    });
    
    if (newStatus === 'delivered') {
        this.actualDelivery = new Date();
    }
    
    return this.save();
};

// Method to add status history (for initial creation)
orderSchema.methods.addInitialStatus = function() {
    this.statusHistory.push({
        status: this.status,
        timestamp: new Date()
    });
    return this;
};

// Virtual for formatted total amount
orderSchema.virtual('formattedTotalAmount').get(function() {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: this.currency
    }).format(this.totalAmount);
});

module.exports = mongoose.model('Order', orderSchema);
