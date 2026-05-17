import { useState, useEffect, useContext, useCallback } from 'react';
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
import { Link } from 'react-router-dom';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<ResumeData | null>(null);
  const [atsOptimizedContent, setAtsOptimizedContent] = useState<string>('');
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const { toast } = useToast();
  
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
      toast({
        title: "Error fetching resumes",
        description: getErrorMessage(error),
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

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
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
        skills: data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
        certifications: data.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0),
        languages: data.languages ? data.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        achievements: data.achievements ? data.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
      };

      const atsContent = await generateResume(processedData);
      setAtsOptimizedContent(atsContent);
      setGeneratedData(processedData);
      onResumeGenerated('ATS-Optimized Resume Generated');
      
      toast({
        title: "✅ ATS-Optimized Resume Generated!",
        description: "Your professional resume is ready with enhanced formatting and keyword optimization.",
      });
    } catch (error) {
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
      skills: watchedData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      certifications: watchedData.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0),
      languages: watchedData.languages ? watchedData.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
      achievements: watchedData.achievements ? watchedData.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
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
        templateId: selectedTemplate,
        customSections 
      };
      
      await resumeService.saveResume(resumeToSave);
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });
      fetchResumes(); 
    } catch (error: unknown) {
      toast({
        title: "Error saving resume",
        description: getErrorMessage(error),
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
      toast({
         title: "Error deleting resume",
         description: getErrorMessage(error),
         variant: "destructive"
      });
    }
  };

  const downloadPDF = () => {
    const currentData = watchedData.fullName ? {
      ...watchedData,
      skills: watchedData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      certifications: watchedData.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0),
      languages: watchedData.languages ? watchedData.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
      achievements: watchedData.achievements ? watchedData.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
    } : generatedData;

    if (!currentData) return;

    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) return;

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${currentData.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(resumeElement).save().then(() => {
      toast({
        title: "📄 PDF Exported!",
        description: "Your professional resume has been downloaded.",
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

  const previewData = watchedData.fullName ? {
    ...watchedData,
    skills: watchedData.skills ? watchedData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    certifications: watchedData.certifications ? watchedData.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    languages: watchedData.languages ? watchedData.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    achievements: watchedData.achievements ? watchedData.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
  } : generatedData;

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
      <div className="lg:col-span-5 space-y-6">
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
                        <div key={resume._id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer group/item">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="truncate max-w-[150px]">
                              <p className="text-sm font-bold truncate">{resume.fullName || 'Untitled'}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(resume.updatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-500/10" onClick={() => deleteResume(resume._id)}>
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
      <div className="lg:col-span-7 flex flex-col h-[calc(100vh-140px)] sticky top-28">
        <Card className="glass-card border-indigo-500/10 shadow-2xl overflow-hidden flex flex-col h-full">
          <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 p-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                  <Eye className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-black tracking-tight">LIVE CANVAS</CardTitle>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl">
                  {templateIds.map((temp) => (
                    <button
                      key={temp}
                      onClick={() => setSelectedTemplate(temp)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        selectedTemplate === temp ? 'bg-white/[0.06] border border-white/[0.08] text-indigo-400 shadow-md' : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
                <div className="w-px h-6 bg-white/[0.05]" />
                <Button size="icon" variant="ghost" className="w-10 h-10 rounded-xl text-indigo-400 hover:bg-white/5 hover:text-indigo-300 transition-colors" onClick={copyToClipboard}>
                  <Copy className="w-5 h-5" />
                </Button>
                <Button size="icon" className="w-10 h-10 rounded-xl btn-gradient shadow-md" onClick={downloadPDF}>
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-hidden flex flex-col bg-slate-50/50 dark:bg-black/20">
            <AnimatePresence mode="wait">
              {previewData ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-indigo-500/20"
                >
                  <div className="max-w-[210mm] mx-auto bg-white shadow-2xl relative" id="resume-preview">
                    {selectedTemplate === 'modern' && <ModernTemplate data={previewData} />}
                    {selectedTemplate === 'classic' && <ClassicTemplate data={previewData} />}
                    {selectedTemplate === 'creative' && <CreativeTemplate data={previewData} />}
                    {selectedTemplate === 'professional' && <ProfessionalTemplate data={previewData} />}
                    
                    {customSections.length > 0 && (
                      <div className="bg-white p-8">
                         {customSections.map((section) => (
                          <div key={section.id} className="mb-6">
                            <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b-2 border-gray-800 pb-1">
                              {section.title}
                            </h2>
                            <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                               {section.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
    </div>
  );
};

export default ResumeGenerator;
