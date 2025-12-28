
import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateResume } from '../services/geminiApi';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Sparkles, Bot, Copy, Eye, Save, Trash2, Clock, Lock } from 'lucide-react';
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
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'creative'>('modern');
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
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
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl py-4 rounded-xl text-lg font-semibold"
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

      <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
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
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 hover:scale-105 transition-transform border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Copy size={16} />
                Copy Text
              </Button>
              <Button 
                onClick={downloadPDF} 
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-all"
                size="sm"
              >
                <Download size={16} />
                Download PDF
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">

          {/* Controls Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
             {/* Template Selector */}
             <div className="flex flex-wrap gap-2 justify-center">
               {['modern', 'classic', 'creative'].map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setSelectedTemplate(temp as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                      selectedTemplate === temp
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {temp}
                  </button>
               ))}
             </div>

             <div className="flex gap-2">
                <Button 
                 onClick={() => setShowSavedResumes(!showSavedResumes)}
                 variant="outline"
                 size="sm"
                 className="flex items-center gap-2"
                >
                  <Clock size={16} />
                  {showSavedResumes ? 'Hide Saved' : 'Saved Resumes'}
                </Button>
                <Button 
                  onClick={saveResume} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Save size={16} />
                  Save
                </Button>
             </div>
          </div>
          
          {/* Saved Resumes List */}
          {showSavedResumes && (
            <div className="bg-gray-100 dark:bg-gray-900/50 p-4 border-b border-gray-300 dark:border-gray-700">
               <h3 className="font-bold text-sm mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                 <Clock size={14} /> Saved Resumes ({savedResumes.length})
               </h3>
               
               {!user ? (
                 <div className="text-center py-4 bg-white dark:bg-gray-800 rounded p-4 border border-gray-200 dark:border-gray-700">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Please login to view saved resumes</p>
                    <Link to="/login">
                      <Button size="sm" variant="default">Login Now</Button>
                    </Link>
                 </div>
               ) : isLoadingResumes ? (
                 <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                 </div>
               ) : savedResumes.length === 0 ? (
                 <p className="text-xs text-gray-500 italic">No saved resumes found.</p>
               ) : (
                 <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                   {savedResumes.map((resume) => (
                     <div key={resume._id} className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                       <div>
                         <p className="font-bold text-xs text-gray-800 dark:text-gray-200">{resume.fullName} - {resume.templateId}</p>
                         <p className="text-[10px] text-gray-500">{new Date(resume.updatedAt).toLocaleDateString()}</p>
                       </div>
                       <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-700" onClick={() => deleteResume(resume._id)}>
                             <Trash2 size={14} />
                          </Button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

          {previewData ? (
            <div className="max-h-[800px] overflow-y-auto bg-gray-100 dark:bg-gray-900/50 p-4">
              <div id="resume-preview" className="shadow-xl mx-auto w-full max-w-[210mm] bg-white transform transition-transform duration-300 origin-top">
                {selectedTemplate === 'modern' && <ModernTemplate data={previewData} />}
                {selectedTemplate === 'classic' && <ClassicTemplate data={previewData} />}
                {selectedTemplate === 'creative' && <CreativeTemplate data={previewData} />}
                
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
            </div>
          ) : (
            <div className="text-center text-muted-foreground dark:text-gray-300 py-20 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                  <FileText size={64} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse">
                  <Sparkles size={24} className="text-white" />
                </div>
              </div>
              <div className="space-y-3 max-w-md">
                <h3 className="text-2xl font-bold gradient-text">AI-Powered Resume Creator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Fill out the form and click "Generate Perfect ATS Resume" to create a 
                  professional, keyword-optimized resume that passes through ATS systems 
                  and catches recruiters' attention.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>ATS-Friendly</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={16} />
                    <span>AI-Enhanced</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download size={16} />
                    <span>PDF Ready</span>
                  </div>
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
