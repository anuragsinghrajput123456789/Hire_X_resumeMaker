/**
 * Priority definitions and utility methods for the AI Request Queue.
 */
const { PRIORITIES, FEATURE_PRIORITIES } = require('./QueueConfig');

class RequestPriority {
  static get LEVEL() {
    return {
      CRITICAL: 'CRITICAL',
      HIGH: 'HIGH',
      MEDIUM: 'MEDIUM',
      LOW: 'LOW',
    };
  }

  /**
   * Resolves the priority weight for a given feature.
   */
  static getWeight(featureName) {
    const priorityName = FEATURE_PRIORITIES[featureName] || 'MEDIUM';
    return PRIORITIES[priorityName]?.weight || PRIORITIES.MEDIUM.weight;
  }

  /**
   * Priority comparator.
   * Returns a negative value if request 'a' should be processed before request 'b'.
   * 1. Higher priority weight goes first.
   * 2. If priorities are identical, the older request goes first (FIFO based on enqueueTime).
   */
  static compare(a, b) {
    const weightA = RequestPriority.getWeight(a.feature);
    const weightB = RequestPriority.getWeight(b.feature);

    if (weightA !== weightB) {
      return weightB - weightA; // Descending weight order
    }

    return a.enqueueTime - b.enqueueTime; // Ascending enqueueTime (FIFO)
  }
}

module.exports = RequestPriority;
