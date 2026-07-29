/**
 * Centralized manager for handling AbortControllers and request cancellations.
 */
class CancellationManager {
  constructor() {
    this.controllers = new Map();
  }

  /**
   * Registers a new AbortController for a request ID and returns its signal.
   */
  register(requestId, providedSignal = null) {
    const controller = new AbortController();
    this.controllers.set(requestId, controller);

    // If an external AbortSignal was provided (e.g. from Express connection closing), link it
    if (providedSignal) {
      if (providedSignal.aborted) {
        controller.abort();
      } else {
        providedSignal.addEventListener('abort', () => {
          this.cancel(requestId);
        });
      }
    }

    return controller.signal;
  }

  /**
   * Triggers the AbortController for a request ID, aborting any active requests.
   */
  cancel(requestId) {
    const controller = this.controllers.get(requestId);
    if (controller) {
      controller.abort();
      this.controllers.delete(requestId);
      return true;
    }
    return false;
  }

  /**
   * Removes a request ID from the cancellation registry (used when a job completes normally).
   */
  unregister(requestId) {
    this.controllers.delete(requestId);
  }

  /**
   * Aborts all active and waiting controllers (useful during server shutdowns or queue resets).
   */
  cancelAll() {
    for (const [requestId, controller] of this.controllers.entries()) {
      controller.abort();
    }
    this.controllers.clear();
  }
}

module.exports = new CancellationManager(); // Export as singleton
