const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const JobApplication = require('../models/JobApplication');
const { protect } = require('../middleware/authMiddleware');

// Get all applications for the user
router.get('/', protect, asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ userId: req.user.id }).sort({ dateApplied: -1 });
  res.json(applications);
}));

// Add a new application
router.post('/save', protect, asyncHandler(async (req, res) => {
  const { company, role, status, salary, jobLink, notes, dateApplied } = req.body;

  if (!company?.trim() || !role?.trim()) {
    res.status(400);
    throw new Error('Company and role are required');
  }

  const savedApplication = await JobApplication.create({
    userId: req.user.id,
    company,
    role,
    status,
    salary,
    jobLink,
    notes,
    dateApplied: dateApplied || Date.now()
  });

  res.status(201).json(savedApplication);
}));

// Update an application
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedApplication = await JobApplication.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedApplication);
}));

// Delete an application
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await application.deleteOne();
  res.json({ message: 'Application removed' });
}));

module.exports = router;
