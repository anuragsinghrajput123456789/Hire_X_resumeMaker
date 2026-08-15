const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
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

  // Production: CLIENT_URL is critical for CORS — requests from the frontend will be blocked without it
  if (isProduction && !process.env.CLIENT_URL) {
    console.warn('[env] WARNING: CLIENT_URL is not set. CORS will reject all browser requests in production. Set CLIENT_URL to your Vercel frontend origin (e.g. https://your-app.vercel.app).');
  }

  // Production: Validate that the primary AI provider key is present
  if (isProduction && process.env.AI_PROVIDER === 'openrouter' && !process.env.OPENROUTER_API_KEY) {
    console.warn('[env] WARNING: AI_PROVIDER is "openrouter" but OPENROUTER_API_KEY is not set. All AI features will fail.');
  }

  // Production: Warn if OPENROUTER_REFERER is not set (affects OpenRouter dashboard tracking)
  if (isProduction && !process.env.OPENROUTER_REFERER && !process.env.CLIENT_URL) {
    console.warn('[env] WARNING: Neither OPENROUTER_REFERER nor CLIENT_URL is set. OpenRouter HTTP-Referer header will fall back to a placeholder value.');
  }
};

const localClientOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

const getAllowedOrigins = () => {
  const configuredOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  // In production, only allow explicitly configured origins (CLIENT_URL).
  // In development, also allow common localhost ports for convenience.
  if (process.env.NODE_ENV === 'production') {
    return configuredOrigins;
  }

  return [...new Set([...configuredOrigins, ...localClientOrigins])];
};

module.exports = {
  getAllowedOrigins,
  validateEnv
};
