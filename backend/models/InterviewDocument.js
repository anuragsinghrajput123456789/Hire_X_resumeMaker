const mongoose = require('mongoose');

const interviewDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      default: 'General Notes'
    },
    tags: [
      {
        type: String
      }
    ],
    isFavorite: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('InterviewDocument', interviewDocumentSchema);
