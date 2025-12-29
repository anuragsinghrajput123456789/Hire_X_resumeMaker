require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const key = process.env.GEMINI_API_KEY;
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    
    console.log(`Testing raw REST API: ${model}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Success (REST):", data.candidates?.[0]?.content?.parts?.[0]?.text || "No text");
        } else {
            const text = await response.text();
            console.error(`❌ Failed (REST): ${response.status} - ${text}`);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
