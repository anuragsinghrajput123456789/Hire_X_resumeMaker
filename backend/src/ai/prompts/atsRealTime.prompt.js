/**
 * Prompt template for real-time keyword scan.
 */

const metadata = {
  name: 'atsRealTime',
  version: 'v1',
  description: 'Real-time keyword matcher and readabilities checker'
};

const compile = (variables) => {
  const { cleanedText, jobRole, expectedKeywords } = variables;
  return `Analyze this resume for the "${jobRole}" position. Return ONLY JSON.
Resume:
${cleanedText}
Target Role: ${jobRole}
Expected Keywords: ${expectedKeywords.join(', ')}

Required JSON Structure:
{
  "keywordMatchScore": <number 0-100>,
  "foundKeywords": [list strings],
  "missingKeywords": [list strings],
  "readabilityScore": <number 0-100>,
  "structureAnalysis": {
    "Contact Information": <bool>,
    "Professional Summary": <bool>,
    "Work Experience": <bool>,
    "Education": <bool>,
    "Skills": <bool>,
    "Projects": <bool>
  },
  "formattingIssues": [list strings]
}`;
};

module.exports = {
  metadata,
  compile
};
