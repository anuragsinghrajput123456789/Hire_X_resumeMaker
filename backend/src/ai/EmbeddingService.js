const { OpenAI } = require('openai');

class EmbeddingService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    this.client = null;
    this.model = 'text-embedding-3-small'; // Standard OpenAI embedding model
  }

  async initialize() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      this.model = 'text-embedding-3-small';
      return;
    }
    const isOpenRouter = this.apiKey.startsWith('sk-or-') || !!process.env.OPENROUTER_API_KEY;
    const baseURL = isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined;
    this.model = isOpenRouter ? 'openai/text-embedding-3-small' : 'text-embedding-3-small';
    const referer = process.env.OPENROUTER_REFERER || process.env.CLIENT_URL || 'http://localhost:3000';

    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL,
      defaultHeaders: isOpenRouter ? {
        "HTTP-Referer": referer,
        "X-Title": "Hire-X"
      } : undefined
    });
  }

  async generateEmbedding(text) {
    if (!text || typeof text !== 'string') {
      return this.generateLocalEmbedding('');
    }

    if (!this.client) {
      await this.initialize();
    }

    if (this.client) {
      try {
        const response = await this.client.embeddings.create({
          model: this.model,
          input: text.substring(0, 8000), // Protect token limit
        });
        
        if (response.data && response.data[0] && response.data[0].embedding) {
          return response.data[0].embedding;
        }
      } catch (error) {
        console.warn('[EmbeddingService] API Embedding failed, falling back to local: ', error.message);
      }
    }

    return this.generateLocalEmbedding(text);
  }

  generateLocalEmbedding(text) {
    const size = 1536;
    const embedding = new Array(size).fill(0);
    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Generate a simple frequency-based vector
    for (let i = 0; i < cleanText.length; i++) {
      const code = cleanText.charCodeAt(i);
      const index = (code * (i + 1)) % size;
      embedding[index] = (embedding[index] + 1) / 10;
    }
    
    // L2 Normalize
    let norm = 0;
    for (let j = 0; j < size; j++) {
      norm += embedding[j] * embedding[j];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let j = 0; j < size; j++) {
        embedding[j] /= norm;
      }
    }
    return embedding;
  }
}

module.exports = new EmbeddingService();
