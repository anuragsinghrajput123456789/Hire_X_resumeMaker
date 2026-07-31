/**
 * Validation schema and defaults for mock interview question evaluation.
 */

const defaults = {
  score: 50,
  review: 'Response evaluated.',
  modelAnswer: 'An exemplary response.'
};

const validate = (data) => {
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: true, errors: [], data: validated };
  }

  // validate score
  const rawScore = typeof data.score === 'number' ? data.score : parseInt(data.score, 10);
  validated.score = isNaN(rawScore) ? 50 : Math.max(0, Math.min(100, rawScore));

  // validate review
  const reviewText = data.review || data.feedback || data.evaluation || data.summary;
  validated.review = typeof reviewText === 'string' && reviewText.trim().length > 0 ? reviewText.trim() : 'Response evaluated successfully.';

  // validate modelAnswer
  const answerText = data.modelAnswer || data.idealAnswer || data.sampleAnswer || data.answer;
  validated.modelAnswer = typeof answerText === 'string' && answerText.trim().length > 0 ? answerText.trim() : 'An exemplary answer addressing key concepts.';

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
