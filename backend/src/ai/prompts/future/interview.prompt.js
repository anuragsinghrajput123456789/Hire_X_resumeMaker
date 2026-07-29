/**
 * Future feature: Interview Questions generation template stub.
 */

const metadata = {
  name: 'interview',
  version: 'v1',
  description: 'Placeholder interview preparation compiler'
};

const compile = (variables) => {
  const { resumeText, jobRole } = variables;
  return `Generate interview preparation questions and matching answers for a candidate applying to "${jobRole}".
Candidate Profile Details:
${resumeText.substring(0, 4000)}`;
};

module.exports = {
  metadata,
  compile
};
