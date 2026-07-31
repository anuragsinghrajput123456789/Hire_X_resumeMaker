const AIError = require('./errors/AIError');

/**
 * QuotaManager — Per-User Daily AI Quota enforcement to prevent cost amplification and quota exhaustion.
 */
class QuotaManager {
  constructor() {
    this.usageMap = new Map(); // Key: `userId:YYYY-MM-DD:feature` -> count
    this.dailyQuotas = {
      resumeOptimization: 10,
      atsAnalysis: 20,
      atsRealTime: 30,
      coverLetter: 10,
      chat: 100,
      interviewQuestion: 100,
      interviewFeedback: 20,
      interviewRoadmap: 10,
      interviewStudyPlan: 10,
      coldEmail: 10,
      careerIntelligence: 50,
      jobSuggestions: 20,
      default: 50
    };
  }

  _getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  _getQuotaLimit(feature) {
    return this.dailyQuotas[feature] || this.dailyQuotas.default;
  }

  /**
   * Checks whether a user has remaining quota for a given feature.
   * Throws 429 AIError if quota is exhausted.
   */
  checkQuota(userId, feature) {
    if (!userId) return true; // Unauthenticated or system call

    const today = this._getTodayString();
    const key = `${userId}:${today}:${feature}`;
    const currentCount = this.usageMap.get(key) || 0;
    const maxLimit = this._getQuotaLimit(feature);

    if (currentCount >= maxLimit) {
      const friendlyFeatureNames = {
        coverLetter: 'Cover Letter Generator',
        coldEmail: 'Cold Email Generator',
        resumeOptimization: 'Resume Optimizer',
        atsAnalysis: 'ATS Resume Analysis',
        chat: 'Career Assistant Chat',
        interviewQuestion: 'Interview Practice'
      };
      const featureName = friendlyFeatureNames[feature] || feature;
      throw new AIError(
        429,
        `Daily limit reached for ${featureName} (${maxLimit}/day). Your daily quota resets at midnight.`
      );
    }

    return true;
  }

  /**
   * Increments user daily quota count after an AI request is initiated.
   */
  incrementQuota(userId, feature) {
    if (!userId) return;

    const today = this._getTodayString();
    const key = `${userId}:${today}:${feature}`;
    const currentCount = this.usageMap.get(key) || 0;
    this.usageMap.set(key, currentCount + 1);

    // Periodic cleanup of older date entries
    if (this.usageMap.size > 5000) {
      for (const k of this.usageMap.keys()) {
        if (!k.includes(today)) {
          this.usageMap.delete(k);
        }
      }
    }
  }

  /**
   * Returns remaining daily quota for a specific user and feature.
   */
  getRemainingQuota(userId, feature) {
    if (!userId) return Infinity;

    const today = this._getTodayString();
    const key = `${userId}:${today}:${feature}`;
    const currentCount = this.usageMap.get(key) || 0;
    const maxLimit = this._getQuotaLimit(feature);
    return Math.max(0, maxLimit - currentCount);
  }

  getSnapshot() {
    return {
      trackedEntries: this.usageMap.size,
      quotasConfigured: this.dailyQuotas
    };
  }
}

module.exports = new QuotaManager();
