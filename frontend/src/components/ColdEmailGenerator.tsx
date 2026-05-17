import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Send, Copy, RefreshCw, User, Sparkles, Save, History, Trash2, Clock, Zap, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { generateColdEmail } from '../services/aiService';
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
    setValue('senderName', email.senderName || '');
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

  // Preset Auto-fill triggers to vaporize empty space
  const applyPreset = (preset: 'vercel' | 'stripe' | 'linear') => {
    if (preset === 'vercel') {
      setValue('recipientName', 'Guillermo Rauch');
      setValue('recipientEmail', 'rauchg@vercel.com');
      setValue('recipientCompany', 'Vercel');
      setValue('recipientRole', 'CEO');
      setValue('senderName', 'Alex Carter');
      setValue('senderEmail', 'alex.carter@dev.com');
      setValue('jobTitle', 'Senior Frontend Engineer');
      setValue('experience', '4 years designing lightning-fast reactive dashboards with highly unified styles.');
      setValue('skills', 'React, Next.js, TypeScript, Tailwind CSS, Framer Motion');
      setValue('personalNote', 'I am completely obsessed with the Edge Network rendering speeds and Vercel DX!');
    } else if (preset === 'stripe') {
      setValue('recipientName', 'John Collison');
      setValue('recipientEmail', 'john@stripe.com');
      setValue('recipientCompany', 'Stripe');
      setValue('recipientRole', 'Co-Founder');
      setValue('senderName', 'Alex Carter');
      setValue('senderEmail', 'alex.carter@dev.com');
      setValue('jobTitle', 'API & Integration Engineer');
      setValue('experience', '3+ years constructing REST and GraphQL architectures with transactional security.');
      setValue('skills', 'Node.js, PostgreSQL, Ruby on Rails, API Specs');
      setValue('personalNote', 'Stripe API documentation is the absolute gold standard for developer experience!');
    } else if (preset === 'linear') {
      setValue('recipientName', 'Karri Saarinen');
      setValue('recipientEmail', 'karri@linear.app');
      setValue('recipientCompany', 'Linear');
      setValue('recipientRole', 'CEO');
      setValue('senderName', 'Alex Carter');
      setValue('senderEmail', 'alex.carter@dev.com');
      setValue('jobTitle', 'Product Designer & Frontend Developer');
      setValue('experience', '3 years polishing keyboard-driven workspace tools and glassmorphism card systems.');
      setValue('skills', 'Figma, Tailwind CSS, React, Performance Optimization');
      setValue('personalNote', 'I absolute love Linear\'s cyberpunk aesthetic, keyboard shortcuts, and responsiveness!');
    }
    toast.success(`${preset.toUpperCase()} test credentials loaded! Click Generate below.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <div className="flex justify-end absolute -top-16 right-0 z-20">
        {isAuthenticated() && (
          <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-9 px-4 rounded-xl border-white/5 bg-[#0F1424]/60 text-xs font-bold text-gray-300 hover:bg-white/5 gap-2">
                <History className="w-4 h-4 text-[#00F2FE]" /> Outreach History
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#0F1424] border-white/5 text-white">
              <SheetHeader>
                <SheetTitle className="text-white text-lg font-black">Outreach History</SheetTitle>
                <SheetDescription className="text-gray-400 text-xs font-medium">
                  Browse your previously generated cold emails.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-2">
                {isLoadingHistory ? (
                   <div className="flex justify-center p-8">
                     <RefreshCw className="w-6 h-6 animate-spin text-[#00F2FE]" />
                   </div>
                ) : savedEmails.length === 0 ? (
                   <p className="text-center text-gray-500 mt-6 text-xs font-bold">No saved emails found.</p>
                ) : (
                  <div className="space-y-3">
                    {savedEmails.map((email) => (
                      <div 
                        key={email._id} 
                        className="bg-[#0A0E1A]/40 p-4 rounded-xl border border-white/5 cursor-pointer hover:border-[#00F2FE]/20 hover:bg-[#0A0E1A]/80 transition-all group text-left"
                        onClick={() => loadFromHistory(email)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#00F2FE] text-xs truncate pr-2">{email.recipientName}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                            onClick={(e) => handleDelete(email._id, e)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-1 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#00F2FE]" />
                          {new Date(email.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-300 font-medium line-clamp-1">{email.jobTitle} • {email.recipientCompany}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Input Form Column */}
          <div className="lg:col-span-6 flex">
            <Card className="glass-card border-white/5 shadow-2xl bg-[#0F1424]/80 w-full flex flex-col justify-between">
              <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="flex items-center gap-2.5 text-base font-extrabold text-white">
                  <Mail className="h-5 w-5 text-[#00F2FE]" />
                  Email Configuration
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 font-medium">
                  Provide details to craft your personalized cold email outreach
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 text-left">
                <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
                  {/* Recipient Details Segment */}
                  <div className="border border-white/5 bg-[#0A0E1A]/40 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                      <User className="h-4 w-4 text-[#00F2FE]" />
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">Recipient Details</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Recipient Name *
                        </Label>
                        <Input
                          id="recipientName"
                          {...register('recipientName', { required: 'Recipient name is required' })}
                          placeholder="e.g. John Smith"
                          className="h-12 rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30"
                        />
                        {errors.recipientName && (
                          <p className="text-xs text-rose-400 font-bold">{errors.recipientName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Recipient Email
                        </Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          {...register('recipientEmail')}
                          placeholder="john@company.com"
                          className="h-12 rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientCompany" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Company
                        </Label>
                        <Input
                          id="recipientCompany"
                          {...register('recipientCompany')}
                          placeholder="Tech Corp Inc."
                          className="h-12 rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientRole" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Their Role
                        </Label>
                        <Input
                          id="recipientRole"
                          {...register('recipientRole')}
                          placeholder="e.g. Hiring Manager"
                          className="h-12 rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sender Details Segment */}
                  <div className="border border-white/5 bg-[#0A0E1A]/40 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                      <Sparkles className="h-4 w-4 text-[#00F2FE]" />
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">Your Information</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderName" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Your Name *
                        </Label>
                        <Input
                          id="senderName"
                          {...register('senderName', { required: 'Your name is required' })}
                          placeholder="e.g. Jane Doe"
                          className="h-12 rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30"
                        />
                        {errors.senderName && (
                          <p className="text-xs text-rose-400 font-bold">{errors.senderName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="senderEmail" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Your Email
                        </Label>
                        <Input
                          id="senderEmail"
                          type="email"
                          {...register('senderEmail')}
                          placeholder="jane@email.com"
                          className="h-12 rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Job Title Interested In *
                      </Label>
                      <Input
                        id="jobTitle"
                        {...register('jobTitle', { required: 'Job title is required' })}
                        placeholder="e.g. Frontend Engineer"
                        className="h-12 rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30"
                      />
                      {errors.jobTitle && (
                        <p className="text-xs text-rose-400 font-bold">{errors.jobTitle.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Your Experience Highlight
                      </Label>
                      <Textarea
                        id="experience"
                        {...register('experience')}
                        placeholder="e.g. 3 years of building performant React apps with Tailwind CSS..."
                        rows={2}
                        className="rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30 resize-none text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Key Skills
                      </Label>
                      <Textarea
                        id="skills"
                        {...register('skills')}
                        placeholder="React, TypeScript, Next.js, Framer Motion"
                        rows={1}
                        className="rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30 resize-none text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personalNote" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Personal Note / Hook (Optional)
                      </Label>
                      <Textarea
                        id="personalNote"
                        {...register('personalNote')}
                        placeholder="Why do you love this specific product or company?"
                        rows={2}
                        className="rounded-xl bg-[#0A0E1A] border-white/5 text-white placeholder-gray-600 focus-visible:ring-[#00F2FE]/30 resize-none text-xs"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-xs font-extrabold btn-premium group"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        CRAFTING OUTREACH...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        GENERATE OUTREACH EMAIL
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Result / Template Sandbox Column (No Empty Space) */}
          <div className="lg:col-span-6 flex">
            <Card className="glass-card border-white/5 shadow-2xl bg-[#0F1424]/80 w-full flex flex-col justify-between">
              <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="flex items-center gap-2.5 text-base font-extrabold text-white">
                  <Sparkles className="h-5 w-5 text-[#00F2FE] animate-pulse" />
                  AI Outreach Workspace
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 font-medium">
                  Review and export your customized cold outreach proposal
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                {generatedEmail ? (
                  <div className="space-y-6 flex-1 flex flex-col justify-between text-left">
                    <div className="bg-[#0A0E1A] p-5 rounded-2xl border border-white/5 flex-1 flex flex-col">
                      <div className="whitespace-pre-wrap text-xs leading-relaxed text-gray-300 font-medium flex-1 overflow-y-auto max-h-[460px] pr-2">
                        {generatedEmail}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Button 
                          onClick={copyToClipboard} 
                          variant="outline" 
                          className="flex-1 h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl"
                        >
                          <Copy className="mr-2 h-4 w-4 text-[#00F2FE]" />
                          Copy Outreach Text
                        </Button>
                        
                        <Button 
                          onClick={sendEmail}
                          className="flex-1 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/10"
                          disabled={isSending || !formData.recipientEmail}
                        >
                          {isSending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-white" />
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
                        <div className="text-center p-3 bg-[#00F2FE]/5 border border-[#00F2FE]/10 rounded-xl">
                          <p className="text-[10px] text-[#00F2FE] font-bold uppercase tracking-wider">
                            💡 Fill in Recipient Email above to route directly to Gmail
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Dense interactive layout to completely cover empty vertical workspace!
                  <div className="flex flex-col h-full justify-between py-2 text-left">
                    <div className="space-y-6">
                      <div className="bg-[#00F2FE]/5 border border-[#00F2FE]/10 rounded-3xl w-14 h-14 flex items-center justify-center">
                        <Lightbulb className="h-6 w-6 text-[#00F2FE] animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white mb-2">Workspace Interactive Sandbox</h3>
                        <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                          Rather than filling this panel manually, launch one of our 1-click high-fidelity startup presets to instantly test the email writer model:
                        </p>
                      </div>

                      {/* Interactive Presets suite */}
                      <div className="grid gap-3.5">
                        <div 
                          onClick={() => applyPreset('vercel')}
                          className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#00F2FE]/30 hover:bg-white/[0.04] transition-all cursor-pointer group flex justify-between items-center"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-white group-hover:text-[#00F2FE]">Frontend Engineer @ Vercel</div>
                            <div className="text-[10px] text-slate-500 mt-1 font-medium">To: Guillermo Rauch (CEO) • Custom note on NextJS DX</div>
                          </div>
                          <Zap className="w-4 h-4 text-slate-600 group-hover:text-[#00F2FE] transition-colors" />
                        </div>

                        <div 
                          onClick={() => applyPreset('stripe')}
                          className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#8B5CF6]/30 hover:bg-white/[0.04] transition-all cursor-pointer group flex justify-between items-center"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-white group-hover:text-[#8B5CF6]">API Architect @ Stripe</div>
                            <div className="text-[10px] text-slate-500 mt-1 font-medium">To: John Collison (Co-Founder) • Highlight backend specs</div>
                          </div>
                          <Zap className="w-4 h-4 text-slate-600 group-hover:text-[#8B5CF6] transition-colors" />
                        </div>

                        <div 
                          onClick={() => applyPreset('linear')}
                          className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#EC4899]/30 hover:bg-white/[0.04] transition-all cursor-pointer group flex justify-between items-center"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-white group-hover:text-[#EC4899]">Product UI Developer @ Linear</div>
                            <div className="text-[10px] text-slate-500 mt-1 font-medium">To: Karri Saarinen (CEO) • Highlight keyboard UI focus</div>
                          </div>
                          <Zap className="w-4 h-4 text-slate-600 group-hover:text-[#EC4899] transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-600 mt-4 text-center">
                      💡 Selecting a sandbox preset automatically populates experience, role, and custom notes.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview & Save Mode */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowPreview(false)}
              variant="outline"
              className="h-10 px-5 rounded-xl border-white/10 bg-[#0F1424]/60 text-xs font-bold text-gray-300 hover:bg-white/5"
            >
              ← Return to Editor
            </Button>
            <div className="flex gap-2">
              {isAuthenticated() && (
                <Button 
                  onClick={handleSave} 
                  variant="outline" 
                  className="h-10 px-5 rounded-xl border-white/10 bg-[#0F1424]/60 text-xs font-bold text-[#00F2FE] hover:bg-[#00F2FE]/5 hover:border-[#00F2FE]/20"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
              )}

              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                className="h-10 px-5 rounded-xl border-white/10 bg-[#0F1424]/60 text-xs font-bold text-gray-300 hover:bg-white/5 hover:border-[#00F2FE]/20"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Text
              </Button>
              
              <Button 
                onClick={sendEmail}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-extrabold text-xs shadow-lg shadow-pink-500/10"
                disabled={isSending || !formData.recipientEmail}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin text-white" />
                    Opening Gmail...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Open Gmail
                  </>
                )}
              </Button>
            </div>
          </div>

          <Card className="glass-card border-white/5 shadow-2xl bg-[#0F1424]/90 max-w-3xl mx-auto overflow-hidden text-left">
            <CardHeader className="border-b border-white/5 bg-[#0A0E1A]/40 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#00F2FE] to-[#8B5CF6] rounded-xl">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-extrabold text-white">
                    Email Transmission Preview
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400 font-medium mt-1">
                    Subject: Application for {formData.jobTitle} Position
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Mail Meta Header */}
              <div className="mb-6 p-4.5 bg-[#0A0E1A]/60 border border-white/5 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <span className="text-gray-500">To: </span>
                    <span className="text-[#00F2FE] font-bold">{formData.recipientName}</span>{' '}
                    <span className="text-gray-400">({formData.recipientEmail || 'recipient@email.com'})</span>
                  </div>
                  <div>
                    <span className="text-gray-500">From: </span>
                    <span className="text-[#00F5A0] font-bold">{formData.senderName}</span>{' '}
                    <span className="text-gray-400">({formData.senderEmail || 'your@email.com'})</span>
                  </div>
                </div>
              </div>

              {/* Email Content Draft */}
              <div className="space-y-6">
                <div className="whitespace-pre-wrap text-xs leading-relaxed text-gray-200 font-medium bg-[#0A0E1A] p-6 border border-white/5 rounded-2xl">
                  {generatedEmail}
                </div>
                
                {/* Visual Mail Signature */}
                <div className="pt-4 border-t border-white/5">
                  <p className="font-extrabold text-xs text-white">{formData.senderName}</p>
                  {formData.senderEmail && <p className="text-[10px] text-gray-500 font-medium">{formData.senderEmail}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ColdEmailGenerator;
