const metadata = {
  name: 'interviewRoadmap',
  version: 'v1',
  description: 'AI Interview Roadmap generator based on Resume, JD, and retrieved RAG context'
};

const compile = (variables) => {
  const {
    resumeText,
    jobDescription,
    interviewType = 'Technical',
    difficulty = 'Mid-Level',
    company = 'Target Company',
    role = 'Target Role',
    retrievedContext = ''
  } = variables;

  return `You are a Principal Technical Interview Coach and RAG Specialist.
Analyze the candidate's profile, the target job description, and the retrieved study material below:

CANDIDATE PROFILE DETAILS:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

INTERVIEW PREPARATION PARAMS:
- Company Name: "${company}"
- Target Role: "${role}"
- Interview Type: "${interviewType}" (Technical, HR, Behavioral, System Design, Coding, Managerial, Campus Placement, Custom)
- Difficulty Level: "${difficulty}"

RETRIEVED STUDY MATERIAL & REFERENCE TEXTS (RAG CONTEXT):
${retrievedContext}

Generate a personalized Interview Preparation Roadmap strictly matching the target details.
Identify core focus areas and draft a weekly timeline.

EXPLICIT RULES:
1. Ground the roadmap in both the candidate's background and the target job description.
2. Incorporate retrieved reference study material/cheat sheets where relevant.
3. Return response STRICTLY as a valid JSON object matching this schema:
{
  "role": "Role Title",
  "company": "Company Name",
  "difficulty": "Difficulty level",
  "overview": "A summary explaining what this interview type tests and candidate general readiness",
  "keyFocusAreas": [
    {
      "area": "Topic/Skill name",
      "description": "Specific focus points based on JD and retrieved materials",
      "importance": "High"
    }
  ],
  "roadmapSteps": [
    {
      "dayOrWeek": "Week 1",
      "title": "Module Title",
      "tasks": ["Task 1", "Task 2"],
      "resources": ["Study resource/guide details"]
    }
  ],
  "atsAnalysisSummary": "A quick assessment of the candidate profile vs target job description gap"
}

Return ONLY the raw JSON block. No conversational preamble or trailing explanation.`;
};

module.exports = {
  metadata,
  compile
};
