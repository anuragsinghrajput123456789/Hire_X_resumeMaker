/**
 * AIRequestQueue — the single public gateway for all AI request execution.
 * Integrates Authentication, Quota Management, Deduplication, Validation,
 * Queueing, and Response Caching.
 */
const QueueManager = require('./QueueManager');
const QueueWorker = require('./QueueWorker');
const RequestDeduplicator = require('./RequestDeduplicator');
const CancellationManager = require('./CancellationManager');
const RequestValidator = require('./utils/RequestValidator');
const RequestMetrics = require('./RequestMetrics');
const QueueLogger = require('./QueueLogger');
const QueueConfig = require('./QueueConfig');
const AIError = require('./errors/AIError');
const QuotaManager = require('./QuotaManager');
const AICache = require('./AICache');
const securityLogger = require('../utils/securityLogger');

let _workerInstance = null;

class AIRequestQueue {
  constructor() {
    if (!_workerInstance) {
      _workerInstance = new QueueWorker(QueueManager);
    }
    this.worker = _workerInstance;
  }

  _ensureInitialised() {
    if (!QueueManager.aiManager) {
      const AIManager = require('./AIManager');
      const PromptManager = require('./PromptManager');
      QueueManager.init(AIManager, PromptManager);
    }
  }

  /**
   * Enqueues a standard (non-streaming) AI request following the target security & cost protection pipeline.
   */
  async enqueue({
    promptName,
    variables,
    schemaType = null,
    temperature = 0.2,
    maxTokens = 1500,
    providerName = null,
    userId = null,
    abortSignal = null
  }) {
    this._ensureInitialised();

    // 1. Pre-flight input validation — reject bad or injection requests
    RequestValidator.validate(promptName, variables);

    // 2. Per-User Daily Quota Check — reject if limit reached
    QuotaManager.checkQuota(userId, promptName);

    // 3. Response Cache Check — return cached result if available (saving OpenRouter costs)
    const cachedResult = AICache.get(promptName, variables);
    if (cachedResult) {
      QueueLogger.info(`Cache HIT for [${promptName}]`, { feature: promptName, userId });
      securityLogger.logAiUsage(userId, promptName, 0, true);
      return cachedResult;
    }

    // 4. Deduplication — if identical request is in-flight, collapse to existing promise
    const dedupKey = RequestDeduplicator.generateKey(promptName, variables);
    const existingPromise = RequestDeduplicator.get(dedupKey);
    if (existingPromise) {
      QueueLogger.info(`Deduplicating active request for [${promptName}]`, { feature: promptName });
      return existingPromise;
    }

    // Increment user daily quota usage
    QuotaManager.incrementQuota(userId, promptName);

    // 5. Build new job descriptor
    const requestId = this._generateId();
    const signal = CancellationManager.register(requestId, abortSignal);

    const resultPromise = new Promise((resolve, reject) => {
      const job = {
        id: requestId,
        feature: promptName,
        variables,
        schemaType,
        temperature,
        maxTokens,
        providerName,
        userId,
        signal,
        onChunk: null,
        retries: 0,
        enqueueTime: Date.now(),
        state: 'queued',
        resolve,
        reject,
      };

      // 6. Enqueue & check capacity
      const accepted = QueueManager.enqueue(job);
      if (!accepted) {
        CancellationManager.unregister(requestId);
        reject(new AIError(503, 'AI request queue is full. Please try again shortly.'));
        return;
      }

      this.worker.tick();
    });

    RequestDeduplicator.add(dedupKey, resultPromise);
    resultPromise
      .catch(() => {})
      .finally(() => {
        RequestDeduplicator.remove(dedupKey);
      });

    return resultPromise;
  }

  /**
   * Enqueues a streaming AI request.
   */
  async enqueueStream({
    promptName,
    variables,
    temperature = 0.5,
    maxTokens = 1500,
    providerName = null,
    onChunk,
    abortSignal = null,
    userId = null
  }) {
    this._ensureInitialised();

    RequestValidator.validate(promptName, variables);
    QuotaManager.checkQuota(userId, promptName);

    QuotaManager.incrementQuota(userId, promptName);

    const requestId = this._generateId();
    const signal = CancellationManager.register(requestId, abortSignal);

    return new Promise((resolve, reject) => {
      const job = {
        id: requestId,
        feature: promptName,
        variables,
        schemaType: null,
        temperature,
        maxTokens,
        providerName,
        userId,
        signal,
        onChunk,
        retries: 0,
        enqueueTime: Date.now(),
        state: 'queued',
        resolve,
        reject,
      };

      const accepted = QueueManager.enqueue(job);
      if (!accepted) {
        CancellationManager.unregister(requestId);
        reject(new AIError(503, 'AI request queue is full. Please try again shortly.'));
        return;
      }

      this.worker.tick();
    });
  }

  cancel(requestId) {
    QueueManager.cancelJob(requestId);
    return CancellationManager.cancel(requestId);
  }

  cancelAll() {
    CancellationManager.cancelAll();
  }

  getMetrics() {
    return {
      ...RequestMetrics.getMetrics(),
      cache: AICache.getMetrics(),
      quotas: QuotaManager.getSnapshot()
    };
  }

  getSnapshot() {
    return QueueManager.getSnapshot();
  }

  _generateId() {
    return `REQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }
}

module.exports = new AIRequestQueue();
