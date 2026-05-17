import type { ResumeData } from '../types/resumeTypes';
import { apiUrl, authHeaders, getStoredToken } from './apiClient';

const API_URL = apiUrl('/resumes');

interface StoredUser {
  token: string;
}

export interface SavedResume extends ResumeData {
  _id: string;
  templateId?: string;
  customSections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

// Get user token
const getToken = () => getStoredToken();

// Save resume
const saveResume = async (resumeData: Omit<SavedResume, '_id' | 'createdAt' | 'updatedAt'>) => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(resumeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to save resume');
  }

  return data;
};

// Get user resumes
const getResumes = async (): Promise<SavedResume[]> => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: authHeaders(false),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch resumes');
  }

  return data.data;
};

// Delete resume
const deleteResume = async (id: string) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(false),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete resume');
  }

  return data;
};

const resumeService = {
  saveResume,
  getResumes,
  deleteResume,
};

export default resumeService;
