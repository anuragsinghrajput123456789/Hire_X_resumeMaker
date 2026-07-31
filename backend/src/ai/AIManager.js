const PromptManager = require('./PromptManager');
const SchemaValidator = require('./SchemaValidator');
const ResponseParser = require('./ResponseParser');
const RetryManager = require('./RetryManager');
const ModelConfig = require('./ModelConfig');
const OpenRouterProvider = require('./providers/OpenRouterProvider');
const GeminiProvider = require('./providers/GeminiProvider');
const RequestValidator = require('./utils/RequestValidator');
const { logRequest } = require('./utils/PromptLogger');
const AIError = require('./errors/AIError');

class AIManager {
  constructor() {
    this.providers = {
      openrouter: new OpenRouterProvider(),
      gemini: new GeminiProvider()
    };
    // AIRequestQueue is lazily required to avoid circular dependency
    this._queue = null;
  }

  /**
   * Lazily loads the AIRequestQueue singleton.
   */
  _getQueue() {
    if (!this._queue) {
      this._queue = require('./AIRequestQueue');
    }
    return this._queue;
  }

  getProvider(providerName) {
    let name = providerName || process.env.AI_PROVIDER;
    if (!name) {
      name = process.env.GEMINI_API_KEY ? 'gemini' : 'openrouter';
    }
    const provider = this.providers[name.toLowerCase()];
    if (!provider) {
      throw new Error(`AI Provider '${name}' not configured inside AIManager.`);
    }
    return { provider, name };
  }

  /**
   * Routes a standard AI workflow through the centralized AIRequestQueue.
   * All concurrency, deduplication, retry, and rate-limit handling is managed by the queue.
   */
  async executeAIWorkflow({
    promptName,
    variables,
    schemaType = null,
    temperature = 0.2,
    maxTokens = 1500,
    providerName = null,
    userId = null,
    abortSignal = null
  }) {
    return this._getQueue().enqueue({
      promptName,
      variables,
      schemaType,
      temperature,
      maxTokens,
      providerName,
      userId,
      abortSignal
    });
  }

  /**
   * Routes a streaming AI workflow through the centralized AIRequestQueue.
   */
  async executeAIStreamWorkflow({
    promptName,
    variables,
    temperature = 0.5,
    maxTokens = 1500,
    providerName = null,
    onChunk,
    abortSignal = null,
    userId = null
  }) {
    return this._getQueue().enqueueStream({
      promptName,
      variables,
      temperature,
      maxTokens,
      providerName,
      onChunk,
      abortSignal,
      userId
    });
  }

  // Feature bindings
  async generateResume(data, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'resumeOptimization',
      variables: { data },
      schemaType: 'resume-optimization',
      temperature: 0.3,
      maxTokens: 3000,
      ...options
    });
  }

  async analyzeResumeRealTime(resumeText, jobRole, expectedKeywords = [], options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'atsRealTime',
      variables: { cleanedText: resumeText, jobRole, expectedKeywords },
      schemaType: 'realtime-analysis',
      temperature: 0.2,
      ...options
    });
  }

  async analyzeResume(resumeText, jobRole, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'atsAnalysis',
      variables: { cleanedText: resumeText, jobRole },
      schemaType: 'ats-analysis',
      temperature: 0.2,
      ...options
    });
  }

  async analyzeJobDescription(resumeText, jobDescription, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'jobDescriptionAnalysis',
      variables: { resumeText, jobDescription },
      schemaType: 'job-description',
      temperature: 0.3,
      ...options
    });
  }

  async chat(message, historyContext, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'chat',
      variables: { message, historyContext },
      temperature: 0.5,
      ...options
    });
  }

  async coldEmail(promptText, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'coldEmail',
      variables: { prompt: promptText },
      temperature: 0.4,
      ...options
    });
  }

  async jobSuggestions(resumeText, targetRole, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'jobSuggestions',
      variables: { resumeText, targetRole },
      temperature: 0.3,
      ...options
    });
  }

  async generateContent(promptText, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'coldEmail', // Reuses the generic string prompt compiler
      variables: { prompt: promptText },
      temperature: 0.3,
      ...options
    });
  }

  async generateCoverLetter(variables, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'coverLetter',
      variables,
      schemaType: 'cover-letter',
      temperature: 0.3,
      maxTokens: 2500,
      ...options
    });
  }

  async generateInterviewRoadmap(variables, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'interviewRoadmap',
      variables,
      schemaType: 'interview-roadmap',
      temperature: 0.3,
      maxTokens: 2500,
      ...options
    });
  }

  async generateInterviewQuestion(variables, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'interviewQuestion',
      variables,
      schemaType: 'interview-question',
      temperature: 0.4,
      maxTokens: 1500,
      ...options
    });
  }

  async generateInterviewFeedback(variables, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'interviewFeedback',
      variables,
      schemaType: 'interview-feedback',
      temperature: 0.3,
      maxTokens: 3000,
      ...options
    });
  }

  async generateInterviewStudyPlan(variables, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'interviewStudyPlan',
      variables,
      schemaType: 'interview-studyplan',
      temperature: 0.3,
      maxTokens: 2500,
      ...options
    });
  }

  async generateCareerIntelligence(variables, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'careerIntelligence',
      variables,
      schemaType: 'career-intelligence',
      temperature: 0.3,
      maxTokens: 2500,
      ...options
    });
  }

  async generateInterviewEvaluation(variables, options = {}) {
    return await this.executeAIWorkflow({
      promptName: 'interviewEvaluation',
      variables,
      schemaType: 'interview-evaluation',
      temperature: 0.2,
      maxTokens: 1500,
      ...options
    });
  }
}

// Singleton instantiation
module.exports = new AIManager();
