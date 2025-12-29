const fetch = require('node-fetch');

async function testBackend() {
    console.log("Testing AI Backend...");
    
    // 1. Test Generate Content (Simple)
    try {
        console.log("\n1. Testing /api/ai/generate-content...");
        const response = await fetch('http://localhost:5000/api/ai/generate-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'Say hello world' })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Generate Content Success:", data.result.substring(0, 50) + "...");
        } else {
            console.error("❌ Generate Content Failed:", response.status, await response.text());
        }
    } catch (e) {
        console.error("❌ Generate Content Error:", e.message);
    }

    // 2. Test Resume Analysis (Mock)
    try {
        console.log("\n2. Testing /api/ai/analyze-resume...");
        const response = await fetch('http://localhost:5000/api/ai/analyze-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                resumeText: "Experienced software engineer with 5 years in React and Node.js.",
                jobRole: "Software Engineer"
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Analyze Resume Success. ATS Score:", data.atsScore);
        } else {
            console.error("❌ Analyze Resume Failed:", response.status, await response.text());
        }
    } catch (e) {
         console.error("❌ Analyze Resume Error:", e.message);
    }
}

testBackend();
