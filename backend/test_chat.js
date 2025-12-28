const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { GoogleGenAI } = require('@google/genai');

async function testChat() {
  console.log("Testing Chatbot Logic...");
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing.");
    return;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Simulate history
    const history = [
        { role: 'assistant', content: "Hello! I am your career assistant." },
        { role: 'user', content: "Hi, I need help with my resume." }
    ];
    
    const message = "What tips can you give me?";
    
    // Logic from aiController.js
    let historyContext = "";
    if (history && Array.isArray(history)) {
        historyContext = history.slice(-10).map(msg => 
            `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
    }

    const prompt = `You are a helpful AI career assistant. Provide professional advice about resumes, job search, career development, and interview preparation. Keep responses concise and actionable.

Conversation History:
${historyContext}

User message: ${message}`;
    
    console.log("SENDING PROMPT TO GEMINI...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    console.log("SUCCESS: Chatbot response received.");
    console.log("Response:", response.text);
  } catch (error) {
    console.error("ERROR: Failed to generate chat response.");
    console.error("Error Message:", error.message);
    if (error.response) {
         console.error("API Status:", error.response.status);
         console.error("API Status Text:", error.response.statusText);
    }
  }
}

testChat();
