const JobApplication = require('../../../models/JobApplication');

class ApplicationService {
  static async getApplications(userId) {
    return await JobApplication.find({ userId }).sort({ dateApplied: -1 });
  }

  static async saveApplication(userId, applicationData) {
    const { company, role, status, salary, jobLink, notes, dateApplied } = applicationData;

    if (!company?.trim() || !role?.trim()) {
      const error = new Error('Company and role are required');
      error.statusCode = 400;
      throw error;
    }

    return await JobApplication.create({
      userId,
      company: company.trim(),
      role: role.trim(),
      status,
      salary,
      jobLink,
      notes,
      dateApplied: dateApplied || Date.now()
    });
  }

  static async updateApplication(userId, id, updateData) {
    const application = await JobApplication.findById(id);

    if (!application) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    if (application.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }

    return await JobApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  static async deleteApplication(userId, id) {
    const application = await JobApplication.findById(id);

    if (!application) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    if (application.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }

    await application.deleteOne();
    return true;
  }
}

module.exports = ApplicationService;
