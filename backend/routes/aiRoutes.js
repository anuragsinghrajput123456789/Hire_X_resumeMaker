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
    generateContent
} = require('../controllers/aiController');

const { protect } = require('../middleware/authMiddleware');

router.get('/test', (req, res) => {
    res.json({ message: 'AI Routes are working', time: new Date().toISOString() });
});

router.post('/chat', protect, chat);
router.post('/cold-email', protect, coldEmail);
router.post('/analyze-resume-realtime', protect, analyzeResumeRealTime);
router.post('/analyze-resume', protect, analyzeResume);
router.post('/analyze-job', protect, analyzeJobDescription);
router.post('/job-suggestions', protect, jobSuggestions);
router.post('/generate-resume', protect, generateResume);
router.post('/generate-content', protect, generateContent);


module.exports = router;
