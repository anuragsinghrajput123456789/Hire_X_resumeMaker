const asyncHandler = require('express-async-handler');
const ApplicationService = require('./application.service');

const getApplications = asyncHandler(async (req, res) => {
  const applications = await ApplicationService.getApplications(req.user.id);
  res.json(applications);
});

const saveApplication = asyncHandler(async (req, res) => {
  const savedApplication = await ApplicationService.saveApplication(req.user.id, req.body);
  res.status(201).json(savedApplication);
});

const updateApplication = asyncHandler(async (req, res) => {
  const updatedApplication = await ApplicationService.updateApplication(req.user.id, req.params.id, req.body);
  res.json(updatedApplication);
});

const deleteApplication = asyncHandler(async (req, res) => {
  await ApplicationService.deleteApplication(req.user.id, req.params.id);
  res.json({ message: 'Application removed' });
});

module.exports = {
  getApplications,
  saveApplication,
  updateApplication,
  deleteApplication
};
