const InterviewDocument = require('../../../models/InterviewDocument');
const DocumentChunk = require('../../../models/DocumentChunk');
const InterviewSession = require('../../../models/InterviewSession');
const Resume = require('../../../models/resumeModel');

const EmbeddingService = require('../../ai/EmbeddingService');
const RAGRetriever = require('../../ai/RAGRetriever');
const AIManager = require('../../ai/AIManager');

const chunkText = (text, maxLength = 800, overlap = 150) => {
  if (!text) return [];
  const cleaned = text.replace(/\r\n/g, '\n').trim();
  const paragraphs = cleaned.split(/(?:\n\s*){2,}/);
  const chunks = [];
  let currentChunk = '';
  let currentPage = 1;
  let currentSection = 'General';
  
  for (const para of paragraphs) {
    const isHeading = para.startsWith('#') || (para.length < 100 && /^[A-Z0-9\s:,\-()&]+$/.test(para.trim()));
    if (isHeading) {
      currentSection = para.replace(/[#*]/g, '').trim();
    }
    
    if (currentChunk.length + para.length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push({
          text: currentChunk.trim(),
          page: currentPage,
          section: currentSection
        });
      }
      const overlapStart = Math.max(0, currentChunk.length - overlap);
      currentChunk = currentChunk.substring(overlapStart) + '\n\n' + para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      page: currentPage,
      section: currentSection
    });
  }
  
  return chunks;
};

class InterviewService {
  static async uploadDocument(userId, { title, fileName, fileType, category, tags, content }) {
    if (!title || !fileName || !fileType || !content) {
      const error = new Error('Title, fileName, fileType, and content are required');
      error.statusCode = 400;
      throw error;
    }

    const doc = await InterviewDocument.create({
      userId,
      title,
      fileName,
      fileType,
      category: category || 'General Notes',
      tags: Array.isArray(tags) ? tags : [],
      content
    });

    const chunks = chunkText(content);
    const chunkDocs = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await EmbeddingService.generateEmbedding(chunk.text);
      
      chunkDocs.push({
        userId,
        documentId: doc._id,
        text: chunk.text,
        embedding,
        pageNumber: chunk.page,
        sectionHeader: chunk.section
      });
    }

    if (chunkDocs.length > 0) {
      await DocumentChunk.insertMany(chunkDocs);
    }

    return { doc, chunksCreated: chunkDocs.length };
  }

  static async getDocuments(userId, { search, type = 'keyword', category, favorite, tag }) {
    const filter = { userId };
    if (category) filter.category = category;
    if (favorite === 'true') filter.isFavorite = true;
    if (tag) filter.tags = tag;

    if (search && type === 'semantic') {
      const retrievedChunks = await RAGRetriever.retrieve({
        userId,
        queryText: search,
        limit: 10,
        category: category || null
      });

      return { type: 'semantic', data: retrievedChunks };
    }

    if (search && type === 'keyword') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const docs = await InterviewDocument.find(filter).sort({ createdAt: -1 });
    return { type: 'keyword', data: docs };
  }

  static async updateDocument(userId, id, { title, isFavorite, tags }) {
    const doc = await InterviewDocument.findOne({ _id: id, userId });
    if (!doc) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    if (title !== undefined) doc.title = title;
    if (isFavorite !== undefined) doc.isFavorite = isFavorite;
    if (tags !== undefined) doc.tags = tags;

    await doc.save();
    return doc;
  }

  static async deleteDocument(userId, id) {
    const doc = await InterviewDocument.findOneAndDelete({ _id: id, userId });
    if (!doc) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    await DocumentChunk.deleteMany({ documentId: id, userId });
    return true;
  }

  static async startSession(userId, { jobDescription, resumeId, interviewType, difficulty, company, role }) {
    if (!jobDescription) {
      const error = new Error('Job description is required');
      error.statusCode = 400;
      throw error;
    }

    let resumeText = 'No resume provided.';
    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, userId });
      if (resume) {
        resumeText = `Name: ${resume.fullName}\nRole: ${resume.jobRole}\nSummary: ${resume.summary || ''}\nSkills: ${resume.skills.join(', ')}\n`;
        if (resume.experience && resume.experience.length > 0) {
          resumeText += 'Experience:\n';
          resume.experience.forEach(exp => {
            resumeText += `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}\n`;
          });
        }
      }
    }

    const queryText = `Job Description: ${jobDescription}\nRole: ${role || ''}\nType: ${interviewType || ''}`;
    const retrievedChunks = await RAGRetriever.retrieve({
      userId,
      queryText,
      limit: 4
    });
    
    const retrievedContext = retrievedChunks.map(c => `[Doc: ${c.documentId?.title || 'Study material'}, Section: ${c.sectionHeader || 'General'}]: ${c.text}`).join('\n\n');

    const roadmap = await AIManager.generateInterviewRoadmap({
      resumeText,
      jobDescription,
      interviewType,
      difficulty,
      company,
      role,
      retrievedContext
    }, { userId });

    const session = await InterviewSession.create({
      userId,
      resumeId,
      jobDescription,
      interviewType,
      difficulty,
      company: company || 'Target Company',
      role: role || 'Target Role',
      status: 'active',
      currentQuestionIndex: 0,
      roadmap
    });

    const firstQuestionData = await AIManager.generateInterviewQuestion({
      resumeText,
      jobDescription,
      interviewType,
      difficulty,
      company: session.company,
      role: session.role,
      chatHistory: [],
      retrievedContext
    }, { userId });

    session.chatHistory.push({
      question: firstQuestionData.question,
      category: firstQuestionData.category,
      difficulty: firstQuestionData.difficulty
    });
    await session.save();

    return {
      sessionId: session._id,
      roadmap,
      question: firstQuestionData
    };
  }

  static async submitAnswer(userId, { sessionId, userAnswer }) {
    if (!sessionId || userAnswer === undefined) {
      const error = new Error('SessionId and userAnswer are required');
      error.statusCode = 400;
      throw error;
    }

    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session || session.status !== 'active') {
      const error = new Error('Active interview session not found');
      error.statusCode = 404;
      throw error;
    }

    let resumeText = 'No resume provided.';
    if (session.resumeId) {
      const resume = await Resume.findOne({ _id: session.resumeId, userId });
      if (resume) {
        resumeText = `Name: ${resume.fullName}\nRole: ${resume.jobRole}\nSummary: ${resume.summary || ''}\nSkills: ${resume.skills.join(', ')}\n`;
      }
    }

    const currentQIndex = session.currentQuestionIndex;
    const currentQLog = session.chatHistory[currentQIndex];
    if (!currentQLog) {
      const error = new Error('Current question log not found');
      error.statusCode = 400;
      throw error;
    }

    let score = 50;
    let review = 'Response evaluated.';
    let modelAnswer = 'Model response.';

    try {
      const parsed = await AIManager.generateInterviewEvaluation({
        question: currentQLog.question,
        userAnswer
      }, { userId });
      score = parsed.score;
      review = parsed.review;
      modelAnswer = parsed.modelAnswer;
    } catch (err) {
      console.warn('[submitAnswer] Answer evaluation failed, using default fallback score:', err.message);
    }

    currentQLog.userAnswer = userAnswer;
    currentQLog.score = score;
    currentQLog.review = review;
    currentQLog.modelAnswer = modelAnswer;

    const queryText = `Job Description: ${session.jobDescription}\nRole: ${session.role}\nQuestion: ${currentQLog.question}\nAnswer: ${userAnswer}`;
    const retrievedChunks = await RAGRetriever.retrieve({
      userId,
      queryText,
      limit: 3
    });
    const retrievedContext = retrievedChunks.map(c => `[Doc: ${c.documentId?.title || 'Study Guide'}]: ${c.text}`).join('\n\n');

    session.currentQuestionIndex += 1;

    let nextQuestionData = null;
    const maxQuestions = 5;
    
    if (session.currentQuestionIndex < maxQuestions) {
      nextQuestionData = await AIManager.generateInterviewQuestion({
        resumeText,
        jobDescription: session.jobDescription,
        interviewType: session.interviewType,
        difficulty: session.difficulty,
        company: session.company,
        role: session.role,
        chatHistory: session.chatHistory,
        retrievedContext
      }, { userId });

      session.chatHistory.push({
        question: nextQuestionData.question,
        category: nextQuestionData.category,
        difficulty: nextQuestionData.difficulty
      });
    } else {
      session.status = 'completed';
    }

    await session.save();

    return {
      review,
      score,
      modelAnswer,
      completed: session.status === 'completed',
      nextQuestion: nextQuestionData
    };
  }

  static async finalizeSession(userId, { sessionId }) {
    if (!sessionId) {
      const error = new Error('SessionId is required');
      error.statusCode = 400;
      throw error;
    }

    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session) {
      const error = new Error('Session not found');
      error.statusCode = 404;
      throw error;
    }

    let resumeText = 'No resume provided.';
    if (session.resumeId) {
      const resume = await Resume.findOne({ _id: session.resumeId, userId });
      if (resume) {
        resumeText = `Name: ${resume.fullName}\nRole: ${resume.jobRole}\nSummary: ${resume.summary || ''}\nSkills: ${resume.skills.join(', ')}\n`;
      }
    }

    const queryText = `Job Description: ${session.jobDescription}\nRole: ${session.role}`;
    const retrievedChunks = await RAGRetriever.retrieve({
      userId,
      queryText,
      limit: 4
    });
    const retrievedContext = retrievedChunks.map(c => c.text).join('\n\n');

    const feedback = await AIManager.generateInterviewFeedback({
      resumeText,
      jobDescription: session.jobDescription,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      company: session.company,
      role: session.role,
      chatHistory: session.chatHistory
    }, { userId });

    const studyPlan = await AIManager.generateInterviewStudyPlan({
      resumeText,
      jobDescription: session.jobDescription,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      company: session.company,
      role: session.role,
      retrievedContext,
      feedbackScores: feedback.scores
    }, { userId });

    const careerIntelligence = await AIManager.generateCareerIntelligence({
      resumeText,
      jobDescription: session.jobDescription,
      atsScore: feedback.scores.resumeConsistency || 75,
      performanceScore: feedback.overallScore
    }, { userId });

    session.feedback = feedback;
    session.studyPlan = studyPlan;
    session.careerIntelligence = careerIntelligence;
    session.status = 'completed';
    await session.save();

    return {
      feedback,
      studyPlan,
      careerIntelligence
    };
  }
}

module.exports = InterviewService;
