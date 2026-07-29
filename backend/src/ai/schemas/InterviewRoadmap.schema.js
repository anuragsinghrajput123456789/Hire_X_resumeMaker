const defaults = {
  role: 'Target Role',
  company: 'Target Company',
  difficulty: 'Mid-Level',
  overview: '',
  keyFocusAreas: [],
  roadmapSteps: [],
  atsAnalysisSummary: ''
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  validated.role = typeof data.role === 'string' ? data.role.trim() : defaults.role;
  validated.company = typeof data.company === 'string' ? data.company.trim() : defaults.company;
  validated.difficulty = typeof data.difficulty === 'string' ? data.difficulty.trim() : defaults.difficulty;
  validated.overview = typeof data.overview === 'string' ? data.overview.trim() : '';
  validated.atsAnalysisSummary = typeof data.atsAnalysisSummary === 'string' ? data.atsAnalysisSummary.trim() : '';

  if (Array.isArray(data.keyFocusAreas)) {
    validated.keyFocusAreas = data.keyFocusAreas.map(item => {
      if (!item || typeof item !== 'object') return null;
      return {
        area: typeof item.area === 'string' ? item.area.trim() : '',
        description: typeof item.description === 'string' ? item.description.trim() : '',
        importance: typeof item.importance === 'string' ? item.importance.trim() : 'Medium'
      };
    }).filter(Boolean);
  }

  if (Array.isArray(data.roadmapSteps)) {
    validated.roadmapSteps = data.roadmapSteps.map(item => {
      if (!item || typeof item !== 'object') return null;
      return {
        dayOrWeek: typeof item.dayOrWeek === 'string' ? item.dayOrWeek.trim() : '',
        title: typeof item.title === 'string' ? item.title.trim() : '',
        tasks: Array.isArray(item.tasks) ? item.tasks.map(String).filter(Boolean) : [],
        resources: Array.isArray(item.resources) ? item.resources.map(String).filter(Boolean) : []
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
