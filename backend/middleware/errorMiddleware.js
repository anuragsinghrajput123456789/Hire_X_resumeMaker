const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = (res.statusCode && res.statusCode >= 400) ? res.statusCode : (err.statusCode || err.status || 500);
  let message = err.message || 'Server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((value) => value.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'An account with this email already exists';
  }

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON request body';
  }

  // Handle Mongoose connection timeout / server selection errors
  if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
    statusCode = 503;
    message = 'Database connection failed. Please check MongoDB Atlas IP Access (ensure 0.0.0.0/0 is whitelisted) and MONGO_URI in Render environment variables.';
  }

  // Prevent double-send if headers already flushed (e.g. streaming)
  if (res.headersSent) {
    return;
  }

  res.status(statusCode);

  // Standardized response: include both `message` and `error` so frontend
  // can read either field regardless of which route generated the error
  res.json({
    success: false,
    message,
    error: message,
    ...(process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
