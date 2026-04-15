const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot exceed 50 characters']
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
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
        type: String,
        default: ''
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
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

// Generate slug from name before saving
categorySchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
