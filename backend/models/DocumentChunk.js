const mongoose = require('mongoose');

const documentChunkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewDocument',
      required: true,
      index: true
    },
    text: {
      type: String,
      required: true
    },
    embedding: {
      type: [Number],
      required: true
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    sectionHeader: {
      type: String,
      default: 'General'
    }
  },
  {
    timestamps: true
  }
);

// We can define a vector search index structure for Atlas Vector Search.
// MongoDB Mongoose doesn't natively provision vector indexes on creation via schema definition,
// but defining the path and structure makes it Atlas-compliant.
module.exports = mongoose.model('DocumentChunk', documentChunkSchema);
