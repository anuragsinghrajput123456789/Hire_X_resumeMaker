/**
 * Validation schema and defaults for mock interview question evaluation.
 */

const defaults = {
  score: 50,
  review: 'Response evaluated.',
  modelAnswer: 'A exemplary response.'
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  // validate score
  const rawScore = typeof data.score === 'number' ? data.score : parseInt(data.score, 10);
  if (isNaN(rawScore) || rawScore < 0 || rawScore > 100) {
    errors.push('Score must be a number between 0 and 100');
    validated.score = 50;
  } else {
    validated.score = rawScore;
  }

  // validate review
  if (typeof data.review === 'string' && data.review.trim().length > 0) {
    validated.review = data.review.trim();
  } else {
    errors.push('Review feedback string is required');
  }

  // validate modelAnswer
  if (typeof data.modelAnswer === 'string' && data.modelAnswer.trim().length > 0) {
    validated.modelAnswer = data.modelAnswer.trim();
  } else {
    errors.push('Model answer string is required');
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
