const metadata = {
  name: 'interviewStudyPlan',
  version: 'v1',
  description: 'AI Personalized Study Plan planner based on candidate performance, job requirements, and RAG context'
};

const compile = (variables) => {
  const {
    resumeText,
    jobDescription,
    interviewType = 'Technical',
    difficulty = 'Mid-Level',
    company = 'Target Company',
    role = 'Target Role',
    retrievedContext = '',
    feedbackScores = {}
  } = variables;

  const scoreStr = Object.entries(feedbackScores).map(([k, v]) => `- ${k}: ${v}`).join('\n');

  return `You are a Principal Curriculum Architect and Technical Educator.
Create a personalized study schedule and timeline for a candidate preparing for the role of "${role}" at "${company}".

CANDIDATE PROFILE DETAILS:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

MOCK INTERVIEW PERFORMANCE METRICS (IF COMPLETED):
${scoreStr || 'No mock interview completed yet. Focus on JD and resume gap.'}

RETRIEVED STUDY REFERENCE CONTEXT (RAG):
${retrievedContext}

Formulate a detailed, structured study schedule. Include missing skills, LeetCode target topic areas, resource details, weekly tasks, and estimated preparation time.

EXPLICIT RULES:
1. Provide highly actionable task items.
2. Return response STRICTLY as a valid JSON object matching this schema:
{
  "missingSkills": ["Skills from JD missing in candidate profile"],
  "recommendedTopics": ["Specific technical/behavioral concepts to learn"],
  "leetcodeAreas": ["Algorithm, data structures, or mock problems to solve"],
  "projectsToBuild": ["Suggested coding projects that prove missing skills"],
  "studyResources": [
    {
      "title": "Resource title / book / guide name",
      "urlOrType": "e.g. YouTube Video / Documentation / Reference book",
      "reason": "Why this resource helps bridge the gap"
    }
  ],
  "estimatedPreparationTime": "e.g. 4 weeks",
  "weeklyPlan": [
    {
      "week": "Week 1",
      "topics": ["Topic A", "Topic B"],
      "objective": "Weekly learning goal description"
    }
  ]
}

Return ONLY the raw JSON block. No conversational preamble or trailing explanation.`;
};

module.exports = {
  metadata,
  compile
};
