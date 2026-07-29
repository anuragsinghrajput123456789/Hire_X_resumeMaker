const CoverLetter = require('../../../models/CoverLetter');

class CoverLetterService {
  static async saveCoverLetter(userId, letterData) {
    const { 
      company, 
      jobTitle, 
      jobDescription, 
      tone, 
      length, 
      experienceLevel, 
      coverLetterText,
      structuredData,
      resumeId
    } = letterData;

    if (!company || !jobTitle || !jobDescription || !coverLetterText) {
      const error = new Error('Company, job title, job description, and cover letter text are required');
      error.statusCode = 400;
      throw error;
    }

    const newLetter = new CoverLetter({
      userId,
      resumeId: resumeId || undefined,
      company,
      jobTitle,
      jobDescription,
      tone: tone || 'Professional',
      length: length || 'Medium',
      experienceLevel: experienceLevel || 'Mid-Level',
      coverLetterText,
      structuredData
    });

    return await newLetter.save();
  }

  static async getHistory(userId) {
    return await CoverLetter.find({ userId }).sort({ createdAt: -1 });
  }

  static async deleteCoverLetter(userId, id) {
    const letter = await CoverLetter.findById(id);

    if (!letter) {
      const error = new Error('Cover letter not found');
      error.statusCode = 404;
      throw error;
    }

    if (letter.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }

    await letter.deleteOne();
    return true;
  }
}

module.exports = CoverLetterService;
