const metadata = {
  name: 'interviewQuestion',
  version: 'v1',
  description: 'AI adaptive mock interview question generator using RAG context and session history'
};

const compile = (variables) => {
  const {
    resumeText,
    jobDescription,
    interviewType = 'Technical',
    difficulty = 'Mid-Level',
    company = 'Target Company',
    role = 'Target Role',
    chatHistory = [],
    retrievedContext = ''
  } = variables;

  const historyStr = chatHistory.map((item, idx) => {
    return `Q${idx + 1}: ${item.question}\nUser A${idx + 1}: ${item.userAnswer || 'No response'}\nReview: ${item.review || 'N/A'}`;
  }).join('\n\n');

  return `You are an expert Interviewer at "${company}". Conduct a realistic, conversational mock interview for the role of "${role}".
Analyze the candidate's profile, job description, retrieved reference documents, and active history:

CANDIDATE PROFILE DETAILS:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

INTERVIEW CONFIG:
- Interview Type: "${interviewType}"
- Difficulty: "${difficulty}"

ACTIVE CONVERSATION HISTORY SO FAR:
${historyStr || 'No history. This is the very beginning of the interview.'}

RETRIEVED DOCUMENTATION & STUDY CHUNKS (RAG CONTEXT):
${retrievedContext}

Determine the next logical, high-impact question to ask the candidate.
If the candidate's previous answer was incomplete, you may perform cross-questioning or ask follow-ups.
If this is the first question, start with an appropriate opening.
Utilize retrieved study chunks/notes/cheat sheets if they relate to the role's topics. Never ask generic questions when specific details are available in the retrieved context.

EXPLICIT RULES:
1. Return response STRICTLY as a valid JSON object matching this schema:
{
  "questionNumber": 1,
  "question": "The single interview question to present to the user",
  "category": "e.g. Coding / System Design / Behavioral / Scenario",
  "difficulty": "e.g. Easy / Medium / Hard",
  "contextRetrieved": "A very brief snippet of the context/materials referenced to make this question, or empty",
  "hint": "A subtle hint to guide the candidate if they get stuck"
}

Return ONLY the raw JSON block. No conversational preamble or trailing explanation.`;
};

module.exports = {
  metadata,
  compile
};
