const Resume = require('../../../models/resumeModel');

class ResumeService {
  static async saveResume(userId, resumeData) {
    if (!resumeData.fullName?.trim() || !resumeData.email?.trim()) {
      const error = new Error('Full name and email are required');
      error.statusCode = 400;
      throw error;
    }

    let resume;
    if (resumeData._id) {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeData._id, userId },
        { ...resumeData, userId, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!resume) {
        const error = new Error('Resume not found');
        error.statusCode = 404;
        throw error;
      }
    } else {
      resume = await Resume.create({
        ...resumeData,
        userId
      });
    }

    return resume;
  }

  static async getResumes(userId) {
    return await Resume.find({ userId }).sort({ updatedAt: -1 });
  }

  static async deleteResume(userId, id) {
    const resume = await Resume.findOneAndDelete({ _id: id, userId });
    if (!resume) {
      const error = new Error('Resume not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  }
}

module.exports = ResumeService;
