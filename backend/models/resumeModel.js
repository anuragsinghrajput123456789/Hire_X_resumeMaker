const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  templateId: {
    type: String,
    enum: ['modern', 'classic', 'creative', 'professional'],
    default: 'modern'
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  linkedin: String,
  github: String,
  portfolio: String,
  jobRole: String,
  summary: String,
  skills: [String],
  experience: [{
    company: String,
    role: String,
    duration: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    year: String,
    gpa: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: String
  }],
  certifications: [String],
  languages: [String],
  achievements: [String],
  customSections: [{
    id: String,
    title: String,
    content: String
  }],
  fontSizeAdjustment: { type: Number, default: 0 },
  lineHeightAdjustment: { type: String, default: 'normal' },
  spacingAdjustment: { type: String, default: 'normal' },
  targetPages: { type: String, default: 'auto' },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
