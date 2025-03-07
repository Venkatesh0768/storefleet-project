const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  userType: {
    type: String,
    enum: ['user', 'seller'],
    required: [true, 'User type is required']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Seller specific fields
  businessName: {
    type: String,
    trim: true,
    required: function() {
      return this.userType === 'seller';
    }
  },
  businessAddress: {
    type: String,
    trim: true,
    required: function() {
      return this.userType === 'seller';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.toPublicJSON = function() {
  const obj = {
    id: this._id,
    name: this.name,
    email: this.email,
    userType: this.userType,
    role: this.role,
    createdAt: this.createdAt,
  };

  if (this.userType === 'seller') {
    obj.businessName = this.businessName;
    obj.businessAddress = this.businessAddress;
  }
  if (this.userType === 'user') {
    obj.cart = this.cart;
    obj.wishlist = this.wishlist;
  }

  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
