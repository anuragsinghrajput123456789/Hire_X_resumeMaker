const { extractJson, repairJson } = require('./utils/JsonExtractor');

/**
 * Standardizes raw model text strings into clean JSON blocks.
 */
class ResponseParser {
  static parse(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('AI output is empty or not a string');
    }

    const jsonString = extractJson(text);
    if (!jsonString) {
      throw new Error('Could not find any JSON curly boundaries inside AI response');
    }

    const repairedString = repairJson(jsonString);

    try {
      return JSON.parse(repairedString);
    } catch (error) {
      throw new Error(`Failed to parse AI output: ${error.message}. Raw extracted content: ${repairedString.substring(0, 150)}`);
    }
  }
}

module.exports = ResponseParser;
