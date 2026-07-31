/**
 * Bot Protection Middleware — screens sensitive routes for automated bot signatures,
 * honeypot triggers, and optional Turnstile CAPTCHA tokens.
 */

const botProtection = async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';

  // 1. Honeypot check: If hidden form field 'website_hp' or 'hp_field' is filled, drop as bot
  if (req.body && (req.body.website_hp || req.body.hp_field)) {
    console.warn(`[BotProtection] Honeypot triggered by IP: ${req.ip}`);
    return res.status(403).json({ error: 'Automated submission detected.' });
  }

  // 2. Headless automation user-agent checks (for unauthenticated auth attempts)
  if (!req.user && !req.headers.authorization) {
    const suspiciousAgents = [
      /headlesschrome/i,
      /selenium/i,
      /puppeteer/i,
      /phantomjs/i,
      /bot/i,
      /crawler/i,
      /spider/i
    ];
    
    // Exception: Allow health checks and internal tool requests
    const isInternalHealth = req.path === '/health' || req.path === '/api/health';
    if (!isInternalHealth && suspiciousAgents.some(regex => regex.test(userAgent))) {
      console.warn(`[BotProtection] Blocked suspicious User-Agent [${userAgent}] from IP: ${req.ip}`);
      return res.status(403).json({ error: 'Automated agent request denied.' });
    }
  }

  // 3. Optional Turnstile verification if secret key is present in environment
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const turnstileToken = req.body?.turnstileToken || req.headers['x-turnstile-token'];

  if (turnstileSecret && turnstileToken) {
    try {
      const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: req.ip
        })
      });
      const data = await response.json();
      if (!data.success) {
        console.warn(`[BotProtection] Turnstile verification failed for IP: ${req.ip}`);
        return res.status(403).json({ error: 'CAPTCHA verification failed. Please try again.' });
      }
    } catch (err) {
      console.error('[BotProtection] Turnstile API check error:', err.message);
    }
  }

  next();
};

module.exports = { botProtection };
