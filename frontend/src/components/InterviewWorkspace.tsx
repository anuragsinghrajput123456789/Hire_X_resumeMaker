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
  Edit2
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

  // Resume states
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Setup mock interview session states
  const [sessionStage, setSessionStage] = useState<'setup' | 'active' | 'feedback'>('setup');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  // Active Session states
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<InterviewRoadmap | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [answerResult, setAnswerResult] = useState<{ score: number; review: string; modelAnswer: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Completed Session Feedback/Study Plan states
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [studyPlan, setStudyPlan] = useState<InterviewStudyPlan | null>(null);
  const [careerIntelligence, setCareerIntelligence] = useState<CareerIntelligence | null>(null);

  // Timer states
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);

  // Fetch initial documents and resumes
  useEffect(() => {
    fetchDocs();
    fetchResumes();
  }, []);

  // Timer hook
  useEffect(() => {
    if (sessionStage === 'active' && !answerResult) {
      const interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
      setTimerIntervalId(interval);
      return () => clearInterval(interval);
    } else {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
        setTimerIntervalId(null);
      }
    }
  }, [sessionStage, answerResult]);

  const fetchDocs = async (query = '') => {
    setLoadingDocs(true);
    try {
      const categoryFilter = selectedDocCategory === 'All' ? undefined : selectedDocCategory;
      const res = await getDocuments({
        search: query || undefined,
        type: searchType,
        category: categoryFilter
      });
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const fetchResumes = async () => {
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
  };

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
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Could not upload document',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [uploadCategory, uploadTags, toast]);

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

  // Start mock interview session
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
      const res = await startSession({
        jobDescription,
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
        description: 'RAG Roadmap and first question generated successfully.'
      });
    } catch (err: any) {
      toast({
        title: 'Setup Failed',
        description: err.message || 'Failed to start interview prep session.',
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

      // Update question data if session isn't completed
      if (!res.completed && res.nextQuestion) {
        setCurrentQuestion(res.nextQuestion);
      } else if (res.completed) {
        setCurrentQuestion(null);
      }
    } catch (err: any) {
      toast({
        title: 'Submission Failed',
        description: err.message || 'Could not evaluate answer.',
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
  };

  // Finalize Mock Session (generate results study plan & career intelligence)
  const handleFinalizeSession = async () => {
    if (!sessionId) return;
    setIsFinishing(true);
    try {
      const res = await finalizeSession({ sessionId });
      setFeedback(res.feedback);
      setStudyPlan(res.studyPlan);
      setCareerIntelligence(res.careerIntelligence);
      setSessionStage('feedback');
    } catch (err: any) {
      toast({
        title: 'Feedback Failed',
        description: err.message || 'Could not compile final feedback reports.',
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
      
      {/* Selector Tabs */}
      <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl max-w-sm mx-auto">
        <button
          onClick={() => setActiveTab('interview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'interview'
              ? 'bg-[#8B5CF6] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          Interview Prep
        </button>
        <button
          onClick={() => {
            setActiveTab('documents');
            fetchDocs();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'documents'
              ? 'bg-[#8B5CF6] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          RAG Documents
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
            {/* STAGE 1: SETUP */}
            {sessionStage === 'setup' && (
              <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative text-left">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-50" />
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider">Start Mock Interview Prep</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Configure parameters to customize roadmap, RAG context matching, and questions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStartSession} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="companyName" className="text-[11px] font-bold text-slate-300">Target Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="e.g. Amazon, Google, Startup"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="roleTitle" className="text-[11px] font-bold text-slate-300">Target Job Title / Role</Label>
                        <Input
                          id="roleTitle"
                          placeholder="e.g. AI Engineer, Fullstack Architect"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="intType" className="text-[11px] font-bold text-slate-300">Interview Focus Type</Label>
                        <Select value={interviewType} onValueChange={setInterviewType}>
                          <SelectTrigger id="intType" className="h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-slate-300">
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
                          <SelectTrigger id="difficulty" className="h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-slate-300">
                            <SelectValue placeholder="Difficulty" />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-[#0F1424] border-white/10 text-slate-300 rounded-xl">
                            {difficultyLevels.map(l => (
                              <SelectItem key={l} value={l} className="text-xs font-semibold rounded-lg focus:bg-white/5 cursor-pointer">{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="setupResume" className="text-[11px] font-bold text-slate-300">Select Profile Resume</Label>
                        {loadingResumes ? (
                          <div className="h-10 flex items-center justify-center text-xs text-slate-500 bg-white/[0.01] border border-white/5 rounded-xl">
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2 text-[#8B5CF6]" /> Loading...
                          </div>
                        ) : resumes.length === 0 ? (
                          <div className="h-10 flex items-center justify-between px-3 text-[10px] text-slate-400 bg-white/[0.01] border border-dashed border-white/10 rounded-xl">
                            No Resumes
                            <Link to="/generator">
                              <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 text-[9px] cursor-pointer">Create</Badge>
                            </Link>
                          </div>
                        ) : (
                          <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                            <SelectTrigger id="setupResume" className="h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-slate-200">
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

                    <div className="space-y-1.5">
                      <Label htmlFor="jdText" className="text-[11px] font-bold text-slate-300">Target Job Description</Label>
                      <textarea
                        id="jdText"
                        placeholder="Paste the target duties, roles, and technical description here to align the questions..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full h-36 p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/15 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmittingAnswer}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-extrabold text-xs shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2"
                    >
                      {isSubmittingAnswer ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Constructing RAG Roadmap & Opening Session...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                          Initialize RAG Mock Interview
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
                    <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative">
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                          <Zap className="w-4 h-4 text-cyan-400" /> Tailored Prep Roadmap
                        </CardTitle>
                        <CardDescription className="text-[10px] text-slate-400">Roadmap built using target parameters & RAG reference materials.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                        <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                          <h4 className="text-xs font-bold text-slate-300 mb-1">Timeline Target: {roadmap.role}</h4>
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

                {/* Question panel */}
                <div className="lg:col-span-8 space-y-6">
                  {currentQuestion ? (
                    <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative">
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-50" />
                      
                      <CardHeader className="pb-3 border-b border-white/[0.04] flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                            Q{currentQuestion.questionNumber}
                          </Badge>
                          <Badge className="bg-white/5 text-slate-300 border-white/10 text-[9px] font-bold">
                            {currentQuestion.category}
                          </Badge>
                          {currentQuestion.difficulty && (
                            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[9px] font-bold">
                              {currentQuestion.difficulty}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          <Clock className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                          <span>{formatTimer(secondsElapsed)}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-6 space-y-6">
                        
                        {/* Question Block */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 opacity-5">
                            <Sparkles className="w-24 h-24 text-white" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-100 leading-relaxed font-poppins relative z-10">
                            {currentQuestion.question}
                          </h3>
                        </div>

                        {/* Retrieved document attribution badge */}
                        {currentQuestion.contextRetrieved && (
                          <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-semibold bg-cyan-500/5 p-2 rounded-lg border border-cyan-500/10">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>RAG Grounded: Context matched from uploaded materials.</span>
                          </div>
                        )}

                        {/* Answer Input Area */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="userAns" className="text-[11px] font-bold text-slate-300">Your Response Answer</Label>
                            {currentQuestion.hint && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowHint(!showHint)}
                                className="h-7 text-[10px] text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/5 font-extrabold gap-1.5 flex"
                              >
                                <Lightbulb className="w-3.5 h-3.5" />
                                {showHint ? 'Hide Hint' : 'Reveal Hint'}
                              </Button>
                            )}
                          </div>

                          <AnimatePresence>
                            {showHint && currentQuestion.hint && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-3"
                              >
                                <div className="p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-[10px] font-semibold text-yellow-300 leading-relaxed">
                                  {currentQuestion.hint}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <textarea
                            id="userAns"
                            placeholder="Type your detailed, structured answer response here... Speak to technical specifics or structure behavioral metrics using STAR method."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={isSubmittingAnswer || !!answerResult}
                            className="w-full h-32 p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/15 resize-none disabled:opacity-60"
                          />
                        </div>

                        {/* Submit Actions */}
                        {!answerResult ? (
                          <div className="flex justify-end">
                            <Button
                              onClick={handleSubmitAnswer}
                              disabled={isSubmittingAnswer || !userAnswer.trim()}
                              className="h-10 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-extrabold px-6 gap-2"
                            >
                              {isSubmittingAnswer ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" /> Submit Response
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          // Answer evaluation result block
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] space-y-4"
                          >
                            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Answer Assessment</span>
                              <Badge className={answerResult.score >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                                Response Score: {answerResult.score}/100
                              </Badge>
                            </div>
                            
                            <p className="text-[11px] text-slate-300 font-semibold leading-relaxed whitespace-pre-line">
                              {answerResult.review}
                            </p>

                            {answerResult.modelAnswer && (
                              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Model Answer</h4>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed whitespace-pre-line">{answerResult.modelAnswer}</p>
                              </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                              <Button
                                onClick={handleNextQuestion}
                                className="h-9.5 rounded-xl bg-gradient-to-r from-cyan-400 to-[#8B5CF6] hover:scale-102 text-white text-xs font-extrabold px-5 gap-2"
                              >
                                Next Question <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}

                      </CardContent>
                    </Card>
                  ) : (
                    // Session complete, ready to analyze
                    <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative p-8 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/10">
                        <div className="w-full h-full bg-[#0F1424] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-pink-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-white">Mock Interview Finished!</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                          All mock questions completed. We are ready to compile your technical feedback, career intelligence index, and detailed study schedules.
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          onClick={handleFinalizeSession}
                          disabled={isFinishing}
                          className="h-11 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white text-xs font-black px-8 gap-2 shadow-lg shadow-pink-500/15"
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
                
                {/* Core Overall Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Overall score gauge card */}
                  <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl p-6 text-center space-y-3 shadow-xl md:col-span-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Readiness</h3>
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center rounded-full border-4 border-dashed border-[#8B5CF6]/30">
                      <div className="absolute w-24 h-24 rounded-full bg-[#8B5CF6]/5 blur-sm" />
                      <div className="text-center relative z-10">
                        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-pink-500">
                          {feedback.overallScore}
                        </span>
                        <p className="text-[10px] text-slate-500 font-black mt-0.5">/ 100</p>
                      </div>
                    </div>
                    <Badge className="bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] px-2 py-0.5">
                      {difficulty} prep
                    </Badge>
                  </Card>

                  {/* Dimension score bars card */}
                  <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl p-5 shadow-xl md:col-span-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Competency Radar Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(feedback?.scores || {}).map(([key, val]) => (
                        <div key={key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                            <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-[#8B5CF6]">{val}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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
                  
                  {/* Left Column: Strengths / Weaknesses / Suggestions */}
                  <div className="lg:col-span-6 space-y-6">
                    <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl shadow-xl">
                      <CardHeader className="pb-3 border-b border-white/[0.04]">
                        <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> Observed Strengths
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

                    <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl shadow-xl">
                      <CardHeader className="pb-3 border-b border-white/[0.04]">
                        <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
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
                      <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
                        <CardHeader className="pb-3 border-b border-white/[0.04]">
                          <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-cyan-400" /> Personalized Study Plan
                          </CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Target Preparation Duration: {studyPlan.estimatedPreparationTime}</CardDescription>
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

                          {/* Recommended Topics / Leetcode */}
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
                  <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl shadow-xl relative overflow-hidden text-left">
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
                    <CardHeader className="pb-3 border-b border-white/[0.04]">
                      <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
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
                    className="h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-bold px-6"
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
              <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-50" />
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider">Upload Reference Guides</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Documents uploaded here will be chunked, embedded, and dynamically retrieved by the AI to ground Mock Interviews.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-[11px] font-bold text-slate-300">Category Tag</Label>
                    <Select value={uploadCategory} onValueChange={setUploadCategory}>
                      <SelectTrigger id="category" className="h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-slate-300">
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
                      className="h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-300">Upload File (PDF/DOCX/TXT/MD)</Label>
                    <div
                      {...getRootProps()}
                      className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 ${
                        isDragActive
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/5'
                          : 'border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-slate-400" />
                        {isUploading ? (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                            Uploading & embedding...
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-slate-300 font-bold">Drag and drop file here</p>
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
              <Card className="glass-card bg-[#0F1424]/40 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative">
                <CardHeader className="pb-3 border-b border-white/[0.04]">
                  
                  {/* Search controls */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                      <Input
                        placeholder="Search document archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 rounded-xl bg-white/[0.02] border-white/10 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/10"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        onClick={() => {
                          const nextType = searchType === 'keyword' ? 'semantic' : 'keyword';
                          setSearchType(nextType);
                          toast({ title: `Search mode switched to ${nextType}` });
                        }}
                        className={`cursor-pointer px-2.5 py-1 text-[9px] uppercase tracking-wider rounded-md font-extrabold ${
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
                        className="h-8 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300"
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
                          // We trigger fetching documents with category filter
                          // Wait, to run properly we set it in state and fetch immediately
                          setTimeout(() => fetchDocs(), 0);
                        }}
                        className={`cursor-pointer text-[9px] px-2 py-0.5 rounded-full ${
                          selectedDocCategory === c
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>

                </CardHeader>
                <CardContent className="pt-4 max-h-[420px] overflow-y-auto pr-1">
                  
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
                      {documents.map((doc: any) => (
                        <div
                          key={doc._id}
                          className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-all flex items-center justify-between gap-4 group"
                        >
                          <div className="flex items-center gap-3 max-w-[70%]">
                            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
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
                                        <span key={t} className="text-[8px] text-[#8B5CF6] bg-[#8B5CF6]/5 px-1.5 py-0.2 rounded font-bold">#{t}</span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(doc)}
                              className="h-8 w-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5"
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
                              className="h-8 w-8 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteDoc(doc._id)}
                              className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/5"
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

    </div>
  );
};

export default InterviewWorkspace;
