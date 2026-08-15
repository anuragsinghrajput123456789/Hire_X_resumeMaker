const AIProvider = require('../AIProvider');
const { OpenAI } = require('openai');

class GeminiProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.fallbackModels = [
      process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
      'gemini-3.6-flash'
    ];
    this.client = null;
  }

  async initialize() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('Gemini API Key is missing or invalid');
    }
    
    const isOpenRouter = this.apiKey.startsWith('sk-or-');
    const baseURL = isOpenRouter ? 'https://openrouter.ai/api/v1' : 'https://generativelanguage.googleapis.com/v1beta/openai';

    if (isOpenRouter) {
      this.fallbackModels = [
        'google/gemini-2.0-flash-001',
        'google/gemini-flash-1.5'
      ];
    } else {
      this.fallbackModels = [
        process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-flash-lite-latest',
        'gemini-3.5-flash',
        'gemini-3.6-flash'
      ];
    }

    const referer = process.env.CLIENT_URL || 'http://localhost:3000';
    if (process.env.NODE_ENV === 'production' && referer.includes('localhost')) {
      console.warn('[GeminiProvider] WARNING: HTTP-Referer is set to a localhost URL in production. Set CLIENT_URL to your production frontend domain.');
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

  async generate(prompt, temperature = 0.2, maxTokens = 1500, timeoutMs = 15000, abortSignal = null, attempt = 0) {
    if (!this.client) {
      await this.initialize();
    }

    let adjustedPrompt = prompt;
    let adjustedTemperature = temperature;

    if (attempt > 0) {
      adjustedPrompt += "\n\nCRITICAL: Adhere STRICTLY to the requested JSON schema. Do not output conversational filler or preamble. Ensure all JSON brackets, commas, quotes, and keys are properly closed and formatted.";
      adjustedTemperature = Math.min(1.0, temperature + (attempt * 0.15));
    }

    let lastError = null;
    for (const currentModel of this.fallbackModels) {
      try {
        console.log(`[GeminiProvider] Attempting generation with model: ${currentModel} | Temp: ${adjustedTemperature} | Attempt: ${attempt}`);
        const completion = await this.client.chat.completions.create({
          model: currentModel,
          messages: [{ role: 'user', content: adjustedPrompt }],
          temperature: adjustedTemperature,
          max_tokens: maxTokens,
        }, {
          timeout: timeoutMs,
          signal: abortSignal || undefined
        });

        const response = completion.choices?.[0]?.message?.content;
        if (response) {
          console.log(`[GeminiProvider] Generation successful with model: ${currentModel}`);
          return response;
        }
        throw new Error('Empty response returned by Gemini model');
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('[GeminiProvider] Generation aborted by client signal.');
          throw error;
        }
        console.warn(`[GeminiProvider] Model ${currentModel} failed: ${error.message}`);
        lastError = error;
      }
    }

    throw lastError || new Error('All Gemini model fallbacks failed');
  }

  async healthCheck() {
    try {
      if (!this.apiKey) return false;
      await this.initialize();
      const testRes = await this.generate('Hello', 0.1, 10, 5000);
      return Boolean(testRes);
    } catch (err) {
      console.warn('[GeminiProvider] Health check failed:', err.message);
      return false;
    }
  }

  async stream(prompt, callback, abortSignal = null) {
    if (!this.client) {
      await this.initialize();
    }

    let lastError = null;
    for (const currentModel of this.fallbackModels) {
      try {
        console.log(`[GeminiProvider] Streaming request with model: ${currentModel}`);
        const responseStream = await this.client.chat.completions.create({
          model: currentModel,
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        }, {
          signal: abortSignal || undefined
        });

        for await (const chunk of responseStream) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          callback(content);
        }
        console.log(`[GeminiProvider] Streaming successful with model: ${currentModel}`);
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('[GeminiProvider] Streaming aborted by client signal.');
          throw error;
        }
        console.warn(`[GeminiProvider] Streaming with model ${currentModel} failed: ${error.message}`);
        lastError = error;
      }
    }

    throw lastError || new Error('All Gemini streaming fallbacks failed');
  }
}

module.exports = GeminiProvider;
