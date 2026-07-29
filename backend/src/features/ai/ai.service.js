const User = require('../../../models/User');
const AIManager = require('../../ai/AIManager');
const AIRequestQueue = require('../../ai/AIRequestQueue');

const AI_LIMIT = Number(process.env.AI_USAGE_LIMIT || 500);

class AIService {
  static async checkAndIncrementUsage(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const whitelist = (process.env.AI_USAGE_WHITELIST || 'anuragsinghj678@gmail.com')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (whitelist.includes(user.email)) {
      return user.aiUsage;
    }

    if (user.aiUsage >= AI_LIMIT) {
      const error = new Error(`AI usage limit reached (${AI_LIMIT} attempts). Please upgrade for more access.`);
      error.statusCode = 403;
      throw error;
    }

    user.aiUsage += 1;
    await user.save();
    return user.aiUsage;
  }

  static cleanResumeText(text) {
    if (typeof text !== 'string') return '';

    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,;:()\-@/+&%#]/g, '')
      .trim();
  }

  static getJobRoleKeywords(jobRole) {
    const keywordMap = {
      'Software Developer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'API', 'Database', 'Frontend', 'Backend', 'Agile'],
      'Data Analyst': ['SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'Statistics', 'Data Visualization', 'Analytics', 'Reporting'],
      'Product Manager': ['Product Strategy', 'Roadmap', 'Stakeholder Management', 'Agile', 'Scrum', 'User Research', 'Analytics'],
      'Marketing Manager': ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Campaign Management'],
    };

    return keywordMap[jobRole] || ['Leadership', 'Communication', 'Problem Solving', 'Team Work'];
  }

  static requireText(value, fieldName, minLength = 1) {
    if (typeof value !== 'string' || value.trim().length < minLength) {
      const error = new Error(`${fieldName} is required`);
      error.statusCode = 400;
      throw error;
    }

    return value.trim();
  }

  static getMetrics() {
    return {
      metrics: AIRequestQueue.getMetrics(),
      snapshot: AIRequestQueue.getSnapshot()
    };
  }

  static cancelRequest(requestId) {
    if (!requestId) {
      const error = new Error('requestId is required.');
      error.statusCode = 400;
      throw error;
    }
    return AIRequestQueue.cancel(requestId);
  }

  static async healthCheck(providerQuery) {
    const providerName = providerQuery || process.env.AI_PROVIDER || 'openrouter';
    const { provider } = AIManager.getProvider(providerName);
    const isHealthy = await provider.healthCheck();

    return {
      isHealthy,
      providerName,
      model: provider.model
    };
  }
}

module.exports = AIService;
