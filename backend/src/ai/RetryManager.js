/**
 * Manager handles execution retries with exponential backoff.
 */
class RetryManager {
  static async execute(fn, options = {}) {
    const {
      maxRetries = 2,
      initialDelay = 1000,
      factor = 2,
      maxDelay = 10000,
      retryableErrors = [
        'rate limit',
        'timeout',
        '429',
        '502',
        '503',
        '504',
        'json',
        'provider error',
        'schema validation failed',
        'syntaxerror',
        'validation',
        '422'
      ]
    } = options;

    let attempt = 0;
    let delay = initialDelay;

    while (attempt <= maxRetries) {
      try {
        return await fn(attempt);
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          throw error;
        }

        const isRetryable = retryableErrors.some(keyword => 
          error.message?.toLowerCase().includes(keyword) ||
          String(error.statusCode)?.includes(keyword) ||
          String(error.status)?.includes(keyword)
        );

        if (!isRetryable) {
          throw error;
        }

        console.warn(`[RetryManager] Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(maxDelay, delay * factor);
      }
    }
  }
}

module.exports = RetryManager;
