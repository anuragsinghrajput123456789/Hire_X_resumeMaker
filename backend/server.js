const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { getAllowedOrigins, validateEnv } = require('./config/env');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

validateEnv();

// Middleware
const allowedOrigins = getAllowedOrigins();

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

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/cold-email', require('./routes/coldEmailRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
