const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  // Warn about missing AI key (don't throw — app still works for non-AI features)
  if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn('[env] WARNING: No AI API key found (OPENROUTER_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY). AI features will fail.');
  }

  // Default NODE_ENV
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
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
