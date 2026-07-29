import { apiUrl, authHeaders, apiFetch } from './apiClient';
import { CoverLetterResponse } from './aiService';

const API_URL = apiUrl('/cover-letter');

export interface SavedCoverLetter {
  _id: string;
  userId: string;
  resumeId?: string;
  company: string;
  jobTitle: string;
  jobDescription: string;
  tone: string;
  length: string;
  experienceLevel: string;
  coverLetterText: string;
  structuredData: CoverLetterResponse;
  createdAt: string;
}

export const saveCoverLetter = async (letterData: Omit<SavedCoverLetter, '_id' | 'userId' | 'createdAt'>): Promise<SavedCoverLetter> => {
    try {
        const response = await apiFetch(`${API_URL}/save`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(letterData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving cover letter:', error);
        throw error;
    }
};

export const getCoverLetterHistory = async (): Promise<SavedCoverLetter[]> => {
    try {
        const response = await apiFetch(`${API_URL}/history`, {
            method: 'GET',
            headers: authHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

export const deleteCoverLetter = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await apiFetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting cover letter:', error);
        throw error;
    }
};
