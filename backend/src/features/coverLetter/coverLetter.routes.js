const express = require('express');
const router = express.Router();
const { saveCoverLetter, getHistory, deleteCoverLetter } = require('./coverLetter.controller');
const { protect } = require('../../../middleware/authMiddleware');
const { sanitizeInput } = require('../../../middleware/sanitizerMiddleware');

router.post('/save', protect, sanitizeInput, saveCoverLetter);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteCoverLetter);

module.exports = router;
