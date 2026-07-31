/**
 * Validation schema and defaults for Resume Optimization.
 */

const defaults = {
  fullName: 'Applicant',
  email: 'applicant@example.com',
  phone: '',
  linkedin: '',
  github: '',
  portfolio: '',
  jobRole: 'Software Engineer',
  summary: '',
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
  education: [],
  experience: [],
  projects: []
};

const validate = (data) => {
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: true, errors: [], data: validated };
  }

  // Populate strings
  const stringKeys = ['fullName', 'email', 'phone', 'linkedin', 'github', 'portfolio', 'jobRole', 'summary'];
  for (const key of stringKeys) {
    validated[key] = typeof data[key] === 'string' ? data[key].trim() : '';
  }

  if (!validated.fullName) {
    validated.fullName = data.name || 'Applicant';
  }
  if (!validated.email) {
    validated.email = 'applicant@example.com';
  }

  // Populate basic arrays
  const arrayKeys = ['skills', 'certifications', 'languages', 'achievements'];
  for (const key of arrayKeys) {
    validated[key] = Array.isArray(data[key]) ? data[key].map(item => String(item).trim()).filter(Boolean) : [];
  }

  // Populate education sub-objects
  if (Array.isArray(data.education)) {
    validated.education = data.education.map(edu => ({
      degree: typeof edu.degree === 'string' ? edu.degree.trim() : '',
      institution: typeof edu.institution === 'string' ? edu.institution.trim() : '',
      year: typeof edu.year === 'string' ? edu.year.trim() : '',
      gpa: typeof edu.gpa === 'string' ? edu.gpa.trim() : ''
    }));
  }

  // Populate experience sub-objects
  if (Array.isArray(data.experience)) {
    validated.experience = data.experience.map(exp => ({
      company: typeof exp.company === 'string' ? exp.company.trim() : '',
      role: typeof exp.role === 'string' ? exp.role.trim() : '',
      duration: typeof exp.duration === 'string' ? exp.duration.trim() : '',
      description: typeof exp.description === 'string' ? exp.description.trim() : ''
    }));
  }

  // Populate projects sub-objects
  if (Array.isArray(data.projects)) {
    validated.projects = data.projects.map(proj => ({
      name: typeof proj.name === 'string' ? proj.name.trim() : '',
      description: typeof proj.description === 'string' ? proj.description.trim() : '',
      technologies: typeof proj.technologies === 'string' ? proj.technologies.trim() : ''
    }));
  }

  return {
    isValid: true,
    errors: [],
    data: validated
  };
};

module.exports = {
  validate,
  defaults
};
