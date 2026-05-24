const User = require('../models/User');
const { OpenAI } = require('openai');

const MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';
const AI_LIMIT = Number(process.env.AI_USAGE_LIMIT || 500);

const getStatusCode = (error) => {
  if (error.statusCode) return error.statusCode;
  if (error.message?.includes('limit reached')) return 403;
  return 500;
};

const sendError = (res, error, fallbackMessage) => {
  const statusCode = getStatusCode(error);
  const exposeMessage = statusCode < 500 || process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    error: exposeMessage ? error.message || fallbackMessage : fallbackMessage,
  });
};

const requireText = (value, fieldName, minLength = 1) => {
  if (typeof value !== 'string' || value.trim().length < minLength) {
    const error = new Error(`${fieldName} is required`);
    error.statusCode = 400;
    throw error;
  }

  return value.trim();
};

const parseAIJson = (text, fallback = {}) => {
  if (typeof text !== 'string') return fallback;
  
  // Clean markdown syntax if wrapped in ```json ... ``` or ``` ... ```
  let cleanedText = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim();

  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return fallback;
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    // Attempt minor fixes for common AI issues (e.g. unescaped quotes inside strings, trailing commas)
    try {
      // Remove trailing commas before matching brackets/braces
      let repaired = jsonMatch[0]
        .replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(repaired);
    } catch {
      const error = new Error(`Invalid JSON returned by AI provider: ${parseError.message}`);
      error.statusCode = 502;
      throw error;
    }
  }
};

const checkAndIncrementUsage = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const whitelist = (process.env.AI_USAGE_WHITELIST || 'anuragsinghj678@gmail.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (whitelist.includes(user.email)) {
    return user.aiUsage;
  }

  if (user.aiUsage >= AI_LIMIT) {
    const error = new Error(`AI usage limit reached (${AI_LIMIT} attempts). Please upgrade for more access.`);
    error.statusCode = 403;
    throw error;
  }

  user.aiUsage += 1;
  await user.save();
  return user.aiUsage;
};

// Robust callAI using standard openai package (supports both OpenRouter and standard OpenAI)
const callAI = async (prompt, temperature = 0.3, maxTokens = 1500) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error('AI service is not configured');
    error.statusCode = 503;
    throw error;
  }

  // Model fallback chain for reliability (deduplicated)
  const rawModels = [
    MODEL,
    'baidu/cobuddy:free',
    'meta-llama/llama-3.2-3b-instruct:free'
  ];
  const fallbackModels = [...new Set(rawModels)].filter(Boolean);

  let lastError = null;

  for (const currentModel of fallbackModels) {
    try {
      console.log(`[callAI] Attempting AI generation with model: ${currentModel}`);
      const isOpenRouter = apiKey.startsWith('sk-or-');
      const baseURL = isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined;

      const openai = new OpenAI({
        apiKey,
        baseURL,
        defaultHeaders: isOpenRouter ? {
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Hire-X"
        } : undefined
      });

      const completion = await openai.chat.completions.create({
        model: currentModel,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      }, {
        timeout: 12000 // 12-second timeout per model to prevent infinite hanging on upstream rate limits
      });

      const response = completion.choices?.[0]?.message?.content;

      if (!response) {
        throw new Error('Empty response returned by model');
      }

      console.log(`[callAI] Successful generation with model: ${currentModel}`);
      return response;
    } catch (error) {
      console.warn(`[callAI] Model ${currentModel} failed: ${error.message}`);
      lastError = error;
      // Continue to next model in fallback chain
    }
  }

  // If all models failed
  const statusCode = lastError?.statusCode || 502;
  const wrappedError = new Error(`AI provider error: All models in fallback chain failed. Last error: ${lastError?.message || 'Unknown'}`);
  wrappedError.statusCode = statusCode;
  throw wrappedError;
};


const cleanResumeText = (text) => {
  if (typeof text !== 'string') return '';

  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,;:()\-@/+&%#]/g, '')
    .trim();
};

const getJobRoleKeywords = (jobRole) => {
  const keywordMap = {
    'Software Developer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'API', 'Database', 'Frontend', 'Backend', 'Agile'],
    'Data Analyst': ['SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'Statistics', 'Data Visualization', 'Analytics', 'Reporting'],
    'Product Manager': ['Product Strategy', 'Roadmap', 'Stakeholder Management', 'Agile', 'Scrum', 'User Research', 'Analytics'],
    'Marketing Manager': ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Campaign Management'],
  };

  return keywordMap[jobRole] || ['Leadership', 'Communication', 'Problem Solving', 'Team Work'];
};

const chat = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    const message = requireText(req.body.message, 'Message');
    const history = Array.isArray(req.body.history) ? req.body.history : [];
    const historyContext = history
      .slice(-5)
      .filter((msg) => msg?.role && msg?.content)
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${String(msg.content).slice(0, 2000)}`)
      .join('\n');

    const prompt = `You are a helpful AI career assistant.
Conversation History:
${historyContext}
User message: ${message}`;

    const result = await callAI(prompt);
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to generate response');
  }
};

const coldEmail = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    const prompt = requireText(req.body.prompt, 'Prompt');
    const result = await callAI(prompt);
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to generate cold email');
  }
};

const analyzeResumeRealTime = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    const cleanedText = cleanResumeText(req.body.resumeText).substring(0, 15000);
    const jobRole = req.body.jobRole || 'General';

    if (cleanedText.length < 100) {
      return res.status(400).json({ error: 'Resume text is too short' });
    }

    const expectedKeywords = getJobRoleKeywords(jobRole);
    const prompt = `Analyze this resume for the "${jobRole}" position. Return ONLY JSON.
Resume:
${cleanedText}
Target Role: ${jobRole}
Expected Keywords: ${expectedKeywords.join(', ')}

Required JSON Structure:
{
  "keywordMatchScore": <number 0-100>,
  "foundKeywords": [list strings],
  "missingKeywords": [list strings],
  "readabilityScore": <number 0-100>,
  "structureAnalysis": {
    "Contact Information": <bool>,
    "Professional Summary": <bool>,
    "Work Experience": <bool>,
    "Education": <bool>,
    "Skills": <bool>,
    "Projects": <bool>
  },
  "formattingIssues": [list strings]
}`;

    const text = await callAI(prompt, 0.2);
    res.json(parseAIJson(text));
  } catch (error) {
    sendError(res, error, 'Failed to analyze resume');
  }
};

const analyzeResume = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    const cleanedText = cleanResumeText(req.body.resumeText).substring(0, 30000);
    const jobRole = req.body.jobRole || 'General';

    if (cleanedText.length < 100) {
      return res.status(400).json({ error: 'Resume text is too short' });
    }

    const prompt = `You are an expert ATS resume analyzer. Analyze this resume for "${jobRole}" role.
Return ONLY JSON with this structure:
{
  "atsScore": <number 0-100>,
  "missingKeywords": [list],
  "formatSuggestions": [list],
  "improvements": [list],
  "matchingJobRoles": [list]
}
Resume:
${cleanedText}`;

    const text = await callAI(prompt, 0.2);
    res.json(parseAIJson(text));
  } catch (error) {
    sendError(res, error, 'Failed to analyze resume');
  }
};

const analyzeJobDescription = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    const resumeText = requireText(req.body.resumeText, 'Resume text');
    const jobDescription = requireText(req.body.jobDescription, 'Job description');
    const prompt = `Compare resume to JD. Return JSON:
{
  "requiredKeywords": [],
  "missingFromResume": [],
  "recommendedSkills": [],
  "keywordInsertions": [{"keyword":"", "suggestion":"", "section":""}]
}
Resume: ${resumeText.substring(0, 5000)}
JD: ${jobDescription.substring(0, 5000)}`;

    const text = await callAI(prompt);
    res.json(parseAIJson(text));
  } catch (error) {
    sendError(res, error, 'Job analysis failed');
  }
};

const jobSuggestions = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    const resumeText = requireText(req.body.resumeText, 'Resume text');
    const targetRole = req.body.targetRole || 'General';
    const prompt = `Career guidance and job suggestions for:
Role: ${targetRole}
Resume: ${resumeText.substring(0, 5000)}
Provide specific job titles, industries, and skills to learn.`;

    const result = await callAI(prompt);
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to get job suggestions');
  }
};

const generateResume = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    if (!req.body.data || typeof req.body.data !== 'object') {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const prompt = `You are a world-class ATS resume optimizer. Optimize this resume data.
Format your entire response strictly as a single, valid JSON object that exactly matches this schema:
{
  "fullName": "...",
  "email": "...",
  "phone": "...",
  "linkedin": "...",
  "github": "...",
  "portfolio": "...",
  "jobRole": "...",
  "summary": "Optimize the professional summary for highest ATS score using powerful keywords.",
  "skills": ["TypeScript", "React", ...],
  "certifications": ["Cert 1", "Cert 2", ...],
  "languages": ["English", ...],
  "achievements": ["Achievement 1", ...],
  "education": [
    { "degree": "...", "institution": "...", "year": "...", "gpa": "..." }
  ],
  "experience": [
    {
      "company": "...",
      "role": "...",
      "duration": "...",
      "description": "Rewrite the bullet points using the STAR method (Situation, Task, Action, Result). Make sure to include hard metrics (e.g. percentages, money saved, hours saved). Separate bullets with newlines."
    }
  ],
  "projects": [
    {
      "name": "...",
      "description": "Optimize description with strong verbs and separate bullets with newlines.",
      "technologies": "..."
    }
  ]
}

Input data to optimize:
${JSON.stringify(req.body.data)}

Return ONLY the raw JSON block without any conversational text or explanation.`;

    const result = await callAI(prompt, 0.3, 3000);
    // Parse the result to ensure it is clean valid JSON
    const parsed = parseAIJson(result);
    
    // Return both the structured parsed data and the raw text for copy compatibility
    res.json({ 
      success: true,
      result: typeof result === 'string' ? result : JSON.stringify(result),
      parsedData: parsed
    });
  } catch (error) {
    sendError(res, error, 'Failed to generate resume');
  }
};

const generateContent = async (req, res) => {
  try {
    await checkAndIncrementUsage(req.user._id);
    const prompt = requireText(req.body.prompt, 'Prompt');
    const result = await callAI(prompt);
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to generate content');
  }
};

module.exports = {
  chat,
  coldEmail,
  analyzeResumeRealTime,
  analyzeResume,
  analyzeJobDescription,
  jobSuggestions,
  generateResume,
  generateContent,
};
