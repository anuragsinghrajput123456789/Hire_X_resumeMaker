const express = require('express');
const router = express.Router();
const { saveResume, getResumes, deleteResume } = require('./resume.controller');
const { protect } = require('../../../middleware/authMiddleware');
const { sanitizeInput } = require('../../../middleware/sanitizerMiddleware');

router.post('/', protect, sanitizeInput, saveResume);
router.get('/', protect, getResumes);
router.delete('/:id', protect, deleteResume);

module.exports = router;
