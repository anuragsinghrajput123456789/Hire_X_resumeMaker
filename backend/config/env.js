const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'OPENROUTER_API_KEY'];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const localClientOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const getAllowedOrigins = () => {
  const configuredOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...configuredOrigins, ...localClientOrigins])];
};

module.exports = {
  getAllowedOrigins,
  validateEnv
};
