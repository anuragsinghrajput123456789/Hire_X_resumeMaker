const DocumentChunk = require('../../models/DocumentChunk');
const mongoose = require('mongoose');
const EmbeddingService = require('./EmbeddingService');

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

class RAGRetriever {
  async retrieve({ userId, queryText, limit = 5, category = null }) {
    const queryEmbedding = await EmbeddingService.generateEmbedding(queryText);
    
    let results = [];
    
    // Try MongoDB Atlas Vector Search first
    try {
      const filter = { userId: new mongoose.Types.ObjectId(userId) };
      if (category) {
        filter.category = category;
      }
      
      results = await DocumentChunk.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: limit,
            filter: filter
          }
        }
      ]);
      
      if (results && results.length > 0) {
        console.log(`[RAGRetriever] Atlas Vector Search retrieved ${results.length} chunks`);
        return results;
      }
    } catch (error) {
      console.log('[RAGRetriever] Atlas Vector Search aggregator failed or unsupported. Falling back to local cosine-similarity retrieval: ', error.message);
    }
    
    // Fallback: Fetch chunks and calculate cosine similarity in JS memory
    try {
      const chunks = await DocumentChunk.find({ userId: userId }).populate('documentId');
      
      const chunksWithScore = chunks
        .map(chunk => {
          if (!chunk.embedding || chunk.embedding.length === 0) return null;
          
          // Filter by category if specified
          if (category && chunk.documentId && chunk.documentId.category !== category) {
            return null;
          }
          
          const score = cosineSimilarity(queryEmbedding, chunk.embedding);
          return {
            ...chunk.toObject(),
            score
          };
        })
        .filter(Boolean);
      
      // Sort descending by score
      chunksWithScore.sort((a, b) => b.score - a.score);
      
      results = chunksWithScore.slice(0, limit);
      console.log(`[RAGRetriever] Local JS similarity search retrieved ${results.length} chunks`);
      return results;
    } catch (error) {
      console.error('[RAGRetriever] Fallback retrieval error: ', error);
      return [];
    }
  }
}

module.exports = new RAGRetriever();
