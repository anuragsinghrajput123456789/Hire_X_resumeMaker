/**
 * Custom application-level error mapping API responses to user-safe notifications.
 */
class AIError extends Error {
  constructor(statusCode, message, rawError = null) {
    super(message);
    this.name = 'AIError';
    this.statusCode = statusCode || 500;
    this.rawError = rawError;
    
    // Determine standardized error category types
    // Store user-safe description separately — do NOT overwrite the diagnostic `message`
    if (this.statusCode === 401) {
      this.type = 'InvalidAPIKey';
      this.userMessage = 'The AI service configuration is invalid. Please contact support.';
    } else if (this.statusCode === 403) {
      this.type = 'Forbidden';
      this.userMessage = 'AI usage limit reached or request was denied. Please upgrade your profile.';
    } else if (this.statusCode === 404) {
      this.type = 'ModelNotFound';
      this.userMessage = 'The requested AI model could not be found. Retrying fallbacks.';
    } else if (this.statusCode === 408) {
      this.type = 'ProviderTimeout';
      this.userMessage = 'The AI provider timed out. Retrying execution.';
    } else if (this.statusCode === 429) {
      this.type = 'RateLimited';
      this.userMessage = 'AI rate limit exceeded. Please wait a moment before trying again.';
    } else if (this.statusCode >= 500) {
      this.type = 'ProviderDowntime';
      this.userMessage = 'The AI provider is experiencing temporary downtime. Retrying call.';
    } else {
      this.type = 'GeneralAIError';
      this.userMessage = message;
    }

    if (rawError && process.env.NODE_ENV !== 'production') {
      this.details = rawError.message || String(rawError);
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AIError;
