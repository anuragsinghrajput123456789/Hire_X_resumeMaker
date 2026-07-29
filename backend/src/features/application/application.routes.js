const express = require('express');
const router = express.Router();
const { 
  getApplications, 
  saveApplication, 
  updateApplication, 
  deleteApplication 
} = require('./application.controller');
const { protect } = require('../../../middleware/authMiddleware');

router.get('/', protect, getApplications);
router.post('/save', protect, saveApplication);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
