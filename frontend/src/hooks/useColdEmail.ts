import { useState, useCallback, useEffect } from 'react';
import { generateColdEmail } from '../services/aiService';
import { saveColdEmail, getColdEmailHistory, deleteColdEmail } from '../services/coldEmailService';
import { SavedColdEmail } from '../types/coldEmail.types';
import { useToast } from '../components/ui/use-toast';

export const TONE_OPTIONS = [
  { id: 'persuasive', label: 'Persuasive & Impact-Driven', icon: '⚡' },
  { id: 'direct', label: 'Short & Direct (< 150 words)', icon: '🎯' },
  { id: 'executive', label: 'Formal & Executive', icon: '💼' },
  { id: 'casual', label: 'Casual & Friendly', icon: '☕' },
];

export const GOAL_OPTIONS = [
  { id: 'job_inquiry', label: 'Direct Job Inquiry' },
  { id: 'networking', label: 'Networking & Advice' },
  { id: 'referral', label: 'Internal Referral Request' },
  { id: 'follow_up', label: 'Application Follow Up' },
];

export const CTA_OPTIONS = [
  { id: 'call_15', label: '15-min Intro Call' },
  { id: 'resume_review', label: 'Resume Review' },
  { id: 'quick_reply', label: 'Simple Reply' },
];

export const useColdEmail = (token?: string) => {
  const { toast } = useToast();

  // Form Fields State
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
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Strategy Presets
  const [tone, setTone] = useState('persuasive');
  const [goal, setGoal] = useState('job_inquiry');
  const [ctaType, setCtaType] = useState('call_15');

  // Status & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<SavedColdEmail[]>([]);

  // Parse subject line and body from raw AI generated content
  const parseGeneratedEmail = (content: string) => {
    if (!content) {
      setSubjectLine('');
      setEmailBody('');
      return;
    }

    const subjectMatch = content.match(/^Subject:\s*(.*(?:\r?\n|$))/i);
    if (subjectMatch) {
      const extractedSub = subjectMatch[1].trim();
      const extractedBody = content.replace(/^Subject:\s*.*(?:\r?\n)+/i, '').trim();
      setSubjectLine(extractedSub);
      setEmailBody(extractedBody);
    } else {
      const lines = content.split('\n');
      if (lines[0].toLowerCase().includes('subject')) {
        setSubjectLine(lines[0].replace(/subject:\s*/i, '').trim());
        setEmailBody(lines.slice(1).join('\n').trim());
      } else {
        setSubjectLine(`Application for ${jobTitle || 'Target Role'} - ${senderName || 'Candidate'}`);
        setEmailBody(content.trim());
      }
    }
  };

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
    if (!recipientName.trim()) {
      toast({
        title: 'Recipient Name Required',
        description: 'Please enter the name of the recipient (e.g. Sarah Jenkins).',
        variant: 'destructive',
      });
      return;
    }

    if (!jobTitle.trim()) {
      toast({
        title: 'Target Job Title Required',
        description: 'Please specify the position you are applying for.',
        variant: 'destructive',
      });
      return;
    }

    if (!recipientCompany.trim()) {
      toast({
        title: 'Company Name Required',
        description: 'Please specify the target company name.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    const selectedToneLabel = TONE_OPTIONS.find((t) => t.id === tone)?.label || tone;
    const selectedGoalLabel = GOAL_OPTIONS.find((g) => g.id === goal)?.label || goal;
    const selectedCtaLabel = CTA_OPTIONS.find((c) => c.id === ctaType)?.label || ctaType;

    const prompt = `
Write a high-converting, tailored cold outreach email.
Recipient Name: ${recipientName}
Target Company: ${recipientCompany}
${recipientRole ? `Recipient Title/Role: ${recipientRole}` : ''}
${recipientEmail ? `Recipient Email: ${recipientEmail}` : ''}
Sender Name: ${senderName || 'Candidate'}
${senderEmail ? `Sender Email: ${senderEmail}` : ''}
Target Job Title: ${jobTitle}
${skills ? `Key Skills & Stack: ${skills}` : ''}
${experience ? `Experience Overview & Key Achievements: ${experience}` : ''}
${personalNote ? `Specific Context / Reference / Blog / Project: ${personalNote}` : ''}
${portfolioUrl ? `Portfolio / GitHub / LinkedIn: ${portfolioUrl}` : ''}

OUTREACH STRATEGY PARAMETERS:
- Overall Tone: ${selectedToneLabel}
- Outreach Primary Goal: ${selectedGoalLabel}
- Requested Call to Action: ${selectedCtaLabel}

CRITICAL FORMATTING INSTRUCTIONS:
1. Provide a crisp, high-open-rate Subject Line starting with "Subject: ".
2. Follow with a personalized email body that grabs attention, highlights relevant value/skills immediately, and ends with a clear, low-friction Call to Action.
3. Include a clean sign-off with candidate contact details.
`;

    try {
      const result = await generateColdEmail(prompt);
      setGeneratedEmail(result);
      parseGeneratedEmail(result);
      toast({
        title: 'Cold Email Crafted!',
        description: 'Your personalized outreach message is ready to send.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate email.',
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
        title: 'Email Saved to History!',
        description: 'You can revisit or re-copy this outreach draft anytime.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Could not save email.',
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
    } catch (error: unknown) {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Could not delete email.',
        variant: 'destructive',
      });
    }
  };

  const getGmailComposerUrl = () => {
    const toParam = encodeURIComponent(recipientEmail || '');
    const subjectParam = encodeURIComponent(subjectLine || `Application for ${jobTitle} - ${senderName}`);
    const bodyParam = encodeURIComponent(emailBody || generatedEmail);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${toParam}&su=${subjectParam}&body=${bodyParam}`;
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
    portfolioUrl, setPortfolioUrl,
    tone, setTone,
    goal, setGoal,
    ctaType, setCtaType,
    isGenerating,
    generatedEmail,
    subjectLine, setSubjectLine,
    emailBody, setEmailBody,
    isSaving,
    history,
    handleGenerate,
    handleSave,
    handleDelete,
    getGmailComposerUrl,
  };
};

