/**
 * Prompt template for job suggestions.
 */

const metadata = {
  name: 'jobSuggestions',
  version: 'v1',
  description: 'Career advice and industries portal check'
};

const compile = (variables) => {
  const { resumeText, targetRole } = variables;
  return `Career guidance and job suggestions for:
Role: ${targetRole || 'General'}
Resume: ${resumeText.substring(0, 5000)}
Provide specific job titles, industries, and skills to learn.`;
};

module.exports = {
  metadata,
  compile
};
