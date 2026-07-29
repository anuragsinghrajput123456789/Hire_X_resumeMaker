const asyncHandler = require('express-async-handler');
const ResumeService = require('./resume.service');

const saveResume = asyncHandler(async (req, res) => {
  const resume = await ResumeService.saveResume(req.user._id, req.body);
  res.status(200).json({
    success: true,
    data: resume
  });
});

const getResumes = asyncHandler(async (req, res) => {
  const resumes = await ResumeService.getResumes(req.user._id);
  res.status(200).json({
    success: true,
    count: resumes.length,
    data: resumes
  });
});

const deleteResume = asyncHandler(async (req, res) => {
  await ResumeService.deleteResume(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'Resume deleted'
  });
});

module.exports = {
  saveResume,
  getResumes,
  deleteResume
};
