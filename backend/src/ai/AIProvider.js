/**
 * Base abstract class defining the contract for AI model providers.
 */
class AIProvider {
  constructor() {
    if (this.constructor === AIProvider) {
      throw new Error("Abstract classes cannot be instantiated.");
    }
  }

  async initialize() {
    throw new Error("Method 'initialize()' must be implemented.");
  }

  async generate(prompt, temperature = 0.3, maxTokens = 1500) {
    throw new Error("Method 'generate()' must be implemented.");
  }

  async healthCheck() {
    throw new Error("Method 'healthCheck()' must be implemented.");
  }

  async estimateTokens(prompt) {
    return Math.ceil(prompt.length / 4); // Default rough estimation
  }

  async stream(prompt, callback) {
    throw new Error("Method 'stream()' must be implemented.");
  }

  async cancel() {
    // Optional cancel logic placeholder
  }
}

module.exports = AIProvider;
