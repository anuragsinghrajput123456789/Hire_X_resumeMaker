const defaults = {
  missingSkills: [],
  recommendedTopics: [],
  leetcodeAreas: [],
  projectsToBuild: [],
  studyResources: [],
  estimatedPreparationTime: '2 weeks',
  weeklyPlan: []
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  validated.missingSkills = Array.isArray(data.missingSkills) ? data.missingSkills.map(String).filter(Boolean) : [];
  validated.recommendedTopics = Array.isArray(data.recommendedTopics) ? data.recommendedTopics.map(String).filter(Boolean) : [];
  validated.leetcodeAreas = Array.isArray(data.leetcodeAreas) ? data.leetcodeAreas.map(String).filter(Boolean) : [];
  validated.projectsToBuild = Array.isArray(data.projectsToBuild) ? data.projectsToBuild.map(String).filter(Boolean) : [];
  validated.estimatedPreparationTime = typeof data.estimatedPreparationTime === 'string' ? data.estimatedPreparationTime.trim() : defaults.estimatedPreparationTime;

  if (Array.isArray(data.studyResources)) {
    validated.studyResources = data.studyResources.map(item => {
      if (!item || typeof item !== 'object') return null;
      return {
        title: typeof item.title === 'string' ? item.title.trim() : '',
        urlOrType: typeof item.urlOrType === 'string' ? item.urlOrType.trim() : '',
        reason: typeof item.reason === 'string' ? item.reason.trim() : ''
      };
    }).filter(Boolean);
  }

  if (Array.isArray(data.weeklyPlan)) {
    validated.weeklyPlan = data.weeklyPlan.map(item => {
      if (!item || typeof item !== 'object') return null;
      return {
        week: typeof item.week === 'string' ? item.week.trim() : '',
        topics: Array.isArray(item.topics) ? item.topics.map(String).filter(Boolean) : [],
        objective: typeof item.objective === 'string' ? item.objective.trim() : ''
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
