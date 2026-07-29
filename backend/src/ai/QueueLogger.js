/**
 * Centralized logger for the AI Request Queue.
 * Supports structured JSON logging in production and readable formatting in development.
 */
class QueueLogger {
  static log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    
    if (process.env.NODE_ENV === 'production') {
      const structuredLog = {
        level: level.toLowerCase(),
        timestamp,
        message: `[AI-QUEUE] ${message}`,
        ...metadata
      };
      console.log(JSON.stringify(structuredLog));
    } else {
      const metaString = Object.keys(metadata).length > 0 ? ` | ${JSON.stringify(metadata)}` : '';
      console.log(`[AI-QUEUE] [${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`);
    }
  }

  static info(message, metadata) {
    this.log('info', message, metadata);
  }

  static warn(message, metadata) {
    this.log('warn', message, metadata);
  }

  static error(message, metadata) {
    this.log('error', message, metadata);
  }
}

module.exports = QueueLogger;
