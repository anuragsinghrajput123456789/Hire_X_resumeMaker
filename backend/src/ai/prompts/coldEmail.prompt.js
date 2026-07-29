/**
 * Prompt template for recruiter outreach cold email.
 */

const metadata = {
  name: 'coldEmail',
  version: 'v1',
  description: 'Cold email generator template'
};

const compile = (variables) => {
  const { prompt } = variables;
  return prompt; // In this codebase, the prompt generated on the client contains all parameters and variables
};

module.exports = {
  metadata,
  compile
};
