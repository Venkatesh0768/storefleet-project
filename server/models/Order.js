const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative'],
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true,
    },
  },
  paymentInfo: {
    method: {
      type: String,
      required: true,
      enum: ['credit_card', 'debit_card', 'paypal', 'other'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  notes: String,
  statusHistory: [{
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
  }],
}, {
  timestamps: true,
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  next();
});

// Add status change to history
orderSchema.methods.updateStatus = function(status, note = '') {
  this.status = status;
  this.statusHistory.push({
    status,
    note,
    timestamp: new Date(),
  });
};

// Populate references when finding orders
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  }).populate({
    path: 'items.product',
    select: 'name price images',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
