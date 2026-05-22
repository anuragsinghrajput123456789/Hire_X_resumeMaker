import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken, clearAuthStorage } from '../services/apiClient';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { analyzeResume, type AnalysisResult } from '../services/aiService';
import { extractTextFromPDF, extractTextFromWordDoc } from '../services/pdfTextExtractor';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Upload, 
  Loader2,
  Brain,
  Target,
  Award,
  TrendingUp,
  Briefcase,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search,
  Layout,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const jobRoles = [
  'Software Developer',
  'Data Analyst',
  'Product Manager',
  'Marketing Manager',
  'Sales Representative',
  'Project Manager',
  'Business Analyst',
  'UX/UI Designer',
  'DevOps Engineer',
  'Customer Success Manager',
  'Financial Analyst',
  'HR Specialist',
  'Operations Manager',
  'Content Writer',
  'Digital Marketing Specialist',
  'Other / Custom'
];

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong';

const cleanResumeText = (rawText: string): string => {
  return rawText.replace(/\s+/g, ' ').trim();
};

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const token = getStoredToken();
  
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 select-none">
        <Card className="glass-card bg-[#0F1424]/85 border border-white/5 shadow-2xl overflow-hidden rounded-3xl relative text-center p-8">
          <div className="absolute inset-0 bg-grid-soft opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5A0] via-[#00D2FF] to-[#8B5CF6] p-[1.5px] mb-6 shadow-xl shadow-emerald-500/10">
              <div className="w-full h-full bg-[#0F1424] rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-[#00F5A0]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00F5A0] to-[#00D2FF] mb-3">
              Resume AI Intelligence
            </h2>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">
              Unlock complete resume ATS parsing audits, structure scans, custom keyword extraction, and target profile optimization by signing in or registering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button 
                onClick={() => navigate('/login')}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-extrabold px-6 h-11 transition-all"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D2FF] hover:from-[#00E290] hover:to-[#00C2EF] text-white font-black px-6 h-11 shadow-lg shadow-emerald-500/15 transition-all"
              >
                Create Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [customJobRole, setCustomJobRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    try {
      setUploadProgress(10);
      let rawText = '';
      if (file.type === 'application/pdf') {
        setUploadProgress(30);
        rawText = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        setUploadProgress(30);
        rawText = await file.text();
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        setUploadProgress(30);
        rawText = await extractTextFromWordDoc(file);
      } else {
        setUploadProgress(30);
        rawText = await file.text();
      }
      setUploadProgress(70);
      const cleanedText = cleanResumeText(rawText);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      return cleanedText;
    } catch (error) {
      setUploadProgress(0);
      throw error;
    }
  }, []);

  const handleAnalyze = async (autoStart = false) => {
    if (!resumeText.trim()) {
       if (!autoStart) {
        toast({ title: "No Resume Content", description: "Please upload a resume document.", variant: "destructive" });
       }
       return;
    }
    
    const effectiveRole = selectedJobRole === 'Other / Custom' ? customJobRole : selectedJobRole;

    if (!effectiveRole && !autoStart) {
         toast({ title: "Select Job Role", description: "Please select or enter a target job role.", variant: "destructive" });
         return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    
    try {
      const result = await analyzeResume(resumeText, effectiveRole);
      setAnalysis(result);
      toast({ title: "Analysis Complete", description: `ATS Score: ${result.atsScore}/100` });
    } catch (error: unknown) {
      console.error('Analysis error:', error);
      const errorMessage = getErrorMessage(error);
      if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('not authorized') || errorMessage.toLowerCase().includes('no token')) {
        clearAuthStorage();
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      setFileName(file.name);
      setAnalysis(null);
      toast({ title: "Resume Uploaded", description: "Document processed successfully." });
    } catch (error: unknown) {
      toast({ title: "Upload Failed", description: getErrorMessage(error), variant: "destructive" });
    }
  }, [extractTextFromFile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'], 'text/plain': ['.txt'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };
  
  const getGradientColor = (score: number) => {
      if (score >= 80) return 'from-emerald-500 to-teal-600';
      if (score >= 60) return 'from-amber-400 to-orange-500';
      return 'from-rose-500 to-pink-600';
  };

  return (
    <div className="pb-16 relative overflow-hidden selection:bg-emerald-500/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Left Column: Target Role & Dropzone */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col gap-6"
            >
              {/* Target Job Profile */}
              <Card className="glass-card border-white/5 shadow-xl bg-[#0F1424]/80">
                <CardHeader className="pb-4 border-b border-white/5">
                  <CardTitle className="text-base font-extrabold flex items-center gap-2.5 text-white">
                    <Target className="w-5 h-5 text-emerald-400" />
                    Target Job Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Title</Label>
                    <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
                      <SelectTrigger className="h-13 rounded-xl border-white/5 bg-[#0A0E1A] text-white focus:ring-1 focus:ring-emerald-500/30">
                        <SelectValue placeholder="What job are you aiming for?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/5 bg-[#0F1424] text-white">
                        {jobRoles.map((role) => (
                          <SelectItem key={role} value={role} className="rounded-lg hover:bg-white/5 focus:bg-white/5">{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <AnimatePresence>
                    {selectedJobRole === 'Other / Custom' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Custom Title</Label>
                        <Input
                          placeholder="e.g. Senior Frontend Lead"
                          value={customJobRole}
                          onChange={(e) => setCustomJobRole(e.target.value)}
                          className="h-13 rounded-xl border-white/5 bg-[#0A0E1A] text-white placeholder-gray-600 focus-visible:ring-emerald-500/30"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Document Dropzone */}
              <Card className="glass-card border-white/5 shadow-xl bg-[#0F1424]/80 flex-1 flex flex-col">
                <CardHeader className="pb-4 border-b border-white/5">
                  <CardTitle className="text-base font-extrabold flex items-center gap-2.5 text-white">
                    <Upload className="w-5 h-5 text-emerald-400" />
                    Upload Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 flex-1 flex flex-col justify-center items-center group ${
                      isDragActive 
                        ? 'border-emerald-400 bg-emerald-500/5 scale-[1.01]' 
                        : 'border-emerald-500/10 bg-[#0A0E1A]/40 hover:border-emerald-400/40 hover:bg-emerald-500/[0.02]'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                      <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-all duration-500">
                        <FileText className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm text-gray-200">
                          {isDragActive ? 'Drop your document here' : 'Drop resume file'}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">Supports PDF, DOCX, TXT up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  {uploadProgress > 0 && (
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                         <span>Reading Document Content...</span>
                         <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-1.5 bg-emerald-500/10" />
                    </div>
                  )}

                  <AnimatePresence>
                    {resumeText && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-[#0A0E1A] rounded-lg flex items-center justify-center border border-emerald-500/20">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 overflow-hidden text-left">
                           <p className="font-bold text-xs text-white truncate">{fileName}</p>
                           <p className="text-[10px] text-gray-400 font-medium">{(resumeText.length / 1024).toFixed(1)} KB processed</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setResumeText('')} className="h-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-gray-400 text-xs">
                           Clear
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <Button 
                    className="w-full mt-6 h-13 text-sm font-black btn-gradient group" 
                    onClick={() => handleAnalyze(false)}
                    disabled={!resumeText || isAnalyzing || (!selectedJobRole && !customJobRole)}
                  >
                    {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" /> DISSECTING...
                        </>
                    ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5 group-hover:fill-current" /> RUN SMART ANALYSIS
                        </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: Placeholder Brain or Analysis Results */}
          <div className="lg:col-span-7 flex">
            <AnimatePresence mode="wait" className="w-full flex">
              {!analysis ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="w-full min-h-[460px] flex flex-col items-center justify-center text-center p-8 glass-card border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden bg-[#0F1424]/40 flex-1 glow-green"
                >
                  <div className="relative z-10 space-y-6 max-w-md">
                    <div className="bg-emerald-500/5 p-7 border border-emerald-500/15 rounded-3xl inline-block shadow-lg shadow-emerald-500/5">
                       <Brain className="w-14 h-14 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="space-y-2.5">
                      <h3 className="text-2xl font-black text-white">Intelligence Awaits</h3>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        Connect your resume to our neural network to receive a comprehensive breakdown of your professional DNA.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        { icon: Award, label: "ATS Score" },
                        { icon: Layout, label: "Format Scan" },
                        { icon: Search, label: "Keyword Check" },
                        { icon: ShieldCheck, label: "Data Secured" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 bg-[#0F1424]/90 rounded-xl border border-white/5 font-bold text-xs text-gray-200">
                          <item.icon className="w-4 h-4 text-emerald-400" />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 w-full text-left"
                >
                  {/* Score Dashboard */}
                  <Card className="glass-card border-white/5 shadow-2xl overflow-hidden bg-[#0F1424]/90 relative">
                    <div className={`p-8 bg-gradient-to-br ${getGradientColor(analysis.atsScore)} text-white relative overflow-hidden`}>
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Award className="w-56 h-56 transform rotate-12 translate-x-12 -translate-y-12" />
                       </div>
                       
                       <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="space-y-3">
                             <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-[10px] font-black uppercase tracking-wider">
                                ATS Assessment
                             </div>
                             <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                                {analysis.atsScore}<span className="text-2xl opacity-60">/100</span>
                             </h3>
                             <p className="text-base font-bold opacity-90">
                                {analysis.atsScore >= 80 ? 'Excellent Match!' : analysis.atsScore >= 60 ? 'Good Match - Needs Tuning' : 'Weak Compatibility'}
                             </p>
                          </div>
                          <div className="hidden justify-end md:flex">
                             <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-white/10 border border-white/10">
                               <Award className="h-16 w-16 text-white" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </Card>

                  {/* Detailed Analysis Grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Format Section */}
                    <Card className="glass-card border-white/5 bg-[#0F1424]/80 shadow-xl">
                      <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="text-rose-400 text-sm font-black flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> FORMAT AUDIT
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5">
                        <ul className="space-y-3.5">
                          {analysis.formatSuggestions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                              <p className="text-xs text-gray-300 font-medium leading-relaxed">{item}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Improvements Section */}
                    <Card className="glass-card border-white/5 bg-[#0F1424]/80 shadow-xl">
                      <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="text-indigo-400 text-sm font-black flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> STRATEGIC EDITS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5">
                        <ul className="space-y-3.5">
                          {analysis.improvements.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                              <p className="text-xs text-gray-300 font-medium leading-relaxed">{item}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Keywords Section */}
                    <Card className="glass-card border-white/5 bg-[#0F1424]/80 shadow-xl md:col-span-2">
                      <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
                        <CardTitle className="text-purple-400 text-sm font-black flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> CRITICAL KEYWORDS MISSING
                        </CardTitle>
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs font-bold">{analysis.missingKeywords.length}</Badge>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingKeywords.map((keyword, i) => (
                            <Badge key={i} className="px-3.5 py-1.5 rounded-xl bg-purple-500/5 text-purple-300 border-purple-500/10 font-bold text-xs">
                              + {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Job Roles Section */}
                    <Card className="glass-card border-white/5 bg-[#0F1424]/80 shadow-xl md:col-span-2">
                      <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="text-emerald-400 text-sm font-black flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> IDEAL ROLE MATCHES
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {analysis.matchingJobRoles.map((role, i) => (
                            <div key={i} className="flex items-center gap-2.5 p-2.5 bg-[#0A0E1A]/60 rounded-xl border border-white/5">
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <Award className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-emerald-300 truncate">{role}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button size="lg" className="h-13 px-8 text-sm font-black btn-gradient rounded-xl group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      RE-ANALYZE REVISED VERSION <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-13 px-8 text-sm font-black border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl">
                      DOWNLOAD REPORT (PDF)
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
