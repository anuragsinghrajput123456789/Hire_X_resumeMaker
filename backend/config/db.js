const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // In production, don't crash — let the readiness probe report the issue.
    // In development, exit so the developer knows immediately.
    if (process.env.NODE_ENV === 'production') {
      console.error('MongoDB connection failed. The server will continue running but /api/ready will return 503.');
    } else {
      process.exit(1);
    }
  }

  // Connection event listeners for monitoring
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Mongoose will auto-reconnect.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error event:', err.message);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected.');
  });
};

module.exports = connectDB;
