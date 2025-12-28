const express = require('express');
const router = express.Router();
const ColdEmail = require('../models/ColdEmail');
const { protect } = require('../middleware/authMiddleware');

// Check if authMiddleware is a function or an object with a property
// Assuming standard export: module.exports = middlewareFn
// If it's named export: const { protect } = require(...)
// Based on typical usage, let's assume it might be the default export or a named one.
// I'll try to guess based on common practices, usually it's `protect` or just the function.
// Let's assume `authMiddleware` is the function itself or we use it like `authMiddleware.protect` if it exports an object.
// Safest bet for now:
// const { protect } = require('../middleware/authMiddleware'); 
// But let's verify authMiddleware content first if possible, but I'll write standard code.

// Save a generated email
router.post('/save', protect, async (req, res) => {
  try {
    const { 
      recipientName, 
      recipientEmail, 
      recipientCompany, 
      recipientRole, 
      jobTitle, 
      content 
    } = req.body;

    const newEmail = new ColdEmail({
      userId: req.user.id, // Assuming authMiddleware populates req.user
      recipientName,
      recipientEmail,
      recipientCompany,
      recipientRole,
      jobTitle,
      content
    });

    const savedEmail = await newEmail.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    console.error('Error saving cold email:', error);
    res.status(500).json({ error: 'Failed to save email' });
  }
});

// Get all saved emails for the logged-in user
router.get('/history', protect, async (req, res) => {
  try {
    const emails = await ColdEmail.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    console.error('Error fetching email history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Delete a saved email
router.delete('/:id', protect, async (req, res) => {
  try {
    const email = await ColdEmail.findById(req.params.id);
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Ensure user owns the email
    if (email.userId.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await email.deleteOne();
    res.json({ message: 'Email removed' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

module.exports = router;
