const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user changed password after token was issued
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      throw new Error('User recently changed password. Please login again');
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

// Optional: Middleware to check if user has required role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error('You do not have permission to perform this action');
      error.status = 403;
      return next(error);
    }
    next();
  };
};

module.exports = { authMiddleware, restrictTo }; 