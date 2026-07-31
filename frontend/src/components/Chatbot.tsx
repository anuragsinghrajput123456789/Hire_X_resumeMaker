import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/services/aiService';
import resumeService, { SavedResume } from '@/services/resumeService';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Bot,
  User,
  MessageCircle,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Copy,
  Check,
  Sliders,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Download,
  Search,
  Briefcase,
  DollarSign,
  MapPin,
  Code,
  FileText,
  Bookmark,
  RefreshCw
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { apiUrl, authHeaders, clearAuthStorage, getStoredToken } from '@/services/apiClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatSession {
  _id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

const CAREER_GOALS = [
  { id: 'resume_audit', label: 'Resume & Portfolio Audit', icon: '📄' },
  { id: 'interview_prep', label: 'Mock Interview & STAR Prep', icon: '🎯' },
  { id: 'salary_negotiation', label: 'Salary & Offer Negotiation', icon: '💵' },
  { id: 'career_transition', label: 'Career Transition & Upskilling', icon: '🚀' },
  { id: 'recruiter_outreach', label: 'Recruiter Outreach Strategy', icon: '📧' },
];

const SENIORITY_LEVELS = ['Entry-Level (< 2 yrs)', 'Mid-Level (2-5 yrs)', 'Senior (5-8 yrs)', 'Lead / Staff (8+ yrs)', 'Executive / VP'];
const WORK_FORMATS = ['Remote (Global)', 'Remote (US/EU)', 'Hybrid', 'On-site / Relocation', 'Flexible'];
const TRANSITION_STAGES = [
  'Actively Interviewing & Testing',
  'Resume & Portfolio Building (1-3 mos)',
  'Executive Role Pivot',
  'Salary & Offer Evaluation',
  'Upskilling & Skill Gap Bridge'
];

export const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "**Welcome to your AI Career Intelligence Studio.**\n\nI am calibrated to analyze your candidate profile, audit ATS resume bullet points, simulate technical System Design & STAR interviews, and build high-converting recruiter outreach strategies.\n\n**Configure your candidate context parameters above or select a topic chip below to get started.**",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sessionSearch, setSessionSearch] = useState('');
  
  // Existing Context Parameters State
  const [showParams, setShowParams] = useState(false);
  const [targetRole, setTargetRole] = useState('Senior Fullstack Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Senior (5-8 yrs)');
  const [primaryGoal, setPrimaryGoal] = useState('resume_audit');
  const [targetCompanies, setTargetCompanies] = useState('Stripe, Vercel, Remote Startups');

  // NEW REQUIRED FIELDS
  const [targetCompensation, setTargetCompensation] = useState('$140k - $190k / Year');
  const [workFormat, setWorkFormat] = useState('Remote (Global)');
  const [keySkills, setKeySkills] = useState('React, Node.js, TypeScript, AWS, System Design');
  const [transitionStage, setTransitionStage] = useState('Actively Interviewing & Testing');
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  // Audio simulation state
  const [playingMsgIndex, setPlayingMsgIndex] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const scrollToBottom = () => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const token = getStoredToken();

  // Fetch saved resumes to ground assistant context
  useEffect(() => {
    if (token) {
      resumeService.getResumes()
        .then(data => {
          setResumes(data || []);
          if (data && data.length > 0) setSelectedResumeId(data[0]._id);
        })
        .catch(err => console.error("Failed to load resumes for chat context:", err));
    }
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="glass-card bg-[#0B1020]/90 border border-white/10 shadow-2xl overflow-hidden rounded-3xl relative text-center p-8">
          <div className="absolute inset-0 bg-grid-soft opacity-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F2FE] via-[#8B5CF6] to-[#EC4899] p-[1.5px] mb-6 shadow-xl shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0B1020] rounded-2xl flex items-center justify-center">
                <Bot className="h-8 w-8 text-[#00F2FE]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6] mb-3 font-poppins">
              AI Career Intelligence Bot
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed mb-8 max-w-sm">
              Unlock personalized resume auditing, direct recruiter outreach, mock system design simulations, and expert career coaching.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Button 
                onClick={() => navigate('/login')}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-extrabold px-6 h-11 transition-all text-xs cursor-pointer"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="btn-premium rounded-xl text-white font-extrabold px-6 h-11 text-xs cursor-pointer"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const fetchChatHistory = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(apiUrl('/chats'), {
        headers: authHeaders(false)
      });
      if (response.status === 401) {
        clearAuthStorage();
        window.location.reload();
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setChatHistory(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchChatHistory();
    }
  }, [fetchChatHistory, token]);

  const loadChat = (chat: ChatSession) => {
    setMessages(chat.messages || []);
    setCurrentChatId(chat._id);
    isInitialLoad.current = false;
  };

  const startNewChat = () => {
    setMessages([{
      content: "**Welcome to your AI Career Intelligence Studio.**\n\nI am calibrated to analyze your candidate profile, audit ATS resume bullet points, simulate technical System Design & STAR interviews, and build high-converting recruiter outreach strategies.\n\n**Configure your candidate context parameters above or select a topic chip below to get started.**",
      role: 'assistant',
      timestamp: new Date()
    }]);
    setCurrentChatId(null);
  };

  const deleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!token) return;

    try {
      const response = await fetch(apiUrl(`/chats/${chatId}`), {
        method: 'DELETE',
        headers: authHeaders(false)
      });

      if (response.ok) {
        setChatHistory(prev => prev.filter(c => c._id !== chatId));
        if (currentChatId === chatId) {
          startNewChat();
        }
        toast({ title: "Chat session deleted" });
      }
    } catch (error) {
      toast({ title: "Failed to delete chat", variant: "destructive" });
    }
  };

  const handleCopyMessage = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Text-To-Speech audio reading simulation
  const toggleSpeechAudio = (index: number, text: string) => {
    if (playingMsgIndex === index) {
      window.speechSynthesis?.cancel();
      setPlayingMsgIndex(null);
      return;
    }

    if (!('speechSynthesis' in window)) {
      toast({ title: "Audio playback not supported in this browser." });
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for natural speech
    const cleanText = text.replace(/[*#_`~-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setPlayingMsgIndex(null);
    utterance.onerror = () => setPlayingMsgIndex(null);
    setPlayingMsgIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Export current session to Markdown
  const exportSessionMarkdown = () => {
    const header = `# Hire-X AI Career Assistant Session Audit\nDate: ${new Date().toLocaleDateString()}\nRole: ${targetRole} | Seniority: ${experienceLevel} | Compensation: ${targetCompensation}\n\n---\n\n`;
    const content = messages.map(m => `### ${m.role === 'user' ? 'Candidate' : 'AI Career Intelligence Counselor'}\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([header + content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-session-${targetRole.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Session Exported", description: "Downloaded chat session log as Markdown file." });
  };

  const sendMessage = async (presetPrompt?: string) => {
    const textToSend = presetPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      content: textToSend,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!presetPrompt) setInputMessage('');
    setIsLoading(true);
    isInitialLoad.current = false;

    // Build context prefix incorporating ALL 5 NEW required fields + Selected Resume
    const selectedResume = resumes.find(r => r._id === selectedResumeId);
    const resumeDetails = selectedResume
      ? `Selected Profile Resume: ${selectedResume.fullName} (${selectedResume.jobRole}) - Skills: ${selectedResume.skills.slice(0, 8).join(', ')}`
      : 'No Resume Linked';

    const contextPrefix = `[CANDIDATE CAREER CONTEXT:
- Target Role: ${targetRole || 'Not specified'}
- Seniority Level: ${experienceLevel}
- Primary Goal: ${primaryGoal}
- Target Companies: ${targetCompanies || 'General'}
- Target Compensation: ${targetCompensation}
- Preferred Work Format: ${workFormat}
- Key Technical Skills: ${keySkills}
- Transition Stage: ${transitionStage}
- ${resumeDetails}
]\n\n`;

    const fullPrompt = messages.length <= 2 ? `${contextPrefix}${textToSend}` : textToSend;

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponseContent = await generateChatResponse(fullPrompt, history);
      
      const assistantMessage: Message = {
        content: aiResponseContent,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (token) {
        if (!currentChatId) {
          const createResponse = await fetch(apiUrl('/chats'), {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
              title: textToSend.substring(0, 30) + (textToSend.length > 30 ? '...' : ''),
              messages: [...messages, userMessage, assistantMessage]
            })
          });
          
          if (createResponse.status === 401) {
            clearAuthStorage();
            window.location.reload();
            return;
          }

          if (createResponse.ok) {
            const newChat = await createResponse.json();
            setCurrentChatId(newChat._id);
            fetchChatHistory();
          }
        } else {
          const updateResponse = await fetch(apiUrl(`/chats/${currentChatId}`), {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ messages: [userMessage, assistantMessage] })
          });
          
          if (updateResponse.status === 401) {
            clearAuthStorage();
            window.location.reload();
            return;
          }
          fetchChatHistory();
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Connection Error",
        description: "Failed to fetch response. Check server connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredHistory = chatHistory.filter(c => 
    c.title.toLowerCase().includes(sessionSearch.toLowerCase())
  );

  const HistoryList = () => (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Outreach & Chat Sessions</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={startNewChat} 
          className="h-7 px-2 rounded-lg text-xs font-bold text-[#00F2FE] hover:text-[#00F2FE]/80 hover:bg-[#00F2FE]/10 gap-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> New Session
        </Button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
        <Input
          placeholder="Filter sessions..."
          value={sessionSearch}
          onChange={(e) => setSessionSearch(e.target.value)}
          className="pl-8 h-8 rounded-xl bg-[#050814] border-white/10 text-[11px] text-white placeholder:text-slate-500 focus:border-[#00F2FE]"
        />
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-8 px-4">
          <MessageCircle className="h-7 w-7 mx-auto mb-2 text-slate-600 animate-pulse" />
          <p className="text-xs text-slate-500 font-medium">No saved sessions found.</p>
        </div>
      )}

      <ScrollArea className="h-[430px] pr-2">
        {filteredHistory.map((chat) => (
          <div 
            key={chat._id} 
            className={`group flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 border cursor-pointer mb-2 relative overflow-hidden ${
              currentChatId === chat._id 
                ? 'bg-[#00F2FE]/10 border-[#00F2FE]/30 text-white shadow-sm' 
                : 'bg-[#0A0E1A]/60 border-white/5 hover:bg-[#0A0E1A] hover:border-white/15'
            }`} 
            onClick={() => loadChat(chat)}
          >
            {currentChatId === chat._id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00F2FE] to-[#8B5CF6]" />
            )}
            
            <MessageCircle className={`h-4 w-4 shrink-0 ${currentChatId === chat._id ? 'text-[#00F2FE]' : 'text-slate-500'}`}/>
            
            <div className="flex flex-col overflow-hidden flex-1">
              <span className={`text-xs font-bold truncate ${currentChatId === chat._id ? 'text-[#00F2FE]' : 'text-slate-300 group-hover:text-white'}`}>
                {chat.title}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                {new Date(chat.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg cursor-pointer" 
              onClick={(e) => deleteChat(e, chat._id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* Context Parameters Drawer Bar */}
      <div className="glass-card bg-[#0B1020]/90 border border-white/10 rounded-2xl p-4 transition-all shadow-xl">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowParams(!showParams)}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F2FE]/20 to-[#8B5CF6]/20 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shadow-sm">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white font-poppins">
                  Candidate Career Context Parameters
                </span>
                <span className="text-[9px] font-extrabold text-[#00F5A0] bg-[#00F5A0]/10 border border-[#00F5A0]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Fully Calibrated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                Role: <b className="text-slate-200">{targetRole}</b> • Seniority: <b className="text-slate-200">{experienceLevel}</b> • Target Comp: <b className="text-emerald-400">{targetCompensation}</b> • Format: <b className="text-cyan-300">{workFormat}</b>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] text-slate-400 font-semibold">
              {showParams ? 'Collapse Parameters' : 'Expand Setup Fields'}
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-white rounded-lg cursor-pointer">
              {showParams ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {showParams && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-white/[0.08] mt-3.5 text-xs">
            {/* Field 1: Target Role */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-[#00F2FE]" /> Target Role <span className="text-[#00F2FE]">*</span>
              </Label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Staff Software Architect"
                className="bg-[#050814] border-white/10 text-white rounded-xl h-8.5 text-xs focus:border-[#00F2FE]"
              />
            </div>

            {/* Field 2: Seniority Level */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block">Seniority Level <span className="text-[#00F2FE]">*</span></Label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl h-8.5 px-2.5 text-xs outline-none focus:border-[#00F2FE]"
              >
                {SENIORITY_LEVELS.map((s) => (
                  <option key={s} value={s} className="bg-[#050814] text-white">{s}</option>
                ))}
              </select>
            </div>

            {/* NEW FIELD 1: Target Compensation */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Target Compensation
              </Label>
              <Input
                value={targetCompensation}
                onChange={(e) => setTargetCompensation(e.target.value)}
                placeholder="e.g. $150k - $200k / Year"
                className="bg-[#050814] border-white/10 text-white rounded-xl h-8.5 text-xs focus:border-emerald-400"
              />
            </div>

            {/* NEW FIELD 2: Preferred Work Format */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-300" /> Preferred Work Format
              </Label>
              <select
                value={workFormat}
                onChange={(e) => setWorkFormat(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl h-8.5 px-2.5 text-xs outline-none focus:border-cyan-400"
              >
                {WORK_FORMATS.map((f) => (
                  <option key={f} value={f} className="bg-[#050814] text-white">{f}</option>
                ))}
              </select>
            </div>

            {/* NEW FIELD 3: Key Technical Stack */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
                <Code className="w-3 h-3 text-purple-400" /> Core Tech Stack & Skills
              </Label>
              <Input
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                placeholder="e.g. React, Node.js, AWS, Python"
                className="bg-[#050814] border-white/10 text-white rounded-xl h-8.5 text-xs focus:border-purple-400"
              />
            </div>

            {/* NEW FIELD 4: Transition Stage */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block">Career Transition Stage</Label>
              <select
                value={transitionStage}
                onChange={(e) => setTransitionStage(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl h-8.5 px-2.5 text-xs outline-none focus:border-pink-400"
              >
                {TRANSITION_STAGES.map((ts) => (
                  <option key={ts} value={ts} className="bg-[#050814] text-white">{ts}</option>
                ))}
              </select>
            </div>

            {/* NEW FIELD 5: Select Resume Context */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
                <FileText className="w-3 h-3 text-amber-400" /> Link Profile Resume
              </Label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl h-8.5 px-2.5 text-xs outline-none focus:border-amber-400"
              >
                <option value="" className="bg-[#050814] text-slate-400">None (Use General Context)</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id} className="bg-[#050814] text-white">
                    {r.fullName} ({r.jobRole})
                  </option>
                ))}
              </select>
            </div>

            {/* Primary Goal */}
            <div>
              <Label className="text-slate-300 font-semibold mb-1 block">Primary Goal</Label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 text-white rounded-xl h-8.5 px-2.5 text-xs outline-none focus:border-[#00F2FE]"
              >
                {CAREER_GOALS.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#050814] text-white">{g.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[660px] items-stretch">
        {/* Sidebar for Desktop */}
        <Card className="hidden lg:flex lg:col-span-3 flex-col glass-card bg-[#0B1020]/90 border-white/10 shadow-2xl overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-white/[0.08] py-4 bg-[#050814]">
            <CardTitle className="text-xs font-black flex items-center gap-2 text-white font-poppins">
              <Sparkles className="h-4 w-4 text-[#00F2FE]" />
              OUTREACH SESSIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-3 flex flex-col justify-between">
            <HistoryList />
          </CardContent>
        </Card>

        {/* Main Chat Window */}
        <Card className="flex flex-col lg:col-span-9 glass-card bg-[#0B1020]/90 border-white/10 shadow-2xl overflow-hidden h-full rounded-2xl relative">
          <div className="absolute inset-0 bg-grid-soft opacity-20 pointer-events-none" />
          
          <CardHeader className="bg-[#050814] border-b border-white/[0.08] py-3.5 px-5 z-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-[#00F2FE] via-[#8B5CF6] to-[#EC4899] p-[1.5px] shadow-sm">
                  <div className="w-full h-full bg-[#050814] rounded-xl flex items-center justify-center">
                    <Bot className="h-5 w-5 text-[#00F2FE]" />
                  </div>
                </div>
                
                <div className="flex flex-col text-left">
                  <CardTitle className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6] font-poppins">
                    Neural Career Intelligence Bot
                  </CardTitle>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
                    Online • Calibrated: {targetRole} ({targetCompensation})
                  </span>
                </div>
              </div>
              
              {/* Header Action Tools */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportSessionMarkdown}
                  title="Export session to Markdown"
                  className="h-8 px-2.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl gap-1.5 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#00F2FE]" />
                  <span className="hidden sm:inline">Export Log</span>
                </Button>

                {/* Mobile History Drawer */}
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#0B1020] border-r border-white/10 text-white w-80 p-0">
                      <div className="p-5 border-b border-white/10 bg-[#050814]">
                        <SheetTitle className="text-[#00F2FE] flex items-center gap-2 text-sm font-black font-poppins">
                          <Sparkles className="h-4 w-4" /> CHAT SESSIONS
                        </SheetTitle>
                      </div>
                      <div className="p-3">
                        <HistoryList />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 sm:p-5 min-h-0 z-10 justify-between">
            <ScrollArea className="flex-1 pr-3 mb-3 relative">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-[#050814] border border-white/10 flex items-center justify-center shadow-md shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-[#00F2FE]" />
                      </div>
                    )}

                    <div
                      className={`group/msg relative max-w-[85%] rounded-2xl px-4 py-3 shadow-md text-left ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6] text-white rounded-tr-none font-medium'
                          : 'bg-[#050814]/90 border border-white/[0.08] text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-xs prose-invert max-w-none text-slate-200 leading-relaxed font-sans">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-xs font-semibold leading-relaxed">{message.content}</p>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/[0.05] text-[9px] text-slate-400 gap-4">
                        <span>{new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 opacity-80 group-hover/msg:opacity-100 transition-opacity">
                            {/* Audio TTS simulation */}
                            <button
                              type="button"
                              onClick={() => toggleSpeechAudio(idx, message.content)}
                              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                              title="Listen to audio"
                            >
                              {playingMsgIndex === idx ? (
                                <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                              <span>{playingMsgIndex === idx ? 'Stop' : 'Listen'}</span>
                            </button>

                            {/* Copy button */}
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(idx, message.content)}
                              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedIdx === idx ? <Check className="w-3 h-3 text-[#00F5A0]" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-[#00F2FE]/15 border border-[#00F2FE]/30 flex items-center justify-center shrink-0 mt-1">
                        <User className="h-4 w-4 text-[#00F2FE]" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Categorized Topic Presets Quick Chips */}
                {messages.length === 1 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-300">
                    {[
                      { title: "Audit Resume & ATS Metrics", prompt: `Audit my resume points for a ${targetRole} position (${targetCompensation}) and suggest quantitative ATS metric impact.`, icon: "📄" },
                      { title: "Simulate Tech System Design", prompt: `Let's run a mock System Design interview for a ${targetRole} at ${targetCompanies}. Focus on ${keySkills}. Ask question 1.`, icon: "🎯" },
                      { title: "Recruiter Outreach Strategy", prompt: `Draft a high-converting recruiter cold message for a ${targetRole} (${workFormat}) at ${targetCompanies}.`, icon: "📧" },
                      { title: "Salary Negotiation Playbook", prompt: `What salary negotiation tactics and counter-offer strategy should I use for a ${targetRole} target package of ${targetCompensation}?`, icon: "💵" }
                    ].map((chip) => (
                      <div
                        key={chip.title}
                        onClick={() => sendMessage(chip.prompt)}
                        className="p-3 bg-white/[0.02] border border-white/[0.08] hover:border-[#00F2FE]/40 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer text-left group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors flex items-center gap-1.5">
                            <span>{chip.icon}</span>
                            {chip.title}
                          </span>
                          <Zap className="w-3 h-3 text-slate-500 group-hover:text-[#00F2FE]" />
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{chip.prompt}</p>
                      </div>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-start gap-3 animate-in fade-in duration-300">
                    <div className="w-7 h-7 rounded-lg bg-[#050814] border border-white/10 flex items-center justify-center shadow-md">
                      <Bot className="h-4 w-4 text-[#00F2FE]" />
                    </div>
                    <div className="bg-[#050814] rounded-2xl rounded-tl-none px-4 py-3 border border-white/[0.08] flex items-center gap-2 text-xs">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#00F2FE] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Formulating career intelligence...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-px" />
              </div>
            </ScrollArea>
            
            {/* Input Bar */}
            <div className="relative">
              <div className="relative z-10 flex gap-2 items-end p-2 bg-[#050814] border border-white/10 rounded-2xl shadow-lg">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask anything about ${targetRole}, ATS audit, system design, compensation (${targetCompensation})...`}
                  className="flex-1 min-h-[42px] max-h-[100px] resize-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-200 placeholder:text-slate-500 py-3 px-3 text-xs font-medium"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="h-9 w-9 mb-0.5 mr-0.5 bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6] hover:from-[#00E5F0] hover:to-[#7C3AED] shadow-md transition-all rounded-xl cursor-pointer"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
              <p className="text-center text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-2">
                💡 Calibrated to {targetRole} ({experienceLevel}) • {targetCompensation} • {workFormat}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
