/**
 * Structured Security Logger — logs security events, rate limit hits, prompt injections, and AI metrics.
 * Ensures NO secrets or API keys are ever printed to logs.
 */

class SecurityLogger {
  constructor() {
    this.events = [];
    this.maxEvents = 1000;
  }

  logEvent(type, details = {}) {
    const timestamp = new Date().toISOString();
    const sanitizedDetails = { ...details };

    // Scrub sensitive fields
    delete sanitizedDetails.password;
    delete sanitizedDetails.token;
    delete sanitizedDetails.apiKey;
    delete sanitizedDetails.OPENROUTER_API_KEY;
    delete sanitizedDetails.JWT_SECRET;

    const logItem = {
      timestamp,
      type,
      ...sanitizedDetails
    };

    console.log(`[SECURITY-LOG] [${timestamp}] [${type.toUpperCase()}]`, JSON.stringify(sanitizedDetails));

    this.events.push(logItem);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  logFailedLogin(ip, email, reason) {
    this.logEvent('failed_login', { ip, email, reason });
  }

  logRateLimitHit(ip, path, feature) {
    this.logEvent('rate_limit_exceeded', { ip, path, feature });
  }

  logPromptInjection(ip, userId, promptName) {
    this.logEvent('prompt_injection_blocked', { ip, userId, promptName });
  }

  logAiUsage(userId, feature, tokenEstimate) {
    this.logEvent('ai_usage', { userId, feature, tokenEstimate });
  }

  getRecentEvents(limit = 100) {
    return this.events.slice(-limit);
  }
}

module.exports = new SecurityLogger();
