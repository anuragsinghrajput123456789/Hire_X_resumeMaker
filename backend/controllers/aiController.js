const { GoogleGenAI } = require('@google/genai');

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to clean resume text
const cleanResumeText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,;:()\-@]/g, '')
    .trim();
};

// Retry utility (Adapted for new SDK if needed, but basic retry logic remains same)
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryableError = error.status === 503 || error.status === 429 || 
                              (error.message && (error.message.includes('overloaded') || error.message.includes('quota')));
      
      if (isLastAttempt || !isRetryableError) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

// ATS Score Calculation
const calculateATSScore = (resumeText) => {
    const text = resumeText.toLowerCase();
    let score = 0;
    
    // Contact information (20 points)
    if (/email|@/.test(text)) score += 8;
    if (/phone|\d{3}[-\s]?\d{3}[-\s]?\d{4}/.test(text)) score += 8;
    if (/linkedin|github/.test(text)) score += 4;
    
    // Professional sections (25 points)
    if (/summary|objective|profile/.test(text)) score += 8;
    if (/experience|work|employment/.test(text)) score += 12;
    if (/education|degree|university|college/.test(text)) score += 5;
    
    // Skills and keywords (25 points)
    if (/skills|technical|proficient/.test(text)) score += 10;
    const techKeywords = ['javascript', 'python', 'java', 'react', 'sql', 'aws', 'docker', 'git'];
    const foundTechKeywords = techKeywords.filter(keyword => text.includes(keyword));
    score += Math.min(15, foundTechKeywords.length * 2);
    
    // Quantifiable achievements (15 points)
    const numbers = text.match(/\d+%|\$\d+|\d+\+|increased|decreased|improved|reduced/g);
    if (numbers && numbers.length > 0) score += Math.min(15, numbers.length * 3);
    
    // Content quality (15 points)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount > 200) score += 5;
    if (wordCount > 400) score += 5;
    if (wordCount > 600) score += 5;
    
    return Math.min(100, Math.max(15, score));
};

const getJobRoleKeywords = (jobRole) => {
    const keywordMap = {
      'Software Developer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'API', 'Database', 'Frontend', 'Backend', 'Agile'],
      'Data Analyst': ['SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'Statistics', 'Data Visualization', 'Analytics', 'Reporting'],
      'Product Manager': ['Product Strategy', 'Roadmap', 'Stakeholder Management', 'Agile', 'Scrum', 'User Research', 'Analytics'],
      'Marketing Manager': ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Campaign Management'],
      'Project Manager': ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Risk Management', 'Stakeholder Management'],
      'Business Analyst': ['Requirements Analysis', 'Process Improvement', 'SQL', 'Documentation', 'Stakeholder Management'],
      'UX/UI Designer': ['User Experience', 'User Interface', 'Figma', 'Adobe', 'Prototyping', 'User Research', 'Wireframing'],
      'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure', 'Automation', 'Monitoring'],
    };
    
    return keywordMap[jobRole] || ['Leadership', 'Communication', 'Problem Solving', 'Team Work'];
};


// Controllers

const chat = async (req, res) => {
    try {
        const { message, history } = req.body;
        
        // Construct conversation history
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
        
     const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
        });

        res.json({ result: response.text });
    } catch (error) {
        console.error('Error generating chat response:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
};

const coldEmail = async (req, res) => {
    try {
        const { prompt } = req.body; 
        const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
        });
        res.json({ result: response.text });
    } catch (error) {
        console.error('Error generating cold email:', error);
        res.status(500).json({ error: 'Failed to generate cold email', details: error.message });
    }
};

const analyzeResumeRealTime = async (req, res) => {
    try {
        const { resumeText, jobRole } = req.body;
        console.log('Starting real-time resume analysis for job role:', jobRole);
        
        const cleanedText = cleanResumeText(resumeText).substring(0, 15000);
        
        if (cleanedText.length < 100) {
           return res.status(400).json({ error: 'Resume text is too short.' });
        }
        
        const expectedKeywords = getJobRoleKeywords(jobRole);
        
        const result = await retryWithBackoff(async () => {
          
          const prompt = `Analyze this resume for the "${jobRole}" position. Provide analysis in JSON format.
    
    Resume Text:
    ${cleanedText}
    
    Target Job Role: ${jobRole}
    Expected Keywords: ${expectedKeywords.join(', ')}
    
    Analyze and return ONLY a valid JSON object with this exact structure:
    {
      "keywordMatchScore": <number 0-100>,
      "foundKeywords": [list of keywords found in resume],
      "missingKeywords": [important keywords missing from resume],
      "readabilityScore": <number 0-100 based on clarity and structure>,
      "structureAnalysis": {
        "Contact Information": <true if contact info present>,
        "Professional Summary": <true if summary/objective present>,
        "Work Experience": <true if experience section present>,
        "Education": <true if education section present>,
        "Skills": <true if skills section present>,
        "Projects": <true if projects section present>
      },
      "formattingIssues": [list of formatting problems]
    }
    
    Be accurate and specific. Only include keywords that are actually relevant to the job role.`;
    
          const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
             config: {
                temperature: 0.3,
                topK: 40,
                topP: 0.8,
                maxOutputTokens: 2048,
             }
          });
          
          return response.text;
        });
        
        try {
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              res.json(parsed);
              return;
            }
        } catch (e) {
            console.error('JSON Parse error', e);
        }

        // Fallback logic
        const textLower = cleanedText.toLowerCase();
        const foundKeywords = expectedKeywords.filter(keyword => textLower.includes(keyword.toLowerCase()));
        const missingKeywords = expectedKeywords.filter(keyword => !textLower.includes(keyword.toLowerCase()));
        
        res.json({
            keywordMatchScore: Math.round((foundKeywords.length / expectedKeywords.length) * 100),
            foundKeywords: foundKeywords,
            missingKeywords: missingKeywords,
            readabilityScore: Math.min(85, Math.max(40, cleanedText.split(' ').length > 300 ? 75 : 60)),
            structureAnalysis: {
                'Contact Information': /email|phone|contact/.test(textLower),
                'Professional Summary': /summary|objective|profile/.test(textLower),
                'Work Experience': /experience|work|employment|job/.test(textLower),
                'Education': /education|degree|university|college/.test(textLower),
                'Skills': /skills|technical|proficient/.test(textLower),
                'Projects': /project|portfolio/.test(textLower)
            },
            formattingIssues: []
        });

    } catch (error) {
        console.error('Real-time resume analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
};

const analyzeResume = async (req, res) => {
    try {
        const { resumeText, jobRole } = req.body;
        const cleanedText = cleanResumeText(resumeText).substring(0, 40000);
        
        if (cleanedText.length < 200) {
            return res.status(400).json({ error: 'Resume text too short' });
        }

        const fallbackATSScore = calculateATSScore(cleanedText);

        const result = await retryWithBackoff(async () => {
            
            const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer with 10+ years of experience. Analyze this resume comprehensively for the target role of "${jobRole || 'General Professional'}" and provide detailed, accurate feedback.

Resume Content:
${cleanedText}

Target Job Role: ${jobRole || 'General Professional'}

SCORING CRITERIA (Rate 0-100):
- Contact Info (20%): Email, phone, LinkedIn present and professional
- Professional Summary (15%): Clear, compelling, keyword-rich summary tailored to ${jobRole || 'the role'}
- Work Experience (25%): Relevant experience, quantified achievements, action verbs
- Skills (20%): Industry-relevant technical and soft skills for ${jobRole || 'the role'}
- Education (10%): Relevant education, certifications
- Formatting (10%): ATS-friendly structure, consistent formatting

Provide your analysis as a valid JSON object with this exact structure:
{
  "atsScore": <number 0-100 based on above criteria>,
  "missingKeywords": [array of 8-12 important missing industry keywords for ${jobRole || 'this role'}],
  "formatSuggestions": [array of 6-10 specific formatting improvements for ATS compatibility],
  "improvements": [array of 8-12 actionable content improvements with specifics],
  "matchingJobRoles": [array of 4-6 suitable job roles based on resume content]
}

IMPORTANT SCORING GUIDELINES:
- Score 80-100: Excellent ATS optimization for ${jobRole || 'this role'}, comprehensive content, strong keywords
- Score 60-79: Good foundation, some optimization needed
- Score 40-59: Average resume, multiple areas need improvement  
- Score 20-39: Poor ATS compatibility, significant gaps
- Score 0-19: Major issues, extensive rewrite needed

Be specific, accurate, and provide actionable recommendations. Consider industry standards and current ATS technology.`;
      
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
               contents: prompt,
               config: {
                 temperature: 0.2,
                 topK: 30,
                 topP: 0.8,
                 maxOutputTokens: 3000,
               }
            });
            
            return response.text;
        });

        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            
            let atsScore = parsed.atsScore;
            if (typeof atsScore !== 'number' || atsScore < 15 || atsScore > 100) {
                atsScore = fallbackATSScore;
            }
            const variance = Math.floor(Math.random() * 6) - 3;
            parsed.atsScore = Math.max(15, Math.min(100, atsScore + variance));
            
            res.json(parsed);
        } else {
             res.json({
                atsScore: fallbackATSScore,
                missingKeywords: ['Technical skills', 'Action verbs'],
                formatSuggestions: ['Use standard headers', 'Add quantifiable results'],
                improvements: ['Include metrics', 'Add professional summary'],
                matchingJobRoles: ['Entry Level Professional']
             });
        }

    } catch (error) {
        console.error('Comprehensive resume analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
};

const analyzeJobDescription = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        console.log('Starting job description analysis...');
        
        const cleanedResume = cleanResumeText(resumeText).substring(0, 15000);
        const cleanedJobDesc = cleanResumeText(jobDescription).substring(0, 10000);
        
        if (cleanedResume.length < 100 || cleanedJobDesc.length < 100) {
           return res.status(400).json({error: 'Content too short'});
        }
        
        
        const prompt = `Compare this resume against the job description and provide targeted recommendations.

Resume:
${cleanedResume}

Job Description:
${cleanedJobDesc}

Analyze the gap and provide ONLY a valid JSON object:
{
  "requiredKeywords": [8-12 key required keywords from job description],
  "missingFromResume": [keywords from job description missing in resume],
  "recommendedSkills": [6-10 additional skills to strengthen application],
  "keywordInsertions": [
    {
      "keyword": "specific keyword",
      "suggestion": "Natural sentence to incorporate this keyword",
      "section": "Experience/Skills/Summary"
    }
  ]
}

Focus on actionable, specific recommendations. Make suggestions natural and professional.`;

        const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
             config: {
               temperature: 0.3,
               topK: 40,
               topP: 0.8,
               maxOutputTokens: 2500,
             }
        });
        
        const text = response.text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        res.json(jsonMatch ? JSON.parse(jsonMatch[0]) : {});

    } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Job analysis failed' });
    }
};

const jobSuggestions = async (req, res) => {
    try {
        const { resumeText, targetRole } = req.body;
        
        const prompt = `Based on the following resume, provide personalized job recommendations and career guidance:

Resume:
${resumeText}

${targetRole ? `Target Role: ${targetRole}` : ''}

Please provide:
1. Recommended job titles and roles
2. Industries that would be a good fit
3. Skills to develop for career advancement
4. Potential career paths
5. Companies or job boards to target

Format the response with clear sections and actionable advice.`;

        const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
        });
        res.json({ result: response.text });
    } catch(e) {
        console.error(e);
        res.status(500).json({error: 'Failed'});
    }
};

const generateResume = async (req, res) => {
    try {
        const { data } = req.body;
        
        const prompt = `You are an expert ATS (Applicant Tracking System) resume writer and career coach. Create a highly optimized, professional resume that will pass through ATS systems and impress hiring managers.

CRITICAL ATS OPTIMIZATION REQUIREMENTS:
- Use standard section headers that ATS systems recognize
- Include 15-20 relevant keywords for ${data.jobRole} role distributed naturally throughout
- Start each experience bullet with strong action verbs (Achieved, Managed, Developed, Led, etc.)
- Include quantifiable results and metrics wherever possible
- Use industry-standard terminology and technical skills
- Ensure consistent formatting and proper spacing
- Write in third person, professional tone
- Include power words that show impact and leadership

CANDIDATE INFORMATION:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Target Role: ${data.jobRole}
${data.linkedin ? `LinkedIn: ${data.linkedin}` : ''}
${data.github ? `GitHub: ${data.github}` : ''}

PROFESSIONAL SUMMARY REQUIREMENTS:
${data.summary ? `Base Summary: ${data.summary}` : `Create a compelling 3-4 line summary for ${data.jobRole}`}
- Highlight years of experience and key expertise
- Include 3-5 industry keywords
- Showcase unique value proposition
- Mention quantifiable achievements if applicable

CORE COMPETENCIES (Optimize with ATS keywords):
${data.skills.join(', ')}
- Add related technical skills and tools
- Include soft skills relevant to ${data.jobRole}
- Use industry-standard terminology
- Group by categories if applicable (Technical Skills, Leadership, etc.)

EDUCATION:
${data.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}`).join('\n')}

PROFESSIONAL EXPERIENCE (Rewrite with impact):
${data.experience.map(exp => `${exp.role} at ${exp.company} (${exp.duration})
Current Description: ${exp.description}`).join('\n\n')}

ENHANCEMENT INSTRUCTIONS FOR EXPERIENCE:
1. Start each bullet with a strong action verb
2. Include specific numbers, percentages, or metrics
3. Show progression and growth
4. Highlight achievements, not just responsibilities
5. Use keywords relevant to ${data.jobRole}
6. Focus on results and business impact

${data.projects.length > 0 ? `KEY PROJECTS:
${data.projects.map(proj => `${proj.name}: ${proj.description} (Technologies: ${proj.technologies})`).join('\n')}
- Enhance project descriptions with technical details and outcomes` : ''}

${data.certifications.length > 0 ? `CERTIFICATIONS: ${data.certifications.join(', ')}` : ''}
${data.languages.length > 0 ? `LANGUAGES: ${data.languages.join(', ')}` : ''}
${data.achievements.length > 0 ? `ACHIEVEMENTS: ${data.achievements.join(', ')}` : ''}

OUTPUT REQUIREMENTS:
1. Professional Summary: 3-4 compelling lines with keywords
2. Core Competencies: Organized list with industry keywords
3. Professional Experience: Rewritten bullets with action verbs and metrics
4. Education: Clean, ATS-friendly format
5. Additional sections as applicable
6. Ensure keyword density of 2-3% for target role
7. Use consistent formatting throughout
8. Include relevant technical and soft skills
9. Focus on achievements and quantifiable results
10. Make it ATS-parseable with clear section headers

Create a complete, polished resume that will score 90+ on ATS systems and impress hiring managers. The content should be professional, impactful, and perfectly tailored for the ${data.jobRole} position.`;

        const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
        });
        res.json({ result: response.text });
    } catch(e) {
        console.error(e);
        res.status(500).json({error: 'Failed'});
    }
}


const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
        });
        res.json({ result: response.text });
    } catch(e) {
        console.error(e);
        res.status(500).json({error: 'Failed'});
    }
}

module.exports = {
    chat,
    coldEmail,
    analyzeResumeRealTime,
    analyzeResume,
    analyzeJobDescription,
    jobSuggestions,
    generateResume,
    generateContent
};
