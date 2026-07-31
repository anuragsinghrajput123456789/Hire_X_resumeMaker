const mongoose = require('mongoose');

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      index: true
    },
    tier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    features: {
      resumeOptimization: { type: Number, default: 0 },
      atsAnalysis: { type: Number, default: 0 },
      atsRealTime: { type: Number, default: 0 },
      coverLetter: { type: Number, default: 0 },
      coldEmail: { type: Number, default: 0 },
      chat: { type: Number, default: 0 },
      interviewQuestion: { type: Number, default: 0 },
      interviewRoadmap: { type: Number, default: 0 },
      interviewStudyPlan: { type: Number, default: 0 },
      careerIntelligence: { type: Number, default: 0 },
      jobDescriptionAnalysis: { type: Number, default: 0 },
      jobSuggestions: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for O(1) daily user lookups
aiUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

const AIUsage = mongoose.model('AIUsage', aiUsageSchema);

module.exports = AIUsage;
