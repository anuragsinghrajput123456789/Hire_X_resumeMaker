const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const { protect } = require('../middleware/authMiddleware');

// Get all applications for the user
router.get('/', protect, async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user.id }).sort({ dateApplied: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Add a new application
router.post('/save', protect, async (req, res) => {
  try {
    const { company, role, status, salary, jobLink, notes, dateApplied } = req.body;
    
    const newApplication = new JobApplication({
      userId: req.user.id,
      company,
      role,
      status,
      salary,
      jobLink,
      notes,
      dateApplied: dateApplied || Date.now()
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error saving application', error: error.message });
  }
});

// Update an application
router.put('/:id', protect, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
});

// Delete an application
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await application.deleteOne();
    res.json({ message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
});

module.exports = router;
