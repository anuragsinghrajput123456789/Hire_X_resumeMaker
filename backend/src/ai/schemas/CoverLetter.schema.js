/**
 * Validation schema and defaults for Cover Letter generation.
 */

const defaults = {
  company: '',
  jobTitle: '',
  opening: '',
  experience: '',
  skills: '',
  closing: '',
  coverLetter: '',
  missingSkills: [],
  recommendedChanges: []
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  // strings
  const stringKeys = ['company', 'jobTitle', 'opening', 'experience', 'skills', 'closing', 'coverLetter'];
  for (const key of stringKeys) {
    validated[key] = typeof data[key] === 'string' ? data[key].trim() : '';
  }

  // arrays of strings
  const arrayKeys = ['missingSkills', 'recommendedChanges'];
  for (const key of arrayKeys) {
    validated[key] = Array.isArray(data[key]) ? data[key].map(item => String(item).trim()).filter(Boolean) : [];
  }

  if (!validated.coverLetter) {
    errors.push('coverLetter body is missing or empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: validated
  };
};

module.exports = {
  validate,
  defaults
};
