const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    index: true
  },
  company: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    default: 'Professional'
  },
  length: {
    type: String,
    default: 'Medium'
  },
  experienceLevel: {
    type: String,
    default: 'Mid-Level'
  },
  coverLetterText: {
    type: String,
    required: true
  },
  structuredData: {
    company: String,
    jobTitle: String,
    opening: String,
    experience: String,
    skills: String,
    closing: String,
    coverLetter: String,
    missingSkills: [String],
    recommendedChanges: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
