
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, History, Trash2, Plus } from 'lucide-react';
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
      content: "🚀 **Welcome to your AI Career Assistant!**\n\nI'm here to help you excel in your career journey. I can assist with:\n\n✨ **Career guidance & strategic planning**\n🎯 **Interview preparation & techniques**\n📝 **Resume optimization & ATS compliance**\n🔍 **Job search strategies & networking**\n💰 **Salary negotiation & benefits**\n📈 **Professional development & skills**\n\n**What career challenge can I help you solve today?**",
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
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        localStorage.removeItem('token');
        window.location.reload();
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
        content: "🚀 **Welcome to your AI Career Assistant!**\n\nI'm here to help you excel in your career journey. I can assist with:\n\n✨ **Career guidance & strategic planning**\n🎯 **Interview preparation & techniques**\n📝 **Resume optimization & ATS compliance**\n🔍 **Job search strategies & networking**\n💰 **Salary negotiation & benefits**\n📈 **Professional development & skills**\n\n**What career challenge can I help you solve today?**",
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

          if (createResponse.status === 401) {
             localStorage.removeItem('user');
             localStorage.removeItem('userToken');
             localStorage.removeItem('token');
             window.location.reload();
             return;
          }
          if (createResponse.ok) {
            const newChat = await createResponse.json();
            setCurrentChatId(newChat._id);
            fetchChatHistory(); // Refresh list
          }
        } else {
          // Update existing chat - send both messages to append
          const updateResponse = await fetch(`http://localhost:5000/api/chats/${currentChatId}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ messages: [userMessage, assistantMessage] })
          });
          
          if (updateResponse.status === 401) {
             localStorage.removeItem('user');
             localStorage.removeItem('userToken');
             localStorage.removeItem('token');
             window.location.reload();
             return;
          }
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
        {/* Enhanced Floating Chat Button */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`fixed ${
              isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'
            } z-50`}
          >
            <Button
              onClick={toggleChat}
              className={`rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 animate-pulse-glow group ${
                isMobile ? 'w-16 h-16' : 'w-18 h-18'
              }`}
              size="icon"
            >
              <div className="relative">
                <MessageCircle className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-white transition-transform group-hover:scale-110`} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce"></div>
              </div>
            </Button>
          </motion.div>
        )}

        {/* Enhanced Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed ${
              isMobile 
                ? 'bottom-4 right-4 left-4 top-20' 
                : 'bottom-6 right-6 w-96'
            } z-50`}
          >
            <Card className={`bg-gradient-to-br from-gray-800/95 via-slate-800/95 to-gray-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              isMinimized ? 'h-16' : isMobile ? 'h-full' : 'h-[600px]'
            }`}>
              <CardHeader className={`${isMobile ? 'pb-3 px-4 pt-4' : 'pb-2'} bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-b border-slate-700/50`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-bold flex items-center gap-3`}>
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}>
                      <Bot className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Career Assistant
                      </span>
                      <span className="text-xs text-gray-400 font-normal">AI-Powered Career Coach</span>
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {!isMinimized && (
                       <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHistory(!showHistory)}
                            className="h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg transition-colors"
                            title="Chat History"
                        >
                            <History className="h-4 w-4 text-indigo-400" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={startNewChat}
                            className="h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg transition-colors"
                             title="New Chat"
                        >
                            <Plus className="h-4 w-4 text-indigo-400" />
                        </Button>
                       </>
                    )}
                    {!isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMinimize}
                        className="h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        {isMinimized ? (
                          <Maximize2 className="h-4 w-4 text-indigo-400" />
                        ) : (
                          <Minimize2 className="h-4 w-4 text-indigo-400" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleChat}
                      className="h-8 w-8 p-0 hover:bg-red-800/50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className={`p-4 pt-0 flex flex-col flex-1 min-h-0`}>
                  {showHistory ? (
                      <ScrollArea className="flex-1 pr-4 mb-4">
                          <div className="space-y-2 mt-2">
                           <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">Chat History</h3>
                           {chatHistory.length === 0 && (
                               <p className="text-center text-gray-500 text-sm py-4">No saved chats found.</p>
                           )}
                           {chatHistory.map((chat) => (
                               <motion.div 
                                  key={chat._id} 
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="group flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50 cursor-pointer" 
                                  onClick={() => loadChat(chat)}
                               >
                                   <div className="flex items-center gap-3 overflow-hidden">
                                       <MessageCircle className="h-4 w-4 text-indigo-400 flex-shrink-0"/>
                                       <div className="flex flex-col overflow-hidden">
                                           <span className="text-sm font-medium text-gray-200 truncate">{chat.title}</span>
                                           <span className="text-xs text-gray-500">{new Date(chat.updatedAt).toLocaleDateString()}</span>
                                       </div>
                                   </div>
                                   <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => deleteChat(e, chat._id)}>
                                       <Trash2 className="h-4 w-4" />
                                   </Button>
                               </motion.div>
                           ))}
                          </div>
                      </ScrollArea>
                  ) : (
                    <>
                    <ScrollArea className={`flex-1 ${isMobile ? 'pr-2 mb-3' : 'pr-4 mb-4'}`}>
                        <div className="space-y-4 pt-2">
                        {messages.map((message, idx) => (
                            <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-start gap-3 ${
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                            >
                            {message.role === 'assistant' && (
                                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <Bot className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                                </div>
                            )}
                            <div
                                className={`${isMobile ? 'max-w-[85%]' : 'max-w-[80%]'} rounded-2xl px-4 py-3 shadow-lg ${
                                message.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-500/25'
                                    : 'bg-gradient-to-br from-gray-700/90 to-slate-800/90 text-gray-100 border border-slate-600/50'
                                }`}
                            >
                                {message.role === 'assistant' ? (
                                <div className={`prose prose-sm prose-invert max-w-none ${isMobile ? 'text-xs' : 'text-xs'}`}>
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                                ) : (
                                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{message.content}</p>
                                )}
                            </div>
                            {message.role === 'user' && (
                                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <User className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                                </div>
                            )}
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                            <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}>
                                <Bot className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                            </div>
                            <div className="bg-gradient-to-br from-gray-700/90 to-slate-800/90 rounded-2xl px-4 py-3 border border-slate-600/50 shadow-lg">
                                <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                    <div className={`flex gap-3 ${isMobile ? 'items-end' : 'items-center'}`}>
                        <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about your career journey..."
                        className={`flex-1 ${
                            isMobile 
                            ? 'min-h-[36px] max-h-[60px] text-sm' 
                            : 'min-h-[40px] max-h-[80px]'
                        } resize-none border-slate-600 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl bg-gray-700/80 text-gray-100 placeholder:text-gray-400`}
                        rows={1}
                        disabled={isLoading}
                        />
                        <Button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        size="icon"
                        className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 rounded-xl ${
                            isMobile ? 'h-9 w-9' : 'h-10 w-10'
                        }`}
                        >
                        <Send className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        </Button>
                    </div>
                    </>
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
