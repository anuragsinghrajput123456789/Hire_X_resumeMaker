const { OpenAI } = require('openai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const apiKey = process.env.OPENROUTER_API_KEY;
const model = 'meta-llama/llama-3.2-3b-instruct:free';

console.log('API Key:', apiKey ? 'Loaded' : 'Missing');
console.log('Model:', model);

const openai = new OpenAI({
  apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function run() {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

run();
