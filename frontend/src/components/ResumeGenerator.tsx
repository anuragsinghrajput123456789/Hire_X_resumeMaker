import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateResume } from '../services/aiService';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Sparkles, Bot, Copy, Eye, Save, Trash2, Clock, Lock, Upload, Loader2, Zap, ArrowRight, Layers, Layout } from 'lucide-react';
import BasicInfoForm from './forms/BasicInfoForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';
import CustomSectionsForm from './forms/CustomSectionsForm';
import { FormData, ResumeData } from '../types/resumeTypes';
import html2pdf from 'html2pdf.js';
import ModernTemplate from './resume-templates/ModernTemplate';
import ClassicTemplate from './resume-templates/ClassicTemplate';
import CreativeTemplate from './resume-templates/CreativeTemplate';
import ProfessionalTemplate from './resume-templates/ProfessionalTemplate';
import AuthContext from '../context/AuthContext';
import resumeService, { type SavedResume } from '../services/resumeService';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredToken, clearAuthStorage } from '../services/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

type TemplateId = 'modern' | 'classic' | 'creative' | 'professional';

const templateIds: TemplateId[] = ['modern', 'classic', 'creative', 'professional'];

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong';

const ResumeGenerator = ({ onResumeGenerated }: { onResumeGenerated: (resume: string) => void }) => {
  const navigate = useNavigate();
  const token = getStoredToken();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<ResumeData | null>(null);
  const [atsOptimizedContent, setAtsOptimizedContent] = useState<string>('');
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [activeMobileView, setActiveMobileView] = useState<'edit' | 'preview'>('edit');
  const [fontSizeAdjustment, setFontSizeAdjustment] = useState<number>(0);
  const [lineHeightAdjustment, setLineHeightAdjustment] = useState<string>('normal');
  const [spacingAdjustment, setSpacingAdjustment] = useState<string>('normal');
  const [targetPages, setTargetPages] = useState<'auto' | '1' | '2'>('auto');
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [previewHeight, setPreviewHeight] = useState(1123);

  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [showSavedResumes, setShowSavedResumes] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  const fetchResumes = useCallback(async () => {
    setIsLoadingResumes(true);
    try {
      const resumes = await resumeService.getResumes();
      setSavedResumes(resumes);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('not authorized') || errorMessage.toLowerCase().includes('no token')) {
        clearAuthStorage();
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive"
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }
      toast({
        title: "Error fetching resumes",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoadingResumes(false);
    }
  }, [toast]);

  useEffect(() => {
    if (showSavedResumes && user) {
      fetchResumes();
    }
  }, [fetchResumes, showSavedResumes, user]);

  const { register, control, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>({
    defaultValues: {
      skills: '',
      education: [{ degree: '', institution: '', year: '' }],
      experience: [{ company: '', role: '', duration: '', description: '' }],
      certifications: '',
      projects: [{ name: '', description: '', technologies: '' }],
      languages: '',
      achievements: ''
    }
  });

  const watchedData = watch();

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    try {
      const processedData: ResumeData = {
        ...data,
        skills: (data.skills || '').split(',').map(s => s.trim()).filter(s => s.length > 0),
        certifications: (data.certifications || '').split(',').map(s => s.trim()).filter(s => s.length > 0),
        languages: data.languages ? (data.languages || '').split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        achievements: data.achievements ? (data.achievements || '').split(',').map(s => s.trim()).filter(s => s.length > 0) : []
      };

      const atsResponse = await generateResume(processedData);
      const rawText = atsResponse.result;
      const parsedData = atsResponse.parsedData;

      setAtsOptimizedContent(rawText);

      if (parsedData && Object.keys(parsedData).length > 0) {
        // Dynamically reset the form fields with the AI-optimized suggestions!
        const optimizedFormData: FormData = {
          fullName: parsedData.fullName || data.fullName,
          email: parsedData.email || data.email,
          phone: parsedData.phone || data.phone,
          linkedin: parsedData.linkedin || data.linkedin,
          github: parsedData.github || data.github,
          portfolio: parsedData.portfolio || data.portfolio,
          jobRole: parsedData.jobRole || data.jobRole,
          summary: parsedData.summary || data.summary,
          skills: Array.isArray(parsedData.skills) ? parsedData.skills.join(', ') : data.skills,
          certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications.join(', ') : data.certifications,
          languages: Array.isArray(parsedData.languages) ? parsedData.languages.join(', ') : data.languages,
          achievements: Array.isArray(parsedData.achievements) ? parsedData.achievements.join(', ') : data.achievements,
          education: parsedData.education || data.education,
          experience: parsedData.experience || data.experience,
          projects: parsedData.projects || data.projects
        };
        reset(optimizedFormData);
        
        // Update the live canvas with the parsed AI optimization!
        setGeneratedData({
          ...parsedData,
          skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
          certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
          languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
          achievements: Array.isArray(parsedData.achievements) ? parsedData.achievements : []
        });
      } else {
        // Fallback to input data if AI returned unparseable text
        setGeneratedData(processedData);
      }

      onResumeGenerated('ATS-Optimized Resume Generated');
      
      toast({
        title: "✅ ATS-Optimized Resume Generated!",
        description: "Your professional resume is ready with enhanced formatting and keyword optimization.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('not authorized') || errorMessage.toLowerCase().includes('no token')) {
        clearAuthStorage();
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive"
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }
      toast({
        title: "❌ Generation Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveResume = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to save your resume.",
        variant: "destructive"
      });
      return;
    }

    const currentData = watchedData.fullName ? {
      ...watchedData,
      skills: (watchedData.skills || '').split(',').map(s => s.trim()).filter(s => s.length > 0),
      certifications: (watchedData.certifications || '').split(',').map(s => s.trim()).filter(s => s.length > 0),
      languages: watchedData.languages ? (watchedData.languages || '').split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
      achievements: watchedData.achievements ? (watchedData.achievements || '').split(',').map(s => s.trim()).filter(s => s.length > 0) : []
    } : generatedData;

    if (!currentData) {
      toast({
        title: "No Data",
        description: "Please generate or fill out a resume first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const resumeToSave = {
        ...currentData,
        _id: activeResumeId || undefined,
        templateId: selectedTemplate,
        customSections,
        fontSizeAdjustment,
        lineHeightAdjustment,
        spacingAdjustment,
        targetPages
      };
      
      const saved = await resumeService.saveResume(resumeToSave);
      if (saved && saved.data && saved.data._id) {
        setActiveResumeId(saved.data._id);
      }
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });
      fetchResumes(); 
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('not authorized') || errorMessage.toLowerCase().includes('no token')) {
        clearAuthStorage();
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive"
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }
      toast({
        title: "Error saving resume",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeService.deleteResume(id);
      setSavedResumes(prev => prev.filter(r => r._id !== id));
      toast({
        title: "Deleted",
        description: "Resume deleted successfully.",
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('not authorized') || errorMessage.toLowerCase().includes('no token')) {
        clearAuthStorage();
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive"
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }
      toast({
         title: "Error deleting resume",
         description: errorMessage,
         variant: "destructive"
      });
    }
  };

  const loadResume = (resume: SavedResume) => {
    const formData: FormData = {
      fullName: resume.fullName || '',
      email: resume.email || '',
      phone: resume.phone || '',
      linkedin: resume.linkedin || '',
      github: resume.github || '',
      portfolio: resume.portfolio || '',
      jobRole: resume.jobRole || '',
      summary: resume.summary || '',
      skills: Array.isArray(resume.skills) ? resume.skills.join(', ') : '',
      certifications: Array.isArray(resume.certifications) ? resume.certifications.join(', ') : '',
      languages: Array.isArray(resume.languages) ? resume.languages.join(', ') : '',
      achievements: Array.isArray(resume.achievements) ? resume.achievements.join(', ') : '',
      education: resume.education || [{ degree: '', institution: '', year: '' }],
      experience: resume.experience || [{ company: '', role: '', duration: '', description: '' }],
      projects: resume.projects || [{ name: '', description: '', technologies: '' }]
    };

    reset(formData);

    setActiveResumeId(resume._id);
    if (resume.fontSizeAdjustment !== undefined) {
      setFontSizeAdjustment(resume.fontSizeAdjustment);
    }
    if (resume.lineHeightAdjustment) {
      setLineHeightAdjustment(resume.lineHeightAdjustment);
    }
    if (resume.spacingAdjustment) {
      setSpacingAdjustment(resume.spacingAdjustment);
    }
    if (resume.targetPages) {
      setTargetPages(resume.targetPages as 'auto' | '1' | '2');
    }

    if (resume.templateId) {
      setSelectedTemplate(resume.templateId as TemplateId);
    }
    if (resume.customSections) {
      setCustomSections(resume.customSections);
    } else {
      setCustomSections([]);
    }

    setGeneratedData({
      ...resume,
      skills: Array.isArray(resume.skills) ? resume.skills : [],
      certifications: Array.isArray(resume.certifications) ? resume.certifications : [],
      languages: Array.isArray(resume.languages) ? resume.languages : [],
      achievements: Array.isArray(resume.achievements) ? resume.achievements : []
    });

    toast({
      title: "✅ Blueprint Loaded",
      description: `Successfully loaded ${resume.fullName || 'Untitled'}'s resume blueprint.`,
    });
  };


  const downloadPDF = () => {
    if (!previewData) return;

    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) return;

    // Save the original inline styles
    const originalTransform = resumeElement.style.transform;
    const originalBoxShadow = resumeElement.style.boxShadow;
    const originalPosition = resumeElement.style.position;
    const originalTop = resumeElement.style.top;
    const originalLeft = resumeElement.style.left;
    const originalWidth = resumeElement.style.width;

    // Save the parent element's styles
    const parentElement = resumeElement.parentElement;
    let originalParentWidth = '';
    let originalParentHeight = '';
    let originalParentOverflow = '';
    let originalParentPosition = '';

    if (parentElement) {
      originalParentWidth = parentElement.style.width;
      originalParentHeight = parentElement.style.height;
      originalParentOverflow = parentElement.style.overflow;
      originalParentPosition = parentElement.style.position;
    }

    // Save the scroll container styles
    const previewContainer = document.getElementById('preview-container');
    let originalContainerOverflowX = '';
    let originalContainerOverflowY = '';
    let originalContainerScrollTop = 0;
    let originalContainerScrollLeft = 0;

    if (previewContainer) {
      originalContainerOverflowX = previewContainer.style.overflowX;
      originalContainerOverflowY = previewContainer.style.overflowY;
      originalContainerScrollTop = previewContainer.scrollTop;
      originalContainerScrollLeft = previewContainer.scrollLeft;
    }

    // Save window scroll
    const originalWindowScrollX = window.scrollX;
    const originalWindowScrollY = window.scrollY;

    // --- APPLY PDF CAPTURE STYLES ---
    // 1. Reset resume preview styling to standard relative box
    resumeElement.style.transform = 'none';
    resumeElement.style.boxShadow = 'none';
    resumeElement.style.position = 'relative';
    resumeElement.style.top = '0';
    resumeElement.style.left = '0';
    resumeElement.style.width = '794px';

    // 2. Expand parent element to fit the full resume preview size
    if (parentElement) {
      parentElement.style.width = '794px';
      parentElement.style.height = 'auto';
      parentElement.style.overflow = 'visible';
      parentElement.style.position = 'relative';
    }

    // 3. Scroll container to the very top and remove overflow clipping
    if (previewContainer) {
      previewContainer.scrollTop = 0;
      previewContainer.scrollLeft = 0;
      previewContainer.style.overflowX = 'visible';
      previewContainer.style.overflowY = 'visible';
    }

    // 4. Scroll main window to 0,0 to prevent any page scroll coordinate conflicts
    window.scrollTo(0, 0);

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${(previewData.fullName || 'Resume').trim().replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2.0, // Scale 2.0 is extremely crisp and prevents canvas allocation crashes on mobile devices
        useCORS: true, 
        logging: false,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    const restoreStyles = () => {
      // Restore resume preview styles
      resumeElement.style.transform = originalTransform;
      resumeElement.style.boxShadow = originalBoxShadow;
      resumeElement.style.position = originalPosition;
      resumeElement.style.top = originalTop;
      resumeElement.style.left = originalLeft;
      resumeElement.style.width = originalWidth;

      // Restore parent styles
      if (parentElement) {
        parentElement.style.width = originalParentWidth;
        parentElement.style.height = originalParentHeight;
        parentElement.style.overflow = originalParentOverflow;
        parentElement.style.position = originalParentPosition;
      }

      // Restore container styles and scroll
      if (previewContainer) {
        previewContainer.style.overflowX = originalContainerOverflowX;
        previewContainer.style.overflowY = originalContainerOverflowY;
        previewContainer.scrollTop = originalContainerScrollTop;
        previewContainer.scrollLeft = originalContainerScrollLeft;
      }

      // Restore window scroll
      window.scrollTo(originalWindowScrollX, originalWindowScrollY);
    };

    // Use html2pdf to generate and save
    html2pdf().set(opt).from(resumeElement).save().then(() => {
      restoreStyles();
      toast({
        title: "📄 PDF Exported!",
        description: "Your professional resume has been downloaded.",
      });
    }).catch((err) => {
      restoreStyles();
      console.error('PDF generation error:', err);
      toast({
        title: "❌ PDF Export Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    });
  };

  const copyToClipboard = () => {
    if (atsOptimizedContent) {
      navigator.clipboard.writeText(atsOptimizedContent);
      toast({
        title: "📋 Copied!",
        description: "Resume content copied to clipboard.",
      });
    }
  };

  const hasAnyInput = !!(
    watchedData.fullName?.trim() ||
    watchedData.email?.trim() ||
    watchedData.phone?.trim() ||
    watchedData.jobRole?.trim() ||
    watchedData.summary?.trim() ||
    watchedData.skills?.trim()
  );

  const mockFallbackData: ResumeData = {
    fullName: 'Johnathan Doe',
    jobRole: 'Senior Full Stack Engineer',
    email: 'john.doe@techcorp.com',
    phone: '+1 (555) 019-2834',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    portfolio: 'johndoe.dev',
    summary: 'Innovative Senior Full Stack Engineer with 8+ years of expertise in designing, building, and deploying highly scalable web solutions. Passionate about system architecture, performance optimization, and mentoring high-performing engineering teams.',
    skills: ['TypeScript', 'React.js', 'Node.js', 'Next.js', 'Go', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'System Design'],
    education: [
      {
        degree: 'Master of Science in Computer Science',
        institution: 'Stanford University',
        year: '2016 - 2018',
        gpa: '3.9'
      },
      {
        degree: 'Bachelor of Science in Software Engineering',
        institution: 'University of California, Berkeley',
        year: '2012 - 2016',
        gpa: '3.8'
      }
    ],
    experience: [
      {
        company: 'InnovateTech Solutions',
        role: 'Lead Software Architect',
        duration: '2021 - Present',
        description: 'Designed and implemented a high-performance distributed microservices platform using Node.js and Go, boosting API throughput by 140%.\nLed an agile engineering squad of 8 developers, deploying daily features with zero-downtime CI/CD workflows.\nArchitected a real-time analytics streaming engine processing over 50M daily events.'
      },
      {
        company: 'Apex Code Systems',
        role: 'Senior Full Stack Engineer',
        duration: '2018 - 2021',
        description: 'Spearheaded migration of legacy enterprise systems to a modern Next.js + React micro-frontend framework, improving Lighthouse scores by 45 points.\nOptimized SQL queries and indexes on PostgreSQL databases, yielding a 3.5x acceleration in reporting times.\nMentored junior developers and instituted code review best practices.'
      }
    ],
    projects: [
      {
        name: 'Enterprise Cloud Orchestrator',
        description: 'Developed an open-source cloud resource deployment tool that streamlines AWS containerization workflows.\nEnabled developer sandboxes to compile in under 3 minutes, cutting AWS overhead by 30%.',
        technologies: 'TypeScript, React, Docker, AWS API'
      },
      {
        name: 'Distributed Event Broker',
        description: 'Engineered a light-weight event messaging broker achieving sub-millisecond end-to-end messaging latency.\nAuthored detailed technical whitepapers and documentation for client developers.',
        technologies: 'Go, WebSockets, Redis'
      }
    ],
    certifications: ['AWS Certified Solutions Architect', 'Google Professional Cloud Developer'],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    achievements: ['Speaker at NodeConf 2023', 'Winner of Tech Innovator Hackathon 2022']
  };

  const previewData: ResumeData = (hasAnyInput || generatedData) ? {
    fullName: watchedData.fullName || generatedData?.fullName || '',
    email: watchedData.email || generatedData?.email || '',
    phone: watchedData.phone || generatedData?.phone || '',
    linkedin: watchedData.linkedin || generatedData?.linkedin || '',
    github: watchedData.github || generatedData?.github || '',
    portfolio: watchedData.portfolio || generatedData?.portfolio || '',
    jobRole: watchedData.jobRole || generatedData?.jobRole || '',
    summary: watchedData.summary || generatedData?.summary || '',
    skills: watchedData.skills 
      ? watchedData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) 
      : (generatedData?.skills || []),
    certifications: watchedData.certifications 
      ? watchedData.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0) 
      : (generatedData?.certifications || []),
    languages: watchedData.languages 
      ? watchedData.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) 
      : (generatedData?.languages || []),
    achievements: watchedData.achievements 
      ? watchedData.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) 
      : (generatedData?.achievements || []),
    education: (watchedData.education && watchedData.education.some(edu => edu.institution?.trim() || edu.degree?.trim()))
      ? watchedData.education
      : (generatedData?.education || []),
    experience: (watchedData.experience && watchedData.experience.some(exp => exp.company?.trim() || exp.role?.trim()))
      ? watchedData.experience
      : (generatedData?.experience || []),
    projects: (watchedData.projects && watchedData.projects.some(proj => proj.name?.trim()))
      ? watchedData.projects
      : (generatedData?.projects || [])
  } : mockFallbackData;

  useEffect(() => {
    const container = containerRef.current;
    const preview = previewRef.current;
    if (!container || !preview) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === preview) {
          setPreviewHeight(preview.scrollHeight);
        } else if (entry.target === container) {
          const containerWidth = entry.contentRect.width;
          const padding = 32;
          const availableWidth = containerWidth - padding;
          setScale(Math.max(0.2, Math.min(1, availableWidth / 794)));
        }
      }
    });

    observer.observe(container);
    observer.observe(preview);

    // Initial measurement triggers
    setPreviewHeight(preview.scrollHeight);
    const initialWidth = container.getBoundingClientRect().width;
    const initialAvailable = initialWidth - 32;
    setScale(Math.max(0.2, Math.min(1, initialAvailable / 794)));

    return () => {
      observer.disconnect();
    };
  }, [previewData, selectedTemplate, customSections, fontSizeAdjustment, lineHeightAdjustment, spacingAdjustment]);

  // Smart Auto-Fit Engine Effect
  useEffect(() => {
    if (targetPages === 'auto') return;

    const limit = targetPages === '1' ? 1123 : 2246;

    // Small delay to let the height recalculate before measuring
    const timer = setTimeout(() => {
      if (previewHeight > limit) {
        if (spacingAdjustment !== 'compact') {
          setSpacingAdjustment('compact');
        } else if (fontSizeAdjustment > -3) {
          setFontSizeAdjustment(prev => Math.max(-3, prev - 1));
        } else if (lineHeightAdjustment !== 'tight') {
          setLineHeightAdjustment('tight');
        }
      } else if (previewHeight < limit - 100) {
        // Gently scale back up if there's plenty of space to maximize aesthetics
        if (fontSizeAdjustment < 0) {
          setFontSizeAdjustment(prev => prev + 1);
        } else if (lineHeightAdjustment === 'tight') {
          setLineHeightAdjustment('normal');
        } else if (spacingAdjustment === 'compact') {
          setSpacingAdjustment('normal');
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [previewHeight, targetPages, selectedTemplate]);

  const computedPreviewHeight = targetPages === '1' ? 1123 : targetPages === '2' ? 2246 : previewHeight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative pb-20">
      
      {/* AI Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-indigo-950/80 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center max-w-md w-full px-6 text-center">
               <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-8 relative"
               >
                  <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="relative p-6 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-indigo-500/20">
                    <Sparkles className="w-16 h-16 text-indigo-600" />
                  </div>
               </motion.div>
               
               <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                 Crafting Your <span className="text-indigo-400">Masterpiece</span>
               </h3>
               
               <p className="text-indigo-200 text-lg mb-8 font-medium">
                 Our neural network is optimizing your profile for 99.9% ATS compatibility...
               </p>

               <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4 border border-white/10">
                 <motion.div 
                   className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 />
               </div>
               <div className="flex justify-between w-full text-xs font-black uppercase tracking-widest text-indigo-300/50">
                 <span>SCANNING SKILLS</span>
                 <span>POLISHING CONTENT</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <div className={`lg:col-span-5 space-y-6 ${activeMobileView === 'edit' ? 'block' : 'hidden lg:block'}`}>
        <Card className="glass-card border-indigo-500/10 shadow-2xl overflow-hidden group">
          <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">RESUME BLUEPRINT</CardTitle>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Intelligent Form Builder</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowSavedResumes(!showSavedResumes)}
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-xl transition-all ${showSavedResumes ? 'bg-indigo-500/10 text-indigo-600' : ''}`}
                >
                  <Clock className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={saveResume}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl text-emerald-600 hover:bg-emerald-500/10"
                >
                  <Save className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <AnimatePresence>
            {showSavedResumes && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-indigo-500/5 border-b border-indigo-500/10"
              >
                <div className="p-4 space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Saved Versions</h4>
                  {isLoadingResumes ? (
                    <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                  ) : savedResumes.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4 italic">No saved blueprints found.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {savedResumes.map(resume => (
                        <div 
                          key={resume._id} 
                          onClick={() => loadResume(resume)}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="truncate max-w-[150px]">
                              <p className="text-sm font-bold truncate">{resume.fullName || 'Untitled'}</p>
                              <p className="text-[10px] text-muted-foreground">{resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Recent'}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-500/10" 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteResume(resume._id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <BasicInfoForm register={register} errors={errors} />
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
              <EducationForm register={register} control={control} />
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
              <ExperienceForm register={register} control={control} />
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
              <AdditionalInfoForm register={register} control={control} />
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
              <CustomSectionsForm 
                customSections={customSections}
                onSectionsChange={setCustomSections}
              />

              <Button
                type="submit"
                className="w-full h-16 text-lg font-black btn-gradient group relative overflow-hidden"
                disabled={isGenerating}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>CRAFT ATS MASTERPIECE</span>
                </div>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className={`lg:col-span-7 flex flex-col lg:h-[calc(100vh-140px)] lg:sticky lg:top-28 h-auto ${activeMobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
        <Card className="glass-card border-indigo-500/10 shadow-2xl overflow-hidden flex flex-col h-full">
          <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 p-4 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                  <Eye className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-black tracking-tight">LIVE CANVAS</CardTitle>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <div className="flex flex-wrap items-center bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl gap-0.5 sm:gap-1">
                  {templateIds.map((temp) => (
                    <button
                      key={temp}
                      onClick={() => setSelectedTemplate(temp)}
                      className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        selectedTemplate === temp ? 'bg-white/[0.06] border border-white/[0.08] text-indigo-400 shadow-md' : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/[0.05]" />
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-indigo-400 hover:bg-white/5 hover:text-indigo-300 transition-colors" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button size="icon" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl btn-gradient shadow-md" onClick={downloadPDF}>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Upgraded Premium Resizing & Spacing Settings Bar */}
          <div className="bg-[#0A0E1A]/80 border-b border-indigo-500/10 p-3 shrink-0 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold select-none z-15 backdrop-blur-md">
            <div className="flex items-center gap-5 flex-wrap">
              {/* Target Page Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <Layout className="w-3 h-3 text-indigo-400" /> Target Page:
                </span>
                <div className="flex items-center bg-white/[0.02] border border-white/[0.04] p-0.5 rounded-lg gap-0.5">
                  {[
                    { val: 'auto', label: 'Auto' },
                    { val: '1', label: '1 Page' },
                    { val: '2', label: '2 Pages' }
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setTargetPages(p.val as 'auto' | '1' | '2')}
                      className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        targetPages === p.val ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm shadow-indigo-500/5' : 'text-slate-500 hover:text-slate-300 border border-transparent'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <span className="text-xs text-indigo-400 font-black">A</span> Size:
                </span>
                <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.04] p-0.5 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setFontSizeAdjustment(prev => Math.max(-3, prev - 1))}
                    className="w-5.5 h-5.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors font-bold text-xs"
                  >
                    A-
                  </button>
                  <span className="text-indigo-400 px-1 text-[9px] font-bold min-w-[20px] text-center">
                    {fontSizeAdjustment >= 0 ? `+${fontSizeAdjustment}` : fontSizeAdjustment}px
                  </span>
                  <button 
                    type="button"
                    onClick={() => setFontSizeAdjustment(prev => Math.min(3, prev + 1))}
                    className="w-5.5 h-5.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors font-bold text-xs"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Line Height Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Height:</span>
                <div className="flex items-center bg-white/[0.02] border border-white/[0.04] p-0.5 rounded-lg gap-0.5">
                  {['tight', 'normal', 'loose'].map((lh) => (
                    <button
                      key={lh}
                      type="button"
                      onClick={() => setLineHeightAdjustment(lh)}
                      className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        lineHeightAdjustment === lh ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300 border border-transparent'
                      }`}
                    >
                      {lh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Spacing Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Spacing:</span>
                <div className="flex items-center bg-white/[0.02] border border-white/[0.04] p-0.5 rounded-lg gap-0.5">
                  {['compact', 'normal', 'spacious'].map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setSpacingAdjustment(sp)}
                      className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        spacingAdjustment === sp ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300 border border-transparent'
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Reset Layout Button */}
            <button
              type="button"
              onClick={() => {
                setFontSizeAdjustment(0);
                setLineHeightAdjustment('normal');
                setSpacingAdjustment('normal');
                setTargetPages('auto');
              }}
              className="text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-rose-400 transition-colors"
            >
              Reset Layout
            </button>
          </div>

          <CardContent className="p-0 flex-1 overflow-hidden flex flex-col bg-slate-50/50 dark:bg-black/20">
            <AnimatePresence mode="wait">
              {previewData ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  ref={containerRef}
                  id="preview-container"
                  className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto p-4 flex justify-center items-start scrollbar-thin scrollbar-thumb-indigo-500/20"
                >
                  <div 
                    style={{ 
                      width: `${794 * scale}px`, 
                      height: `${computedPreviewHeight * scale}px`, 
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.15s ease-out'
                    }}
                  >
                    <div 
                      ref={previewRef}
                      id="resume-preview"
                      style={{ 
                        width: '794px', 
                        transform: `scale(${scale})`, 
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
                      }}
                    >
                      {/* Virtual A4 Page Guidelines */}
                      {previewHeight > 1123 && (
                        <div 
                          data-html2canvas-ignore="true"
                          className="absolute left-0 right-0 border-b border-dashed border-rose-500/40 pointer-events-none z-[40] print:hidden" 
                          style={{ top: '1123px' }}
                        >
                          <div className="absolute right-4 -top-2 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 select-none">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            PAGE 1 LIMIT (A4)
                          </div>
                        </div>
                      )}
                      {previewHeight > 2246 && (
                        <div 
                          data-html2canvas-ignore="true"
                          className="absolute left-0 right-0 border-b border-dashed border-rose-500/40 pointer-events-none z-[40] print:hidden" 
                          style={{ top: '2246px' }}
                        >
                          <div className="absolute right-4 -top-2 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 select-none">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            PAGE 2 LIMIT (A4)
                          </div>
                        </div>
                      )}

                      {selectedTemplate === 'modern' && <ModernTemplate data={previewData} customSections={customSections} fontSizeAdjustment={fontSizeAdjustment} lineHeightAdjustment={lineHeightAdjustment} spacingAdjustment={spacingAdjustment} />}
                      {selectedTemplate === 'classic' && <ClassicTemplate data={previewData} customSections={customSections} fontSizeAdjustment={fontSizeAdjustment} lineHeightAdjustment={lineHeightAdjustment} spacingAdjustment={spacingAdjustment} />}
                      {selectedTemplate === 'creative' && <CreativeTemplate data={previewData} customSections={customSections} fontSizeAdjustment={fontSizeAdjustment} lineHeightAdjustment={lineHeightAdjustment} spacingAdjustment={spacingAdjustment} />}
                      {selectedTemplate === 'professional' && <ProfessionalTemplate data={previewData} customSections={customSections} fontSizeAdjustment={fontSizeAdjustment} lineHeightAdjustment={lineHeightAdjustment} spacingAdjustment={spacingAdjustment} />}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 relative overflow-hidden"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute left-8 top-8 h-24 w-24 rounded-3xl border border-teal-500/20 bg-teal-500/5" />
                    <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border border-amber-500/20 bg-amber-500/5" />
                    <div className="absolute left-1/2 top-1/3 h-20 w-20 rounded-2xl border border-sky-500/20 bg-sky-500/5" />
                  </div>
                  
                  <div className="relative z-10 space-y-6 max-w-md">
                    <div className="p-8 bg-indigo-500/10 rounded-[2.5rem] inline-block shadow-inner group">
                      <Layout className="w-20 h-20 text-indigo-600 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tight">Your Canvas is Ready</h3>
                      <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                        Every keystroke you make on the left will be transformed into an industry-leading professional profile.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {[
                        { icon: Zap, label: "Real-time Sync" },
                        { icon: Layers, label: "4 Premium Themes" },
                        { icon: Sparkles, label: "AI Optimization" },
                        { icon: ArrowRight, label: "ATS Ready" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-500/10 font-bold text-xs">
                          <item.icon className="w-4 h-4 text-indigo-600" />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Floating Toggle Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <div className="flex items-center gap-1.5 bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border border-white/10 p-1.5 rounded-full shadow-2xl">
          <button
            onClick={() => setActiveMobileView('edit')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeMobileView === 'edit'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Edit Form</span>
          </button>
          <button
            onClick={() => setActiveMobileView('preview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeMobileView === 'preview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
