const crypto = require('crypto');

/**
 * AICache — Intelligent LRU Response Cache to eliminate redundant OpenRouter API token costs.
 */
class AICache {
  constructor(maxItems = 1000) {
    this.cache = new Map();
    this.maxItems = maxItems;
    this.hits = 0;
    this.misses = 0;

    // Feature TTLs in milliseconds
    this.featureTTLs = {
      atsAnalysis: 24 * 60 * 60 * 1000,          // 24 hours
      atsRealTime: 60 * 60 * 1000,               // 1 hour
      jobDescriptionAnalysis: 24 * 60 * 60 * 1000,// 24 hours
      coverLetter: 12 * 60 * 60 * 1000,           // 12 hours
      coldEmail: 12 * 60 * 60 * 1000,            // 12 hours
      jobSuggestions: 12 * 60 * 60 * 1000,       // 12 hours
      resumeOptimization: 24 * 60 * 60 * 1000,    // 24 hours
      interviewRoadmap: 24 * 60 * 60 * 1000,      // 24 hours
      interviewStudyPlan: 24 * 60 * 60 * 1000,    // 24 hours
      careerIntelligence: 24 * 60 * 60 * 1000     // 24 hours
    };
  }

  /**
   * Generates a stable SHA-256 cache key from feature name and normalized payload.
   */
  generateKey(feature, variables = {}) {
    const sortedVariables = this._sortObjectKeys(variables);
    const serialized = JSON.stringify(sortedVariables);
    const hash = crypto.createHash('sha256').update(serialized).digest('hex');
    return `cache:${feature}:${hash}`;
  }

  /**
   * Retrieves a cached response if valid and not expired.
   */
  get(feature, variables) {
    // Chat prompts bypass caching
    if (feature === 'chat' || feature === 'interviewQuestion') {
      return null;
    }

    const key = this.generateKey(feature, variables);
    const item = this.cache.get(key);

    if (!item) {
      this.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh LRU position
    this.cache.delete(key);
    this.cache.set(key, item);
    this.hits++;
    return item.data;
  }

  /**
   * Stores an AI output in the cache.
   */
  set(feature, variables, data) {
    if (feature === 'chat' || feature === 'interviewQuestion' || !data) {
      return;
    }

    const key = this.generateKey(feature, variables);
    const ttl = this.featureTTLs[feature] || 12 * 60 * 60 * 1000; // Default 12 hours
    const expiresAt = Date.now() + ttl;

    // Enforce max LRU items limit
    if (this.cache.size >= this.maxItems) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Clears or invalidates cache entries for a user or feature.
   */
  invalidate(feature) {
    if (!feature) {
      this.cache.clear();
      return;
    }
    const prefix = `cache:${feature}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  getMetrics() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(2) + '%' : '0.00%';
    return {
      size: this.cache.size,
      maxItems: this.maxItems,
      hits: this.hits,
      misses: this.misses,
      hitRate
    };
  }

  _sortObjectKeys(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this._sortObjectKeys(item));
    return Object.keys(obj)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = this._sortObjectKeys(obj[key]);
        return sorted;
      }, {});
  }
}

module.exports = new AICache();
