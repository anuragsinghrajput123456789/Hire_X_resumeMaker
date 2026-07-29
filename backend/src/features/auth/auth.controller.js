const asyncHandler = require('express-async-handler');
const AuthService = require('./auth.service');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const user = await AuthService.registerUser(req.body);
  res.status(201).json(user);
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const user = await AuthService.loginUser(req.body);
  res.status(200).json(user);
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getMe(req.user);
  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
