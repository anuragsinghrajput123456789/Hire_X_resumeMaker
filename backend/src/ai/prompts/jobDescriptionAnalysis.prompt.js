/**
 * Prompt template for Job Description compatibility analysis.
 */

const metadata = {
  name: 'jobDescriptionAnalysis',
  version: 'v1',
  description: 'Job description comparison builder'
};

const compile = (variables) => {
  const { resumeText, jobDescription } = variables;
  return `Compare resume to JD. Return JSON:
{
  "requiredKeywords": [],
  "missingFromResume": [],
  "recommendedSkills": [],
  "keywordInsertions": [{"keyword":"", "suggestion":"", "section":""}]
}
Resume: ${resumeText.substring(0, 5000)}
JD: ${jobDescription.substring(0, 5000)}`;
};

module.exports = {
  metadata,
  compile
};
