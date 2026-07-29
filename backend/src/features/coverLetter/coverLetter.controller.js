const asyncHandler = require('express-async-handler');
const CoverLetterService = require('./coverLetter.service');

const saveCoverLetter = asyncHandler(async (req, res) => {
  const savedLetter = await CoverLetterService.saveCoverLetter(req.user._id, req.body);
  res.status(201).json(savedLetter);
});

const getHistory = asyncHandler(async (req, res) => {
  const letters = await CoverLetterService.getHistory(req.user._id);
  res.json(letters);
});

const deleteCoverLetter = asyncHandler(async (req, res) => {
  await CoverLetterService.deleteCoverLetter(req.user._id, req.params.id);
  res.json({ message: 'Cover letter removed' });
});

module.exports = {
  saveCoverLetter,
  getHistory,
  deleteCoverLetter,
};
