const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    selectedSize: {
        type: String,
        trim: true
    },
    selectedColor: {
        type: String,
        trim: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0,
        min: [0, 'Total amount cannot be negative']
    },
    totalItems: {
        type: Number,
        default: 0,
        min: [0, 'Total items cannot be negative']
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

// Calculate total amount and items before saving
cartSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productData, quantity = 1) {
    const existingItemIndex = this.items.findIndex(item => 
        item.product.toString() === productData.product.toString() &&
        item.selectedSize === productData.selectedSize &&
        item.selectedColor === productData.selectedColor
    );

    if (existingItemIndex > -1) {
        // Update existing item quantity
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        this.items.push({
            product: productData.product,
            quantity,
            price: productData.price,
            selectedSize: productData.selectedSize,
            selectedColor: productData.selectedColor
        });
    }

    return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId, selectedSize, selectedColor) {
    this.items = this.items.filter(item => 
        !(item.product.toString() === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor)
    );
    return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, selectedSize, selectedColor) {
    const item = this.items.find(item => 
        item.product.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (item) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            this.removeItem(productId, selectedSize, selectedColor);
        } else {
            // Update quantity
            item.quantity = quantity;
            return this.save();
        }
    }
    return Promise.resolve(this);
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
    this.items = [];
    return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
