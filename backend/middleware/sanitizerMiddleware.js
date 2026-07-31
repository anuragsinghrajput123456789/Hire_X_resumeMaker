/**
 * Sanitizer Middleware — protects against XSS, Prototype Pollution, and malicious inputs.
 */

// Keys that could pollute Object prototype
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * Recursively strips dangerous prototype pollution keys and sanitizes string content.
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Strip script tags and dangerous HTML event attributes
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitizedObj = {};
    for (const key of Object.keys(value)) {
      if (DANGEROUS_KEYS.includes(key)) {
        console.warn(`[Security] Blocked prototype pollution attempt with key: ${key}`);
        continue;
      }
      sanitizedObj[key] = sanitizeValue(value[key]);
    }
    return sanitizedObj;
  }

  return value;
};

const sanitizeInput = (req, res, next) => {
  try {
    if (req.body) {
      req.body = sanitizeValue(req.body);
    }
    if (req.query) {
      req.query = sanitizeValue(req.query);
    }
    if (req.params) {
      req.params = sanitizeValue(req.params);
    }
    next();
  } catch (err) {
    console.error('[SanitizerMiddleware] Error during input sanitization:', err.message);
    res.status(400).json({ error: 'Malformed request payload.' });
  }
};

module.exports = { sanitizeInput, sanitizeValue };
