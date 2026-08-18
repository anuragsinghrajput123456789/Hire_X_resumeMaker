const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const isLocal = mongoUri && (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'));
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      directConnection: isLocal ? true : undefined,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('MongoDB connection failed. The server will continue running but /api/ready will return 503.');
    } else {
      console.warn('MongoDB connection failed in dev. Mongoose will attempt reconnection when queries execute.');
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
