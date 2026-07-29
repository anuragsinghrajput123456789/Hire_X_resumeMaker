const PromptVersioning = require('./utils/PromptVersioning');

const resumeOptimization = require('./prompts/resumeOptimization.prompt');
const atsAnalysis = require('./prompts/atsAnalysis.prompt');
const jobDescriptionAnalysis = require('./prompts/jobDescriptionAnalysis.prompt');
const resumeRewrite = require('./prompts/resumeRewrite.prompt');
const atsRealTime = require('./prompts/atsRealTime.prompt');
const chat = require('./prompts/chat.prompt');
const coldEmail = require('./prompts/coldEmail.prompt');
const jobSuggestions = require('./prompts/jobSuggestions.prompt');

const coverLetter = require('./prompts/coverLetter.prompt');
const interview = require('./prompts/future/interview.prompt');
const interviewRoadmap = require('./prompts/interviewRoadmap.prompt');
const interviewQuestion = require('./prompts/interviewQuestion.prompt');
const interviewFeedback = require('./prompts/interviewFeedback.prompt');
const interviewStudyPlan = require('./prompts/interviewStudyPlan.prompt');
const careerIntelligence = require('./prompts/careerIntelligence.prompt');
const interviewEvaluation = require('./prompts/interviewEvaluation.prompt');

const prompts = {
  resumeOptimization,
  atsAnalysis,
  jobDescriptionAnalysis,
  resumeRewrite,
  atsRealTime,
  chat,
  coldEmail,
  jobSuggestions,
  coverLetter,
  interview,
  interviewRoadmap,
  interviewQuestion,
  interviewFeedback,
  interviewStudyPlan,
  careerIntelligence,
  interviewEvaluation
};

class PromptManager {
  static getPrompt(name, variables = {}) {
    const promptModule = prompts[name];
    if (!promptModule) {
      throw new Error(`Prompt template '${name}' not found inside PromptManager registry.`);
    }

    const text = promptModule.compile(variables);
    const versionMeta = PromptVersioning.getMetadata(name, promptModule.metadata?.version || 'v1');
    
    return {
      text,
      metadata: {
        ...promptModule.metadata,
        ...versionMeta
      }
    };
  }
}

module.exports = PromptManager;
