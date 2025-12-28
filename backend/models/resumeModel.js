const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: String,
    enum: ['modern', 'classic', 'creative'],
    default: 'modern'
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  linkedin: String,
  github: String,
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
