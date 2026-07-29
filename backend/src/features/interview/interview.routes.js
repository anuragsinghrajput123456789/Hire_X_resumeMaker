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

router.post('/documents/upload', protect, uploadDocument);
router.get('/documents', protect, getDocuments);
router.put('/documents/:id', protect, updateDocument);
router.delete('/documents/:id', protect, deleteDocument);

router.post('/session/start', protect, startSession);
router.post('/session/answer', protect, submitAnswer);
router.post('/session/finalize', protect, finalizeSession);

module.exports = router;
