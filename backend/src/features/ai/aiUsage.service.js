const AIUsage = require('../../../models/AIUsage');

const TIER_LIMITS = {
  free: {
    resumeOptimization: 10,
    atsAnalysis: 20,
    atsRealTime: 30,
    coverLetter: 10,
    coldEmail: 10,
    chat: 100,
    interviewQuestion: 100,
    interviewRoadmap: 10,
    interviewStudyPlan: 10,
    careerIntelligence: 50,
    jobDescriptionAnalysis: 25,
    jobSuggestions: 20
  },
  pro: {
    resumeOptimization: 50,
    atsAnalysis: 100,
    atsRealTime: 150,
    coverLetter: 50,
    coldEmail: 50,
    chat: 500,
    interviewQuestion: 500,
    interviewRoadmap: 50,
    interviewStudyPlan: 50,
    careerIntelligence: 200,
    jobDescriptionAnalysis: 100,
    jobSuggestions: 100
  },
  enterprise: {
    resumeOptimization: 1000,
    atsAnalysis: 1000,
    atsRealTime: 1000,
    coverLetter: 1000,
    coldEmail: 1000,
    chat: 10000,
    interviewQuestion: 10000,
    interviewRoadmap: 1000,
    interviewStudyPlan: 1000,
    careerIntelligence: 1000,
    jobDescriptionAnalysis: 1000,
    jobSuggestions: 1000
  }
};

class AIUsageService {
  static getTodayDateString() {
    return new Date().toISOString().split('T')[0];
  }

  static getResetCountdown() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const diffMs = Math.max(0, endOfDay.getTime() - now.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return {
      hours,
      minutes,
      totalSeconds,
      formatted: `${hours}h ${minutes}m Remaining`
    };
  }

  static getDailyLimits(tier = 'free') {
    return TIER_LIMITS[tier.toLowerCase()] || TIER_LIMITS.free;
  }

  /**
   * Retrieves current user's daily usage breakdown and quota remaining.
   */
  static async getUserUsage(userId) {
    if (!userId) {
      return this.getEmptyUsageResponse();
    }

    const today = this.getTodayDateString();
    let usageDoc = await AIUsage.findOne({ userId, date: today }).lean();

    if (!usageDoc) {
      usageDoc = {
        userId,
        date: today,
        tier: 'free',
        features: {}
      };
    }

    const tier = usageDoc.tier || 'free';
    const limits = this.getDailyLimits(tier);
    const userFeatures = usageDoc.features || {};

    const featureKeys = [
      'resumeOptimization',
      'atsAnalysis',
      'atsRealTime',
      'coverLetter',
      'coldEmail',
      'chat',
      'interviewQuestion',
      'interviewRoadmap',
      'interviewStudyPlan',
      'careerIntelligence',
      'jobDescriptionAnalysis',
      'jobSuggestions'
    ];

    const breakdown = {};
    for (const key of featureKeys) {
      const used = userFeatures[key] || 0;
      const limit = limits[key] || 20;
      const remaining = Math.max(0, limit - used);
      const progressPercent = Math.min(100, Math.round((used / limit) * 100));

      breakdown[key] = {
        used,
        limit,
        remaining,
        progressPercent
      };
    }

    return {
      date: today,
      tier,
      countdown: this.getResetCountdown(),
      usage: breakdown
    };
  }

  /**
   * Increments daily usage for a feature strictly after a successful AI execution.
   */
  static async incrementUsage(userId, feature) {
    if (!userId || !feature) return;

    const today = this.getTodayDateString();
    const updateField = `features.${feature}`;

    try {
      await AIUsage.findOneAndUpdate(
        { userId, date: today },
        { $inc: { [updateField]: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (err) {
      console.warn(`[AIUsageService] Error incrementing usage for user ${userId} on ${feature}:`, err.message);
    }
  }

  static getEmptyUsageResponse() {
    const limits = this.getDailyLimits('free');
    const breakdown = {};
    for (const key in limits) {
      breakdown[key] = {
        used: 0,
        limit: limits[key],
        remaining: limits[key],
        progressPercent: 0
      };
    }
    return {
      date: this.getTodayDateString(),
      tier: 'free',
      countdown: this.getResetCountdown(),
      usage: breakdown
    };
  }
}

module.exports = AIUsageService;
