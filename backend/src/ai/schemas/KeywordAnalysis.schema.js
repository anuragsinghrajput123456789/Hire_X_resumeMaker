/**
 * Validation schema and defaults for real-time keyword analysis.
 */

const defaults = {
  keywordMatchScore: 0,
  foundKeywords: [],
  missingKeywords: [],
  readabilityScore: 0,
  structureAnalysis: {
    "Contact Information": false,
    "Professional Summary": false,
    "Work Experience": false,
    "Education": false,
    "Skills": false,
    "Projects": false
  },
  formattingIssues: []
};

const validate = (data) => {
  const errors = [];
  const validated = {
    ...defaults,
    structureAnalysis: { ...defaults.structureAnalysis }
  };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  // keywordMatchScore and readabilityScore
  validated.keywordMatchScore = typeof data.keywordMatchScore === 'number' ? data.keywordMatchScore : parseInt(data.keywordMatchScore, 10) || 0;
  validated.readabilityScore = typeof data.readabilityScore === 'number' ? data.readabilityScore : parseInt(data.readabilityScore, 10) || 0;

  // arrays
  const arrayKeys = ['foundKeywords', 'missingKeywords', 'formattingIssues'];
  for (const key of arrayKeys) {
    validated[key] = Array.isArray(data[key]) ? data[key].map(item => String(item).trim()).filter(Boolean) : [];
  }

  // structureAnalysis flags
  if (data.structureAnalysis && typeof data.structureAnalysis === 'object') {
    const structureKeys = ["Contact Information", "Professional Summary", "Work Experience", "Education", "Skills", "Projects"];
    for (const key of structureKeys) {
      validated.structureAnalysis[key] = !!data.structureAnalysis[key];
    }
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
