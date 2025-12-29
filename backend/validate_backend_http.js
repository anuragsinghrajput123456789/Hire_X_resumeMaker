const http = require('http');

function post(path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(`Request failed with status ${res.statusCode}: ${body}`);
                }
            });
        });

        req.on('error', (e) => reject(e.message));
        req.write(data);
        req.end();
    });
}

async function test() {
    console.log("Testing Backend with native HTTP...");
    
    try {
        const data = JSON.stringify({ prompt: "Hello Gemini" });
        console.log("Testing /api/ai/generate-content...");
        const result = await post('/api/ai/generate-content', data);
        console.log("✅ Custom Content Result:", result.result?.substring(0, 50));
    } catch (e) {
        console.error("❌ Custom Content Failed:", e);
    }

    try {
        const data = JSON.stringify({ 
             resumeText: "Software Engineer with React skills. Experience in Node.js, Express, and MongoDB. Built full stack applications. Looking for a challenging role in technical leadership. I have over 5 years of experience in the industry, working with various technologies and frameworks. I am a quick learner and a team player. I have led multiple projects to success and have a strong track record of delivering high-quality software on time and within budget. I am passionate about coding and always looking for new challenges.",
             jobRole: "Software Engineer"
        });
        console.log("\nTesting /api/ai/analyze-resume...");
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Analysis Result ATS Score:", data.atsScore);
        } else {
             const text = await response.text();
             console.error(`❌ Analysis Failed: ${response.statusCode} - ${text}`);
        }
    } catch (e) {
        console.error("❌ Analysis Failed:", e);
    }
}

test();
