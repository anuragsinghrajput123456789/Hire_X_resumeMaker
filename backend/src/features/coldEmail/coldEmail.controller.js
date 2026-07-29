const asyncHandler = require('express-async-handler');
const ColdEmailService = require('./coldEmail.service');

const saveColdEmail = asyncHandler(async (req, res) => {
  const savedEmail = await ColdEmailService.saveColdEmail(req.user.id, req.body);
  res.status(201).json(savedEmail);
});

const getHistory = asyncHandler(async (req, res) => {
  const emails = await ColdEmailService.getHistory(req.user.id);
  res.json(emails);
});

const deleteColdEmail = asyncHandler(async (req, res) => {
  await ColdEmailService.deleteColdEmail(req.user.id, req.params.id);
  res.json({ message: 'Email removed' });
});

module.exports = {
  saveColdEmail,
  getHistory,
  deleteColdEmail,
};
