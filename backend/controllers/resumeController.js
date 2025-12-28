const Resume = require('../models/resumeModel');

exports.saveResume = async (req, res) => {
  try {
    console.log('saveResume called');
    console.log('User:', req.user);
    const { _id } = req.user; // Assuming authMiddleware attaches user to req
    const resumeData = req.body;

    // Optional: Check if updating an existing resume or always creating new?
    // For simplicity, let's allow creating multiple versions. 
    // If an ID is provided in body, we could update.
    
    let resume;
    if (resumeData._id) {
       resume = await Resume.findOneAndUpdate(
        { _id: resumeData._id, userId: _id },
        { ...resumeData, updatedAt: Date.now() },
        { new: true }
      );
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
  } catch (error) {
    console.error('Save Resume Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resume'
    });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const { _id } = req.user;
    const resumes = await Resume.find({ userId: _id }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resumes'
    });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;

    const resume = await Resume.findOneAndDelete({ _id: id, userId: _id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted'
    });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume'
    });
  }
};
