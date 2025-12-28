const express = require('express');
const router = express.Router();
const { saveResume, getResumes, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveResume);
router.get('/', protect, getResumes);
router.delete('/:id', protect, deleteResume);

module.exports = router;
