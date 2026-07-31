/**
 * Cloudflare Turnstile Server-Side Verification Middleware (Phase 7)
 */
const verifyTurnstile = async (req, res, next) => {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  // In development / local testing without TURNSTILE_SECRET_KEY, bypass smoothly
  if (!turnstileSecret) {
    return next();
  }

  const turnstileToken = req.body?.turnstileToken || req.headers['x-turnstile-token'];

  if (!turnstileToken) {
    return res.status(400).json({
      success: false,
      error: 'Security challenge token is missing. Please complete the CAPTCHA verification.'
    });
  }

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

    const result = await response.json();

    if (!result.success) {
      console.warn(`[Turnstile] Server verification failed for IP: ${req.ip} | Codes:`, result['error-codes']);
      return res.status(403).json({
        success: false,
        error: 'Security CAPTCHA verification failed. Please refresh and try again.'
      });
    }

    return next();
  } catch (error) {
    console.error('[Turnstile] Verification endpoint request failed:', error.message);
    return res.status(502).json({
      success: false,
      error: 'Security verification service temporarily unreachable.'
    });
  }
};

module.exports = { verifyTurnstile };
