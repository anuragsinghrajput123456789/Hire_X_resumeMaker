import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Send, Copy, RefreshCw, User, Sparkles, Save, History, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { generateColdEmail } from '../services/geminiApi';
import { saveColdEmail, getColdEmailHistory, deleteColdEmail } from '../services/coldEmailService';
import { isAuthenticated } from '../services/authService';

interface EmailFormData {
  recipientName: string;
  recipientEmail: string;
  recipientCompany: string;
  recipientRole: string;
  senderName: string;
  senderEmail: string;
  jobTitle: string;
  experience: string;
  skills: string;
  personalNote: string;
}

interface SavedEmail extends EmailFormData {
  _id: string;
  content: string;
  createdAt: string;
}

const ColdEmailGenerator = () => {
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedEmails, setSavedEmails] = useState<SavedEmail[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<EmailFormData>({
    defaultValues: {
      recipientName: '',
      recipientEmail: '',
      recipientCompany: '',
      recipientRole: '',
      senderName: '',
      senderEmail: '',
      jobTitle: '',
      experience: '',
      skills: '',
      personalNote: ''
    }
  });

  const formData = watch();

  useEffect(() => {
    if (isHistoryOpen && isAuthenticated()) {
      fetchHistory();
    }
  }, [isHistoryOpen]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await getColdEmailHistory();
      setSavedEmails(history);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const onGenerate = async (data: EmailFormData) => {
    if (!data.recipientName || !data.senderName || !data.jobTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional cold email for a job application with the following details:
      
      Recipient: ${data.recipientName} (${data.recipientRole || 'Hiring Manager'}) at ${data.recipientCompany || 'the company'}
      Sender: ${data.senderName}
      Job Interest: ${data.jobTitle}
      Experience: ${data.experience || 'Not specified'}
      Skills: ${data.skills || 'Not specified'}
      Personal Note: ${data.personalNote || 'None'}
      
      Make the email:
      - Professional and concise
      - Personalized to the recipient and company
      - Highlight relevant experience and skills
      - Include a clear call to action
      - Be engaging but not overly familiar
      - Keep it under 200 words
      
      Do not include subject line, just the email body starting with the greeting.`;

      const email = await generateColdEmail(prompt);
      setGeneratedEmail(email);
      setShowPreview(true);
      toast.success('Email generated successfully!');
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to save emails');
      return;
    }

    try {
      await saveColdEmail({
        ...formData,
        content: generatedEmail
      });
      toast.success('Email saved to history!');
    } catch (error) {
      toast.error('Failed to save email');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteColdEmail(id);
      setSavedEmails(prev => prev.filter(email => email._id !== id));
      toast.success('Email deleted');
    } catch (error) {
      toast.error('Failed to delete email');
    }
  };

  const loadFromHistory = (email: SavedEmail) => {
    setValue('recipientName', email.recipientName);
    setValue('recipientEmail', email.recipientEmail || '');
    setValue('recipientCompany', email.recipientCompany || '');
    setValue('recipientRole', email.recipientRole || '');
    setValue('jobTitle', email.jobTitle);
    setValue('senderName', email.senderName || ''); // If saved in history, likely sender details are implicit but stored
    // Note: The saved model might need to be consistent with form data.
    // For now we load what we have.
    setGeneratedEmail(email.content);
    setShowPreview(true);
    setIsHistoryOpen(false);
  };

  const copyToClipboard = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(generatedEmail);
      toast.success('Email copied to clipboard!');
    }
  };

  const sendEmail = () => {
    if (!formData.recipientEmail || !formData.senderEmail) {
      toast.error('Please provide both sender and recipient email addresses');
      return;
    }

    setIsSending(true);
    
    const subject = `Application for ${formData.jobTitle} Position`;
    const body = generatedEmail;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(formData.recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(gmailUrl, '_blank');
    
    setTimeout(() => {
      setIsSending(false);
      toast.success('Gmail opened successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 min-h-screen p-6">
      <div className="flex justify-end">
        {isAuthenticated() && (
          <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 border-slate-600 text-gray-200">
                <History className="w-4 h-4" /> History
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-900 border-slate-800 text-gray-100">
              <SheetHeader>
                <SheetTitle className="text-gray-100">Email History</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Your previously generated cold emails.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
                {isLoadingHistory ? (
                   <div className="flex justify-center p-4">
                     <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
                   </div>
                ) : savedEmails.length === 0 ? (
                   <p className="text-center text-gray-500 mt-4">No saved emails yet.</p>
                ) : (
                  <div className="space-y-4">
                    {savedEmails.map((email) => (
                      <div 
                        key={email._id} 
                        className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors group"
                        onClick={() => loadFromHistory(email)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-orange-400 truncate pr-2">{email.recipientName}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDelete(email._id, e)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(email.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-300 line-clamp-2">{email.jobTitle}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {!showPreview ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-gradient-to-br from-gray-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-t-lg border-b border-slate-700/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
                  Email Configuration
                </span>
              </CardTitle>
              <CardDescription className="text-gray-300 font-medium">
                Provide details to create your personalized cold email
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
                {/* Recipient Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-200 uppercase tracking-wide text-sm">Recipient Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName" className="text-sm font-semibold text-gray-300">
                        Recipient Name *
                      </Label>
                      <Input
                        id="recipientName"
                        {...register('recipientName', { required: 'Recipient name is required' })}
                        placeholder="John Smith"
                        className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                      />
                      {errors.recipientName && (
                        <p className="text-sm text-red-400 font-medium">{errors.recipientName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail" className="text-sm font-semibold text-gray-300">
                        Recipient Email
                      </Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        {...register('recipientEmail')}
                        placeholder="john@company.com"
                        className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientCompany" className="text-sm font-semibold text-gray-300">
                        Company
                      </Label>
                      <Input
                        id="recipientCompany"
                        {...register('recipientCompany')}
                        placeholder="Tech Corp Inc."
                        className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientRole" className="text-sm font-semibold text-gray-300">
                        Their Role
                      </Label>
                      <Input
                        id="recipientRole"
                        {...register('recipientRole')}
                        placeholder="Hiring Manager"
                        className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-slate-700 to-slate-600" />

                {/* Sender Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-200 uppercase tracking-wide text-sm">Your Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName" className="text-sm font-semibold text-gray-300">
                        Your Name *
                      </Label>
                      <Input
                        id="senderName"
                        {...register('senderName', { required: 'Your name is required' })}
                        placeholder="Jane Doe"
                        className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                      />
                      {errors.senderName && (
                        <p className="text-sm text-red-400 font-medium">{errors.senderName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail" className="text-sm font-semibold text-gray-300">
                        Your Email
                      </Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        {...register('senderEmail')}
                        placeholder="jane@email.com"
                        className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-300">
                      Job Title You're Interested In *
                    </Label>
                    <Input
                      id="jobTitle"
                      {...register('jobTitle', { required: 'Job title is required' })}
                      placeholder="Software Engineer"
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 text-gray-100 placeholder:text-gray-400"
                    />
                    {errors.jobTitle && (
                      <p className="text-sm text-red-400 font-medium">{errors.jobTitle.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-semibold text-gray-300">
                      Your Experience
                    </Label>
                    <Textarea
                      id="experience"
                      {...register('experience')}
                      placeholder="5 years of experience in React, Node.js..."
                      rows={3}
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 resize-none text-gray-100 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-sm font-semibold text-gray-300">
                      Key Skills
                    </Label>
                    <Textarea
                      id="skills"
                      {...register('skills')}
                      placeholder="JavaScript, Python, AWS, Leadership..."
                      rows={2}
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 resize-none text-gray-100 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personalNote" className="text-sm font-semibold text-gray-300">
                      Personal Note (Optional)
                    </Label>
                    <Textarea
                      id="personalNote"
                      {...register('personalNote')}
                      placeholder="Any specific reason for reaching out or connection to the company..."
                      rows={2}
                      className="bg-gray-700/80 border-slate-600 focus:border-orange-400 focus:ring-orange-400/20 resize-none text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-3"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Crafting Your Email...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Perfect Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated Email */}
          <Card className="bg-gradient-to-br from-gray-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-t-lg border-b border-slate-700/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">
                  Generated Email
                </span>
              </CardTitle>
              <CardDescription className="text-gray-300 font-medium">
                Your AI-crafted personalized cold email
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {generatedEmail ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-700/50 to-slate-800/50 p-6 rounded-xl border border-slate-600/50 shadow-inner">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200 font-medium">
                      {generatedEmail}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={copyToClipboard} 
                      variant="outline" 
                      className="flex-1 border-slate-600 text-gray-200 hover:bg-gray-700/50 hover:border-green-400 transition-all duration-300 font-semibold"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                    
                    <Button 
                      onClick={sendEmail}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                      disabled={isSending || !formData.recipientEmail}
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Opening Gmail...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send via Gmail
                        </>
                      )}
                    </Button>
                  </div>

                  {!formData.recipientEmail && (
                    <div className="text-center p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                      <p className="text-sm text-amber-300 font-medium">
                        💡 Add recipient email to enable direct sending
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-700/50 to-slate-800/50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Mail className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Ready to Generate</h3>
                  <p className="text-gray-400 font-medium">
                    Fill in the form and click "Generate Perfect Email" to create your personalized outreach
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Preview Mode */
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowPreview(false)}
              variant="outline"
              className="border-slate-600 text-gray-200 hover:bg-gray-700/50"
            >
              ← Back to Editor
            </Button>
            <div className="flex gap-3">
              {isAuthenticated() && (
                <Button 
                  onClick={handleSave} 
                  variant="outline" 
                  className="border-slate-600 text-orange-400 hover:bg-gray-700/50 hover:border-orange-400"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save to History
                </Button>
              )}

              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                className="border-slate-600 text-gray-200 hover:bg-gray-700/50 hover:border-green-400"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Email
              </Button>
              
              <Button 
                onClick={sendEmail}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isSending || !formData.recipientEmail}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Opening Gmail...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send via Gmail
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Email Preview */}
          <Card className="bg-white dark:bg-gray-900 shadow-2xl max-w-4xl mx-auto">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                    Email Preview
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Subject: Application for {formData.jobTitle} Position
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Email Header Info */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">To: </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formData.recipientName} ({formData.recipientEmail || 'recipient@email.com'})
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">From: </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formData.senderName} ({formData.senderEmail || 'your@email.com'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed font-medium">
                  {generatedEmail}
                </div>
                
                {/* Email Signature */}
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-gray-900 dark:text-gray-100">
                    <p className="font-semibold">{formData.senderName}</p>
                    {formData.senderEmail && <p className="text-sm text-gray-600 dark:text-gray-400">{formData.senderEmail}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!formData.recipientEmail && (
            <div className="text-center p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg max-w-4xl mx-auto">
              <p className="text-sm text-amber-300 font-medium">
                💡 Add recipient email in the form to enable direct sending
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColdEmailGenerator;
