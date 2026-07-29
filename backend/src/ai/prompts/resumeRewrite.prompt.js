/**
 * Prompt template for STAR method bullet rewriting.
 */

const metadata = {
  name: 'resumeRewrite',
  version: 'v1',
  description: 'Enhances individual bullet points using the STAR method'
};

const compile = (variables) => {
  const { role, bulletText } = variables;
  return `You are a professional resume writer. Rewrite the following experience bullet point using the STAR method (Situation, Task, Action, Result).
Include hard metrics (e.g. percentages, money saved, hours saved) where possible.
Job Title: ${role || 'General'}
Current Bullet: ${bulletText}

Return ONLY the rewritten bullet point without any conversational filler or introductions.`;
};

module.exports = {
  metadata,
  compile
};
