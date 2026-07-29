const express = require('express');
const router = express.Router();
const { saveCoverLetter, getHistory, deleteCoverLetter } = require('./coverLetter.controller');
const { protect } = require('../../../middleware/authMiddleware');

router.post('/save', protect, saveCoverLetter);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteCoverLetter);

module.exports = router;
