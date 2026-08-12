import type { ResumeData } from '../types/resumeTypes';
import { apiUrl, authHeaders, apiFetch, getStoredToken } from './apiClient';

const API_URL = apiUrl('/resumes');
const GUEST_KEY = 'hirex_guest_resumes';

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

const getGuestResumes = (): SavedResume[] => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestResume = (resumeData: Omit<SavedResume, 'createdAt' | 'updatedAt'> & { _id?: string }) => {
  const current = getGuestResumes();
  const now = new Date().toISOString();
  const id = resumeData._id || `guest_res_${Date.now()}`;
  
  const formatted: SavedResume = {
    ...resumeData,
    _id: id,
    createdAt: resumeData._id ? (current.find(r => r._id === id)?.createdAt || now) : now,
    updatedAt: now,
  };

  const existingIdx = current.findIndex(r => r._id === id);
  if (existingIdx >= 0) {
    current[existingIdx] = formatted;
  } else {
    current.unshift(formatted);
  }

  localStorage.setItem(GUEST_KEY, JSON.stringify(current));
  return { success: true, data: formatted };
};

const deleteGuestResume = (id: string) => {
  const current = getGuestResumes().filter(r => r._id !== id);
  localStorage.setItem(GUEST_KEY, JSON.stringify(current));
  return { success: true };
};

// Save resume
const saveResume = async (resumeData: Omit<SavedResume, 'createdAt' | 'updatedAt'> & { _id?: string }) => {
  const token = getStoredToken();
  if (!token) {
    return saveGuestResume(resumeData);
  }

  try {
    const response = await apiFetch(API_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(resumeData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Fallback to guest local storage if network request fails
    console.warn("Saving to backend failed, caching in localStorage:", error);
    return saveGuestResume(resumeData);
  }
};

// Get user resumes
const getResumes = async (): Promise<SavedResume[]> => {
  const token = getStoredToken();
  if (!token) {
    return getGuestResumes();
  }

  try {
    const response = await apiFetch(API_URL, {
      method: 'GET',
      headers: authHeaders(false),
    });

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.warn("Fetching backend resumes failed, returning local guest resumes:", error);
    return getGuestResumes();
  }
};

// Delete resume
const deleteResume = async (id: string) => {
  const token = getStoredToken();
  if (!token || id.startsWith('guest_res_')) {
    return deleteGuestResume(id);
  }

  try {
    const response = await apiFetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(false),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return deleteGuestResume(id);
  }
};

const resumeService = {
  saveResume,
  getResumes,
  deleteResume,
  getGuestResumes,
};

export default resumeService;
