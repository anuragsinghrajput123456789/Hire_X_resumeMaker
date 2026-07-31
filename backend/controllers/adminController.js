const User = require('../models/User');
const AIService = require('../src/features/ai/ai.service');
const securityLogger = require('../src/utils/securityLogger');

const getAdminMetrics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const { metrics, snapshot } = AIService.getMetrics();
    const aiHealth = await AIService.healthCheck();
    const recentSecurityEvents = securityLogger.getRecentEvents(50);

    const metricsData = {
      timestamp: new Date().toISOString(),
      systemStatus: 'ONLINE',
      activeUsers: userCount,
      aiProvider: aiHealth.providerName,
      aiModel: aiHealth.model,
      aiHealth: aiHealth.isHealthy ? 'UP' : 'DOWN',
      metrics: {
        totalRequestsProcessed: metrics.totalProcessed || 0,
        totalFailedRequests: metrics.totalFailed || 0,
        rateLimitedEvents: recentSecurityEvents.filter(e => e.type === 'rate_limit_exceeded').length,
        promptInjectionsBlocked: recentSecurityEvents.filter(e => e.type === 'prompt_injection_blocked').length,
        failedLoginCount: recentSecurityEvents.filter(e => e.type === 'failed_login').length,
        averageExecutionTimeMs: metrics.averageExecutionTimeMs || 0
      },
      queueSnapshot: snapshot,
      recentEvents: recentSecurityEvents
    };

    res.json(metricsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve admin metrics', message: error.message });
  }
};

module.exports = {
  getAdminMetrics
};
