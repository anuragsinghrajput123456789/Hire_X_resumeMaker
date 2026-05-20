const Resume = require('../models/resumeModel');
const asyncHandler = require('express-async-handler');

exports.saveResume = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const resumeData = req.body;

  if (!resumeData.fullName?.trim() || !resumeData.email?.trim()) {
    res.status(400);
    throw new Error('Full name and email are required');
  }

  let resume;
  if (resumeData._id) {
    resume = await Resume.findOneAndUpdate(
      { _id: resumeData._id, userId: _id },
      { ...resumeData, userId: _id, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }
  } else {
    resume = await Resume.create({
      ...resumeData,
      userId: _id
    });
  }

  res.status(200).json({
    success: true,
    data: resume
  });
});

exports.getResumes = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const resumes = await Resume.find({ userId: _id }).sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: resumes.length,
    data: resumes
  });
});

exports.deleteResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const resume = await Resume.findOneAndDelete({ _id: id, userId: _id });

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  res.status(200).json({
    success: true,
    message: 'Resume deleted'
  });
});
