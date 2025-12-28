const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { GoogleGenAI } = require('@google/genai');

async function testKey() {
  console.log("Checking API Key...");
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing from process.env");
    return;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    console.log("Generating content with gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, are you working?",
    });
    
    console.log("SUCCESS: API Key is valid and working.");
    console.log("Response:", response.text);
  } catch (error) {
    console.error("ERROR: Failed to generate content.");
    console.error("Message:", error.message);
  }
}

testKey();
