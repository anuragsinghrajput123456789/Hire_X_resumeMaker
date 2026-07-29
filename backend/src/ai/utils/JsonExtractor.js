/**
 * Utility for extracting and repairing JSON content from AI outputs.
 */

const extractJson = (text) => {
  if (typeof text !== 'string') return null;

  // Clean markdown syntax if wrapped in ```json ... ``` or ``` ... ```
  let cleanedText = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim();

  // Find boundaries of curly braces or brackets
  const startCurly = cleanedText.indexOf('{');
  const startBracket = cleanedText.indexOf('[');

  let startIndex = -1;
  let endIndex = -1;

  if (startCurly !== -1 && (startBracket === -1 || startCurly < startBracket)) {
    startIndex = startCurly;
    endIndex = cleanedText.lastIndexOf('}');
  } else if (startBracket !== -1) {
    startIndex = startBracket;
    endIndex = cleanedText.lastIndexOf(']');
  }

  if (startIndex === -1) {
    return null;
  }

  // If truncated (no matching end delimiter found), slice to the end of string
  if (endIndex === -1 || endIndex < startIndex) {
    return cleanedText.substring(startIndex);
  }

  return cleanedText.substring(startIndex, endIndex + 1);
};

const repairJson = (jsonString) => {
  if (!jsonString) return null;

  let cleaned = jsonString.trim();

  // 1. First, resolve outer single quotes to double quotes while preserving internal apostrophes.
  let repairedQuotes = '';
  let inDoubleQuote = false;
  let inSingleQuote = false;
  let len = cleaned.length;

  for (let i = 0; i < len; i++) {
    const char = cleaned[i];

    if (char === '\\') {
      repairedQuotes += char;
      if (i + 1 < len) {
        repairedQuotes += cleaned[i + 1];
        i++;
      }
      continue;
    }

    if (char === '"') {
      if (!inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
      }
      repairedQuotes += char;
      continue;
    }

    if (char === "'") {
      if (inDoubleQuote) {
        // Inside a double-quoted string, single quote is just literal
        repairedQuotes += char;
      } else if (inSingleQuote) {
        // We are in a single-quoted string. Is this the closing single quote?
        // A closing single quote must be followed by whitespace then comma, closing brace, closing bracket, or colon.
        let isClosing = false;
        let j = i + 1;
        while (j < len && /\s/.test(cleaned[j])) {
          j++;
        }
        if (j < len && (cleaned[j] === ',' || cleaned[j] === '}' || cleaned[j] === ']' || cleaned[j] === ':')) {
          isClosing = true;
        } else if (j >= len) {
          // End of string
          isClosing = true;
        }

        if (isClosing) {
          repairedQuotes += '"';
          inSingleQuote = false;
        } else {
          // Internal apostrophe - keep as is (since we are wrapping in double quotes, it is valid JSON)
          repairedQuotes += char;
        }
      } else {
        // Starting a single-quoted string
        repairedQuotes += '"';
        inSingleQuote = true;
      }
      continue;
    }

    repairedQuotes += char;
  }

  cleaned = repairedQuotes;

  // 2. Fix unquoted keys, e.g. {atsScore: 80} -> {"atsScore": 80}
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

  // 3. Fix trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  // 4. Character-by-character balance healer for incomplete/truncated JSON
  let inString = false;
  let escape = false;
  const stack = [];
  let repaired = '';

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escape) {
      escape = false;
      repaired += char;
      continue;
    }

    if (char === '\\') {
      escape = true;
      repaired += char;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      repaired += char;
      continue;
    }

    if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char === '{' ? '}' : ']');
      } else if (char === '}' || char === ']') {
        const expected = stack.pop();
        if (expected && expected !== char) {
          // Mismatch, push back
          stack.push(expected);
        }
      }
    }

    repaired += char;
  }

  // If the string is cut off while inside a string value
  if (inString) {
    if (repaired.endsWith('\\')) {
      repaired = repaired.slice(0, -1);
    }
    repaired += '"'; // Close the string quote
  }

  // Handle cut off after colon or comma
  let cleanRep = repaired.trim();
  if (cleanRep.endsWith(':')) {
    repaired = cleanRep + ' null';
  } else if (cleanRep.endsWith(',')) {
    repaired = cleanRep.slice(0, -1);
  }

  // Close remaining unclosed braces/brackets in reverse order
  while (stack.length > 0) {
    const closingChar = stack.pop();
    repaired += closingChar;
  }

  return repaired;
};

module.exports = {
  extractJson,
  repairJson
};
