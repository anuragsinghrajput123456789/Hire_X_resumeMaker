/**
 * Validation schema and defaults for Job Description comparison matching.
 */

const defaults = {
  requiredKeywords: [],
  missingFromResume: [],
  recommendedSkills: [],
  keywordInsertions: []
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  // arrays
  const arrayKeys = ['requiredKeywords', 'missingFromResume', 'recommendedSkills'];
  for (const key of arrayKeys) {
    validated[key] = Array.isArray(data[key]) ? data[key].map(item => String(item).trim()).filter(Boolean) : [];
  }

  // keywordInsertions
  if (Array.isArray(data.keywordInsertions)) {
    validated.keywordInsertions = data.keywordInsertions.map(ki => ({
      keyword: typeof ki.keyword === 'string' ? ki.keyword.trim() : '',
      suggestion: typeof ki.suggestion === 'string' ? ki.suggestion.trim() : '',
      section: typeof ki.section === 'string' ? ki.section.trim() : ''
    }));
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
