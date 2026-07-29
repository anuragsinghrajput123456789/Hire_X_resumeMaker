/**
 * Prompt template for Resume Optimization.
 */

const metadata = {
  name: 'resumeOptimization',
  version: 'v1',
  description: 'STAR optimizer for structural resume inputs'
};

const compile = (variables) => {
  const dataString = JSON.stringify(variables.data);
  return `You are a world-class ATS resume optimizer. Optimize this resume data.
Format your entire response strictly as a single, valid JSON object that exactly matches this schema:
{
  "fullName": "...",
  "email": "...",
  "phone": "...",
  "linkedin": "...",
  "github": "...",
  "portfolio": "...",
  "jobRole": "...",
  "summary": "Optimize the professional summary for highest ATS score using powerful keywords.",
  "skills": ["TypeScript", "React", ...],
  "certifications": ["Cert 1", "Cert 2", ...],
  "languages": ["English", ...],
  "achievements": ["Achievement 1", ...],
  "education": [
    { "degree": "...", "institution": "...", "year": "...", "gpa": "..." }
  ],
  "experience": [
    {
      "company": "...",
      "role": "...",
      "duration": "...",
      "description": "Rewrite the bullet points using the STAR method (Situation, Task, Action, Result). Make sure to include hard metrics (e.g. percentages, money saved, hours saved). Separate bullets with newlines."
    }
  ],
  "projects": [
    {
      "name": "...",
      "description": "Optimize description with strong verbs and separate bullets with newlines.",
      "technologies": "..."
    }
  ]
}

Input data to optimize:
${dataString}

Return ONLY the raw JSON block without any conversational text or explanation.`;
};

module.exports = {
  metadata,
  compile
};
