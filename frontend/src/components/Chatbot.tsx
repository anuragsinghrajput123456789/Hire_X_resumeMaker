import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/services/aiService';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, MessageCircle, Plus, Trash2, History, Menu, Sparkles, Zap } from 'lucide-react';
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

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "**Welcome to your AI Career Assistant.**\n\nI can help with resume optimization, interview prep, job search strategy, career planning, salary negotiation, and professional development.\n\n**What career challenge would you like to tackle today?**",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
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

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="glass-card bg-[#0F1424]/85 border border-white/5 shadow-2xl overflow-hidden rounded-3xl relative text-center p-8">
          <div className="absolute inset-0 bg-grid-soft opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F2FE] via-[#8B5CF6] to-[#EC4899] p-[1.5px] mb-6 shadow-xl shadow-cyan-500/10">
              <div className="w-full h-full bg-[#0F1424] rounded-2xl flex items-center justify-center">
                <Bot className="h-8 w-8 text-[#00F2FE]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6] mb-3">
              AI Career Assistant
            </h2>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">
              Unlock tailormade resume optimization, direct recruiter outreach, mock system design simulations, and expert career coaching by creating an account or logging in.
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
                className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-black px-6 h-11 shadow-lg shadow-pink-500/15 transition-all"
              >
                Create Account
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
        content: "**Welcome to your AI Career Assistant.**\n\nI'm ready to help with your resume, interviews, job search, and career decisions.\n\n**How can I help you today?**",
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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    isInitialLoad.current = false;

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponseContent = await generateChatResponse(inputMessage, history);
      
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
              title: inputMessage.substring(0, 30) + (inputMessage.length > 30 ? '...' : ''),
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
      const errorMessage = error instanceof Error ? error.message : String(error);
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
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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

  const HistoryList = () => (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">Outreach Sessions</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={startNewChat} 
            className="h-8 px-2.5 rounded-lg text-xs font-bold text-[#00F2FE] hover:text-[#00F2FE]/80 hover:bg-[#00F2FE]/10 gap-1"
          >
              <Plus className="h-3.5 w-3.5" /> New Session
          </Button>
      </div>
      {chatHistory.length === 0 && (
          <div className="text-center py-10 px-4">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-600 animate-pulse" />
            <p className="text-xs text-gray-500 font-medium">No saved sessions yet.</p>
          </div>
      )}
      <ScrollArea className="h-[460px] pr-2">
        {chatHistory.map((chat) => (
            <div 
              key={chat._id} 
              className={`group flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 border cursor-pointer mb-2 relative overflow-hidden ${
                currentChatId === chat._id 
                  ? 'bg-gradient-to-r from-[#00F2FE]/10 to-[#8B5CF6]/10 border-[#00F2FE]/20 shadow-[0_0_15px_rgba(0,242,254,0.05)]' 
                  : 'bg-[#0A0E1A]/40 border-white/5 hover:bg-[#0A0E1A]/80 hover:border-[#00F2FE]/10'
              }`} 
              onClick={() => loadChat(chat)}
            >
                {currentChatId === chat._id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00F2FE] to-[#8B5CF6]" />
                )}
                
                <MessageCircle className={`h-4 w-4 flex-shrink-0 ${currentChatId === chat._id ? 'text-[#00F2FE]' : 'text-gray-500 group-hover:text-gray-400'}`}/>
                
                <div className="flex flex-col overflow-hidden flex-1">
                    <span className={`text-xs font-bold truncate ${currentChatId === chat._id ? 'text-[#00F2FE]' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {chat.title}
                    </span>
                    <span className="text-[10px] text-gray-600 group-hover:text-gray-500 font-semibold mt-0.5">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                </div>

                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg" 
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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[660px] items-stretch">
         {/* Sidebar for Desktop */}
         <Card className="hidden lg:flex lg:col-span-3 flex-col glass-card bg-[#0F1424]/80 border-white/5 shadow-2xl overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 py-4.5 bg-[#0A0E1A]/40">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-white">
                    <Sparkles className="h-4.5 w-4.5 text-[#00F2FE]" />
                    AI OUTREACH LOGS
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 flex flex-col justify-between">
                <HistoryList />
            </CardContent>
         </Card>

         {/* Main Chat Area */}
         <Card className="flex flex-col lg:col-span-9 glass-card bg-[#0F1424]/80 border-white/5 shadow-2xl overflow-hidden h-full rounded-2xl relative">
          <div className="absolute inset-0 bg-grid-soft opacity-10 pointer-events-none" />
          
          <CardHeader className="bg-[#0F1424]/90 border-b border-white/5 py-4 z-10">
            <div className="flex items-center justify-between w-full">
                 <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#8B5CF6] p-[1px]">
                      <div className="w-full h-full bg-[#0F1424] rounded-xl flex items-center justify-center">
                        <Bot className="h-5 w-5 text-[#00F2FE]" />
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0F1424]" />
                  </div>
                  
                  <div className="flex flex-col text-left">
                    <CardTitle className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6]">
                      Career Intelligence Bot
                    </CardTitle>
                    <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online • Ready to Optimize
                    </span>
                  </div>
                </div>
                
                {/* Mobile History Toggle */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-[#0F1424] border-r border-white/5 text-white w-80 p-0">
                            <div className="p-6 border-b border-white/5 bg-[#0A0E1A]/40">
                                <SheetTitle className="text-[#00F2FE] flex items-center gap-2.5 text-base font-black">
                                    <Sparkles className="h-5 w-5" /> AI CHAT SESSIONS
                                </SheetTitle>
                            </div>
                            <div className="p-4">
                              <HistoryList />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-5 min-h-0 z-10 justify-between">
            <ScrollArea className="flex-1 pr-3 mb-4 relative">
              <div className="space-y-6">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3.5 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-[#0A0E1A] border border-white/5 flex items-center justify-center shadow-lg flex-shrink-0 mt-0.5">
                        <Bot className="h-4 w-4 text-[#00F2FE]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-xl text-left ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-[#00F2FE] to-[#8B5CF6] border border-white/10 text-white rounded-tr-none'
                          : 'bg-[#0A0E1A] border border-white/5 text-gray-200 rounded-tl-none'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-xs prose-invert max-w-none text-gray-300 leading-relaxed font-medium">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-xs font-bold leading-relaxed">{message.content}</p>
                      )}
                      <span className="text-[9px] opacity-40 mt-2 block w-full text-right" suppressHydrationWarning>
                        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-center shadow-lg flex-shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-[#00F2FE]" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* 1-click guided interactive prompt chips to vaporize vertical spacing void */}
                {messages.length === 1 && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    {[
                      { title: "Audit React Resume", prompt: "Can you review my React experience block and suggest ATS improvements?", color: "border-[#00F2FE]/20 hover:border-[#00F2FE]/45" },
                      { title: "Simulate Tech Interview", prompt: "Let's run a mock system design interview for a Senior Staff Architect position. Ask the first question.", color: "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/45" },
                      { title: "Draft Recruiter Note", prompt: "Write a high-impact recruiter cold message seeking a Frontend Engineer role.", color: "border-[#EC4899]/20 hover:border-[#EC4899]/45" },
                      { title: "Suggest High-Paying Skills", prompt: "What are the most valued skills and tools to learn for high-paying remote roles in 2026?", color: "border-[#00F5A0]/20 hover:border-[#00F5A0]/45" }
                    ].map((chip) => (
                      <div
                        key={chip.title}
                        onClick={() => {
                          setInputMessage(chip.prompt);
                          toast({ title: "Prompt loaded! Click Send to start." });
                        }}
                        className={`p-3.5 bg-white/[0.02] border rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer text-left ${chip.color} group`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-white group-hover:text-[#00F2FE] transition-colors">{chip.title}</span>
                          <Zap className="w-3 h-3 text-slate-600 group-hover:text-[#00F2FE] transition-colors" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 font-semibold line-clamp-1">{chip.prompt}</p>
                      </div>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-start gap-3.5 animate-in fade-in duration-300">
                    <div className="w-8 h-8 rounded-lg bg-[#0A0E1A] border border-white/5 flex items-center justify-center shadow-lg">
                      <Bot className="h-4 w-4 text-[#00F2FE]" />
                    </div>
                    <div className="bg-[#0A0E1A] rounded-2xl rounded-tl-none px-5 py-3.5 border border-white/5 shadow-lg flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#00F2FE] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Analyzing context...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-px" />
              </div>
            </ScrollArea>
            
            <div className="relative">
              <div className="relative z-10 flex gap-3 items-end p-2 bg-[#0A0E1A] border border-white/5 rounded-2xl shadow-xl">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask for resume optimization, career paths, interview prep..."
                  className="flex-1 min-h-[46px] max-h-[120px] resize-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-200 placeholder:text-gray-600 py-3.5 px-4 text-xs font-medium"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="h-9 w-9 mb-1 mr-1 bg-gradient-to-r from-[#00F2FE] to-[#8B5CF6] hover:from-[#00E5F0] hover:to-[#7C3AED] shadow-lg shadow-cyan-500/10 transition-all rounded-xl"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
              <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-wider mt-2.5">
                💡 AI guidance operates dynamically. Verify critical milestones independently.
              </p>
            </div>
          </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default Chatbot;
