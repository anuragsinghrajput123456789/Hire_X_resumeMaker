/**
 * QueueManager maintains the in-memory priority-sorted queue of AI request jobs.
 * It provides enqueue, dequeue, and lifecycle management operations.
 */
const QueueConfig = require('./QueueConfig');
const RequestPriority = require('./RequestPriority');
const RequestMetrics = require('./RequestMetrics');
const QueueLogger = require('./QueueLogger');

// Request lifecycle states
const STATES = {
  QUEUED: 'queued',
  WAITING: 'waiting',
  EXECUTING: 'executing',
  PARSING: 'parsing',
  VALIDATING: 'validating',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

class QueueManager {
  constructor() {
    this.queue = [];       // Waiting jobs sorted by priority
    this.active = new Map(); // Currently executing jobs keyed by id
    this.aiManager = null;
    this.promptManager = null;

    // Queue timeout sweeper — removes expired waiting jobs every 5 seconds
    this.sweepInterval = setInterval(() => this.sweepExpired(), 5000);
  }

  /**
   * Injects dependencies after singleton creation to break circular require chains.
   */
  init(aiManager, promptManager) {
    this.aiManager = aiManager;
    this.promptManager = promptManager;
  }

  /**
   * Adds a new job to the priority-sorted waiting queue.
   * Returns false if the queue is full.
   */
  enqueue(job) {
    if (this.queue.length >= QueueConfig.MAX_QUEUE_SIZE) {
      QueueLogger.warn(`Queue is full (${QueueConfig.MAX_QUEUE_SIZE}). Rejecting request ${job.id}`, { requestId: job.id });
      return false;
    }

    job.state = STATES.QUEUED;
    this.queue.push(job);
    this.queue.sort(RequestPriority.compare);

    job.state = STATES.WAITING;
    RequestMetrics.recordEnqueue(this.queue.length);
    QueueLogger.info(`Enqueued request ${job.id} [${job.feature}] priority=${RequestPriority.getWeight(job.feature)}`, {
      requestId: job.id,
      feature: job.feature,
      queueLength: this.queue.length,
    });

    return true;
  }

  /**
   * Retrieves the next highest-priority waiting job from the queue (does not remove it yet).
   * Returns null if no jobs are waiting.
   */
  getNextJob() {
    if (this.queue.length === 0) return null;

    // Find first non-cancelled job
    while (this.queue.length > 0) {
      const job = this.queue[0];
      if (job.signal && job.signal.aborted) {
        // Already cancelled while waiting — discard
        this.queue.shift();
        job.state = STATES.CANCELLED;
        RequestMetrics.recordCancellation();
        QueueLogger.info(`Discarding cancelled queued request ${job.id}`, { requestId: job.id });
        job.reject(new Error('Request was cancelled while waiting in queue.'));
        continue;
      }

      // Check if the job has expired its queue timeout
      const waitTime = Date.now() - job.enqueueTime;
      if (waitTime > QueueConfig.QUEUE_TIMEOUT_MS) {
        this.queue.shift();
        job.state = STATES.FAILED;
        RequestMetrics.recordFailure(true, false);
        QueueLogger.warn(`Request ${job.id} expired in queue after ${waitTime}ms`, { requestId: job.id });
        job.reject(new Error(`Request expired after waiting ${waitTime}ms in queue.`));
        continue;
      }

      return job;
    }

    return null;
  }

  /**
   * Moves a job from the waiting queue into the active execution set.
   */
  startJob(job) {
    const idx = this.queue.indexOf(job);
    if (idx !== -1) {
      this.queue.splice(idx, 1);
    }
    this.active.set(job.id, job);
    RequestMetrics.updateQueueLength(this.queue.length);
  }

  /**
   * Removes a job from the active execution set after completion/failure/cancellation.
   */
  completeJob(job) {
    this.active.delete(job.id);
    RequestMetrics.updateQueueLength(this.queue.length);
  }

  /**
   * Re-inserts a job back into the waiting queue for retry.
   */
  requeueJob(job) {
    job.state = STATES.WAITING;
    this.active.delete(job.id);
    this.queue.push(job);
    this.queue.sort(RequestPriority.compare);
    RequestMetrics.updateQueueLength(this.queue.length);
    QueueLogger.info(`Re-queued request ${job.id} for retry attempt ${job.retries}`, { requestId: job.id, retries: job.retries });
  }

  /**
   * Returns the count of currently executing jobs.
   */
  getActiveCount() {
    return this.active.size;
  }

  /**
   * Sweeps expired requests from the waiting queue.
   */
  sweepExpired() {
    const now = Date.now();
    const expired = [];

    this.queue = this.queue.filter(job => {
      const waitTime = now - job.enqueueTime;
      if (waitTime > QueueConfig.QUEUE_TIMEOUT_MS) {
        expired.push(job);
        return false;
      }
      return true;
    });

    for (const job of expired) {
      job.state = STATES.FAILED;
      RequestMetrics.recordFailure(true, false);
      QueueLogger.warn(`Sweep: Request ${job.id} expired after ${Date.now() - job.enqueueTime}ms`, { requestId: job.id });
      job.reject(new Error('Request expired while waiting in queue.'));
    }

    if (expired.length > 0) {
      RequestMetrics.updateQueueLength(this.queue.length);
    }
  }

  /**
   * Cancels a specific job by request ID. Works for both queued and active jobs.
   */
  cancelJob(requestId) {
    // Check waiting queue
    const idx = this.queue.findIndex(j => j.id === requestId);
    if (idx !== -1) {
      const job = this.queue.splice(idx, 1)[0];
      job.state = STATES.CANCELLED;
      RequestMetrics.recordCancellation();
      RequestMetrics.updateQueueLength(this.queue.length);
      job.reject(new Error('Request was cancelled.'));
      return true;
    }

    // Check active jobs
    const activeJob = this.active.get(requestId);
    if (activeJob) {
      // The CancellationManager abort signal will handle stopping the provider call
      return true; // actual abort happens via CancellationManager.cancel()
    }

    return false;
  }

  /**
   * Returns a snapshot of all jobs for debugging.
   */
  getSnapshot() {
    return {
      queueLength: this.queue.length,
      activeCount: this.active.size,
      waitingJobs: this.queue.map(j => ({ id: j.id, feature: j.feature, state: j.state, age: Date.now() - j.enqueueTime })),
      activeJobs: Array.from(this.active.values()).map(j => ({ id: j.id, feature: j.feature, state: j.state })),
    };
  }

  /**
   * Graceful shutdown — clears the sweep interval and rejects all pending jobs.
   */
  shutdown() {
    if (this.sweepInterval) {
      clearInterval(this.sweepInterval);
      this.sweepInterval = null;
    }

    // Reject all waiting jobs
    for (const job of this.queue) {
      job.state = STATES.CANCELLED;
      job.reject(new Error('Server is shutting down.'));
    }
    this.queue = [];

    QueueLogger.info('QueueManager shut down. All pending jobs rejected.');
  }
}

QueueManager.STATES = STATES;
module.exports = new QueueManager(); // Export as singleton

