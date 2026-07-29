const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    jobDescription: {
      type: String,
      required: true
    },
    interviewType: {
      type: String,
      required: true,
      default: 'Technical'
    },
    difficulty: {
      type: String,
      required: true,
      default: 'Mid-Level'
    },
    company: {
      type: String,
      default: 'Target Company'
    },
    role: {
      type: String,
      default: 'Target Role'
    },
    status: {
      type: String,
      enum: ['setup', 'active', 'completed'],
      default: 'active'
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    chatHistory: [
      {
        question: {
          type: String,
          required: true
        },
        userAnswer: {
          type: String
        },
        score: {
          type: Number,
          default: 0
        },
        review: {
          type: String
        },
        modelAnswer: {
          type: String
        },
        category: {
          type: String
        },
        difficulty: {
          type: String
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    roadmap: {
      type: mongoose.Schema.Types.Mixed
    },
    feedback: {
      type: mongoose.Schema.Types.Mixed
    },
    studyPlan: {
      type: mongoose.Schema.Types.Mixed
    },
    careerIntelligence: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
