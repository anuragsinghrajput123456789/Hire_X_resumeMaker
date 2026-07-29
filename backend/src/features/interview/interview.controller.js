const asyncHandler = require('express-async-handler');
const InterviewService = require('./interview.service');

const uploadDocument = asyncHandler(async (req, res) => {
  const result = await InterviewService.uploadDocument(req.user._id, req.body);
  res.status(201).json({
    success: true,
    data: result.doc,
    chunksCreated: result.chunksCreated
  });
});

const getDocuments = asyncHandler(async (req, res) => {
  const result = await InterviewService.getDocuments(req.user._id, req.query);
  res.status(200).json({
    success: true,
    type: result.type,
    data: result.data
  });
});

const updateDocument = asyncHandler(async (req, res) => {
  const doc = await InterviewService.updateDocument(req.user._id, req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: doc
  });
});

const deleteDocument = asyncHandler(async (req, res) => {
  await InterviewService.deleteDocument(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'Document and associated vector chunks removed'
  });
});

const startSession = asyncHandler(async (req, res) => {
  const sessionData = await InterviewService.startSession(req.user._id, req.body);
  res.status(200).json({
    success: true,
    ...sessionData
  });
});

const submitAnswer = asyncHandler(async (req, res) => {
  const evaluation = await InterviewService.submitAnswer(req.user._id, req.body);
  res.status(200).json({
    success: true,
    ...evaluation
  });
});

const finalizeSession = asyncHandler(async (req, res) => {
  const finalData = await InterviewService.finalizeSession(req.user._id, req.body);
  res.status(200).json({
    success: true,
    ...finalData
  });
});

module.exports = {
  uploadDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  startSession,
  submitAnswer,
  finalizeSession
};
