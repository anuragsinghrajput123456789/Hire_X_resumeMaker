const metadata = {
  name: 'careerIntelligence',
  version: 'v1',
  description: 'AI Career Intelligence forecast analyzing hiring probability, skill gaps, certifications, salary, and growth'
};

const compile = (variables) => {
  const {
    resumeText,
    jobDescription,
    atsScore = 70,
    performanceScore = null
  } = variables;

  return `You are a Senior Career Strategist and HR Executive recruiter.
Analyze the candidate's portfolio against the target job post:

CANDIDATE PROFILE DETAILS:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

ATS METRICS:
- ATS Match Score: ${atsScore}/100
- Mock Interview Score: ${performanceScore ? performanceScore + '/100' : 'N/A'}

Provide career intelligence forecasting: estimate hiring probability, analyze technical skill gaps, suggest industry certifications, outline projects, estimate salary ranges, and write growth advice.

EXPLICIT RULES:
1. Provide realistic and competitive salary ranges based on industry standard.
2. Return response STRICTLY as a valid JSON object matching this schema:
{
  "hiringProbability": "e.g. 75% - Moderate Match",
  "skillGapAnalysis": [
    {
      "skill": "React Testing Library",
      "gapLevel": "Critical",
      "recommendation": "Build custom test suites for existing projects."
    }
  ],
  "recommendedCertifications": ["AWS Certified Developer Associate", "etc"],
  "suggestedProjects": ["Build a full-stack real-time RAG workspace using MongoDB", "etc"],
  "salaryRange": {
    "min": "$90,000",
    "max": "$130,000",
    "average": "$110,000",
    "currency": "USD"
  },
  "careerGrowthAdvice": "A paragraph of advice explaining how to maximize career growth for this role"
}

Return ONLY the raw JSON block. No conversational preamble or trailing explanation.`;
};

module.exports = {
  metadata,
  compile
};
