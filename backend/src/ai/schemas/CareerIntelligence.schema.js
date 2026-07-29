const defaults = {
  hiringProbability: 'N/A',
  skillGapAnalysis: [],
  recommendedCertifications: [],
  suggestedProjects: [],
  salaryRange: {
    min: 'N/A',
    max: 'N/A',
    average: 'N/A',
    currency: 'USD'
  },
  careerGrowthAdvice: ''
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  validated.hiringProbability = typeof data.hiringProbability === 'string' ? data.hiringProbability.trim() : defaults.hiringProbability;
  validated.recommendedCertifications = Array.isArray(data.recommendedCertifications) ? data.recommendedCertifications.map(String).filter(Boolean) : [];
  validated.suggestedProjects = Array.isArray(data.suggestedProjects) ? data.suggestedProjects.map(String).filter(Boolean) : [];
  validated.careerGrowthAdvice = typeof data.careerGrowthAdvice === 'string' ? data.careerGrowthAdvice.trim() : '';

  if (data.salaryRange && typeof data.salaryRange === 'object') {
    validated.salaryRange = {
      min: typeof data.salaryRange.min === 'string' ? data.salaryRange.min.trim() : defaults.salaryRange.min,
      max: typeof data.salaryRange.max === 'string' ? data.salaryRange.max.trim() : defaults.salaryRange.max,
      average: typeof data.salaryRange.average === 'string' ? data.salaryRange.average.trim() : defaults.salaryRange.average,
      currency: typeof data.salaryRange.currency === 'string' ? data.salaryRange.currency.trim() : defaults.salaryRange.currency
    };
  }

  if (Array.isArray(data.skillGapAnalysis)) {
    validated.skillGapAnalysis = data.skillGapAnalysis.map(item => {
      if (!item || typeof item !== 'object') return null;
      return {
        skill: typeof item.skill === 'string' ? item.skill.trim() : '',
        gapLevel: typeof item.gapLevel === 'string' ? item.gapLevel.trim() : 'Moderate',
        recommendation: typeof item.recommendation === 'string' ? item.recommendation.trim() : ''
      };
    }).filter(Boolean);
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
