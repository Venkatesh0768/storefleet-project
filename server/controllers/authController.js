const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Check if email exists
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });
    res.json({
      exists: !!existingUser
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking email'
    });
  }
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error',
        message: errors.array()[0].msg
      });
    }

    const { name, email, password, userType, businessName, businessAddress } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      userType,
      ...(userType === 'seller' && { businessName, businessAddress }),
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Get public user data
    const userResponse = user.toPublicJSON();

    // Set cookie and send response
    res.status(201)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      })
      .json({
        status: 'success',
        token,
        user: userResponse
      });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error',
        message: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Get public user data
    const userResponse = user.toPublicJSON();

    // Send response with cookie
    res.status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      })
      .json({
        status: 'success',
        token,
        user: userResponse
      });
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
  .status(200)
  .json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, businessName, businessAddress } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if new email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }
      user.email = email;
    }

    // Update seller specific fields
    if (user.userType === 'seller') {
      if (businessName) user.businessName = businessName;
      if (businessAddress) user.businessAddress = businessAddress;
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
}; 