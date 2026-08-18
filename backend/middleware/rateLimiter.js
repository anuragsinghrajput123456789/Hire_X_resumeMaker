const { rateLimit } = require('express-rate-limit');

/**
 * Custom Key Generator: Uses User ID if authenticated, else falls back to request IP.
 */
const userOrIpKeyGenerator = (req) => {
  if (req.user && req.user._id) {
    return `user:${req.user._id}`;
  }
  return req.ip;
};

/**
 * Standard handler for 429 Too Many Requests response
 */
const createRateLimitHandler = (message) => (req, res, next, options) => {
  res.status(429).json({
    success: false,
    error: message,
    statusCode: 429,
    retryAfterSeconds: Math.ceil(options.windowMs / 1000)
  });
};

// 1. Auth Login: 20 attempts per 15 minutes in production (100 in dev)
const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'production' ? 20 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  handler: createRateLimitHandler('Too many login attempts. Please try again after 15 minutes.')
});

// 2. Auth Registration: 20 accounts per IP per hour in production (100 in dev)
const authRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: process.env.NODE_ENV === 'production' ? 20 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  handler: createRateLimitHandler('Registration limit reached from this IP. Please try again in an hour.')
});

// 3. AI Global Endpoint: 20 requests per hour per user/IP
const aiGlobalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  keyGenerator: userOrIpKeyGenerator,
  handler: createRateLimitHandler('Hourly AI generation limit reached (20 requests/hr). Upgrade or try again later.')
});

// 4. Interview Chat: 60 messages per hour per user/IP
const interviewChatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  keyGenerator: userOrIpKeyGenerator,
  handler: createRateLimitHandler('Interview chat message limit reached (60 messages/hr). Please try again later.')
});

// 5. Resume Optimization: 10 requests per hour
const resumeOptimizationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  keyGenerator: userOrIpKeyGenerator,
  handler: createRateLimitHandler('Resume optimization limit reached (10 requests/hr). Please try again later.')
});

// 6. Cover Letter Generator: 10 requests per hour
const coverLetterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  keyGenerator: userOrIpKeyGenerator,
  handler: createRateLimitHandler('Cover letter generation limit reached (10 requests/hr). Please try again later.')
});

// 7. Cold Email Generator: 10 requests per hour
const coldEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  keyGenerator: userOrIpKeyGenerator,
  handler: createRateLimitHandler('Cold email generation limit reached (10 requests/hr). Please try again later.')
});

// 8. General API: 200 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: false,
  handler: createRateLimitHandler('Too many requests from this IP. Please try again after 15 minutes.')
});

module.exports = {
  authLoginLimiter,
  authRegisterLimiter,
  aiGlobalLimiter,
  interviewChatLimiter,
  resumeOptimizationLimiter,
  coverLetterLimiter,
  coldEmailLimiter,
  generalLimiter
};
