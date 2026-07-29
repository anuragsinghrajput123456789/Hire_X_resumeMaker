/**
 * Prompt template for generating personalized cover letters.
 */

const metadata = {
  name: 'coverLetter',
  version: 'v1',
  description: 'AI Cover Letter generator with structural breakdown and ATS mapping'
};

const compile = (variables) => {
  const {
    resumeText,
    jobDescription,
    tone = 'Professional',
    length = 'Medium',
    experienceLevel = 'Mid-Level',
    companyName = 'Target Company',
    jobTitle = 'Target Role'
  } = variables;

  return `You are a world-class professional career writer and hiring strategist.
Analyze the following candidate profile details and target job description:

CANDIDATE PROFILE DETAILS:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

Generate a personalized, highly tailored cover letter for the role of "${jobTitle}" at "${companyName}".

EXPLICIT RULES:
1. Target Tone: "${tone}" (e.g. Professional, Friendly, Confident, Executive, Concise, Enthusiastic).
2. Target Length: "${length}" (Short, Medium, Detailed).
3. Experience Seniority Level: "${experienceLevel}" (Student, Fresher, Junior, Mid-Level, Senior, Executive).
4. Never invent skills or work experience that are not present in the candidate profile. Do not fabricate metrics.
5. Highlight matching technical skills and achievements matching the job description parameters.
6. Identify missing skills or requirements from the candidate profile relative to the job description.
7. Return your response strictly as a valid JSON object matching this schema:
{
  "company": "Company Name",
  "jobTitle": "Job Title",
  "opening": "Opening Greeting & Statement of Interest",
  "experience": "Relevant Experience Narrative matching the job description",
  "skills": "Technical and Soft skills breakdown tailored for the company",
  "closing": "Closing Call to Action and Next Steps",
  "coverLetter": "The complete combined cover letter text with professional header, greetings, paragraphs, and professional sign-off",
  "missingSkills": ["List of skills from the JD missing in the resume"],
  "recommendedChanges": ["List of recommended additions or changes to highlight in the resume"]
}

Return ONLY the raw JSON block. No conversational preamble or trailing explanation.`;
};

module.exports = {
  metadata,
  compile
};
