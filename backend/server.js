const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');
const { getAllowedOrigins, validateEnv } = require('./config/env');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { generalLimiter } = require('./middleware/rateLimiter');
const securityLogger = require('./src/utils/securityLogger');

validateEnv();

// Allowed origins helper
const allowedOrigins = getAllowedOrigins();

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser (curl, Postman, server-to-server)

  const cleanOrigin = origin.replace(/\/+$/, '');

  // 1. Wildcard allowed origin
  if (allowedOrigins.includes('*')) return true;

  // 2. Exact match against allowed origins (includes CLIENT_URL + local dev origins)
  if (allowedOrigins.includes(cleanOrigin)) return true;

  // 3. In development, also match localhost / 127.0.0.1 on any port
  if (process.env.NODE_ENV !== 'production') {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(cleanOrigin)) return true;
  }

  return false;
};

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    securityLogger.logEvent('cors_blocked', { origin });
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Helmet security headers (Phase 7)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com"],
      frameSrc: ["'self'", "https://challenges.cloudflare.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://openrouter.ai", "https://api.openai.com"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xFrameOptions: { action: 'deny' },
  xContentTypeOptions: true
}));

// Additional security response headers
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(compression());

// MongoDB Sanitizer middleware (Phase 8 - NoSQL Injection protection)
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return mongoSanitize.sanitize(obj, { replaceWith: '_' });
};

app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  next();
});

// Request logging middleware (Phase 9)
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = `REQ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode === 429) {
      securityLogger.logRateLimitHit(req.ip, req.originalUrl, req.baseUrl);
    }
    const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    const logFn = logLevel === 'error' ? console.error : logLevel === 'warn' ? console.warn : console.log;
    logFn(`[${requestId}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)${req.user ? ` user=${req.user._id}` : ''}`);
  });

  next();
});

// Global API Rate Limiter (Phase 1)
app.use('/api/', generalLimiter);

app.get('/', (req, res) => {
  res.send('Hire-X Security Hardened API is running...');
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    service: 'hire-x-api',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe — returns 503 if DB is not connected
app.get('/api/ready', (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) {
    return res.json({ status: 'ready' });
  }
  res.status(503).json({ status: 'not ready', reason: 'Database not connected' });
});

// Comprehensive AI Health Check endpoint
app.get('/api/health/ai', async (req, res) => {
  const mongoose = require('mongoose');
  const AIService = require('./src/features/ai/ai.service');
  try {
    const aiHealth = await AIService.healthCheck();
    const { metrics, snapshot } = AIService.getMetrics();
    res.json({
      status: aiHealth.isHealthy ? 'ok' : 'degraded',
      backend: 'running',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      aiProvider: aiHealth.providerName,
      aiModel: aiHealth.model,
      metrics,
      queueSnapshot: snapshot,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/cold-email', require('./routes/coldEmailRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/cover-letter', require('./routes/coverLetterRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown (Phase 12)
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed.');

    try {
      const QueueManager = require('./src/ai/QueueManager');
      if (QueueManager.shutdown) {
        QueueManager.shutdown();
      }
    } catch { /* Queue may not be initialised */ }

    const mongoose = require('mongoose');
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    }).catch(() => {
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`);
  if (process.env.NODE_ENV !== 'production') {
    server.close(() => process.exit(1));
  }
});
