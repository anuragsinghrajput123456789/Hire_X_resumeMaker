const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  startSession,
  submitAnswer,
  finalizeSession
} = require('./interview.controller');
const { protect } = require('../../../middleware/authMiddleware');
const { interviewChatLimiter, aiGlobalLimiter } = require('../../../middleware/rateLimiter');
const { botProtection } = require('../../../middleware/botProtection');
const { sanitizeInput } = require('../../../middleware/sanitizerMiddleware');

router.post('/documents/upload', protect, botProtection, sanitizeInput, uploadDocument);
router.get('/documents', protect, getDocuments);
router.put('/documents/:id', protect, sanitizeInput, updateDocument);
router.delete('/documents/:id', protect, deleteDocument);

router.post('/session/start', protect, aiGlobalLimiter, botProtection, sanitizeInput, startSession);
router.post('/session/answer', protect, interviewChatLimiter, botProtection, sanitizeInput, submitAnswer);
router.post('/session/finalize', protect, aiGlobalLimiter, botProtection, sanitizeInput, finalizeSession);

module.exports = router;
