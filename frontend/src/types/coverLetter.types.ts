import { CoverLetterResponse } from '../services/aiService';

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

export interface CoverLetterFormData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  tone: string;
  length: string;
  expLevel: string;
  resumeSource: 'upload' | 'select';
  selectedResumeId: string;
  uploadedResumeText: string;
  uploadedFileName: string;
}
