const validateEnv = () => {
  // Normalize MongoDB URI (Atlas and Render commonly provide MONGODB_URI)
  if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
    process.env.MONGO_URI = process.env.MONGODB_URI;
  }
  if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
    process.env.MONGODB_URI = process.env.MONGO_URI;
  }

  // Ensure JWT_SECRET is available
  if (!process.env.JWT_SECRET) {
    console.error('[env] CRITICAL: JWT_SECRET is not set in environment variables! Using fallback secret for startup.');
    process.env.JWT_SECRET = 'hirex_production_fallback_jwt_secret_key_minimum_32_characters_12345';
  } else if (process.env.JWT_SECRET.length < 32) {
    console.warn('[env] WARNING: JWT_SECRET should ideally be at least 32 characters long for production security.');
  }

  // Warn if MongoDB URI is missing
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    console.error('[env] CRITICAL: Neither MONGODB_URI nor MONGO_URI is set in environment variables. Database features will fail.');
  }

  // Default NODE_ENV
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // Warn about missing AI key (don't throw — app still works for non-AI features)
  if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn('[env] WARNING: No AI API key found (OPENROUTER_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY). AI features will fail.');
  }

  // Production: CLIENT_URL
  if (isProduction && !process.env.CLIENT_URL) {
    console.warn('[env] NOTICE: CLIENT_URL is not set. Common hosting domains (Vercel, Render, Netlify) will still be allowed.');
  }
};

const localClientOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

const getAllowedOrigins = () => {
  const configuredOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  // In production, combine configured origins with local client origins if none set, or return configured
  if (configuredOrigins.length > 0) {
    return [...new Set([...configuredOrigins, ...localClientOrigins])];
  }

  return localClientOrigins;
};

module.exports = {
  getAllowedOrigins,
  validateEnv
};
