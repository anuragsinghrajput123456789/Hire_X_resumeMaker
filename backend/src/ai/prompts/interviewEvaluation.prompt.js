/**
 * Prompt template for mock interview answer evaluation and scoring.
 */

const metadata = {
  name: 'interviewEvaluation',
  version: 'v1',
  description: 'Evaluates and scores a candidate response to a mock interview question.'
};

const compile = (variables) => {
  const { question, userAnswer } = variables;
  return `You are a strict, expert interviewer scoring a mock interview response.
Question: "${question}"
Candidate Answer: "${userAnswer}"

Rate the answer. Output strictly a JSON block with this schema:
{
  "score": <integer from 0 to 100>,
  "review": "Detailed feedback on correctness, communication style, and completeness.",
  "modelAnswer": "A high-quality, exemplary response addressing the question."
}

Return ONLY the raw JSON block. No conversational preamble or trailing explanation.`;
};

module.exports = {
  metadata,
  compile
};
