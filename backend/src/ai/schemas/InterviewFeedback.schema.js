const defaults = {
  overallScore: 50,
  scores: {
    technicalAccuracy: 50,
    communication: 50,
    confidence: 50,
    problemSolving: 50,
    systemDesign: 50,
    behavioralAnswers: 50,
    resumeConsistency: 50,
    overallReadiness: 50
  },
  strengths: [],
  weaknesses: [],
  suggestions: [],
  detailedQuestionEvaluation: []
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  validated.overallScore = typeof data.overallScore === 'number' ? data.overallScore : defaults.overallScore;
  
  if (data.scores && typeof data.scores === 'object') {
    const sKeys = ['technicalAccuracy', 'communication', 'confidence', 'problemSolving', 'systemDesign', 'behavioralAnswers', 'resumeConsistency', 'overallReadiness'];
    for (const key of sKeys) {
      validated.scores[key] = typeof data.scores[key] === 'number' ? data.scores[key] : defaults.scores[key];
    }
  }

  validated.strengths = Array.isArray(data.strengths) ? data.strengths.map(String).filter(Boolean) : [];
  validated.weaknesses = Array.isArray(data.weaknesses) ? data.weaknesses.map(String).filter(Boolean) : [];
  validated.suggestions = Array.isArray(data.suggestions) ? data.suggestions.map(String).filter(Boolean) : [];

  if (Array.isArray(data.detailedQuestionEvaluation)) {
    validated.detailedQuestionEvaluation = data.detailedQuestionEvaluation.map(item => {
      if (!item || typeof item !== 'object') return null;
      return {
        question: typeof item.question === 'string' ? item.question.trim() : '',
        userAnswer: typeof item.userAnswer === 'string' ? item.userAnswer.trim() : '',
        score: typeof item.score === 'number' ? item.score : 0,
        review: typeof item.review === 'string' ? item.review.trim() : '',
        modelAnswer: typeof item.modelAnswer === 'string' ? item.modelAnswer.trim() : ''
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
