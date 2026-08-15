const AIProvider = require('../AIProvider');
const ModelConfig = require('../ModelConfig');
const AIError = require('../errors/AIError');
const { OpenAI } = require('openai');

class OpenRouterProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    this.model = ModelConfig.primaryModel;
    this.fallbackModels = [...new Set(ModelConfig.fallbackModels)].filter(Boolean);
    this.client = null;
  }

  async initialize() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new AIError(503, 'AI service API key is not configured');
    }
    const isOpenRouter = !!process.env.OPENROUTER_API_KEY || this.apiKey.startsWith('sk-or-');
    const baseURL = isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined;
    const referer = process.env.OPENROUTER_REFERER || process.env.CLIENT_URL || 'http://localhost:3000';
    if (process.env.NODE_ENV === 'production' && referer.includes('localhost')) {
      console.warn('[OpenRouterProvider] WARNING: HTTP-Referer is set to a localhost URL in production. Set OPENROUTER_REFERER or CLIENT_URL to your production frontend domain.');
    }

    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL,
      defaultHeaders: isOpenRouter ? {
        "HTTP-Referer": referer,
        "X-Title": "Hire-X"
      } : undefined
    });
  }

  async generate(prompt, temperature = 0.2, maxTokens = 1500, timeoutMs = 12000, abortSignal = null, attempt = 0) {
    if (!this.client) {
      await this.initialize();
    }

    let lastError = null;
    let adjustedPrompt = prompt;
    let adjustedTemperature = temperature;

    if (attempt > 0) {
      adjustedPrompt += "\n\nCRITICAL: Adhere STRICTLY to the requested JSON schema. Do not output conversational filler or preamble. Ensure all JSON brackets, commas, quotes, and keys are properly closed and formatted.";
      adjustedTemperature = Math.min(1.0, temperature + (attempt * 0.15));
    }

    for (const currentModel of this.fallbackModels) {
      try {
        console.log(`[OpenRouterProvider] Requesting: ${currentModel} | Temp: ${adjustedTemperature} | Timeout: ${timeoutMs}ms | Attempt: ${attempt}`);
        const completion = await this.client.chat.completions.create({
          model: currentModel,
          messages: [{ role: 'user', content: adjustedPrompt }],
          temperature: adjustedTemperature,
          max_tokens: maxTokens,
          top_p: ModelConfig.defaultParams.topP,
          stop: ModelConfig.defaultParams.stopSequences.length > 0 ? ModelConfig.defaultParams.stopSequences : undefined
        }, {
          timeout: timeoutMs,
          signal: abortSignal || undefined
        });

        const response = completion.choices?.[0]?.message?.content;
        if (response) {
          console.log(`[OpenRouterProvider] Generation successful with model: ${currentModel}`);
          return response;
        }
        throw new Error('Empty response returned by model');
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('[OpenRouterProvider] Generation aborted by client signal.');
          throw error;
        }
        console.warn(`[OpenRouterProvider] Model ${currentModel} failed: ${error.message}`);
        
        const status = error.status || error.statusCode || getHttpStatus(error);
        lastError = new AIError(status, error.message, error);
      }
    }

    throw lastError || new AIError(502, 'OpenRouter invocation failed');
  }

  async healthCheck() {
    try {
      if (!this.apiKey) return false;
      await this.initialize();
      // Execute a lightweight model list fetch to verify credentials & connectivity
      await this.client.models.list();
      return true;
    } catch (err) {
      console.warn('[OpenRouterProvider] Health check failed: ', err.message);
      return false;
    }
  }

  async estimateTokens(prompt) {
    if (typeof prompt !== 'string') return 0;
    return Math.ceil(prompt.length / 4);
  }

  async stream(prompt, callback, abortSignal = null) {
    if (!this.client) {
      await this.initialize();
    }

    let lastError = null;

    for (const currentModel of this.fallbackModels) {
      try {
        console.log(`[OpenRouterProvider] Streaming request: ${currentModel}`);
        const responseStream = await this.client.chat.completions.create({
          model: currentModel,
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        }, {
          timeout: ModelConfig.timeouts.default,
          signal: abortSignal || undefined
        });

        for await (const chunk of responseStream) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          callback(content);
        }
        console.log(`[OpenRouterProvider] Streaming successful with model: ${currentModel}`);
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('[OpenRouterProvider] Streaming aborted by client signal.');
          throw error;
        }
        console.warn(`[OpenRouterProvider] Streaming with model ${currentModel} failed: ${error.message}`);
        const status = error.status || error.statusCode || getHttpStatus(error);
        lastError = new AIError(status, `Streaming interrupted: ${error.message}`, error);
      }
    }

    throw lastError || new AIError(502, 'OpenRouter streaming invocation failed');
  }
}

// Helper to determine HTTP Status codes from standard API Errors
function getHttpStatus(error) {
  if (error.message?.includes('401') || error.message?.toLowerCase().includes('unauthorized')) return 401;
  if (error.message?.includes('403') || error.message?.toLowerCase().includes('forbidden')) return 403;
  if (error.message?.includes('404')) return 404;
  if (error.message?.includes('408') || error.message?.toLowerCase().includes('timeout') || error.name === 'APITimeoutError') return 408;
  if (error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit')) return 429;
  if (error.message?.match(/5[0-9]{2}/)) return 502;
  return 500;
}

module.exports = OpenRouterProvider;
