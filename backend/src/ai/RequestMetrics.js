/**
 * Singleton to track metrics and diagnostic statistics for the AI Request Queue.
 */
class RequestMetrics {
  constructor() {
    this.totalRequests = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.retryCount = 0;
    this.rateLimits429Count = 0;
    this.timeoutsCount = 0;
    this.cancellationsCount = 0;
    
    this.totalQueueTime = 0;
    this.totalExecutionTime = 0;
    
    this.peakConcurrency = 0;
    this.currentConcurrency = 0;
    this.currentQueueLength = 0;
  }

  recordEnqueue(queueLength) {
    this.totalRequests++;
    this.currentQueueLength = queueLength;
  }

  recordStartExecution(queueTime, activeCount) {
    this.totalQueueTime += queueTime;
    this.currentConcurrency = activeCount;
    if (activeCount > this.peakConcurrency) {
      this.peakConcurrency = activeCount;
    }
  }

  recordSuccess(executionTime) {
    this.successCount++;
    this.totalExecutionTime += executionTime;
    this.currentConcurrency = Math.max(0, this.currentConcurrency - 1);
  }

  recordFailure(isTimeout = false, is429 = false) {
    this.failureCount++;
    this.currentConcurrency = Math.max(0, this.currentConcurrency - 1);
    if (isTimeout) this.timeoutsCount++;
    if (is429) this.rateLimits429Count++;
  }

  recordCancellation() {
    this.cancellationsCount++;
    this.currentConcurrency = Math.max(0, this.currentConcurrency - 1);
  }

  recordRetry() {
    this.retryCount++;
  }

  updateQueueLength(len) {
    this.currentQueueLength = len;
  }

  getMetrics() {
    const totalFinished = this.successCount + this.failureCount + this.cancellationsCount;
    const avgQueueTime = totalFinished > 0 ? this.totalQueueTime / totalFinished : 0;
    const avgLatency = this.successCount > 0 ? this.totalExecutionTime / this.successCount : 0;

    const totalProcessed = this.successCount + this.failureCount;
    const successRate = totalProcessed > 0 ? (this.successCount / totalProcessed) * 100 : 0;
    const failureRate = totalProcessed > 0 ? (this.failureCount / totalProcessed) * 100 : 0;

    return {
      totalRequests: this.totalRequests,
      successCount: this.successCount,
      failureCount: this.failureCount,
      retryCount: this.retryCount,
      rateLimits429Count: this.rateLimits429Count,
      timeoutsCount: this.timeoutsCount,
      cancellationsCount: this.cancellationsCount,
      averageQueueTimeMs: Math.round(avgQueueTime),
      averageExecutionTimeMs: Math.round(avgLatency),
      successRatePercentage: parseFloat(successRate.toFixed(2)),
      failureRatePercentage: parseFloat(failureRate.toFixed(2)),
      peakConcurrency: this.peakConcurrency,
      currentConcurrency: this.currentConcurrency,
      currentQueueLength: this.currentQueueLength
    };
  }
}

module.exports = new RequestMetrics(); // Singleton
