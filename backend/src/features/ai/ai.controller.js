const AIService = require('./ai.service');
const AIManager = require('../../ai/AIManager');

const getStatusCode = (error) => {
  if (error.statusCode) return error.statusCode;
  if (error.message?.includes('limit reached')) return 403;
  return 500;
};

const sendError = (res, error, fallbackMessage) => {
  const statusCode = getStatusCode(error);
  const exposeMessage = statusCode < 500 || process.env.NODE_ENV !== 'production';

  if (res.headersSent) {
    res.write(`data: ${JSON.stringify({ error: exposeMessage ? error.message || fallbackMessage : fallbackMessage })}\n\n`);
    res.end();
    return;
  }

  res.status(statusCode).json({
    error: exposeMessage ? error.message || fallbackMessage : fallbackMessage,
  });
};

const chat = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const message = AIService.requireText(req.body.message, 'Message');
    const history = Array.isArray(req.body.history) ? req.body.history : [];
    const historyContext = history
      .slice(-5)
      .filter((msg) => msg?.role && msg?.content)
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${String(msg.content).slice(0, 2000)}`)
      .join('\n');

    if (req.body.stream === true) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const abortController = new AbortController();
      req.on('close', () => abortController.abort());

      await AIManager.executeAIStreamWorkflow({
        promptName: 'chat',
        variables: { message, historyContext },
        temperature: 0.5,
        onChunk: (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        abortSignal: abortController.signal,
        userId: req.user._id
      });

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await AIManager.chat(message, historyContext, { userId: req.user._id });
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to generate response');
  }
};

const coldEmail = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const promptText = AIService.requireText(req.body.prompt, 'Prompt');

    if (req.body.stream === true) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const abortController = new AbortController();
      req.on('close', () => abortController.abort());

      await AIManager.executeAIStreamWorkflow({
        promptName: 'coldEmail',
        variables: { prompt: promptText },
        temperature: 0.4,
        onChunk: (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        abortSignal: abortController.signal,
        userId: req.user._id
      });

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await AIManager.coldEmail(promptText, { userId: req.user._id });
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to generate cold email');
  }
};

const analyzeResumeRealTime = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const cleanedText = AIService.cleanResumeText(req.body.resumeText).substring(0, 15000);
    const jobRole = req.body.jobRole || 'General';

    if (cleanedText.length < 100) {
      return res.status(400).json({ error: 'Resume text is too short' });
    }

    const expectedKeywords = AIService.getJobRoleKeywords(jobRole);
    const parsed = await AIManager.analyzeResumeRealTime(cleanedText, jobRole, expectedKeywords, { userId: req.user._id });
    res.json(parsed);
  } catch (error) {
    sendError(res, error, 'Failed to analyze resume');
  }
};

const analyzeResume = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const cleanedText = AIService.cleanResumeText(req.body.resumeText).substring(0, 30000);
    const jobRole = req.body.jobRole || 'General';

    if (cleanedText.length < 100) {
      return res.status(400).json({ error: 'Resume text is too short' });
    }

    const parsed = await AIManager.analyzeResume(cleanedText, jobRole, { userId: req.user._id });
    res.json(parsed);
  } catch (error) {
    sendError(res, error, 'Failed to analyze resume');
  }
};

const analyzeJobDescription = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const resumeText = AIService.requireText(req.body.resumeText, 'Resume text');
    const jobDescription = AIService.requireText(req.body.jobDescription, 'Job description');

    const parsed = await AIManager.analyzeJobDescription(resumeText, jobDescription, { userId: req.user._id });
    res.json(parsed);
  } catch (error) {
    sendError(res, error, 'Job analysis failed');
  }
};

const jobSuggestions = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const resumeText = AIService.requireText(req.body.resumeText, 'Resume text');
    const targetRole = req.body.targetRole || 'General';

    const result = await AIManager.jobSuggestions(resumeText, targetRole, { userId: req.user._id });
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to get job suggestions');
  }
};

const generateResume = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    if (!req.body.data || typeof req.body.data !== 'object') {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const parsed = await AIManager.generateResume(req.body.data, { userId: req.user._id });
    res.json({ 
      success: true,
      result: JSON.stringify(parsed),
      parsedData: parsed
    });
  } catch (error) {
    sendError(res, error, 'Failed to generate resume');
  }
};

const generateContent = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const promptText = AIService.requireText(req.body.prompt, 'Prompt');

    if (req.body.stream === true) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const abortController = new AbortController();
      req.on('close', () => abortController.abort());

      await AIManager.executeAIStreamWorkflow({
        promptName: 'coldEmail',
        variables: { prompt: promptText },
        temperature: 0.3,
        onChunk: (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        abortSignal: abortController.signal,
        userId: req.user._id
      });

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await AIManager.generateContent(promptText, { userId: req.user._id });
    res.json({ result });
  } catch (error) {
    sendError(res, error, 'Failed to generate content');
  }
};

const generateCoverLetter = async (req, res) => {
  try {
    await AIService.checkAndIncrementUsage(req.user._id);
    const {
      resumeText,
      jobDescription,
      tone,
      length,
      experienceLevel,
      companyName,
      jobTitle
    } = req.body;

    const resumeTxt = AIService.requireText(resumeText, 'Resume text');
    const jobDesc = AIService.requireText(jobDescription, 'Job description');

    if (req.body.stream === true) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const abortController = new AbortController();
      req.on('close', () => abortController.abort());

      await AIManager.executeAIStreamWorkflow({
        promptName: 'coverLetter',
        variables: {
          resumeText: resumeTxt,
          jobDescription: jobDesc,
          tone,
          length,
          experienceLevel,
          companyName,
          jobTitle
        },
        temperature: 0.3,
        onChunk: (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        abortSignal: abortController.signal,
        userId: req.user._id
      });

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const parsed = await AIManager.generateCoverLetter({
      resumeText: resumeTxt,
      jobDescription: jobDesc,
      tone,
      length,
      experienceLevel,
      companyName,
      jobTitle
    }, { userId: req.user._id });

    res.json(parsed);
  } catch (error) {
    sendError(res, error, 'Failed to generate cover letter');
  }
};

const healthCheck = async (req, res) => {
  try {
    const { isHealthy, providerName, model } = await AIService.healthCheck(req.query.provider);

    if (isHealthy) {
      return res.json({
        status: 'UP',
        provider: providerName,
        model,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(503).json({
        status: 'DOWN',
        provider: providerName,
        message: 'API key is missing or model list connection health check failed.'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      error: error.message
    });
  }
};

const queueMetrics = async (req, res) => {
  try {
    const { metrics, snapshot } = AIService.getMetrics();
    res.json({
      status: 'ok',
      metrics,
      snapshot,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const cancelled = AIService.cancelRequest(req.body.requestId);
    if (cancelled) {
      res.json({ status: 'cancelled', requestId: req.body.requestId });
    } else {
      res.status(404).json({ status: 'not_found', message: `No active or queued request with id ${req.body.requestId}` });
    }
  } catch (error) {
    sendError(res, error, 'Cancellation failed');
  }
};

const getUsage = async (req, res) => {
  try {
    const aiUsageService = require('./aiUsage.service');
    const usageData = await aiUsageService.getUserUsage(req.user ? req.user._id : null);
    res.json(usageData);
  } catch (error) {
    sendError(res, error, 'Failed to fetch AI usage statistics');
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
  generateCoverLetter,
  healthCheck,
  queueMetrics,
  cancelRequest,
  getUsage,
};
