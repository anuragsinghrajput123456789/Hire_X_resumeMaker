import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateResume, generateResumeFromImage } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Sparkles, Bot, Copy, Eye, Save, Trash2, Clock, Lock, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
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
import AuthContext from '../context/AuthContext';
import resumeService from '../services/resumeService';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

const ResumeGenerator = ({ onResumeGenerated }: { onResumeGenerated: (resume: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<ResumeData | null>(null);
  const [atsOptimizedContent, setAtsOptimizedContent] = useState<string>('');
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'creative' | 'custom-ai'>('modern');
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const { toast } = useToast();
  
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [showSavedResumes, setShowSavedResumes] = useState(false);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  // Fetch saved resumes when the list is opened or user logs in
  useEffect(() => {
    if (showSavedResumes && user) {
      fetchResumes();
    }
  }, [showSavedResumes, user]);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const resumes = await resumeService.getResumes();
      setSavedResumes(resumes);
    } catch (error: any) {
      toast({
        title: "Error fetching resumes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoadingResumes(false);
    }
  };

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

  // Watch all form values to get real-time data
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

      // Generate ATS-optimized content using AI
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
        customSections // If backend supports custom sections
      };
      
      await resumeService.saveResume(resumeToSave);
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });
      fetchResumes(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Error saving resume",
        description: error.message,
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
    } catch (error: any) {
      toast({
         title: "Error deleting resume",
         description: error.message,
         variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsImageGenerating(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // Use current form data
        const currentData = watchedData.fullName ? {
          ...watchedData,
          skills: watchedData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
          certifications: watchedData.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0),
          languages: watchedData.languages ? watchedData.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
          achievements: watchedData.achievements ? watchedData.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
        } : generatedData;

        if (!currentData || !currentData.fullName) {
             toast({
              title: "No Data",
              description: "Please fill out the resume form first.",
              variant: "destructive"
            });
            setIsImageGenerating(false);
            return;
        }

        const html = await generateResumeFromImage(base64String, currentData);
        setGeneratedHtml(html);
        setSelectedTemplate('custom-ai');
        
        toast({
          title: "✨ Magic Template Generated!",
          description: "Resume template created from your image.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: "Could not generate resume from image. Try a clearer image.",
        variant: "destructive"
      });
    } finally {
      setIsImageGenerating(false);
    }
  };


  const downloadPDF = () => {
    // Use current form data if available, otherwise use generated data
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
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${currentData.fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        allowTaint: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    html2pdf().set(opt).from(resumeElement).save().then(() => {
      toast({
        title: "📄 Resume Downloaded Successfully!",
        description: "Your ATS-optimized PDF resume is ready to use.",
      });
    });
  };

  const copyToClipboard = () => {
    if (atsOptimizedContent) {
      navigator.clipboard.writeText(atsOptimizedContent);
      toast({
        title: "📋 Copied to Clipboard",
        description: "Resume content copied successfully!",
      });
    }
  };

  // Get current form data for preview
  const previewData = watchedData.fullName ? {
    ...watchedData,
    skills: watchedData.skills ? watchedData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    certifications: watchedData.certifications ? watchedData.certifications.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    languages: watchedData.languages ? watchedData.languages.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    achievements: watchedData.achievements ? watchedData.achievements.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
  } : generatedData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in relative">
      
      {/* AI Loading Overlay */}
      <AnimatePresence>
        {(isGenerating || isImageGenerating) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-gray-200 dark:border-gray-700">
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-6 relative"
               >
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                  <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400" />
               </motion.div>
               
               <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                 {isImageGenerating ? "AI Designer Working..." : "Optimizing Resume..."}
               </h3>
               
               <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
                 {isImageGenerating 
                    ? "Analyzing image structure and recreating layout..." 
                    : "Analyzing keywords, enhancing structure, and polishing content for ATS..."}
               </p>

               <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                   initial={{ x: "-100%" }}
                   animate={{ x: "100%" }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="h-fit shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-t-lg">
          <CardTitle className="gradient-text flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            AI Resume Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            Create professional, ATS-optimized resumes with AI-powered content enhancement
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoForm register={register} errors={errors} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            <EducationForm register={register} control={control} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            <ExperienceForm register={register} control={control} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            <AdditionalInfoForm register={register} control={control} />
            <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            <CustomSectionsForm 
              customSections={customSections}
              onSectionsChange={setCustomSections}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl py-6 rounded-xl text-lg font-bold"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating ATS-Optimized Resume...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Perfect ATS Resume</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md overflow-hidden flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-t-lg shrink-0">
          <CardTitle className="gradient-text flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            ATS-Optimized Preview
          </CardTitle>
          {previewData && (
            <div className="flex gap-2">
              <Button 
                onClick={copyToClipboard} 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 hover:bg-white/50"
              >
                <Copy size={16} />
              </Button>
              <Button 
                onClick={downloadPDF} 
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-all shadow-md"
                size="sm"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col h-full min-h-[600px]">

          {/* Controls Bar */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm sticky top-0 z-10">
             <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                
                {/* Modern Tabs */}
                <div className="flex items-center bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-1 gap-1">
                   {['modern', 'classic', 'creative'].map((temp) => (
                      <button
                        key={temp}
                        onClick={() => setSelectedTemplate(temp as any)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize z-10 ${
                           selectedTemplate === temp ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                         {selectedTemplate === temp && (
                            <motion.div 
                              layoutId="activeTab"
                              className="absolute inset-0 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700 -z-10"
                            />
                         )}
                         {temp}
                      </button>
                   ))}
                </div>

                <div className="flex items-center gap-2">
                   <div className="relative group">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        disabled={isImageGenerating}
                      />
                      <Button
                        variant={selectedTemplate === 'custom-ai' ? 'default' : 'outline'}
                        size="sm"
                        className={`transition-all ${selectedTemplate === 'custom-ai' ? 'bg-purple-600 text-white ring-2 ring-purple-200 dark:ring-purple-900' : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
                      >
                        {isImageGenerating ? <Loader2 className="animate-spin h-3 w-3" /> : <ImageIcon size={14} className="mr-2" />}
                        {selectedTemplate === 'custom-ai' ? 'AI Custom Active' : 'Match from Image'}
                      </Button>
                   </div>
                   
                   <Separator orientation="vertical" className="h-6" />

                   <Button 
                    onClick={() => setShowSavedResumes(!showSavedResumes)}
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${showSavedResumes ? 'bg-blue-100 text-blue-600' : ''}`}
                    title="Saved Resumes"
                   >
                     <Clock size={16} />
                   </Button>
                   <Button 
                     onClick={saveResume}
                     variant="ghost" 
                     size="icon"
                     className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full"
                     title="Save Resume"
                   >
                     <Save size={16} />
                   </Button>
                </div>
             </div>
          </div>
          
          {/* Saved Resumes List (Collapsible) */}
          <AnimatePresence>
          {showSavedResumes && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: "auto", opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
            >
               <div className="p-3">
                   <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Clock size={12} /> Saved Attempts
                   </h3>
                   {!user ? (
                     <p className="text-xs text-center py-2 text-gray-400">Login to see saved resumes</p>
                   ) : isLoadingResumes ? (
                     <div className="flex justify-center py-2"><Loader2 className="animate-spin h-4 w-4 text-gray-400"/></div>
                   ) : savedResumes.length === 0 ? (
                     <p className="text-xs text-gray-400 italic text-center py-2">No saved resumes</p>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {savedResumes.map((resume) => (
                         <div key={resume._id} className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center hover:border-blue-300 transition-colors group">
                           <div className="truncate">
                             <p className="font-medium text-xs text-gray-800 dark:text-gray-200 truncate">{resume.fullName || "Untitled"}</p>
                             <p className="text-[10px] text-gray-400">{resume.templateId} • {new Date(resume.updatedAt).toLocaleDateString()}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteResume(resume._id)}>
                              <Trash2 size={12} />
                           </Button>
                         </div>
                       ))}
                     </div>
                   )}
               </div>
            </motion.div>
          )}
          </AnimatePresence>

          {previewData ? (
            <div className="flex-1 overflow-y-auto bg-gray-100/50 dark:bg-black/20 p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
                 id="resume-preview" 
                 className="shadow-[0_0_50px_rgba(0,0,0,0.1)] mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white transform transition-transform duration-300 origin-top"
              >
                {selectedTemplate === 'modern' && <ModernTemplate data={previewData} />}
                {selectedTemplate === 'classic' && <ClassicTemplate data={previewData} />}
                {selectedTemplate === 'creative' && <CreativeTemplate data={previewData} />}
                {selectedTemplate === 'custom-ai' && generatedHtml && (
                  <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                )}
                
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
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-900/20">
              <div className="max-w-md space-y-6">
                 <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                    <FileText size={80} className="relative text-gray-300 dark:text-gray-700" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-100 dark:to-gray-300 mb-2">
                       Ready to Build
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Fill out your details on the left and watch your ATS-optimized resume come to life here.
                    </p>
                 </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeGenerator;
