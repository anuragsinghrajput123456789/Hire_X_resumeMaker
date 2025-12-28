
require('dotenv').config();

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
        console.log("MODELS_START");
        data.models.forEach(m => console.log(m.name));
        console.log("MODELS_END");
    } else {
        console.log("ERROR:", JSON.stringify(data));
    }

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
