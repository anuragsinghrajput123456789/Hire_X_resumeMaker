const AIError = require('../errors/AIError');

/**
 * Pre-flight request validator to screen inputs before LLM invocation.
 */
class RequestValidator {
  static validate(promptName, variables = {}) {
    if (!promptName) {
      throw new AIError(400, 'Prompt name is required for AI execution.');
    }

    // 1. Feature-specific missing input validation
    if (promptName === 'resumeOptimization' && (!variables.data || typeof variables.data !== 'object')) {
      throw new AIError(400, 'Resume data object is required for optimization.');
    }

    if (promptName === 'atsAnalysis' && (!variables.cleanedText || variables.cleanedText.trim().length < 50)) {
      throw new AIError(400, 'A valid, non-empty resume text is required for ATS analysis.');
    }

    if (promptName === 'atsRealTime' && (!variables.cleanedText || variables.cleanedText.trim().length < 50)) {
      throw new AIError(400, 'A valid, non-empty resume text is required for real-time analysis.');
    }

    if (promptName === 'jobDescriptionAnalysis') {
      if (!variables.resumeText || variables.resumeText.trim().length < 50) {
        throw new AIError(400, 'Resume text is required for job description compatibility check.');
      }
      if (!variables.jobDescription || variables.jobDescription.trim().length < 20) {
        throw new AIError(400, 'A valid job description is required for compatibility check.');
      }
    }

    if (promptName === 'coverLetter') {
      if (!variables.resumeText || variables.resumeText.trim().length < 50) {
        throw new AIError(400, 'Resume text is required for generating a cover letter.');
      }
      if (!variables.jobDescription || variables.jobDescription.trim().length < 20) {
        throw new AIError(400, 'Job description is required for generating a cover letter.');
      }
    }

    if (promptName === 'chat' && (!variables.message || variables.message.trim().length < 1)) {
      throw new AIError(400, 'Message body is required for chat conversations.');
    }

    if (promptName === 'coldEmail' && (!variables.prompt || variables.prompt.trim().length < 1)) {
      throw new AIError(400, 'Email compilation instructions are required.');
    }

    if (promptName === 'jobSuggestions' && (!variables.resumeText || variables.resumeText.trim().length < 50)) {
      throw new AIError(400, 'A valid resume text is required for job suggestions.');
    }

    if (promptName === 'interviewRoadmap' && (!variables.jobDescription || variables.jobDescription.trim().length < 20)) {
      throw new AIError(400, 'A valid job description is required to create an interview roadmap.');
    }

    if (promptName === 'interviewQuestion' && (!variables.jobDescription || variables.jobDescription.trim().length < 20)) {
      throw new AIError(400, 'A valid job description is required to generate interview questions.');
    }

    if (promptName === 'interviewFeedback' && (!variables.chatHistory || !Array.isArray(variables.chatHistory) || variables.chatHistory.length === 0)) {
      throw new AIError(400, 'Interview session logs are required to formulate feedback.');
    }

    if (promptName === 'interviewStudyPlan' && (!variables.jobDescription || variables.jobDescription.trim().length < 20)) {
      throw new AIError(400, 'A valid job description is required to compile a study plan.');
    }

    if (promptName === 'careerIntelligence' && (!variables.jobDescription || variables.jobDescription.trim().length < 20)) {
      throw new AIError(400, 'A valid job description is required for career intelligence scoring.');
    }

    if (promptName === 'interviewEvaluation') {
      if (!variables.question || variables.question.trim().length < 5) {
        throw new AIError(400, 'A valid interview question is required for evaluation.');
      }
      if (variables.userAnswer === undefined || variables.userAnswer === null) {
        throw new AIError(400, 'Candidate answer is required for evaluation.');
      }
    }

    // 2. Size boundary check (prevent token exhaustion / DOS attacks)
    const MAX_CHARACTER_LIMIT = 60000; // Limit inputs to ~60,000 characters (~15,000 tokens)
    let totalLength = 0;

    for (const key in variables) {
      if (typeof variables[key] === 'string') {
        totalLength += variables[key].length;
      } else if (typeof variables[key] === 'object' && variables[key] !== null) {
        totalLength += JSON.stringify(variables[key]).length;
      }
    }

    if (totalLength > MAX_CHARACTER_LIMIT) {
      throw new AIError(
        400,
        `Request payload is too large (${totalLength} characters). Max limit is ${MAX_CHARACTER_LIMIT} characters.`
      );
    }

    // 3. Prompt injection detection
    const injectionSignatures = [
      /ignore\s+(?:previous|all|the\s+above)\s+instructions/i,
      /you\s+must\s+now\s+act\s+as/i,
      /system\s*(?:message|prompt|directive):/i,
      /instead\s+of\s+doing\s+what\s+you\s+were\s+told/i,
      /override\s+original\s+instructions/i,
      /stop\s+doing\s+that\s+and/i,
      /ignore\s+rules/i
    ];

    for (const key in variables) {
      if (typeof variables[key] === 'string') {
        const text = variables[key];
        const match = injectionSignatures.find(regex => regex.test(text));
        if (match) {
          console.warn(`[RequestValidator] Potential prompt injection blocked on promptName: ${promptName}. Pattern: ${match}`);
          throw new AIError(
            400,
            'Request contains unauthorized instruction override commands. Execution blocked for security.'
          );
        }
      }
    }

    return true;
  }

  /**
   * Sanitizes text inputs (trims extra whitespace).
   */
  static sanitizeText(text) {
    if (typeof text !== 'string') return '';
    return text
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = RequestValidator;
