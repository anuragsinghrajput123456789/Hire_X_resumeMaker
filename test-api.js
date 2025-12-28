import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const apiKey = process.env.VITE_GEMINI_API_KEY;

console.log('Testing API Key:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
  console.error('Error: VITE_GEMINI_API_KEY is missing in .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGenAI() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Hello, are you working?";
    
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('API Response Success!');
    console.log('Response:', text);
  } catch (error) {
    console.error('API Request Failed:', error);
  }
}

testGenAI();
