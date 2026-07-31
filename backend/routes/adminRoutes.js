const express = require('express');
const router = express.Router();
const { getAdminMetrics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/metrics', protect, adminOnly, getAdminMetrics);

module.exports = router;
