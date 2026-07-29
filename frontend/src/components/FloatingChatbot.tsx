
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, History, Trash2, Plus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '@/services/aiService';
import { apiUrl, authHeaders, getStoredToken, clearAuthStorage } from '@/services/apiClient';

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

const FloatingChatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "**Hi, I'm your AI Career Coach.**\n\nI can help with resume optimization, interview prep, and job search strategy.\n\n**How can I support your goals today?**",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const token = getStoredToken(); 

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
    if (isOpen && token) {
      fetchChatHistory();
    }
  }, [fetchChatHistory, isOpen, token]);

  const loadChat = (chat: ChatSession) => {
    setMessages(chat.messages || []);
    setCurrentChatId(chat._id);
    setShowHistory(false);
  };

  const startNewChat = () => {
    setMessages([{
        content: "**Hi, I'm your AI Career Coach.**\n\nI can help with resume optimization, interview prep, and job search strategy.\n\n**How can I support your goals today?**",
        role: 'assistant',
        timestamp: new Date()
    }]);
    setCurrentChatId(null);
    setShowHistory(false);
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
        toast({ title: "Chat deleted" });
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

    try {
      // 1. Get AI Response
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponseContent = await generateChatResponse(inputMessage, history);
      
      const assistantMessage: Message = {
        content: aiResponseContent,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 2. Save to Backend (if logged in)
      if (token) {
        if (!currentChatId) {
          // Create new chat
          const createResponse = await fetch(apiUrl('/chats'), {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
              title: inputMessage.substring(0, 30) + (inputMessage.length > 30 ? '...' : ''),
              messages: [...messages, userMessage, assistantMessage]
            })
          });

          if (createResponse.ok) {
            const newChat = await createResponse.json();
            setCurrentChatId(newChat._id);
            fetchChatHistory(); // Refresh list
          }
        } else {
          // Update existing chat
          await fetch(apiUrl(`/chats/${currentChatId}`), {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ messages: [userMessage, assistantMessage] })
          });
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <AnimatePresence>
        {/* Floating Toggle Button */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'} z-50`}
          >
             <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-sky-600 rounded-full blur opacity-40 animate-pulse"></div>
            <Button
              onClick={toggleChat}
              className={`relative rounded-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 shadow-xl transition-all duration-300 ${
                isMobile ? 'w-16 h-16' : 'w-16 h-16'
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                 <Bot className="w-8 h-8 text-white" />
              </div>
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </Button>
          </motion.div>
        )}

        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed ${
              isMobile 
                ? 'bottom-2 right-2 left-2 top-20' 
                : 'bottom-8 right-8 w-[400px] h-[600px]'
            } z-50 flex flex-col`}
          >
            <Card className={`flex flex-col h-full border-0 shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 ${isMinimized ? 'h-auto' : ''}`}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-600 to-sky-600 text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Hire-X Assistant</h3>
                    <div className="flex items-center gap-1.5 opacity-90">
                       <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                       <span className="text-xs font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!isMinimized && (
                    <>
                       <Button variant="ghost" size="icon" onClick={() => setShowHistory(!showHistory)} className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20 rounded-full">
                          <History className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={startNewChat} className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20 rounded-full">
                          <Plus className="h-4 w-4" />
                       </Button>
                    </>
                  )}
                  {!isMobile && (
                    <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20 rounded-full">
                       {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-white/80 hover:text-white hover:bg-red-500/50 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <CardContent className="flex flex-col flex-1 p-0 overflow-hidden relative animate-in fade-in duration-300">
                  {!token ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 flex-1 bg-[#0F1424]/95 select-none relative">
                      <div className="absolute inset-0 bg-grid-soft opacity-5 pointer-events-none" />
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 p-[1.5px] mb-4 shadow-lg shadow-teal-500/10 relative z-10">
                        <div className="w-full h-full bg-[#0F1424] rounded-2xl flex items-center justify-center">
                          <Bot className="h-5 w-5 text-teal-400 animate-pulse" />
                        </div>
                      </div>
                      <h4 className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 mb-2 relative z-10">
                        AI Coach Locked
                      </h4>
                      <p className="text-xs text-gray-400 font-semibold mb-6 max-w-[240px] leading-relaxed relative z-10 text-center">
                        Unlock resume coaching, mock interview training, and custom recruiter outreach blueprints today.
                      </p>
                      <div className="flex flex-col gap-2.5 w-full max-w-[200px] relative z-10">
                        <Button 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/login');
                          }}
                          className="w-full h-9 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white text-xs font-black shadow-md shadow-teal-500/10 transition-all"
                        >
                          Sign In
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/register');
                          }}
                          className="w-full h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all"
                        >
                          Create Account
                        </Button>
                      </div>
                    </div>
                  ) : showHistory ? (
                      <div className="flex flex-col h-full bg-gray-50/50 dark:bg-black/20">
                          <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                              <span className="font-semibold text-sm">Previous Chats</span>
                              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)} className="text-xs h-7">Back to Chat</Button>
                          </div>
                          <ScrollArea className="flex-1 p-4">
                             {chatHistory.length === 0 ? (
                                <div className="text-center text-gray-500 py-8 text-sm">No saved chats yet.</div>
                             ) : (
                                <div className="space-y-2">
                                  {chatHistory.map((chat) => (
                                     <div key={chat._id} className="group flex items-center gap-3 p-3 text-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer shadow-sm hover:shadow" onClick={() => loadChat(chat)}>
                                         <MessageCircle className="w-4 h-4 text-teal-500" />
                                         <div className="flex-1 truncate font-medium text-gray-700 dark:text-gray-200">{chat.title}</div>
                                         <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-50" onClick={(e) => deleteChat(e, chat._id)}>
                                             <Trash2 className="w-3 h-3" />
                                         </Button>
                                     </div>
                                  ))}
                                </div>
                             )}
                          </ScrollArea>
                      </div>
                   ) : (
                     <div className="flex flex-col h-full">
                       <ScrollArea className="flex-1 p-4">
                         <div className="space-y-4">
                           {messages.map((message, idx) => (
                             <motion.div
                               key={idx}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               className={`flex items-start gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                             >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-teal-100 dark:bg-teal-900/50'}`}>
                                    {message.role === 'user' ? <User className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                                </div>
                                <div className={`flex flex-col max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                   message.role === 'user' 
                                   ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-tr-sm' 
                                   : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                                }`}>
                                   <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                                       <ReactMarkdown>{message.content}</ReactMarkdown>
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                           {isLoading && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                                   <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
                                   <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></span>
                                   <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-100"></span>
                                   <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                             </motion.div>
                           )}
                           <div ref={messagesEndRef} />
                         </div>
                       </ScrollArea>
                       
                       <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-t border-gray-100 dark:border-gray-700">
                          <div className="flex gap-2">
                             <Textarea
                               value={inputMessage}
                               onChange={(e) => setInputMessage(e.target.value)}
                               onKeyPress={handleKeyPress}
                               placeholder="Type your message..."
                               className="min-h-[44px] max-h-[100px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-teal-500 resize-none rounded-xl"
                               rows={1}
                             />
                             <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="icon" className="h-11 w-11 rounded-xl bg-teal-600 hover:bg-teal-700 shrink-0 shadow-lg shadow-teal-500/20">
                               <Send className="w-5 h-5" />
                             </Button>
                          </div>
                       </div>
                     </div>
                   )}
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;

