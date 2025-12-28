

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { generateChatResponse } from '@/services/geminiApi';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, MessageCircle, Plus, Trash2, History, Menu, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "🚀 **Welcome to your comprehensive AI Career Assistant!**\n\nI'm your dedicated career expert, ready to provide personalized guidance across all aspects of your professional journey:\n\n✨ **Resume & Cover Letter Optimization**\n🎯 **Interview Strategies & Mock Practice**\n🔍 **Job Search Tactics & Market Insights**\n💼 **Career Planning & Transition Guidance**\n💰 **Salary Negotiation & Benefits Analysis**\n📈 **Professional Development & Skill Building**\n\n**What specific career challenge would you like to tackle today?**",
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
    // Prevent scrolling on initial load to stop page jumping
    if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const token = localStorage.getItem('userToken') || localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchChatHistory();
    }
  }, [token]);

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
    isInitialLoad.current = false; // Ensure we scroll when loading a chat
  };

  const startNewChat = () => {
    setMessages([{
        content: "🚀 **Welcome to your comprehensive AI Career Assistant!**\n\nI'm your dedicated career expert, ready to provide personalized guidance across all aspects of your professional journey.\n\n**How can I help you today?**",
        role: 'assistant',
        timestamp: new Date()
    }]);
    setCurrentChatId(null);
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
    isInitialLoad.current = false; // Allow scrolling for new messages

    try {
      // 1. Get AI Response
      // Assuming generateChatResponse handles the API call abstractly
      // We pass the history for context
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
            fetchChatHistory();
          }
        } else {
          // Update existing chat
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
          fetchChatHistory(); // Optional: to refresh updated at time
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

  const HistoryList = () => (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Chats</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={startNewChat} 
            className="h-7 px-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
          >
              <Plus className="h-4 w-4 mr-1" /> New
          </Button>
      </div>
      {chatHistory.length === 0 && (
          <div className="text-center py-8 px-4 opacity-50">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-500">No history yet. Start a conversation!</p>
          </div>
      )}
      <ScrollArea className="h-[500px] pr-3">
        {chatHistory.map((chat) => (
            <div 
              key={chat._id} 
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border cursor-pointer mb-2 relative overflow-hidden ${
                currentChatId === chat._id 
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                  : 'bg-gray-800/20 border-transparent hover:bg-gray-800/40 hover:border-gray-700'
              }`} 
              onClick={() => loadChat(chat)}
            >
                {currentChatId === chat._id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500" />
                )}
                
                <MessageCircle className={`h-4 w-4 flex-shrink-0 ${currentChatId === chat._id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`}/>
                
                <div className="flex flex-col overflow-hidden flex-1">
                    <span className={`text-sm font-medium truncate ${currentChatId === chat._id ? 'text-indigo-100' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {chat.title}
                    </span>
                    <span className="text-[10px] text-gray-600 group-hover:text-gray-500">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                </div>

                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" 
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
    <div className="container mx-auto px-4 py-8 bg-[#0a0f1c] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
        {/* Sidebar for Desktop */}
         <Card className="hidden lg:flex lg:col-span-3 flex-col bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl overflow-hidden rounded-2xl">
            <CardHeader className="bg-gray-900/50 border-b border-gray-800 py-6">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-200 tracking-tight">AI Chat</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 bg-gray-900/30">
                <HistoryList />
            </CardContent>
         </Card>

         {/* Main Chat Area */}
        <Card className="flex flex-col lg:col-span-9 bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl overflow-hidden h-full rounded-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
          
          <CardHeader className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 py-4 z-10">
            <div className="flex items-center justify-between w-full">
                 <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[1px]">
                      <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center">
                        <Bot className="h-6 w-6 text-indigo-400" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900" />
                  </div>
                  
                  <div className="flex flex-col">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                      Career Assistant
                    </CardTitle>
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Online • Ready to help
                    </span>
                  </div>
                </div>
                
                {/* Mobile History Toggle */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-gray-950 border-r border-gray-800 text-gray-100 w-80 p-0">
                            <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                                <SheetTitle className="text-indigo-400 flex items-center gap-3 text-xl">
                                    <Sparkles className="h-5 w-5" /> AI Chat
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
          <CardContent className="flex-1 flex flex-col p-6 min-h-0 z-10">
            <ScrollArea className="flex-1 pr-4 mb-6 relative">
              <div className="space-y-8">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-indigo-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-xl backdrop-blur-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none'
                          : 'bg-gray-800/80 border border-gray-700/50 text-gray-200 rounded-tl-none'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                      )}
                      <span className="text-[10px] opacity-40 mt-2 block w-full text-right" suppressHydrationWarning>
                        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-indigo-400" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4 animate-in fade-in duration-300 pl-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shadow-lg mt-1">
                      <Bot className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl rounded-tl-none px-6 py-4 border border-gray-700/50 shadow-lg flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-px" />
              </div>
            </ScrollArea>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/0 to-transparent -top-20 z-0 pointer-events-none" />
              <div className="relative z-10 flex gap-3 items-end p-2 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-md">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about resume tips, interview prep, or career advice..."
                  className="flex-1 min-h-[50px] max-h-[150px] resize-none border-transparent focus:border-transparent focus:ring-0 bg-transparent text-gray-200 placeholder:text-gray-500 py-3 px-4 text-sm"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="h-10 w-10 mb-1 mr-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 rounded-xl"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
              <p className="text-center text-[10px] text-gray-600 mt-2">
                AI can make mistakes. Consider checking important information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
