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
const { rateLimit } = require('express-rate-limit');

validateEnv();

// Middleware
const allowedOrigins = getAllowedOrigins();

app.use(helmet());
app.use(compression());
app.use(mongoSanitize());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = `REQ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    const logFn = logLevel === 'error' ? console.error : logLevel === 'warn' ? console.warn : console.log;
    logFn(`[${requestId}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)${req.user ? ` user=${req.user._id}` : ''}`);
  });

  next();
});

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per 15 minutes
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 50, // Limit each IP to 50 AI requests per hour
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI generation limit reached for this hour. Please try again later.'
  }
});

app.use('/api/', generalLimiter);
app.use('/api/ai', aiLimiter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
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

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown (Render sends SIGTERM before killing the process)
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed.');

    // Clean up AI queue
    try {
      const QueueManager = require('./src/ai/QueueManager');
      if (QueueManager.shutdown) {
        QueueManager.shutdown();
      }
    } catch { /* Queue may not be initialised */ }

    // Close MongoDB connection
    const mongoose = require('mongoose');
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    }).catch(() => {
      process.exit(0);
    });
  });

  // Force exit after 10s if graceful shutdown hangs
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`);
  // In production, log but don't crash — let the process continue
  if (process.env.NODE_ENV !== 'production') {
    server.close(() => process.exit(1));
  }
});
