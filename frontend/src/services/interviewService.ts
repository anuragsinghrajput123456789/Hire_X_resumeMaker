import { apiUrl, authHeaders, apiFetch } from './apiClient';

const API_URL = apiUrl('/interviews');

// AI-heavy interview calls get a longer timeout
const INTERVIEW_TIMEOUT = 60_000;

export interface RAGDocument {
  _id: string;
  title: string;
  fileName: string;
  fileType: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  content: string;
  createdAt: string;
}

export interface RAGChunk {
  _id: string;
  documentId?: {
    _id: string;
    title: string;
    category: string;
  };
  text: string;
  pageNumber: number;
  sectionHeader: string;
  score?: number;
}

export interface InterviewRoadmap {
  role: string;
  company: string;
  difficulty: string;
  overview: string;
  keyFocusAreas: Array<{
    area: string;
    description: string;
    importance: string;
  }>;
  roadmapSteps: Array<{
    dayOrWeek: string;
    title: string;
    tasks: string[];
    resources: string[];
  }>;
  atsAnalysisSummary?: string;
}

export interface InterviewQuestion {
  questionNumber: number;
  question: string;
  category: string;
  difficulty: string;
  contextRetrieved?: string;
  hint?: string;
}

export interface InterviewFeedback {
  overallScore: number;
  scores: {
    technicalAccuracy: number;
    communication: number;
    confidence: number;
    problemSolving: number;
    systemDesign: number;
    behavioralAnswers: number;
    resumeConsistency: number;
    overallReadiness: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailedQuestionEvaluation: Array<{
    question: string;
    userAnswer: string;
    score: number;
    review: string;
    modelAnswer: string;
  }>;
}

export interface InterviewStudyPlan {
  missingSkills: string[];
  recommendedTopics: string[];
  leetcodeAreas: string[];
  projectsToBuild: string[];
  studyResources: Array<{
    title: string;
    urlOrType: string;
    reason: string;
  }>;
  estimatedPreparationTime: string;
  weeklyPlan: Array<{
    week: string;
    topics: string[];
    objective: string;
  }>;
}

export interface CareerIntelligence {
  hiringProbability: string;
  skillGapAnalysis: Array<{
    skill: string;
    gapLevel: string;
    recommendation: string;
  }>;
  recommendedCertifications: string[];
  suggestedProjects: string[];
  salaryRange: {
    min: string;
    max: string;
    average: string;
    currency: string;
  };
  careerGrowthAdvice: string;
}

export const uploadDocument = async (data: {
  title: string;
  fileName: string;
  fileType: string;
  category: string;
  tags?: string[];
  content: string;
}): Promise<{ success: boolean; data: RAGDocument }> => {
  const response = await apiFetch(`${API_URL}/documents/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const getDocuments = async (params?: {
  search?: string;
  type?: 'keyword' | 'semantic';
  category?: string;
  favorite?: boolean;
  tag?: string;
}): Promise<{ success: boolean; type: string; data: any[] }> => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.favorite !== undefined) queryParams.append('favorite', String(params.favorite));
  if (params?.tag) queryParams.append('tag', params.tag);

  const response = await apiFetch(`${API_URL}/documents?${queryParams.toString()}`, {
    method: 'GET',
    headers: authHeaders(false),
  });
  return await response.json();
};

export const updateDocument = async (
  id: string,
  updates: { title?: string; isFavorite?: boolean; tags?: string[] }
): Promise<{ success: boolean; data: RAGDocument }> => {
  const response = await apiFetch(`${API_URL}/documents/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  return await response.json();
};

export const deleteDocument = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiFetch(`${API_URL}/documents/${id}`, {
    method: 'DELETE',
    headers: authHeaders(false),
  });
  return await response.json();
};

export const startSession = async (data: {
  jobDescription: string;
  resumeId?: string;
  interviewType: string;
  difficulty: string;
  company?: string;
  role?: string;
}): Promise<{
  success: boolean;
  sessionId: string;
  roadmap: InterviewRoadmap;
  question: InterviewQuestion;
}> => {
  const response = await apiFetch(`${API_URL}/session/start`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
    timeoutMs: INTERVIEW_TIMEOUT,
  });
  return await response.json();
};

export const submitAnswer = async (data: {
  sessionId: string;
  userAnswer: string;
}): Promise<{
  success: boolean;
  review: string;
  score: number;
  modelAnswer: string;
  completed: boolean;
  nextQuestion?: InterviewQuestion;
}> => {
  const response = await apiFetch(`${API_URL}/session/answer`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
    timeoutMs: INTERVIEW_TIMEOUT,
  });
  return await response.json();
};

export const finalizeSession = async (data: {
  sessionId: string;
}): Promise<{
  success: boolean;
  feedback: InterviewFeedback;
  studyPlan: InterviewStudyPlan;
  careerIntelligence: CareerIntelligence;
}> => {
  const response = await apiFetch(`${API_URL}/session/finalize`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
    timeoutMs: INTERVIEW_TIMEOUT,
  });
  return await response.json();
};
