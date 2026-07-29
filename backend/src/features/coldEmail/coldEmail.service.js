const ColdEmail = require('../../../models/ColdEmail');

class ColdEmailService {
  static async saveColdEmail(userId, emailData) {
    const { 
      recipientName, 
      recipientEmail, 
      recipientCompany, 
      recipientRole, 
      jobTitle, 
      content 
    } = emailData;

    const newEmail = new ColdEmail({
      userId,
      recipientName,
      recipientEmail,
      recipientCompany,
      recipientRole,
      jobTitle,
      content
    });

    return await newEmail.save();
  }

  static async getHistory(userId) {
    return await ColdEmail.find({ userId }).sort({ createdAt: -1 });
  }

  static async deleteColdEmail(userId, id) {
    const email = await ColdEmail.findById(id);

    if (!email) {
      const error = new Error('Email not found');
      error.statusCode = 404;
      throw error;
    }

    if (email.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }

    await email.deleteOne();
    return true;
  }
}

module.exports = ColdEmailService;
