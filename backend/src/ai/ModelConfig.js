/**
 * Centralized model parameter configuration for LLMs.
 */
module.exports = {
  primaryModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
  fallbackModels: [
    process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
    'meta-llama/llama-3.3-70b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free'
  ],
  defaultParams: {
    temperature: 0.2,
    topP: 0.9,
    topK: 0,
    maxTokens: 2000,
    stopSequences: []
  },
  timeouts: {
    default: 15000,
    resumeOptimization: 45000,
    atsRealTime: 10000,
    atsAnalysis: 20000,
    jobDescriptionAnalysis: 25000,
    chat: 12000,
    coldEmail: 15000,
    jobSuggestions: 15000,
    coverLetter: 30000,
    interviewRoadmap: 30000,
    interviewQuestion: 15000,
    interviewFeedback: 40000,
    interviewStudyPlan: 30000,
    careerIntelligence: 30000,
    interviewEvaluation: 15000
  }
};
