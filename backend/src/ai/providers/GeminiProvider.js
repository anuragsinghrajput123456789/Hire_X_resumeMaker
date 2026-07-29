const AIProvider = require('../AIProvider');
const { OpenAI } = require('openai');

class GeminiProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'google/gemini-flash-1.5';
    this.client = null;
  }

  async initialize() {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is missing or invalid');
    }
    
    // In MERN apps, if GEMINI_API_KEY is not defined, we route Google Gemini requests through OpenRouter
    const isOpenRouter = this.apiKey.startsWith('sk-or-') || !process.env.GEMINI_API_KEY;
    const baseURL = isOpenRouter ? 'https://openrouter.ai/api/v1' : 'https://generativelanguage.googleapis.com/v1beta/openai';

    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL,
      defaultHeaders: isOpenRouter ? {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Hire-X"
      } : undefined
    });
  }

  async generate(prompt, temperature = 0.2, maxTokens = 1500, timeoutMs = 15000, abortSignal = null) {
    if (!this.client) {
      await this.initialize();
    }

    try {
      console.log(`[GeminiProvider] Attempting generation with model: ${this.model}`);
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      }, {
        timeout: timeoutMs,
        signal: abortSignal || undefined
      });

      const response = completion.choices?.[0]?.message?.content;
      if (response) {
        console.log(`[GeminiProvider] Generation successful with model: ${this.model}`);
        return response;
      }
      throw new Error('Empty response returned by Gemini model');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('[GeminiProvider] Generation aborted by client signal.');
      }
      console.error(`[GeminiProvider] Failed: ${error.message}`);
      throw error;
    }
  }

  async healthCheck() {
    try {
      if (!this.apiKey) return false;
      await this.initialize();
      return true;
    } catch {
      return false;
    }
  }

  async stream(prompt, callback, abortSignal = null) {
    if (!this.client) {
      await this.initialize();
    }
    const responseStream = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }, {
      signal: abortSignal || undefined
    });
    for await (const chunk of responseStream) {
      const content = chunk.choices?.[0]?.delta?.content || '';
      callback(content);
    }
  }
}

module.exports = GeminiProvider;
