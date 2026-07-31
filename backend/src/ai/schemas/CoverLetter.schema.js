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
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: true, errors: [], data: validated };
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
    if (typeof data.body === 'string' && data.body.trim()) {
      validated.coverLetter = data.body.trim();
    } else {
      validated.coverLetter = [validated.opening, validated.experience, validated.skills, validated.closing]
        .filter(Boolean)
        .join('\n\n') || 'Thank you for considering my application.';
    }
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
