const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');
const { getAllowedOrigins, validateEnv } = require('./config/env');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy headers behind Render, Vercel, Cloudflare, Nginx
app.set('trust proxy', 1);

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { generalLimiter } = require('./middleware/rateLimiter');
const securityLogger = require('./src/utils/securityLogger');

validateEnv();

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser (curl, Postman, server-to-server)

  // In development, allow all origins so local testing / network dev never gets blocked
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  const cleanOrigin = origin.trim().replace(/\/+$/, '').toLowerCase();
  const currentAllowed = getAllowedOrigins().map(o => o.trim().replace(/\/+$/, '').toLowerCase());

  // 1. Wildcard allowed origin
  if (currentAllowed.includes('*')) return true;

  // 2. Exact match against allowed origins (includes CLIENT_URL + local dev origins)
  if (currentAllowed.includes(cleanOrigin)) return true;

  // 3. Match localhost / 127.0.0.1 / [::1] / local network IPs on any port
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i.test(cleanOrigin)) {
    return true;
  }

  // 4. Match common frontend hosting preview domains (Vercel, Render, Netlify, Cloudflare Pages)
  if (
    cleanOrigin.endsWith('.vercel.app') ||
    cleanOrigin === 'https://vercel.app' ||
    cleanOrigin.endsWith('.onrender.com') ||
    cleanOrigin === 'https://onrender.com' ||
    cleanOrigin.endsWith('.netlify.app') ||
    cleanOrigin === 'https://netlify.app' ||
    cleanOrigin.endsWith('.pages.dev') ||
    cleanOrigin === 'https://pages.dev'
  ) {
    return true;
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'x-turnstile-token'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Helmet security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
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

// Root-level health check for Render (Render health check probes hit this path)
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbReady = mongoose.connection.readyState === 1;
  const mongoUriExists = !!(process.env.MONGODB_URI || process.env.MONGO_URI);
  const jwtExists = !!process.env.JWT_SECRET;
  const envReady = mongoUriExists && jwtExists;
  const status = dbReady && envReady ? 'ok' : 'degraded';

  res.status(dbReady ? 200 : 503).json({
    status,
    service: 'hirex-backend',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    dbState: dbReady ? 'connected' : 'disconnected',
    configValid: envReady,
    timestamp: new Date().toISOString()
  });
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

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

module.exports = app;

// Graceful shutdown (Phase 12)
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  const closeDatabaseAndExit = () => {
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
  };

  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      closeDatabaseAndExit();
    });
  } else {
    closeDatabaseAndExit();
  }

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`);
  if (process.env.NODE_ENV !== 'production' && server) {
    server.close(() => process.exit(1));
  }
});
