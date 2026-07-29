/**
 * QueueWorker handles execution of AI requests pulled from QueueManager.
 * Manages execution timeouts, response parsing, validation, and backoff retries.
 */
const QueueConfig = require('./QueueConfig');
const QueueLogger = require('./QueueLogger');
const RequestMetrics = require('./RequestMetrics');
const CancellationManager = require('./CancellationManager');
const ResponseParser = require('./ResponseParser');
const SchemaValidator = require('./SchemaValidator');
const AIError = require('./errors/AIError');

class QueueWorker {
  constructor(manager) {
    this.manager = manager;
    this.isPaused = false;
    this.pauseTimer = null;
  }

  /**
   * Evaluates the queue and schedules the next job if concurrency limits allow.
   */
  async tick() {
    if (this.isPaused) {
      return;
    }

    const activeCount = this.manager.getActiveCount();
    if (activeCount >= QueueConfig.MAX_CONCURRENT_REQUESTS) {
      return; // Concurrency limit reached
    }

    const job = this.manager.getNextJob();
    if (!job) {
      return; // No jobs waiting
    }

    this.manager.startJob(job);
    this.executeJob(job).finally(() => {
      this.manager.completeJob(job);
      this.tick(); // Process next job
    });

    // Attempt to start another job immediately in parallel
    this.tick();
  }

  /**
   * Executes a single AI job.
   */
  async executeJob(job) {
    const queueTime = Date.now() - job.enqueueTime;
    RequestMetrics.recordStartExecution(queueTime, this.manager.getActiveCount());
    QueueLogger.info(`Starting execution of request ${job.id}`, { requestId: job.id, feature: job.feature, queueTimeMs: queueTime });

    job.state = 'executing';
    const startTime = Date.now();

    try {
      const { provider } = this.manager.aiManager.getProvider(job.providerName);
      const { text: compiledPrompt } = this.manager.promptManager.getPrompt(job.feature, job.variables);

      // Enforce timeout using AbortController cancel mapping
      const executionTimeout = setTimeout(() => {
        CancellationManager.cancel(job.id);
        QueueLogger.warn(`Request ${job.id} exceeded execution timeout. Aborting.`, { requestId: job.id });
      }, QueueConfig.EXECUTION_TIMEOUT_MS);

      let textResult;
      try {
        if (job.onChunk) {
          // Streaming pipeline execution
          await provider.stream(compiledPrompt, job.onChunk, job.signal);
          textResult = null;
        } else {
          // Standard generation execution
          textResult = await provider.generate(
            compiledPrompt,
            job.temperature,
            job.maxTokens,
            QueueConfig.EXECUTION_TIMEOUT_MS,
            job.signal,
            job.retries
          );
        }
      } finally {
        clearTimeout(executionTimeout);
      }

      let finalResult = textResult;

      // Only parse and validate if it was a non-streaming request
      if (!job.onChunk) {
        job.state = 'parsing';
        const parsed = ResponseParser.parse(textResult);

        finalResult = parsed;
        if (job.schemaType) {
          job.state = 'validating';
          const validationResult = SchemaValidator.validate(parsed, job.schemaType);
          if (!validationResult.isValid) {
            throw new AIError(
              422,
              `Schema validation failed: ${validationResult.errors.join(', ')}`,
              new Error(textResult)
            );
          }
          finalResult = validationResult.data;
        }
      }

      job.state = 'completed';
      const executionTime = Date.now() - startTime;
      RequestMetrics.recordSuccess(executionTime);
      QueueLogger.info(`Request ${job.id} completed successfully`, { requestId: job.id, executionTimeMs: executionTime });

      CancellationManager.unregister(job.id);
      job.resolve(finalResult);
    } catch (error) {
      const executionTime = Date.now() - startTime;

      if (job.signal.aborted) {
        job.state = 'cancelled';
        RequestMetrics.recordCancellation();
        QueueLogger.warn(`Request ${job.id} was cancelled`, { requestId: job.id });
        job.reject(new AIError(499, 'Request was cancelled.'));
        return;
      }

      const is429 = error.statusCode === 429 || String(error.message).includes('429') || String(error.message).toLowerCase().includes('rate limit');
      const isTimeout = error.statusCode === 408 || String(error.message).includes('408') || error.name === 'APITimeoutError';

      if (is429) {
        this.pauseQueue();
      }

      // Check retry permissions
      const isRetryable = job.retries < QueueConfig.RETRY_LIMIT && (
        is429 ||
        isTimeout ||
        error.statusCode >= 500 ||
        String(error.message).toLowerCase().includes('json') ||
        error.statusCode === 422
      );

      if (isRetryable) {
        job.retries++;
        RequestMetrics.recordRetry();
        job.state = 'waiting';

        // Exponential backoff with random jitter (prevents thundering herd problems)
        const backoffDelay = Math.min(10000, Math.pow(2, job.retries) * 1000 + Math.random() * 1000);
        QueueLogger.warn(`Request ${job.id} failed (${error.message}). Retrying attempt ${job.retries} in ${Math.round(backoffDelay)}ms...`, {
          requestId: job.id,
          retryAttempt: job.retries,
          delayMs: backoffDelay
        });

        setTimeout(() => {
          this.manager.requeueJob(job);
          this.tick();
        }, backoffDelay);
      } else {
        job.state = 'failed';
        RequestMetrics.recordFailure(isTimeout, is429);
        QueueLogger.error(`Request ${job.id} failed permanently: ${error.message}`, { requestId: job.id, error: error.message });

        CancellationManager.unregister(job.id);
        job.reject(error);
      }
    }
  }

  /**
   * Pauses the queue worker loop temporarily after hitting a 429 Rate Limit.
   */
  pauseQueue() {
    if (this.isPaused) return;

    this.isPaused = true;
    QueueLogger.warn(`429 Rate Limit encountered. Pausing queue worker loop for ${QueueConfig.COOLDOWN_ON_429_MS}ms to allow cooldown.`);

    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = setTimeout(() => {
      this.isPaused = false;
      QueueLogger.info('429 cooldown completed. Resuming queue execution loop.');
      this.tick();
    }, QueueConfig.COOLDOWN_ON_429_MS);
  }
}

module.exports = QueueWorker;
