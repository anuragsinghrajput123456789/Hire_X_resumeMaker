/**
 * Future feature: Cover Letter generation template stub.
 */

const metadata = {
  name: 'coverLetter',
  version: 'v1',
  description: 'Placeholder cover letter template blueprint'
};

const compile = (variables) => {
  const { resumeText, jobRole, companyName } = variables;
  return `Generate a professional cover letter for a candidate applying to "${jobRole}" at "${companyName || 'Target Company'}".
Candidate Profile Details:
${resumeText.substring(0, 4000)}`;
};

module.exports = {
  metadata,
  compile
};
