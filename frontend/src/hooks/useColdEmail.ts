import { useState, useCallback, useEffect } from 'react';
import { generateColdEmail } from '../services/aiService';
import { saveColdEmail, getColdEmailHistory, deleteColdEmail } from '../services/coldEmailService';
import { useToast } from '../components/ui/use-toast';

export const useColdEmail = (token?: string) => {
  const { toast } = useToast();

  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientCompany, setRecipientCompany] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [personalNote, setPersonalNote] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getColdEmailHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching email history:', error);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token, fetchHistory]);

  const handleGenerate = async () => {
    if (!recipientName.trim() || !jobTitle.trim()) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please specify at least the recipient name and job title.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedEmail('');

    const prompt = `
Write a highly compelling, personalized cold email for a job opportunity.
Recipient Name: ${recipientName}
${recipientCompany ? `Company: ${recipientCompany}` : ''}
${recipientRole ? `Recipient Role: ${recipientRole}` : ''}
Sender Name: ${senderName || 'Job Applicant'}
Target Job Title: ${jobTitle}
${experience ? `Experience Overview: ${experience}` : ''}
${skills ? `Key Skills: ${skills}` : ''}
${personalNote ? `Personal Note / Context: ${personalNote}` : ''}

Generate a clear subject line and professional body text. Format with subject on top.
`;

    try {
      const result = await generateColdEmail(prompt);
      setGeneratedEmail(result);
      toast({
        title: 'Email Generated!',
        description: 'Your personalized cold outreach email is ready.',
      });
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate email.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedEmail) return;
    setIsSaving(true);
    try {
      const saved = await saveColdEmail({
        recipientName,
        recipientEmail,
        recipientCompany,
        recipientRole,
        senderName,
        senderEmail,
        jobTitle,
        experience,
        skills,
        personalNote,
        content: generatedEmail,
      });

      setHistory((prev) => [saved, ...prev]);
      toast({
        title: 'Email Saved!',
        description: 'Saved to history.',
      });
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Could not save email.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteColdEmail(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: 'Email Removed',
        description: 'Removed from history.',
      });
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Could not delete email.',
        variant: 'destructive',
      });
    }
  };

  return {
    recipientName, setRecipientName,
    recipientEmail, setRecipientEmail,
    recipientCompany, setRecipientCompany,
    recipientRole, setRecipientRole,
    senderName, setSenderName,
    senderEmail, setSenderEmail,
    jobTitle, setJobTitle,
    experience, setExperience,
    skills, setSkills,
    personalNote, setPersonalNote,
    isGenerating,
    generatedEmail,
    isSaving,
    history,
    handleGenerate,
    handleSave,
    handleDelete,
  };
};
