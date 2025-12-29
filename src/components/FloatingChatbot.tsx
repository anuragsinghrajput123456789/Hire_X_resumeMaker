
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, History, Trash2, Plus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "👋 **Hi there! I'm your AI Career Coach.**\n\nI can help you with:\n✨ Resume Optimization\n🎯 Interview Prep\n🔍 Job Search Strategy\n\n**How can I support your goals today?**",
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

  const token = localStorage.getItem('userToken') || localStorage.getItem('token'); 

  useEffect(() => {
    if (isOpen && token) {
      fetchChatHistory();
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 401) {
        // Handle auth error gracefully
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const loadChat = (chat: ChatSession) => {
    setMessages(chat.messages);
    setCurrentChatId(chat._id);
    setShowHistory(false);
  };

  const startNewChat = () => {
    setMessages([{
        content: "👋 **Hi there! I'm your AI Career Coach.**\n\nI can help you with:\n✨ Resume Optimization\n🎯 Interview Prep\n🔍 Job Search Strategy\n\n**How can I support your goals today?**",
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
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
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
      const { generateChatResponse } = await import('@/services/geminiApi');
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
          const createResponse = await fetch('http://localhost:5000/api/chats', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
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
          await fetch(`http://localhost:5000/api/chats/${currentChatId}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ messages: [userMessage, assistantMessage] })
          });
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
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
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-40 animate-pulse"></div>
            <Button
              onClick={toggleChat}
              className={`relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl transition-all duration-300 ${
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
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shrink-0">
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
                <CardContent className="flex flex-col flex-1 p-0 overflow-hidden relative">
                   {showHistory ? (
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
                                         <MessageCircle className="w-4 h-4 text-blue-500" />
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
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
                                    {message.role === 'user' ? <User className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                </div>
                                <div className={`flex flex-col max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                   message.role === 'user' 
                                   ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm' 
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
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                                   <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
                                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></span>
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
                               className="min-h-[44px] max-h-[100px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-blue-500 resize-none rounded-xl"
                               rows={1}
                             />
                             <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="icon" className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0 shadow-lg shadow-blue-500/20">
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
