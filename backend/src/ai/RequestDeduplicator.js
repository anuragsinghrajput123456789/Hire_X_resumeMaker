/**
 * Request deduplicator for collapsing identical pending or executing requests.
 */
class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
  }

  /**
   * Generates a stable lookup key from the feature name and variable payload.
   */
  generateKey(feature, variables) {
    const crypto = require('crypto');
    const sortedVariables = this.sortObjectKeys(variables);
    const serialized = JSON.stringify(sortedVariables);
    const hash = crypto.createHash('sha256').update(serialized).digest('hex');
    return `${feature}:${hash}`;
  }

  /**
   * Caches a pending request promise.
   */
  add(key, promise) {
    this.pending.set(key, promise);
  }

  /**
   * Retrieves an in-flight promise if it exists.
   */
  get(key) {
    return this.pending.get(key);
  }

  /**
   * Removes a cached request once it is completed or failed.
   */
  remove(key) {
    this.pending.delete(key);
  }

  /**
   * Helper to ensure variable ordering in JSON serialization does not skew deduplication key.
   */
  sortObjectKeys(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }
    return Object.keys(obj)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = this.sortObjectKeys(obj[key]);
        return sorted;
      }, {});
  }

  clear() {
    this.pending.clear();
  }
}

module.exports = new RequestDeduplicator(); // Export as singleton
