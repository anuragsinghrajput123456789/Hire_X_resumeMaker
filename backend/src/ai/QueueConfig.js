/**
 * Centralized configuration variables for the AI Request Queue.
 */
module.exports = {
  // Concurrency and sizes
  MAX_QUEUE_SIZE: 100,
  MAX_CONCURRENT_REQUESTS: parseInt(process.env.AI_MAX_CONCURRENCY, 10) || 3,

  // Timeouts (in milliseconds)
  QUEUE_TIMEOUT_MS: 60000,       // Max duration a request can wait in the queue before expiration
  EXECUTION_TIMEOUT_MS: 45000,   // Max duration for the AI provider to complete generation
  COOLDOWN_ON_429_MS: 3000,      // Cooling delay when a 429 rate limit is returned by OpenRouter

  // Retry limit
  RETRY_LIMIT: 3,

  // Prioritization weights
  PRIORITIES: {
    CRITICAL: { name: 'CRITICAL', weight: 4 },
    HIGH: { name: 'HIGH', weight: 3 },
    MEDIUM: { name: 'MEDIUM', weight: 2 },
    LOW: { name: 'LOW', weight: 1 },
  },

  // Feature to priority mapping
  FEATURE_PRIORITIES: {
    authentication: 'CRITICAL',
    resumeOptimization: 'HIGH',
    atsAnalysis: 'HIGH',
    atsRealTime: 'HIGH',
    resumeRewrite: 'MEDIUM',
    coverLetter: 'MEDIUM',
    coldEmail: 'MEDIUM',
    interviewQuestion: 'MEDIUM',
    interviewRoadmap: 'MEDIUM',
    chat: 'MEDIUM',
    interviewFeedback: 'MEDIUM',
    interviewStudyPlan: 'MEDIUM',
    careerIntelligence: 'MEDIUM',
    interviewEvaluation: 'HIGH', // High priority real-time scoring
    jobSuggestions: 'LOW',
    backgroundAnalysis: 'LOW',
  }
};
