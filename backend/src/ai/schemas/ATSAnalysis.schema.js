/**
 * Validation schema and defaults for general ATS scan analysis.
 */

const defaults = {
  atsScore: 0,
  missingKeywords: [],
  formatSuggestions: [],
  improvements: [],
  matchingJobRoles: []
};

const validate = (data) => {
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: true, errors: [], data: validated };
  }

  // atsScore
  validated.atsScore = typeof data.atsScore === 'number' ? data.atsScore : parseInt(data.atsScore, 10) || 0;
  validated.atsScore = Math.max(0, Math.min(100, validated.atsScore));

  // arrays of strings
  const arrayKeys = ['missingKeywords', 'formatSuggestions', 'improvements', 'matchingJobRoles'];
  for (const key of arrayKeys) {
    validated[key] = Array.isArray(data[key]) ? data[key].map(item => String(item).trim()).filter(Boolean) : [];
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
