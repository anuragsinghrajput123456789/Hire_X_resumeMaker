import { ResumeData } from '../types/resumeTypes';
import { apiUrl, authHeaders, apiFetch } from './apiClient';

const API_URL = apiUrl('/ai');

export interface AnalysisResult {
  atsScore: number;
  missingKeywords: string[];
  formatSuggestions: string[];
  improvements: string[];
  matchingJobRoles: string[];
}

export interface RealTimeAnalysis {
  keywordMatchScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  readabilityScore: number;
  structureAnalysis: {
    [key: string]: boolean;
  };
  formattingIssues: string[];
}

export interface JobDescriptionAnalysis {
  requiredKeywords: string[];
  missingFromResume: string[];
  recommendedSkills: string[];
  keywordInsertions: Array<{
    keyword: string;
    suggestion: string;
    section: string;
  }>;
}

// AI requests get a longer timeout (60s) since they involve LLM processing
const AI_TIMEOUT = 60_000;

export const analyzeResumeRealTime = async (resumeText: string, jobRole: string): Promise<RealTimeAnalysis> => {
    try {
        const response = await apiFetch(`${API_URL}/analyze-resume-realtime`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, jobRole }),
            timeoutMs: AI_TIMEOUT,
        });
        return await response.json();
    } catch (error) {
        console.error("analyzeResumeRealTime error:", error);
        throw error;
    }
};

export const analyzeResume = async (resumeText: string, jobRole?: string): Promise<AnalysisResult> => {
    try {
        const response = await apiFetch(`${API_URL}/analyze-resume`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, jobRole }),
            timeoutMs: AI_TIMEOUT,
        });
        return await response.json();
    } catch (error) {
         console.error("analyzeResume error:", error);
         throw error;
    }
};

export const analyzeJobDescription = async (resumeText: string, jobDescription: string): Promise<JobDescriptionAnalysis> => {
    try {
        const response = await apiFetch(`${API_URL}/analyze-job`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, jobDescription }),
            timeoutMs: AI_TIMEOUT,
        });
        return await response.json();
    } catch (error) {
        console.error("analyzeJobDescription error:", error);
        throw error;
    }
};

export const generateResumeContent = async (prompt: string): Promise<string> => {
    try {
        const response = await apiFetch(`${API_URL}/generate-content`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ prompt }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error("generateResumeContent error:", error);
        throw error;
    }
};

export interface GenerateResumeResponse {
  result: string;
  parsedData?: ResumeData;
}

export const generateResume = async (data: ResumeData): Promise<GenerateResumeResponse> => {
    try {
        const response = await apiFetch(`${API_URL}/generate-resume`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ data }),
            timeoutMs: AI_TIMEOUT,
        });
        const resData = await response.json();
        return {
            result: resData.result,
            parsedData: resData.parsedData
        };
    } catch (error) {
         console.error("generateResume error:", error);
         throw error;
    }
};

export const getJobSuggestions = async (resumeText: string, targetRole?: string): Promise<string> => {
    try {
        const response = await apiFetch(`${API_URL}/job-suggestions`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, targetRole }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        return data.result;
    } catch (error) {
         console.error("getJobSuggestions error:", error);
         throw error;
    }
};

export const generateChatResponse = async (message: string, history?: { role: string, content: string }[]): Promise<string> => {
    try {
        const response = await apiFetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ message, history }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        return data.result;
    } catch (error) {
         console.error("generateChatResponse error:", error);
         throw error;
    }
};

export const generateColdEmail = async (prompt: string): Promise<string> => {
    try {
        const response = await apiFetch(`${API_URL}/cold-email`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ prompt }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        return data.result;
    } catch (error) {
         console.error("generateColdEmail error:", error);
         throw error;
     }
};

export interface CoverLetterResponse {
  company: string;
  jobTitle: string;
  opening: string;
  experience: string;
  skills: string;
  closing: string;
  coverLetter: string;
  missingSkills: string[];
  recommendedChanges: string[];
}

export const generateCoverLetter = async (params: {
  resumeText: string;
  jobDescription: string;
  tone?: string;
  length?: string;
  experienceLevel?: string;
  companyName?: string;
  jobTitle?: string;
}): Promise<CoverLetterResponse> => {
  try {
    const response = await apiFetch(`${API_URL}/cover-letter`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(params),
      timeoutMs: AI_TIMEOUT,
    });
    return await response.json();
  } catch (error) {
    console.error("generateCoverLetter error:", error);
    throw error;
  }
};

export interface FeatureUsage {
  used: number;
  limit: number;
  remaining: number;
  progressPercent: number;
}

export interface AIUsageResponse {
  date: string;
  tier: string;
  countdown: {
    hours: number;
    minutes: number;
    totalSeconds: number;
    formatted: string;
  };
  usage: Record<string, FeatureUsage>;
}

export const getAIUsage = async (): Promise<AIUsageResponse> => {
  try {
    const response = await apiFetch(`${API_URL}/usage`, {
      method: 'GET',
      headers: authHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("getAIUsage error:", error);
    throw error;
  }
};
