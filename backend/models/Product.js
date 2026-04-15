const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discountPercentage: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: String,
        trim: true,
        maxlength: [50, 'Brand name cannot exceed 50 characters']
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    images: [{
        type: String,
        required: true
    }],
    thumbnail: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    minOrderQuantity: {
        type: Number,
        min: [1, 'Minimum order quantity must be at least 1'],
        default: 1
    },
    maxOrderQuantity: {
        type: Number,
        min: [1, 'Maximum order quantity must be at least 1']
    },
    weight: {
        type: Number,
        min: [0, 'Weight cannot be negative']
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    colors: [{
        name: String,
        hexCode: String,
        image: String
    }],
    sizes: [{
        name: String,
        price: Number,
        stock: Number
    }],
    tags: [{
        type: String,
        trim: true
    }],
    rating: {
        average: {
            type: Number,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot exceed 5'],
            default: 0
        },
        count: {
            type: Number,
            min: [0, 'Rating count cannot be negative'],
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },
        comment: {
            type: String,
            required: true,
            maxlength: [500, 'Review comment cannot exceed 500 characters']
        },
        images: [String],
        isVerified: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    features: [{
        type: String,
        trim: true
    }],
    specifications: [{
        key: {
            type: String,
            required: true,
            trim: true
        },
        value: {
            type: String,
            required: true,
            trim: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    seoTitle: {
        type: String,
        trim: true
    },
    seoDescription: {
        type: String,
        trim: true
    },
    metaKeywords: [{
        type: String,
        trim: true
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

// Generate slug from name before saving
productSchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    next();
});

// Calculate average rating before saving
productSchema.pre('save', function(next) {
    if (this.isModified('reviews')) {
        if (this.reviews.length > 0) {
            const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
            this.rating.average = totalRating / this.reviews.length;
            this.rating.count = this.reviews.length;
        } else {
            this.rating.average = 0;
            this.rating.count = 0;
        }
    }
    next();
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
    if (this.discountPercentage > 0) {
        return this.price * (1 - this.discountPercentage / 100);
    }
    return this.price;
});

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
    return this.price - this.finalPrice;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

module.exports = mongoose.model('Product', productSchema);
