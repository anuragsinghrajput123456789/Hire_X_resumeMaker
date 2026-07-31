const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      return next();
    } catch (error) {
      if (res.statusCode === 401) {
        throw error;
      }
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const adminOnly = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'anuragsinghj678@gmail.com';
  if (req.user && (req.user.role === 'admin' || req.user.email === adminEmail)) {
    return next();
  }
  res.status(403).json({ error: 'Access denied: Admin authorization required' });
};

module.exports = { protect, adminOnly };
