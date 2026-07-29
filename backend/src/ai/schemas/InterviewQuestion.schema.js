const defaults = {
  questionNumber: 1,
  question: 'Could you introduce yourself and tell me about your background?',
  category: 'General',
  difficulty: 'Mid-Level',
  contextRetrieved: '',
  hint: ''
};

const validate = (data) => {
  const errors = [];
  const validated = { ...defaults };

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Input is not an object'], data: validated };
  }

  validated.questionNumber = typeof data.questionNumber === 'number' ? data.questionNumber : defaults.questionNumber;
  validated.question = typeof data.question === 'string' ? data.question.trim() : defaults.question;
  validated.category = typeof data.category === 'string' ? data.category.trim() : defaults.category;
  validated.difficulty = typeof data.difficulty === 'string' ? data.difficulty.trim() : defaults.difficulty;
  validated.contextRetrieved = typeof data.contextRetrieved === 'string' ? data.contextRetrieved.trim() : '';
  validated.hint = typeof data.hint === 'string' ? data.hint.trim() : '';

  if (!validated.question) {
    errors.push('Question is missing or empty');
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
