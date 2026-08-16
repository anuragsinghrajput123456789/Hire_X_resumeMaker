import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Upload,
  Loader2,
  Trash2,
  Heart,
  Search,
  BookOpen,
  Briefcase,
  Play,
  ArrowRight,
  Clock,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileCheck,
  TrendingUp,
  DollarSign,
  Plus,
  RefreshCw,
  Edit2,
  Volume2,
  VolumeX,
  Eye,
  X,
  Download,
  ShieldAlert,
  ListChecks,
  Sliders,
  BarChart3
} from 'lucide-react';

// Services
import {
  RAGDocument,
  InterviewRoadmap,
  InterviewQuestion,
  InterviewFeedback,
  InterviewStudyPlan,
  CareerIntelligence,
  uploadDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  startSession,
  submitAnswer,
  finalizeSession
} from '../services/interviewService';
import resumeService, { SavedResume } from '../services/resumeService';
import { extractTextFromPDF, extractTextFromWordDoc } from '../services/pdfTextExtractor';

const docCategories = [
  'Interview Experiences',
  'Company Notes',
  'Study Notes',
  'System Design Notes',
  'Placement Notes',
  'General Notes'
];

const interviewTypes = [
  'Technical',
  'HR',
  'Behavioral',
  'System Design',
  'Coding',
  'Managerial',
  'Campus Placement',
  'Custom'
];

const difficultyLevels = ['Junior', 'Mid-Level', 'Senior', 'Executive'];

// NEW PARAMETER OPTIONS
const INTERVIEW_ROUNDS = [
  'Initial Technical Screening',
  'Coding & Data Structures',
  'System Design & Architecture',
  'Hiring Manager / Leadership',
  'Executive / Behavioral Panel'
];

const EVALUATION_RIGORS = [
  'Standard Guidance (Helpful Feedback)',
  'FAANG High-Bar Rigorous (Strict Standards)',
  'STAR Storytelling & Executive Presence'
];

const QUESTION_COUNTS = ['3 Questions (Quick Sprint)', '5 Questions (Full Session)', '8 Questions (Marathon)'];

const TIME_LIMITS = [
  'Self-Paced / No Limit',
  '2 Minutes (Speed Screen)',
  '5 Minutes (Standard Technical)',
  '10 Minutes (Complex Case)'
];

const InterviewWorkspace = () => {
  const { toast } = useToast();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'interview' | 'documents'>('interview');

  // Documents/RAG management state
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('General Notes');
  const [uploadTags, setUploadTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'keyword' | 'semantic'>('keyword');
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>('All');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [previewDoc, setPreviewDoc] = useState<RAGDocument | null>(null);

  // Resume states
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Setup mock interview session states (Existing)
  const [sessionStage, setSessionStage] = useState<'setup' | 'active' | 'feedback'>('setup');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  // NEW REQUIRED FIELDS State
  const [interviewRound, setInterviewRound] = useState('Initial Technical Screening');
  const [evaluationStrictness, setEvaluationStrictness] = useState('Standard Guidance (Helpful Feedback)');
  const [questionCount, setQuestionCount] = useState('5 Questions (Full Session)');
  const [timeLimit, setTimeLimit] = useState('5 Minutes (Standard Technical)');
  const [candidateFocus, setCandidateFocus] = useState('System Design Trade-offs, Scalability & STAR stories');

  // Active Session states
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<InterviewRoadmap | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [answerResult, setAnswerResult] = useState<{ score: number; review: string; modelAnswer: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Voice AI Simulation State
  const [voiceAudioActive, setVoiceAudioActive] = useState(false);
  const [isPlayingQuestionSpeech, setIsPlayingQuestionSpeech] = useState(false);

  // Completed Session Feedback/Study Plan states
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [studyPlan, setStudyPlan] = useState<InterviewStudyPlan | null>(null);
  const [careerIntelligence, setCareerIntelligence] = useState<CareerIntelligence | null>(null);

  // Timer states
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const fetchDocs = useCallback(async (query = '') => {
    setLoadingDocs(true);
    try {
      const categoryFilter = selectedDocCategory === 'All' ? undefined : selectedDocCategory;
      const res = await getDocuments({
        search: query || undefined,
        type: searchType,
        category: categoryFilter
      });
      setDocuments(res.data as RAGDocument[] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  }, [selectedDocCategory, searchType]);

  const fetchResumes = useCallback(async () => {
    setLoadingResumes(true);
    try {
      const data = await resumeService.getResumes();
      setResumes(data || []);
      if (data && data.length > 0) {
        setSelectedResumeId(data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResumes(false);
    }
  }, []);

  // Fetch initial documents and resumes
  useEffect(() => {
    fetchDocs();
    fetchResumes();
  }, [fetchDocs, fetchResumes]);

  // Timer hook
  useEffect(() => {
    if (sessionStage === 'active' && !answerResult) {
      const interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sessionStage, answerResult]);

  // Drag and drop text extraction for RAG materials upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let extractedText = '';
      if (file.name.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        extractedText = await extractTextFromWordDoc(file);
      } else {
        extractedText = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.readAsText(file);
        });
      }

      if (extractedText.length < 50) {
        throw new Error('Unable to extract sufficient text content.');
      }

      const tagsArray = uploadTags.split(',').map(t => t.trim()).filter(Boolean);

      await uploadDocument({
        title: file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        fileType: file.name.split('.').pop() || 'txt',
        category: uploadCategory,
        tags: tagsArray,
        content: extractedText
      });

      toast({
        title: 'Document Uploaded & Vectorized',
        description: `Successfully stored and indexed chunks for RAG search.`,
      });

      setUploadTags('');
      fetchDocs();
    } catch (error: unknown) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Could not upload document',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [uploadCategory, uploadTags, toast, fetchDocs]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt', '.md', '.csv'],
    },
    maxFiles: 1,
  });

  const toggleFavorite = async (doc: RAGDocument) => {
    try {
      await updateDocument(doc._id, { isFavorite: !doc.isFavorite });
      setDocuments(prev => prev.map(d => d._id === doc._id ? { ...d, isFavorite: !d.isFavorite } : d));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study document? This will remove all vector embeddings.')) return;
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(d => d._id !== id));
      toast({
        title: 'Deleted',
        description: 'Document and RAG embeddings removed successfully.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (id: string) => {
    if (!renameTitle.trim()) return;
    try {
      await updateDocument(id, { title: renameTitle.trim() });
      setDocuments(prev => prev.map(d => d._id === id ? { ...d, title: renameTitle.trim() } : d));
      setRenameId(null);
      setRenameTitle('');
      toast({ title: 'Renamed successfully' });
    } catch (err) {
      console.error(err);
    }
  };

  // Speak question text out loud (Voice Simulation)
  const speakQuestion = (text: string) => {
    if (isPlayingQuestionSpeech) {
      window.speechSynthesis?.cancel();
      setIsPlayingQuestionSpeech(false);
      return;
    }
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingQuestionSpeech(false);
    utterance.onerror = () => setIsPlayingQuestionSpeech(false);
    setIsPlayingQuestionSpeech(true);
    window.speechSynthesis.speak(utterance);
  };

  // Export full feedback report as Markdown
  const exportFeedbackMarkdown = () => {
    if (!feedback) return;
    const header = `# Hire-X Mock Interview Report\nCompany: ${company || 'Target Company'} | Role: ${role || 'Target Role'}\nStage: ${interviewRound} | Score: ${feedback.overallScore}/100\n\n---\n\n`;
    const scoreBreakdown = `## Competency Scores\n${Object.entries(feedback.scores || {}).map(([k, v]) => `- **${k}**: ${v}/100`).join('\n')}\n\n`;
    const strengths = `## Strengths\n${(feedback.strengths || []).map(s => `- ${s}`).join('\n')}\n\n`;
    const improvements = `## Focus Areas\n${(feedback.weaknesses || []).map(w => `- ${w}`).join('\n')}\n\n`;
    const plan = studyPlan ? `## Study Plan\nDuration: ${studyPlan.estimatedPreparationTime}\nMissing Skills: ${studyPlan.missingSkills?.join(', ')}\n` : '';
    
    const blob = new Blob([header + scoreBreakdown + strengths + improvements + plan], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${(role || 'mock').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report Exported", description: "Saved mock interview analysis as Markdown document." });
  };

  // Start mock interview session incorporating ALL 5 NEW FIELDS
  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Please provide the Job Description first.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      // Append all new simulation parameters to job description prompt payload
      const fullJdWithParams = `${jobDescription.trim()}\n\n[TARGET SIMULATION SPECIFICATIONS:
- Interview Stage / Round: ${interviewRound}
- Evaluation Strictness: ${evaluationStrictness}
- Time Constraint: ${timeLimit}
- Question Target: ${questionCount}
- Candidate Focus & Specific Weaknesses: ${candidateFocus || 'General Technical & System Design'}]`;

      const res = await startSession({
        jobDescription: fullJdWithParams,
        resumeId: selectedResumeId || undefined,
        interviewType,
        difficulty,
        company: company.trim() || undefined,
        role: role.trim() || undefined
      });

      setSessionId(res.sessionId);
      setRoadmap(res.roadmap);
      setCurrentQuestion(res.question);
      setSessionStage('active');
      setSecondsElapsed(0);
      setUserAnswer('');
      setAnswerResult(null);
      setShowHint(false);

      toast({
        title: 'Session Started',
        description: `RAG Roadmap generated for ${interviewRound} stage.`
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start interview prep session.';
      toast({
        title: 'Setup Failed',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!sessionId || !userAnswer.trim()) {
      toast({
        title: 'Empty Answer',
        description: 'Please type your answer response first.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      const res = await submitAnswer({
        sessionId,
        userAnswer
      });

      setAnswerResult({
        score: res.score,
        review: res.review,
        modelAnswer: res.modelAnswer
      });

      if (!res.completed && res.nextQuestion) {
        setCurrentQuestion(res.nextQuestion);
      } else if (res.completed) {
        setCurrentQuestion(null);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Could not evaluate answer.';
      toast({
        title: 'Submission Failed',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    setAnswerResult(null);
    setUserAnswer('');
    setShowHint(false);
    setSecondsElapsed(0);
    if (isPlayingQuestionSpeech) {
      window.speechSynthesis?.cancel();
      setIsPlayingQuestionSpeech(false);
    }
  };

  // Finalize Session
  const handleFinalizeSession = async () => {
    if (!sessionId) return;
    setIsFinishing(true);
    try {
      const res = await finalizeSession({ sessionId });
      setFeedback(res.feedback);
      setStudyPlan(res.studyPlan);
      setCareerIntelligence(res.careerIntelligence);
      setSessionStage('feedback');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Could not compile final feedback reports.';
      toast({
        title: 'Feedback Failed',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setIsFinishing(false);
    }
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Selector Tabs Header */}
      <div className="flex items-center gap-2 bg-[#050814]/80 border border-white/10 p-1.5 rounded-2xl max-w-md mx-auto shadow-xl backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('interview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'interview'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-lg shadow-purple-500/20 font-poppins'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Play className="w-4 h-4 text-purple-300" />
          Mock Interview Studio
        </button>
        <button
          onClick={() => {
            setActiveTab('documents');
            fetchDocs();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/20 font-poppins'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-300" />
          RAG Knowledge Base ({documents.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* INTERVIEW PREP TAB */}
        {activeTab === 'interview' && (
          <motion.div
            key="interview-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* STAGE 1: SETUP FORM */}
            {sessionStage === 'setup' && (
              <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative text-left">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] via-pink-500 to-transparent opacity-60" />
                
                <CardHeader className="bg-[#050814] border-b border-white/[0.08] py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 font-poppins">
                        <Sparkles className="w-4 h-4 text-pink-400" /> Configure AI Mock Interview Workspace
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400 mt-1">
                        Configure target parameters, interview stage, strictness level, and resume context for RAG grounding.
                      </CardDescription>
                    </div>
                    <Badge className="bg-pink-500/10 text-pink-300 border-pink-500/20 text-[10px] uppercase font-bold px-2.5 py-1">
                      10 Calibration Controls
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleStartSession} className="space-y-5">
                    
                    {/* Row 1: Company, Job Title, Tech Stack */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="companyName" className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>Target Company Name</span>
                          <span className="text-[#8B5CF6] text-[10px] font-extrabold">* Required</span>
                        </Label>
                        <Input
                          id="companyName"
                          placeholder="e.g. Amazon, Google, Stripe"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="roleTitle" className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>Target Job Title / Role</span>
                          <span className="text-[#8B5CF6] text-[10px] font-extrabold">* Required</span>
                        </Label>
                        <Input
                          id="roleTitle"
                          placeholder="e.g. AI Engineer, Fullstack Architect"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="techStack" className="text-[11px] font-bold text-slate-300">
                          <span>Key Tech Stack & Focus</span>
                        </Label>
                        <Input
                          id="techStack"
                          placeholder="e.g. React, Node.js, System Design"
                          value={uploadTags}
                          onChange={(e) => setUploadTags(e.target.value)}
                          className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    {/* Row 2: NEW REQUIRED FIELDS: Interview Round, Evaluation Rigor, Question Count */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/[0.015] border border-white/[0.06]">
                      
                      {/* NEW FIELD 1: Interview Round / Stage */}
                      <div className="space-y-1.5">
                        <Label htmlFor="intRound" className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                          <Sliders className="w-3 h-3" /> Interview Round / Stage
                        </Label>
                        <select
                          id="intRound"
                          value={interviewRound}
                          onChange={(e) => setInterviewRound(e.target.value)}
                          className="w-full h-10 rounded-xl bg-[#050814] border border-white/10 text-xs font-semibold text-slate-200 px-3 outline-none focus:border-cyan-400"
                        >
                          {INTERVIEW_ROUNDS.map(r => (
                            <option key={r} value={r} className="bg-[#050814] text-white">{r}</option>
                          ))}
                        </select>
                      </div>

                      {/* NEW FIELD 2: Evaluation Rigor */}
                      <div className="space-y-1.5">
                        <Label htmlFor="evalRigor" className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Evaluation Strictness Level
                        </Label>
                        <select
                          id="evalRigor"
                          value={evaluationStrictness}
                          onChange={(e) => setEvaluationStrictness(e.target.value)}
                          className="w-full h-10 rounded-xl bg-[#050814] border border-white/10 text-xs font-semibold text-slate-200 px-3 outline-none focus:border-purple-400"
                        >
                          {EVALUATION_RIGORS.map(ev => (
                            <option key={ev} value={ev} className="bg-[#050814] text-white">{ev}</option>
                          ))}
                        </select>
                      </div>

                      {/* NEW FIELD 3: Expected Question Count */}
                      <div className="space-y-1.5">
                        <Label htmlFor="qCount" className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
                          <ListChecks className="w-3 h-3" /> Target Session Question Length
                        </Label>
                        <select
                          id="qCount"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(e.target.value)}
                          className="w-full h-10 rounded-xl bg-[#050814] border border-white/10 text-xs font-semibold text-slate-200 px-3 outline-none focus:border-pink-400"
                        >
                          {QUESTION_COUNTS.map(qc => (
                            <option key={qc} value={qc} className="bg-[#050814] text-white">{qc}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Row 3: Interview Type, Difficulty, Time Limit, Profile Resume */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="intType" className="text-[11px] font-bold text-slate-300">Interview Category</Label>
                        <Select value={interviewType} onValueChange={setInterviewType}>
                          <SelectTrigger id="intType" className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-slate-200">
                            <SelectValue placeholder="Interview Type" />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-[#0F1424] border-white/10 text-slate-300 rounded-xl">
                            {interviewTypes.map(t => (
                              <SelectItem key={t} value={t} className="text-xs font-semibold rounded-lg focus:bg-white/5 cursor-pointer">{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="difficulty" className="text-[11px] font-bold text-slate-300">Difficulty Grade</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                          <SelectTrigger id="difficulty" className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-slate-200">
                            <SelectValue placeholder="Difficulty" />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-[#0F1424] border-white/10 text-slate-300 rounded-xl">
                            {difficultyLevels.map(l => (
                              <SelectItem key={l} value={l} className="text-xs font-semibold rounded-lg focus:bg-white/5 cursor-pointer">{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* NEW FIELD 4: Time Limit per Question */}
                      <div className="space-y-1.5">
                        <Label htmlFor="timeLim" className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Time Limit / Speed Goal
                        </Label>
                        <select
                          id="timeLim"
                          value={timeLimit}
                          onChange={(e) => setTimeLimit(e.target.value)}
                          className="w-full h-10 rounded-xl bg-[#050814] border border-white/10 text-xs font-semibold text-slate-200 px-3 outline-none focus:border-amber-400"
                        >
                          {TIME_LIMITS.map(tl => (
                            <option key={tl} value={tl} className="bg-[#050814] text-white">{tl}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="setupResume" className="text-[11px] font-bold text-slate-300">Select Profile Resume</Label>
                        {loadingResumes ? (
                          <div className="h-10 flex items-center justify-center text-xs text-slate-500 bg-white/[0.01] border border-white/5 rounded-xl">
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2 text-[#8B5CF6]" /> Loading...
                          </div>
                        ) : resumes.length === 0 ? (
                          <div className="h-10 flex items-center justify-between px-3 text-[10px] text-slate-400 bg-white/[0.01] border border-dashed border-white/10 rounded-xl">
                            No Saved Resumes
                            <Link to="/generator">
                              <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 text-[9px] cursor-pointer">Create</Badge>
                            </Link>
                          </div>
                        ) : (
                          <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                            <SelectTrigger id="setupResume" className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-slate-200">
                              <SelectValue placeholder="Select Profile" />
                            </SelectTrigger>
                            <SelectContent className="glass-card bg-[#0F1424] border-white/10 text-slate-300 rounded-xl">
                              {resumes.map(r => (
                                <SelectItem key={r._id} value={r._id} className="text-xs font-semibold rounded-lg focus:bg-white/5 cursor-pointer">
                                  {r.fullName} - {r.jobRole}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    {/* NEW FIELD 5: Candidate Custom Focus & Weaknesses */}
                    <div className="space-y-1.5">
                      <Label htmlFor="candFocus" className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
                        <span>Candidate Focus Areas & Weaknesses to Test</span>
                        <span className="text-slate-500 text-[10px]">Optional Custom Focus</span>
                      </Label>
                      <Input
                        id="candFocus"
                        placeholder="e.g. Concurrency locks, Microservices trade-offs, STAR Leadership conflict metrics"
                        value={candidateFocus}
                        onChange={(e) => setCandidateFocus(e.target.value)}
                        className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-emerald-400"
                      />
                    </div>

                    {/* Target Job Description */}
                    <div className="space-y-1.5">
                      <Label htmlFor="jdText" className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                        <span>Target Job Description / Key Duties</span>
                        <span className="text-[#8B5CF6] text-[10px] font-extrabold">* Required</span>
                      </Label>
                      <textarea
                        id="jdText"
                        placeholder="Paste the target duties, roles, and technical description here to align the AI questions..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full h-32 p-3.5 rounded-xl bg-[#050814] border border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmittingAnswer}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-amber-500 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmittingAnswer ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Constructing RAG Roadmap & Opening {interviewRound}...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                          Initialize Custom RAG Mock Workspace ({interviewRound})
                        </>
                      )}
                    </Button>

                  </form>
                </CardContent>
              </Card>
            )}

            {/* STAGE 2: ACTIVE QUESTION FLOW */}
            {sessionStage === 'active' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                
                {/* Preparation Roadmap Timeline */}
                <div className="lg:col-span-4 space-y-4">
                  {roadmap && (
                    <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
                      <CardHeader className="pb-3 bg-[#050814] border-b border-white/[0.06]">
                        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-poppins">
                          <Zap className="w-4 h-4 text-cyan-400" /> RAG Preparation Roadmap
                        </CardTitle>
                        <CardDescription className="text-[10px] text-slate-400">Roadmap built for {interviewRound}.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 max-h-[450px] overflow-y-auto p-4">
                        <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                          <h4 className="text-xs font-bold text-slate-200 mb-1">Target: {roadmap.role} ({company})</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">{roadmap.overview}</p>
                        </div>

                        <div className="space-y-3.5">
                          <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Focus Modules</h5>
                          {roadmap.roadmapSteps.map((step, idx) => (
                            <div key={idx} className="relative pl-4 border-l border-white/10 text-left space-y-1">
                              <span className="absolute top-1.5 -left-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                              <h6 className="text-[11px] font-black text-slate-200">{step.dayOrWeek} - {step.title}</h6>
                              <ul className="space-y-0.5 pl-1.5">
                                {step.tasks.slice(0, 3).map((task, tidx) => (
                                  <li key={tidx} className="text-[9px] text-slate-400 font-semibold">• {task}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Question panel HUD */}
                <div className="lg:col-span-8 space-y-6">
                  {currentQuestion ? (
                    <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-50" />
                      
                      <CardHeader className="pb-3.5 border-b border-white/[0.06] bg-[#050814] flex flex-row items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">
                            Question #{currentQuestion.questionNumber}
                          </Badge>
                          <Badge className="bg-white/5 text-slate-300 border-white/10 text-[9px] font-bold">
                            {currentQuestion.category}
                          </Badge>
                          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[9px] font-bold">
                            {interviewRound}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Voice Simulation Toggle */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakQuestion(currentQuestion.question)}
                            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl gap-1.5 border border-white/10 cursor-pointer"
                          >
                            {isPlayingQuestionSpeech ? (
                              <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                            )}
                            <span className="text-[10px]">{isPlayingQuestionSpeech ? 'Mute Speech' : 'Voice Read'}</span>
                          </Button>

                          {/* Dynamic Timer HUD */}
                          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                            <Clock className={`w-3.5 h-3.5 animate-pulse ${secondsElapsed > 300 ? 'text-rose-400' : 'text-pink-400'}`} />
                            <span className={secondsElapsed > 300 ? 'text-rose-300 font-extrabold' : 'text-slate-200'}>
                              {formatTimer(secondsElapsed)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-6 space-y-6">
                        
                        {/* Question Block */}
                        <div className="p-4 rounded-2xl bg-[#050814] border border-white/[0.08] relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 opacity-5">
                            <Sparkles className="w-24 h-24 text-white" />
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed font-poppins relative z-10">
                            {currentQuestion.question}
                          </h3>
                        </div>

                        {/* RAG Attribution Badge */}
                        {currentQuestion.contextRetrieved && (
                          <div className="flex items-center gap-2 text-[10px] text-cyan-300 font-semibold bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20">
                            <BookOpen className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                            <span>RAG Grounded: Vector context retrieved from candidate's uploaded reference materials.</span>
                          </div>
                        )}

                        {/* Answer Input Area & STAR Helper Buttons */}
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Label htmlFor="userAns" className="text-[11px] font-bold text-slate-300">
                              Your Answer Response ({evaluationStrictness})
                            </Label>
                            
                            <div className="flex items-center gap-2">
                              {/* 1-click STAR framework template injector */}
                              <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                onClick={() => setUserAnswer("Situation: \nTask: \nAction: \nResult: \nKey Metrics: ")}
                                className="h-7 text-[10px] border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                Insert STAR Template
                              </Button>

                              {currentQuestion.hint && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setShowHint(!showHint)}
                                  className="h-7 text-[10px] text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/5 font-extrabold gap-1.5 flex cursor-pointer"
                                >
                                  <Lightbulb className="w-3.5 h-3.5" />
                                  {showHint ? 'Hide Hint' : 'Reveal Hint'}
                                </Button>
                              )}
                            </div>
                          </div>

                          <AnimatePresence>
                            {showHint && currentQuestion.hint && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-3"
                              >
                                <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-semibold text-yellow-300 leading-relaxed">
                                  💡 <b>Hint:</b> {currentQuestion.hint}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <textarea
                            id="userAns"
                            placeholder="Type your detailed answer response here... Use STAR method (Situation, Task, Action, Result) for behavioral prompts or detail architectural trade-offs."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={isSubmittingAnswer || !!answerResult}
                            className="w-full h-36 p-3.5 rounded-xl bg-[#050814] border border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] resize-none disabled:opacity-60"
                          />
                        </div>

                        {/* Submit Actions */}
                        {!answerResult ? (
                          <div className="flex justify-end">
                            <Button
                              onClick={handleSubmitAnswer}
                              disabled={isSubmittingAnswer || !userAnswer.trim()}
                              className="h-10 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-extrabold px-6 gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
                            >
                              {isSubmittingAnswer ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Answer...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" /> Submit Answer Evaluation
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          // Answer evaluation result block
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl border border-white/[0.08] bg-[#050814] space-y-4 text-left"
                          >
                            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                              <span className="text-xs font-black text-white uppercase tracking-wider font-poppins">Answer Assessment</span>
                              <Badge className={answerResult.score >= 75 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs py-1 px-3' : 'bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs py-1 px-3'}>
                                Response Score: {answerResult.score}/100
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-slate-200 font-semibold leading-relaxed whitespace-pre-line">
                              {answerResult.review}
                            </p>

                            {answerResult.modelAnswer && (
                              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                <h4 className="text-[10px] font-black text-cyan-300 uppercase tracking-widest">Recommended Model Answer</h4>
                                <p className="text-[10px] text-slate-300 font-medium leading-relaxed whitespace-pre-line">{answerResult.modelAnswer}</p>
                              </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                              <Button
                                onClick={handleNextQuestion}
                                className="h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-[#8B5CF6] hover:scale-102 text-white text-xs font-extrabold px-6 gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
                              >
                                Next Mock Question <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}

                      </CardContent>
                    </Card>
                  ) : (
                    // Session complete, ready to analyze
                    <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative p-8 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20">
                        <div className="w-full h-full bg-[#0F1424] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-pink-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white font-poppins">Mock Interview Completed!</h3>
                        <p className="text-xs text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                          All mock questions completed. We are ready to compile your competency scores, career growth advice, and detailed study schedules.
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          onClick={handleFinalizeSession}
                          disabled={isFinishing}
                          className="h-11 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white text-xs font-black px-8 gap-2 shadow-lg shadow-pink-500/20 cursor-pointer"
                        >
                          {isFinishing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Compiling Feedback Audits...
                            </>
                          ) : (
                            <>
                              <Award className="w-4.5 h-4.5" /> Finalize & Generate Feedback Reports
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>

              </div>
            )}

            {/* STAGE 3: DETAILED COMPLETED REPORTS PANEL */}
            {sessionStage === 'feedback' && feedback && (
              <div className="space-y-8 text-left">
                
                {/* Header Action Bar */}
                <div className="flex items-center justify-between flex-wrap gap-4 bg-[#050814] p-4 rounded-2xl border border-white/10">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white font-poppins">Mock Interview Assessment Report</h2>
                    <p className="text-xs text-slate-400">Target Role: {role || 'Target Role'} ({company || 'Target Company'})</p>
                  </div>
                  <Button
                    onClick={exportFeedbackMarkdown}
                    className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-cyan-400" /> Export Full Report (.MD)
                  </Button>
                </div>

                {/* Core Overall Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Overall score gauge card */}
                  <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl p-6 text-center space-y-3 shadow-xl md:col-span-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-poppins">Overall Readiness</h3>
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center rounded-full border-4 border-dashed border-[#8B5CF6]/40">
                      <div className="absolute w-24 h-24 rounded-full bg-[#8B5CF6]/10 blur-sm" />
                      <div className="text-center relative z-10">
                        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-pink-500 font-poppins">
                          {feedback.overallScore}
                        </span>
                        <p className="text-[10px] text-slate-400 font-black mt-0.5">/ 100</p>
                      </div>
                    </div>
                    <Badge className="bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[10px] px-2.5 py-1">
                      {difficulty} prep grade
                    </Badge>
                  </Card>

                  {/* Dimension score bars card */}
                  <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl p-5 shadow-xl md:col-span-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-poppins">Competency Radar Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(feedback?.scores || {}).map(([key, val]) => (
                        <div key={key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                            <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-[#8B5CF6] font-extrabold">{val}/100</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${val}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-cyan-400 to-[#8B5CF6]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Tabs to show Feedback, Study Plan, and Career Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Strengths / Weaknesses */}
                  <div className="lg:col-span-6 space-y-6">
                    <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl shadow-xl">
                      <CardHeader className="pb-3 border-b border-white/[0.06] bg-[#050814]">
                        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-poppins">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> Observed Candidate Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {(feedback?.strengths || []).map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-300 font-semibold flex items-start gap-2 leading-relaxed">
                              <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl shadow-xl">
                      <CardHeader className="pb-3 border-b border-white/[0.06] bg-[#050814]">
                        <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-poppins">
                          <AlertCircle className="w-4 h-4 text-rose-400" /> Focus Improvement Areas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {(feedback?.weaknesses || []).map((weak, idx) => (
                            <li key={idx} className="text-xs text-slate-300 font-semibold flex items-start gap-2 leading-relaxed">
                              <span className="text-rose-400 mt-0.5 shrink-0">•</span>
                              <span>{weak}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: Study Roadmap Plan */}
                  <div className="lg:col-span-6 space-y-6">
                    {studyPlan && (
                      <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
                        <CardHeader className="pb-3 border-b border-white/[0.06] bg-[#050814]">
                          <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-poppins">
                            <BookOpen className="w-4 h-4 text-cyan-400" /> Personalized Study Plan
                          </CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Target Duration: {studyPlan.estimatedPreparationTime}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-5">
                          
                          {/* Missing Skills Badge */}
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bridging Skill Gaps</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {(studyPlan.missingSkills || []).map((s, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[9px] font-bold rounded-md">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Recommended Topics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Topics</h4>
                              <ul className="space-y-1 pl-1">
                                {(studyPlan.recommendedTopics || []).slice(0, 4).map((t, idx) => (
                                  <li key={idx} className="text-[10px] text-slate-300 font-semibold">• {t}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-1.5">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Algo Focus</h4>
                              <ul className="space-y-1 pl-1">
                                {(studyPlan.leetcodeAreas || []).slice(0, 4).map((l, idx) => (
                                  <li key={idx} className="text-[10px] text-slate-300 font-semibold">• {l}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Weekly Syllabus Timeline */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Syllabus</h4>
                            <div className="space-y-3">
                              {(studyPlan.weeklyPlan || []).map((week, idx) => (
                                <div key={idx} className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] space-y-1">
                                  <h5 className="text-[10px] font-black text-cyan-400">{week.week} - Goal: {week.objective}</h5>
                                  <p className="text-[9px] text-slate-400 font-semibold">Focus: {week.topics ? week.topics.join(', ') : ''}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                        </CardContent>
                      </Card>
                    )}
                  </div>

                </div>

                {/* Career Intelligence Audits */}
                {careerIntelligence && (
                  <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl shadow-xl relative overflow-hidden text-left">
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
                    <CardHeader className="pb-3 border-b border-white/[0.06] bg-[#050814]">
                      <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-poppins">
                        <TrendingUp className="w-4 h-4 text-pink-400" /> Career Intelligence Index
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-5">
                      
                      {/* Hiring Probability & Salary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-center space-y-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hiring Probability</span>
                          <p className="text-base sm:text-lg font-black text-[#00F2FE]">{careerIntelligence.hiringProbability}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-center space-y-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Average Annual Salary</span>
                          <p className="text-base sm:text-lg font-black text-emerald-400">
                            {careerIntelligence.salaryRange.currency} {careerIntelligence.salaryRange.average}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-center space-y-1">
                          <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Target Salary Bounds</span>
                          <p className="text-xs sm:text-sm font-bold text-slate-300">
                            Min: {careerIntelligence.salaryRange.min} | Max: {careerIntelligence.salaryRange.max}
                          </p>
                        </div>
                      </div>

                      {/* Growth Advice */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Growth Strategist Advice</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-semibold">{careerIntelligence.careerGrowthAdvice}</p>
                      </div>

                    </CardContent>
                  </Card>
                )}

                {/* Back to Setup Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => setSessionStage('setup')}
                    className="h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-bold px-8 cursor-pointer"
                  >
                    Start Another Interview Session
                  </Button>
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* DOCUMENTS / RAG TAB */}
        {activeTab === 'documents' && (
          <motion.div
            key="documents-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* Left side: Upload card */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
                <CardHeader className="bg-[#050814] border-b border-white/[0.06]">
                  <CardTitle className="text-xs font-bold text-white uppercase tracking-wider font-poppins">Upload RAG Reference Material</CardTitle>
                  <CardDescription className="text-xs text-slate-400 mt-0.5">
                    Documents uploaded here are chunked, vectorized, and dynamically retrieved to ground your Mock Interviews.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-[11px] font-bold text-slate-300">Category Tag</Label>
                    <Select value={uploadCategory} onValueChange={setUploadCategory}>
                      <SelectTrigger id="category" className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-slate-300">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="glass-card bg-[#0F1424] border-white/10 text-slate-300 rounded-xl">
                        {docCategories.map(c => (
                          <SelectItem key={c} value={c} className="text-xs font-semibold rounded-lg focus:bg-white/5 cursor-pointer">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="tags" className="text-[11px] font-bold text-slate-300">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      placeholder="e.g. system-design, amazon, leetcode"
                      value={uploadTags}
                      onChange={(e) => setUploadTags(e.target.value)}
                      className="h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-300">Upload File (PDF/DOCX/TXT/MD)</Label>
                    <div
                      {...getRootProps()}
                      className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 ${
                        isDragActive
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                          : 'border-white/10 bg-[#050814] hover:bg-white/[0.03] hover:border-white/20'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-cyan-400" />
                        {isUploading ? (
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                            Uploading & generating vector embeddings...
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-slate-200 font-bold">Drag and drop document here</p>
                            <p className="text-[10px] text-slate-500 mt-1">Supports PDF, DOCX, TXT, MD, CSV, Code</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

            {/* Right side: Search/List library */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="glass-card bg-[#0F1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                <CardHeader className="pb-3 border-b border-white/[0.06] bg-[#050814]">
                  
                  {/* Search controls */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        placeholder="Search document archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 rounded-xl bg-[#050814] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6]"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        onClick={() => {
                          const nextType = searchType === 'keyword' ? 'semantic' : 'keyword';
                          setSearchType(nextType);
                          toast({ title: `Search mode switched to ${nextType}` });
                        }}
                        className={`cursor-pointer px-3 py-1.5 text-[9px] uppercase tracking-wider rounded-lg font-extrabold ${
                          searchType === 'semantic'
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {searchType === 'semantic' ? '🧬 Semantic Match' : '🔍 Keyword Match'}
                      </Badge>

                      <Button
                        size="sm"
                        onClick={() => fetchDocs(searchQuery)}
                        className="h-8 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
                      >
                        Search
                      </Button>
                    </div>
                  </div>

                  {/* Categories pills */}
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {['All', ...docCategories].map(c => (
                      <Badge
                        key={c}
                        onClick={() => {
                          setSelectedDocCategory(c);
                          setTimeout(() => fetchDocs(), 0);
                        }}
                        className={`cursor-pointer text-[9px] px-2.5 py-0.5 rounded-full ${
                          selectedDocCategory === c
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>

                </CardHeader>
                <CardContent className="pt-4 max-h-[440px] overflow-y-auto pr-1 p-4">
                  
                  {loadingDocs ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500 text-xs">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8B5CF6]" />
                      Searching reference vectors...
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs font-semibold">
                      No matching documents found. Upload notes or interview logs to start RAG.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc: RAGDocument) => (
                        <div
                          key={doc._id}
                          className="p-3.5 rounded-xl border border-white/[0.05] bg-[#050814] hover:bg-white/[0.02] transition-all flex items-center justify-between gap-4 group"
                        >
                          <div className="flex items-center gap-3 max-w-[70%]">
                            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center shrink-0">
                              <FileCheck className="w-4.5 h-4.5 text-[#8B5CF6]" />
                            </div>
                            <div className="text-left">
                              {renameId === doc._id ? (
                                <div className="flex items-center gap-1.5">
                                  <Input
                                    value={renameTitle}
                                    onChange={(e) => setRenameTitle(e.target.value)}
                                    className="h-7 py-0 px-2 text-xs text-white"
                                  />
                                  <Button size="sm" onClick={() => handleRename(doc._id)} className="h-7 text-[9px] bg-emerald-500 text-white px-2">Save</Button>
                                  <Button size="sm" onClick={() => setRenameId(null)} className="h-7 text-[9px] bg-white/5 text-slate-300 px-2">Cancel</Button>
                                </div>
                              ) : (
                                <>
                                  <h4 className="text-xs font-bold text-slate-200 truncate">{doc.title}</h4>
                                  <p className="text-[9px] text-slate-500 truncate">{doc.fileName} | {doc.category}</p>
                                  {doc.tags && doc.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {doc.tags.map((t: string) => (
                                        <span key={t} className="text-[8px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.2 rounded font-bold">#{t}</span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* Preview Document Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPreviewDoc(doc)}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
                              title="Preview Document Text"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(doc)}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                            >
                              <Heart className={`w-4 h-4 ${doc.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setRenameId(doc._id);
                                setRenameTitle(doc.title);
                              }}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteDoc(doc._id)}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Document Content Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0B1020] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden text-left"
          >
            <div className="p-4 border-b border-white/10 bg-[#050814] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> {previewDoc.title}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{previewDoc.fileName} • Category: {previewDoc.category}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewDoc(null)}
                className="h-8 w-8 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#030712]">
              {previewDoc.content || 'No text content available.'}
            </div>

            <div className="p-3 border-t border-white/10 bg-[#050814] flex justify-end">
              <Button
                onClick={() => setPreviewDoc(null)}
                className="h-8 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              >
                Close Preview
              </Button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default InterviewWorkspace;
