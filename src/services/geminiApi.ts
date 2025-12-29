import { ResumeData } from '../types/resumeTypes';

const API_URL = 'http://localhost:5000/api/ai';

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

const handleResponse = async (response: Response, functionName: string) => {
    if (!response.ok) {
        const text = await response.text();
        console.error(`API Error in ${functionName}:`, response.status, response.statusText, text);
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || `Failed to ${functionName} (Status ${response.status})`);
        } catch (e) {
            throw new Error(`Failed to ${functionName}: ${text.substring(0, 100)}...`);
        }
    }
    return await response.json();
};

export const analyzeResumeRealTime = async (resumeText: string, jobRole: string): Promise<RealTimeAnalysis> => {
    try {
        const response = await fetch(`${API_URL}/analyze-resume-realtime`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText, jobRole })
        });
        return await handleResponse(response, 'analyze resume real-time');
    } catch (error) {
        console.error("analyzeResumeRealTime error:", error);
        throw error;
    }
};

export const analyzeResume = async (resumeText: string, jobRole?: string): Promise<AnalysisResult> => {
    try {
        const response = await fetch(`${API_URL}/analyze-resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText, jobRole })
        });
        return await handleResponse(response, 'analyze resume');
    } catch (error) {
         console.error("analyzeResume error:", error);
         throw error;
    }
};

export const analyzeJobDescription = async (resumeText: string, jobDescription: string): Promise<JobDescriptionAnalysis> => {
    try {
        const response = await fetch(`${API_URL}/analyze-job`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText, jobDescription })
        });
        return await handleResponse(response, 'analyze job description');
    } catch (error) {
        console.error("analyzeJobDescription error:", error);
        throw error;
    }
};

export const generateResumeContent = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/generate-content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await handleResponse(response, 'generate content');
        return data.result;
    } catch (error) {
        console.error("generateResumeContent error:", error);
        throw error;
    }
};

export const generateResume = async (data: ResumeData): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/generate-resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });
        const resData = await handleResponse(response, 'generate resume');
        return resData.result;
    } catch (error) {
        console.error("generateResume error:", error);
        throw error;
    }
};

export const generateResumeFromImage = async (image: string, data: ResumeData): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/generate-resume-from-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, data })
        });
        const resData = await handleResponse(response, 'generate resume from image');
        return resData.result;
    } catch (error) {
        console.error("generateResumeFromImage error:", error);
        throw error;
    }
};

export const getJobSuggestions = async (resumeText: string, targetRole?: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/job-suggestions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText, targetRole })
        });
        const data = await handleResponse(response, 'get job suggestions');
        return data.result;
    } catch (error) {
         console.error("getJobSuggestions error:", error);
         throw error;
    }
};

export const generateChatResponse = async (message: string, history?: { role: string, content: string }[]): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history })
        });
        const data = await handleResponse(response, 'generate chat response');
        return data.result;
    } catch (error) {
         console.error("generateChatResponse error:", error);
         throw error;
    }
};

export const generateColdEmail = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/cold-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await handleResponse(response, 'generate cold email');
        return data.result;
    } catch (error) {
         console.error("generateColdEmail error:", error);
         throw error;
    }
};
