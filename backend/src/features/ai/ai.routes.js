const express = require('express');
const router = express.Router();
const { 
  chat, 
  coldEmail, 
  analyzeResumeRealTime, 
  analyzeResume, 
  analyzeJobDescription,
  jobSuggestions,
  generateResume,
  generateContent,
  generateCoverLetter,
  healthCheck,
  queueMetrics,
  cancelRequest,
  getUsage
} = require('./ai.controller');

const { protect, optionalProtect } = require('../../../middleware/authMiddleware');
const { 
  aiGlobalLimiter,
  interviewChatLimiter,
  resumeOptimizationLimiter,
  coverLetterLimiter,
  coldEmailLimiter
} = require('../../../middleware/rateLimiter');
const { botProtection } = require('../../../middleware/botProtection');
const { sanitizeInput } = require('../../../middleware/sanitizerMiddleware');

router.get('/test', (req, res) => {
  res.json({ message: 'AI Routes are working', time: new Date().toISOString() });
});

router.get('/health', healthCheck);
router.get('/metrics', protect, queueMetrics);
router.get('/usage', optionalProtect, getUsage);
router.post('/cancel', protect, cancelRequest);

// Granular AI Feature Rate Limiting & Abuse Protection
router.post('/chat', optionalProtect, interviewChatLimiter, botProtection, sanitizeInput, chat);
router.post('/cold-email', optionalProtect, coldEmailLimiter, botProtection, sanitizeInput, coldEmail);
router.post('/analyze-resume-realtime', optionalProtect, resumeOptimizationLimiter, botProtection, sanitizeInput, analyzeResumeRealTime);
router.post('/analyze-resume', optionalProtect, resumeOptimizationLimiter, botProtection, sanitizeInput, analyzeResume);
router.post('/analyze-job', optionalProtect, aiGlobalLimiter, botProtection, sanitizeInput, analyzeJobDescription);
router.post('/job-suggestions', optionalProtect, aiGlobalLimiter, botProtection, sanitizeInput, jobSuggestions);
router.post('/generate-resume', optionalProtect, resumeOptimizationLimiter, botProtection, sanitizeInput, generateResume);
router.post('/generate-content', optionalProtect, coldEmailLimiter, botProtection, sanitizeInput, generateContent);
router.post('/cover-letter', optionalProtect, coverLetterLimiter, botProtection, sanitizeInput, generateCoverLetter);

module.exports = router;
