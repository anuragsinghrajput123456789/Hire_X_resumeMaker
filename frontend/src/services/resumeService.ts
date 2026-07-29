import type { ResumeData } from '../types/resumeTypes';
import { apiUrl, authHeaders, apiFetch } from './apiClient';

const API_URL = apiUrl('/resumes');

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

// Save resume
const saveResume = async (resumeData: Omit<SavedResume, 'createdAt' | 'updatedAt'> & { _id?: string }) => {
  const response = await apiFetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(resumeData),
  });

  const data = await response.json();
  return data;
};

// Get user resumes
const getResumes = async (): Promise<SavedResume[]> => {
  const response = await apiFetch(API_URL, {
    method: 'GET',
    headers: authHeaders(false),
  });

  const data = await response.json();
  return data.data;
};

// Delete resume
const deleteResume = async (id: string) => {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(false),
  });

  const data = await response.json();
  return data;
};

const resumeService = {
  saveResume,
  getResumes,
  deleteResume,
};

export default resumeService;
