const ResumeOptimizationSchema = require('./schemas/ResumeOptimization.schema');
const ATSAnalysisSchema = require('./schemas/ATSAnalysis.schema');
const KeywordAnalysisSchema = require('./schemas/KeywordAnalysis.schema');
const JobDescriptionSchema = require('./schemas/JobDescription.schema');
const CoverLetterSchema = require('./schemas/CoverLetter.schema');
const InterviewRoadmapSchema = require('./schemas/InterviewRoadmap.schema');
const InterviewQuestionSchema = require('./schemas/InterviewQuestion.schema');
const InterviewFeedbackSchema = require('./schemas/InterviewFeedback.schema');
const InterviewStudyPlanSchema = require('./schemas/InterviewStudyPlan.schema');
const CareerIntelligenceSchema = require('./schemas/CareerIntelligence.schema');
const InterviewEvaluationSchema = require('./schemas/InterviewEvaluation.schema');

/**
 * Validates parsed AI objects and returns structured objects with defaults.
 */
class SchemaValidator {
  static validate(data, schemaType) {
    let result = { isValid: true, errors: [], data };

    switch (schemaType) {
      case 'resume-optimization':
        result = ResumeOptimizationSchema.validate(data);
        break;
      case 'ats-analysis':
        result = ATSAnalysisSchema.validate(data);
        break;
      case 'realtime-analysis':
        result = KeywordAnalysisSchema.validate(data);
        break;
      case 'job-description':
        result = JobDescriptionSchema.validate(data);
        break;
      case 'cover-letter':
        result = CoverLetterSchema.validate(data);
        break;
      case 'interview-roadmap':
        result = InterviewRoadmapSchema.validate(data);
        break;
      case 'interview-question':
        result = InterviewQuestionSchema.validate(data);
        break;
      case 'interview-feedback':
        result = InterviewFeedbackSchema.validate(data);
        break;
      case 'interview-studyplan':
        result = InterviewStudyPlanSchema.validate(data);
        break;
      case 'career-intelligence':
        result = CareerIntelligenceSchema.validate(data);
        break;
      case 'interview-evaluation':
        result = InterviewEvaluationSchema.validate(data);
        break;
      default:
        // No schema mapping, return original
        break;
    }

    return result;
  }
}

module.exports = SchemaValidator;
