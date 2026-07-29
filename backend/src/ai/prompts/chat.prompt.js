/**
 * Prompt template for Career Chatbot.
 */

const metadata = {
  name: 'chat',
  version: 'v1',
  description: 'AI career counselor guide template'
};

const compile = (variables) => {
  const { historyContext, message } = variables;
  return `You are a helpful AI career assistant.
Conversation History:
${historyContext}
User message: ${message}`;
};

module.exports = {
  metadata,
  compile
};
