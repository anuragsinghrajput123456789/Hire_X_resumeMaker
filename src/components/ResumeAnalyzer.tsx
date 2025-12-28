import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { analyzeResume, type AnalysisResult } from '../services/geminiApi';
import { extractTextFromPDF, extractTextFromWordDoc } from '../services/pdfTextExtractor';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Upload, 
  Loader2,
  Brain,
  Target,
  Award,
  RefreshCw,
  Clock,
  File,
  TrendingUp,
  Lightbulb,
  Plus,
  Minus,
  BookOpen,
  Eye,
  Type,
  Settings,
  BarChart3,
  Search,
  Zap,
  ArrowRight,
  Briefcase,
  Star,
  Wand2,
  Copy,
  CheckCheck
} from 'lucide-react';

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

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [customJobRole, setCustomJobRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const cleanResumeText = (rawText: string): string => {
    // Basic cleaning, more advanced logic can be kept if not overly verbose to replicate
    return rawText.replace(/\s+/g, ' ').trim();
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
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
  };

  const handleAnalyze = async (autoStart = false) => {
    if (!resumeText.trim()) {
       if (!autoStart) {
        toast({ title: "No Resume Content", description: "Please upload a resume document.", variant: "destructive" });
       }
       return;
    }
    
    // Determine the effective job role
    const effectiveRole = selectedJobRole === 'Other / Custom' ? customJobRole : selectedJobRole;

    if (!effectiveRole && !autoStart) {
         toast({ title: "Select Job Role", description: "Please select or enter a target job role.", variant: "destructive" });
         return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setIsRetrying(false);
    
    try {
      const result = await analyzeResume(resumeText, effectiveRole);
      setAnalysis(result);
      toast({ title: "Analysis Complete", description: `ATS Score: ${result.atsScore}/100` });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
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
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'], 'text/plain': ['.txt'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getGradientColor = (score: number) => {
      if (score >= 80) return 'from-green-500 to-emerald-600';
      if (score >= 60) return 'from-yellow-400 to-orange-500';
      return 'from-red-500 to-rose-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AI Resume Analyzer
            </h1>
            <p className="text-muted-foreground text-lg">
              Get detailed ATS insights tailored to your target job role.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Target Job Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select or type a job role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobRoles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedJobRole === 'Other / Custom' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="custom-role" className="mb-2 block text-sm font-medium text-muted-foreground">
                      Enter specific job title
                    </Label>
                    <Input
                      id="custom-role"
                      placeholder="e.g. Senior React Native Engineer"
                      value={customJobRole}
                      onChange={(e) => setCustomJobRole(e.target.value)}
                      className="h-12 text-base border-primary/20 focus:border-primary"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-primary/10">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Upload className="w-5 h-5 text-primary" />
                   Upload Resume
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div
                   {...getRootProps()}
                   className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                     isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
                   }`}
                 >
                   <input {...getInputProps()} />
                   <div className="space-y-3">
                     <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                       <FileText className="w-8 h-8 text-primary" />
                     </div>
                     <p className="font-medium text-lg">
                       {isDragActive ? 'Drop your resume here' : 'Drag & drop or across to upload'}
                     </p>
                     <p className="text-sm text-muted-foreground">Supported: PDF, DOCX, TXT (Max 10MB)</p>
                   </div>
                 </div>
                 
                 {uploadProgress > 0 && (
                   <div className="mt-4 space-y-2">
                     <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>{uploadProgress}%</span>
                     </div>
                     <Progress value={uploadProgress} />
                   </div>
                 )}

                 {resumeText && (
                   <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg flex items-center gap-3">
                     <CheckCircle className="w-5 h-5 text-green-600" />
                     <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-green-800 dark:text-green-300 truncate">{fileName}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">{resumeText.length.toLocaleString()} chars</p>
                     </div>
                     <Button size="sm" variant="ghost" onClick={() => setResumeText('')} className="text-green-700 hover:text-green-800 hover:bg-green-100">
                        Change
                     </Button>
                   </div>
                 )}
                 
                 <Button 
                    className="w-full mt-6 h-12 text-lg font-semibold shadow-lg shadow-primary/20" 
                    onClick={() => handleAnalyze(false)}
                    disabled={!resumeText || isAnalyzing || (!selectedJobRole && !customJobRole)}
                 >
                    {isAnalyzing ? (
                        <>
                         <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
                        </>
                    ) : (
                        <>
                         <Sparkles className="mr-2 h-5 w-5" /> Analyze Resume
                        </>
                    )}
                 </Button>
               </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
             {!analysis ? (
               <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted-foreground/20">
                 <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6">
                    <Brain className="w-16 h-16 text-slate-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Ready to Analyze</h3>
                 <p className="text-muted-foreground max-w-md">
                   Upload your resume and select a target job role to get a comprehensive ATS analysis and improvement suggestions.
                 </p>
               </Card>
             ) : (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* Score Card */}
                  <Card className="overflow-hidden border-none shadow-xl">
                    <div className={`p-8 bg-gradient-to-br ${getGradientColor(analysis.atsScore)} text-white relative overflow-hidden`}>
                       <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Award className="w-64 h-64 transform rotate-12 translate-x-12 -translate-y-12" />
                       </div>
                       
                       <div className="relative z-10 flex flex-col items-center text-center">
                          <h3 className="text-xl font-medium opacity-90 mb-2">ATS Compatibility Score</h3>
                          <div className="text-7xl font-bold tracking-tighter mb-2">
                             {analysis.atsScore}<span className="text-4xl opacity-60">/100</span>
                          </div>
                          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold">
                             {analysis.atsScore >= 80 ? 'Excellent Match' : analysis.atsScore >= 60 ? 'Good Potential' : 'Needs Improvement'}
                          </div>
                       </div>
                    </div>
                  </Card>

                  {/* Improvements */}
                  <div className="grid gap-4">
                     <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                           <CardTitle className="text-red-600 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" /> Format Issues
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-2">
                              {analysis.formatSuggestions.map((item, i) => (
                                 <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-red-500 mt-1">•</span>
                                    <span>{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </CardContent>
                     </Card>

                     <Card className="border-l-4 border-l-blue-500">
                        <CardHeader>
                           <CardTitle className="text-blue-600 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" /> Content Improvements
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-2">
                              {analysis.improvements.map((item, i) => (
                                 <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </CardContent>
                     </Card>

                     <Card className="border-l-4 border-l-purple-500">
                        <CardHeader>
                           <CardTitle className="text-purple-600 flex items-center gap-2">
                              <Sparkles className="w-5 h-5" /> Missing Keywords
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="flex flex-wrap gap-2">
                              {analysis.missingKeywords.map((keyword, i) => (
                                 <Badge key={i} variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                                    {keyword}
                                 </Badge>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                     
                     <Card className="border-l-4 border-l-green-500">
                         <CardHeader>
                            <CardTitle className="text-green-600 flex items-center gap-2">
                               <Briefcase className="w-5 h-5" /> Matching Roles
                            </CardTitle>
                         </CardHeader>
                         <CardContent>
                             <div className="flex flex-wrap gap-2">
                               {analysis.matchingJobRoles.map((role, i) => (
                                  <Badge key={i} variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                     {role}
                                  </Badge>
                               ))}
                             </div>
                         </CardContent>
                     </Card>

                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
