import { ResumeData } from '../types/resumeTypes';
import { apiUrl, authHeaders, apiFetch, getStoredToken } from './apiClient';
import { getGuestAiUsage, incrementGuestAiUsage, MAX_GUEST_AI_LIMIT } from './guestAiLimit';

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

const verifyGuestQuota = () => {
  const guestStatus = getGuestAiUsage();
  if (guestStatus.isGuest && !guestStatus.canUse) {
    throw new Error(`Guest AI limit reached (${guestStatus.limit}/${guestStatus.limit} free uses used). Please Sign In or Register to continue!`);
  }
};

const notifyGuestSuccess = () => {
  const token = getStoredToken();
  if (!token) {
    incrementGuestAiUsage();
  }
};

export const analyzeResumeRealTime = async (resumeText: string, jobRole: string): Promise<RealTimeAnalysis> => {
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/analyze-resume-realtime`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, jobRole }),
            timeoutMs: AI_TIMEOUT,
        });
        const result = await response.json();
        notifyGuestSuccess();
        return result;
    } catch (error) {
        console.error("analyzeResumeRealTime error:", error);
        throw error;
    }
};

export const analyzeResume = async (resumeText: string, jobRole?: string): Promise<AnalysisResult> => {
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/analyze-resume`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, jobRole }),
            timeoutMs: AI_TIMEOUT,
        });
        const result = await response.json();
        notifyGuestSuccess();
        return result;
    } catch (error) {
         console.error("analyzeResume error:", error);
         throw error;
    }
};

export const analyzeJobDescription = async (resumeText: string, jobDescription: string): Promise<JobDescriptionAnalysis> => {
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/analyze-job`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, jobDescription }),
            timeoutMs: AI_TIMEOUT,
        });
        const result = await response.json();
        notifyGuestSuccess();
        return result;
    } catch (error) {
        console.error("analyzeJobDescription error:", error);
        throw error;
    }
};

export const generateResumeContent = async (prompt: string): Promise<string> => {
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/generate-content`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ prompt }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        notifyGuestSuccess();
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
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/generate-resume`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ data }),
            timeoutMs: AI_TIMEOUT,
        });
        const resData = await response.json();
        notifyGuestSuccess();
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
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/job-suggestions`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeText, targetRole }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        notifyGuestSuccess();
        return data.result;
    } catch (error) {
         console.error("getJobSuggestions error:", error);
         throw error;
    }
};

export const generateChatResponse = async (message: string, history?: { role: string, content: string }[]): Promise<string> => {
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ message, history }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        notifyGuestSuccess();
        return data.result;
    } catch (error) {
         console.error("generateChatResponse error:", error);
         throw error;
    }
};

export const generateColdEmail = async (prompt: string): Promise<string> => {
    verifyGuestQuota();
    try {
        const response = await apiFetch(`${API_URL}/cold-email`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ prompt }),
            timeoutMs: AI_TIMEOUT,
        });
        const data = await response.json();
        notifyGuestSuccess();
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
  verifyGuestQuota();
  try {
    const response = await apiFetch(`${API_URL}/cover-letter`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(params),
      timeoutMs: AI_TIMEOUT,
    });
    const result = await response.json();
    notifyGuestSuccess();
    return result;
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
  const token = getStoredToken();
  if (!token) {
    const guestStatus = getGuestAiUsage();
    return {
      date: new Date().toISOString().split('T')[0],
      tier: 'Guest (Free)',
      countdown: { hours: 24, minutes: 0, totalSeconds: 86400, formatted: 'Guest Account' },
      usage: {
        guestAiCredits: {
          used: guestStatus.used,
          limit: MAX_GUEST_AI_LIMIT,
          remaining: guestStatus.remaining,
          progressPercent: Math.round((guestStatus.used / MAX_GUEST_AI_LIMIT) * 100)
        }
      }
    };
  }

  try {
    const response = await apiFetch(`${API_URL}/usage`, {
      method: 'GET',
      headers: authHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("getAIUsage error:", error);
    const guestStatus = getGuestAiUsage();
    return {
      date: new Date().toISOString().split('T')[0],
      tier: 'Guest Mode',
      countdown: { hours: 24, minutes: 0, totalSeconds: 86400, formatted: 'Guest Mode' },
      usage: {
        guestAiCredits: {
          used: guestStatus.used,
          limit: MAX_GUEST_AI_LIMIT,
          remaining: guestStatus.remaining,
          progressPercent: Math.round((guestStatus.used / MAX_GUEST_AI_LIMIT) * 100)
        }
      }
    };
  }
};
