/**
 * AIRequestQueue — the single public gateway for all AI request execution.
 * Every AI feature request enters through this module, is deduplicated,
 * assigned a priority, queued, and executed by the QueueWorker.
 *
 * Controllers call AIRequestQueue instead of AIManager directly.
 * AIManager remains the provider/prompt orchestrator but is no longer the entry point.
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

let _workerInstance = null;

class AIRequestQueue {
  constructor() {
    if (!_workerInstance) {
      _workerInstance = new QueueWorker(QueueManager);
    }
    this.worker = _workerInstance;
  }

  /**
   * Lazily initialises the QueueManager with AIManager and PromptManager references.
   * Called once on the first request to break circular dependency chains.
   */
  _ensureInitialised() {
    if (!QueueManager.aiManager) {
      const AIManager = require('./AIManager');
      const PromptManager = require('./PromptManager');
      QueueManager.init(AIManager, PromptManager);
    }
  }

  /**
   * Enqueues a standard (non-streaming) AI request.
   *
   * @param {Object} params
   * @param {string} params.promptName  - The feature/prompt key (e.g. 'atsAnalysis')
   * @param {Object} params.variables   - Variables for the prompt compiler
   * @param {string} [params.schemaType] - Schema name for response validation
   * @param {number} [params.temperature]
   * @param {number} [params.maxTokens]
   * @param {string} [params.providerName]
   * @param {string} [params.userId]
   * @param {AbortSignal} [params.abortSignal] - Optional external abort signal
   * @returns {Promise<any>} Parsed and validated AI response
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

    // 1. Pre-flight validation — reject bad requests before they enter the queue
    RequestValidator.validate(promptName, variables);

    // 2. Deduplication — if an identical request is already in-flight, piggyback on it
    const dedupKey = RequestDeduplicator.generateKey(promptName, variables);
    const existingPromise = RequestDeduplicator.get(dedupKey);
    if (existingPromise) {
      QueueLogger.info(`Deduplicating request for [${promptName}]`, { feature: promptName });
      return existingPromise;
    }

    // 3. Build a new job descriptor
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
        onChunk: null,          // null = standard request (not streaming)
        retries: 0,
        enqueueTime: Date.now(),
        state: 'queued',
        resolve,
        reject,
      };

      // 4. Check queue capacity
      const accepted = QueueManager.enqueue(job);
      if (!accepted) {
        CancellationManager.unregister(requestId);
        reject(new AIError(503, 'AI request queue is full. Please try again shortly.'));
        return;
      }

      // 5. Kick the worker loop
      this.worker.tick();
    });

    // 6. Register in deduplicator (auto-cleanup on settle)
    RequestDeduplicator.add(dedupKey, resultPromise);
    resultPromise
      .catch(() => {})            // Prevent unhandled rejection from cleanup
      .finally(() => {
        RequestDeduplicator.remove(dedupKey);
      });

    return resultPromise;
  }

  /**
   * Enqueues a streaming AI request.
   *
   * @param {Object} params
   * @param {string}   params.promptName
   * @param {Object}   params.variables
   * @param {number}   [params.temperature]
   * @param {number}   [params.maxTokens]
   * @param {string}   [params.providerName]
   * @param {Function} params.onChunk - Callback invoked with each streaming chunk
   * @param {AbortSignal} [params.abortSignal]
   * @param {string}   [params.userId]
   * @returns {Promise<void>}
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

  // ─── Cancellation API ────────────────────────────────────────────

  /**
   * Cancel a single request by ID.
   */
  cancel(requestId) {
    QueueManager.cancelJob(requestId);
    return CancellationManager.cancel(requestId);
  }

  /**
   * Cancel all queued and active requests.
   */
  cancelAll() {
    CancellationManager.cancelAll();
  }

  // ─── Metrics API ─────────────────────────────────────────────────

  getMetrics() {
    return RequestMetrics.getMetrics();
  }

  getSnapshot() {
    return QueueManager.getSnapshot();
  }

  // ─── Internal helpers ────────────────────────────────────────────

  _generateId() {
    return `REQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }
}

// Export as singleton
module.exports = new AIRequestQueue();
