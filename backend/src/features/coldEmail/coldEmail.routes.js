const express = require('express');
const router = express.Router();
const { saveColdEmail, getHistory, deleteColdEmail } = require('./coldEmail.controller');
const { protect } = require('../../../middleware/authMiddleware');
const { sanitizeInput } = require('../../../middleware/sanitizerMiddleware');

router.post('/save', protect, sanitizeInput, saveColdEmail);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteColdEmail);

module.exports = router;
