const metadata = {
  name: 'interviewFeedback',
  version: 'v1',
  description: 'AI Interview feedback analyzer to score candidate answers and assess overall readiness'
};

const compile = (variables) => {
  const {
    resumeText,
    jobDescription,
    interviewType = 'Technical',
    difficulty = 'Mid-Level',
    company = 'Target Company',
    role = 'Target Role',
    chatHistory = []
  } = variables;

  const historyStr = chatHistory.map((item, idx) => {
    return `Question ${idx + 1}: ${item.question}\nCandidate Answer: ${item.userAnswer || 'No response'}`;
  }).join('\n\n');

  return `You are a Principal Hiring Committee Evaluator.
Analyze the candidate's complete mock interview logs:

CANDIDATE PROFILE DETAILS:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

INTERVIEW PREP CONFIG:
- Target Role: "${role}" at "${company}"
- Interview Type: "${interviewType}"
- Difficulty: "${difficulty}"

MOCK INTERVIEW CONVERSATION LOGS:
${historyStr}

Assess the candidate's answers. Evaluate their technical accuracy, communication, confidence, problem solving, system design, and behavioral answers.
Score each dimension from 0 to 100, calculate an overall score, compile strengths and weaknesses, and provide detailed reviews of each response.

EXPLICIT RULES:
1. Provide constructive, highly specific reviews.
2. Return response STRICTLY as a valid JSON object matching this schema:
{
  "overallScore": 75,
  "scores": {
    "technicalAccuracy": 80,
    "communication": 70,
    "confidence": 75,
    "problemSolving": 85,
    "systemDesign": 60,
    "behavioralAnswers": 70,
    "resumeConsistency": 90,
    "overallReadiness": 75
  },
  "strengths": ["List of strengths observed during the session"],
  "weaknesses": ["List of areas needing improvement"],
  "suggestions": ["Actionable improvement recommendations"],
  "detailedQuestionEvaluation": [
    {
      "question": "The interview question",
      "userAnswer": "The candidate's response",
      "score": 80,
      "review": "Specific feedback on why this answer scored this way and what was missing",
      "modelAnswer": "An example of a high-quality model response"
    }
  ]
}

Return ONLY the raw JSON block. No conversational preamble or trailing explanation.`;
};

module.exports = {
  metadata,
  compile
};
