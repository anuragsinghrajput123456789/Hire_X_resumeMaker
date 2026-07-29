const express = require('express');
const router = express.Router();
const { saveColdEmail, getHistory, deleteColdEmail } = require('./coldEmail.controller');
const { protect } = require('../../../middleware/authMiddleware');

router.post('/save', protect, saveColdEmail);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteColdEmail);

module.exports = router;
