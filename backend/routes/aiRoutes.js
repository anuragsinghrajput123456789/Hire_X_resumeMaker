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

router.get('/test', (req, res) => {
    res.json({ message: 'AI Routes are working', time: new Date().toISOString() });
});

router.post('/chat', chat);
router.post('/cold-email', coldEmail);
router.post('/analyze-resume-realtime', analyzeResumeRealTime);
router.post('/analyze-resume', analyzeResume);
router.post('/analyze-job', analyzeJobDescription);
router.post('/job-suggestions', jobSuggestions);
router.post('/generate-resume', generateResume);
router.post('/generate-content', generateContent);

module.exports = router;
