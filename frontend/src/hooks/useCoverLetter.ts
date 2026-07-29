import { useState, useCallback, useEffect } from 'react';
import { generateCoverLetter, CoverLetterResponse } from '../services/aiService';
import { 
  saveCoverLetter, 
  getCoverLetterHistory, 
  deleteCoverLetter, 
  SavedCoverLetter 
} from '../services/coverLetterService';
import resumeService, { SavedResume } from '../services/resumeService';
import { useToast } from '../components/ui/use-toast';

export interface UseCoverLetterParams {
  token: string | undefined;
}

export const useCoverLetter = (token?: string) => {
  const { toast } = useToast();

  // Form State
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [expLevel, setExpLevel] = useState('Mid-Level');
  const [resumeSource, setResumeSource] = useState<'upload' | 'select'>('upload');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [uploadedResumeText, setUploadedResumeText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Status & Output States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [generatedData, setGeneratedData] = useState<CoverLetterResponse | null>(null);
  const [history, setHistory] = useState<SavedCoverLetter[]>([]);
  const [activeTab, setActiveTab] = useState('editor');

  const fetchSavedResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const data = await resumeService.getResumes();
      setSavedResumes(data || []);
      if (data && data.length > 0) {
        setSelectedResumeId(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoadingResumes(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getCoverLetterHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchSavedResumes();
      fetchHistory();
    }
  }, [token, fetchSavedResumes, fetchHistory]);

  const getEffectiveResumeText = (): string => {
    if (resumeSource === 'upload') {
      return uploadedResumeText;
    }
    const found = savedResumes.find((r) => r._id === selectedResumeId);
    if (!found) return '';

    let text = `Name: ${found.fullName}\nRole: ${found.jobRole || ''}\nSummary: ${found.summary || ''}\nSkills: ${(found.skills || []).join(', ')}\n`;
    if (found.experience && found.experience.length > 0) {
      text += 'Experience:\n';
      found.experience.forEach((e) => {
        text += `- ${e.role} at ${e.company} (${e.duration}): ${e.description}\n`;
      });
    }
    return text;
  };

  const handleGenerate = async () => {
    const resumeText = getEffectiveResumeText();
    if (!resumeText || resumeText.trim().length < 20) {
      toast({
        title: 'Resume Content Missing',
        description: 'Please upload a valid resume PDF or select an existing stored resume profile.',
        variant: 'destructive',
      });
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 10) {
      toast({
        title: 'Job Description Missing',
        description: 'Please input the job description to tailor the cover letter.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const result = await generateCoverLetter({
        resumeText,
        jobDescription,
        tone,
        length,
        experienceLevel: expLevel,
        companyName: companyName.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
      });

      setGeneratedData(result);
      toast({
        title: 'Cover Letter Tailored!',
        description: 'Your premium cover letter has been generated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to communicate with AI model.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;
    setIsSaving(true);
    try {
      const saved = await saveCoverLetter({
        company: companyName.trim() || generatedData.company || 'Target Company',
        jobTitle: jobTitle.trim() || generatedData.jobTitle || 'Target Role',
        jobDescription,
        tone,
        length,
        experienceLevel: expLevel,
        coverLetterText: generatedData.coverLetter,
        structuredData: generatedData,
        resumeId: resumeSource === 'select' ? selectedResumeId : undefined,
      });

      setHistory((prev) => [saved, ...prev]);
      toast({
        title: 'Cover Letter Saved!',
        description: 'Saved to your dashboard history.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Save',
        description: error.message || 'Could not save cover letter.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await deleteCoverLetter(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: 'Deleted',
        description: 'Cover letter removed from history.',
      });
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Could not delete item.',
        variant: 'destructive',
      });
    }
  };

  const loadFromHistory = (item: SavedCoverLetter) => {
    setGeneratedData(item.structuredData || {
      company: item.company,
      jobTitle: item.jobTitle,
      opening: '',
      experience: '',
      skills: '',
      closing: '',
      coverLetter: item.coverLetterText,
      missingSkills: [],
      recommendedChanges: []
    });
    setCompanyName(item.company);
    setJobTitle(item.jobTitle);
    setJobDescription(item.jobDescription);
    setTone(item.tone || 'Professional');
    setLength(item.length || 'Medium');
    setExpLevel(item.experienceLevel || 'Mid-Level');
    setActiveTab('editor');

    toast({
      title: 'History Loaded',
      description: `Loaded cover letter for ${item.company}`,
    });
  };

  return {
    jobDescription,
    setJobDescription,
    companyName,
    setCompanyName,
    jobTitle,
    setJobTitle,
    tone,
    setTone,
    length,
    setLength,
    expLevel,
    setExpLevel,
    resumeSource,
    setResumeSource,
    selectedResumeId,
    setSelectedResumeId,
    uploadedResumeText,
    setUploadedResumeText,
    uploadedFileName,
    setUploadedFileName,
    isGenerating,
    isExtracting,
    setIsExtracting,
    isSaving,
    loadingResumes,
    savedResumes,
    generatedData,
    history,
    activeTab,
    setActiveTab,
    handleGenerate,
    handleSave,
    handleDeleteHistory,
    loadFromHistory,
  };
};
