const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('./auth.controller');
const { protect } = require('../../../middleware/authMiddleware');
const { authLoginLimiter, authRegisterLimiter } = require('../../../middleware/rateLimiter');
const { botProtection } = require('../../../middleware/botProtection');
const { sanitizeInput } = require('../../../middleware/sanitizerMiddleware');

router.post('/register', authRegisterLimiter, botProtection, sanitizeInput, registerUser);
router.post('/login', authLoginLimiter, botProtection, sanitizeInput, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
