/**
 * Prompt template for general ATS analysis.
 */

const metadata = {
  name: 'atsAnalysis',
  version: 'v1',
  description: 'General ATS parsing check'
};

const compile = (variables) => {
  const { cleanedText, jobRole } = variables;
  return `You are an expert ATS resume analyzer. Analyze this resume for "${jobRole || 'General'}" role.
Return ONLY JSON with this structure:
{
  "atsScore": <number 0-100>,
  "missingKeywords": [list],
  "formatSuggestions": [list],
  "improvements": [list],
  "matchingJobRoles": [list]
}
Resume:
${cleanedText}`;
};

module.exports = {
  metadata,
  compile
};
