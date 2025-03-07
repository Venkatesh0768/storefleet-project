const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Other'],
      message: '{VALUE} is not a valid category',
    },
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    alt: String,
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be an integer',
    },
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: val => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  features: [{
    name: String,
    value: String,
  }],
  discount: {
    percentage: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    validUntil: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'outOfStock'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual field for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (!this.discount.percentage || (this.discount.validUntil && this.discount.validUntil < new Date())) {
    return this.price;
  }
  return this.price * (1 - this.discount.percentage / 100);
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });

// Update rating when a new review is added
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
