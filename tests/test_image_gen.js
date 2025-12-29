
// using native fetch


// 1x1 red pixel
const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const testBackend = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/ai/generate-resume-from-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: base64Image,
                data: {
                    fullName: "Test User",
                    email: "test@example.com",
                    skills: ["React", "Node.js"],
                    experience: "5 years of experience",
                    education: "Bachelor's in CS"
                }
            })
        });

        const text = await response.text();
        console.log("Status:", response.status);
        if (response.ok) {
            console.log("Success! Response length:", text.length);
            // console.log("Response preview:", text.substring(0, 200));
        } else {
            console.error("Failed:", text);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

testBackend();
