import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Briefcase, Zap, ChevronRight, Bot, Cpu, Send, Mic, User } from 'lucide-react';

const tools = [
  {
    id: 'gemini-chat',
    title: 'Google Gemini',
    description: 'Chat freely with our integrated AI. Ask questions, get advice, or practice your interview skills.',
    icon: Bot,
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    badge: 'Free',
  },
  {
    id: 'mock-interview',
    title: 'AI Mock Interview',
    description: 'Practice with our conversational AI. Get real-time feedback on your answers, tone, and confidence.',
    icon: MessageSquare,
    color: 'from-emerald-400 to-teal-500',
    bgLight: 'bg-emerald-50',
  },
  {
    id: 'cover-letter',
    title: 'Smart Cover Letters',
    description: 'Craft persuasive cover letters in seconds that perfectly match the job description you are applying for.',
    icon: Briefcase,
    color: 'from-purple-500 to-pink-500',
    bgLight: 'bg-purple-50',
  },
  {
    id: 'skill-analyzer',
    title: 'Skill Gap Analyzer',
    description: 'Analyze your skills against market trends and get personalized learning paths to land your dream job.',
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    badge: 'New',
  }
];

export default function AITools() {
  const [activeTool, setActiveTool] = useState(tools[0].id);
  
  // Chat State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am Google Gemini. I can help you write a resume, prepare for interviews, or answer any questions you have about your career. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'That sounds like a great idea! I am a simulated Gemini interface, but I can definitely help you with: "' + newMsg.text + '". Let me know what specific details you need.' }
      ]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 pt-16 pb-32 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-3xl opacity-50" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 blur-3xl opacity-50" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-200 backdrop-blur-md mb-6 ring-1 ring-white/20">
              <Sparkles className="h-4 w-4" />
              <span>AI-JOB Exclusive Tools</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/80">
              Supercharge Your Career with AI
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Leverage the power of Google Gemini and advanced machine learning to build your resume, prepare for interviews, and land your dream job faster.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Tool List */}
          <div className="lg:col-span-4 space-y-4">
            {tools.map((tool, index) => {
              const isActive = activeTool === tool.id;
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? 'bg-white border-blue-200 shadow-xl shadow-blue-900/5' 
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-md backdrop-blur-sm'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"
                      />
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-bold text-[15px] ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                            {tool.title}
                          </h3>
                          {tool.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              tool.badge === 'New' ? 'bg-amber-100 text-amber-700' : 
                              tool.badge === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm line-clamp-2 ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Main Workspace Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {tools.map((tool) => {
                if (tool.id !== activeTool) return null;
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-[600px] flex flex-col"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">{tool.title}</h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Cpu className="h-3.5 w-3.5 text-slate-400" />
                            <p className="text-xs font-medium text-slate-500">Powered by AI Model</p>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" 
                          alt="Gemini" 
                          className="h-7 opacity-70 grayscale hover:grayscale-0 transition-all duration-300" 
                        />
                      </div>
                    </div>

                    {/* Workspace Content */}
                    <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden">
                      {tool.id === 'gemini-chat' ? (
                        <>
                          {/* Chat Interface */}
                          <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((msg) => (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id} 
                                className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                              >
                                <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-md ${
                                  msg.sender === 'user' 
                                    ? 'bg-slate-900 text-white' 
                                    : `bg-gradient-to-br ${tool.color} text-white`
                                }`}>
                                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={`max-w-[75%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm ${
                                  msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                                }`}>
                                  {msg.text}
                                </div>
                              </motion.div>
                            ))}
                            {isTyping && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-4"
                              >
                                <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br ${tool.color} text-white`}>
                                  <Bot className="h-4 w-4" />
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                              </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                          </div>
                          
                          {/* Chat Input */}
                          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full p-2 pr-2.5 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
                              <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-full hover:bg-white shrink-0 ml-1">
                                <Mic className="h-5 w-5" />
                              </button>
                              <input 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message Gemini..."
                                className="flex-1 bg-transparent outline-none text-[14px] text-slate-700 placeholder:text-slate-400"
                              />
                              <button 
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className={`p-2.5 rounded-full shrink-0 transition-all flex items-center justify-center ${
                                  inputValue.trim() 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md scale-100' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'
                                }`}
                              >
                                <Send className="h-4 w-4 ml-0.5" />
                              </button>
                            </div>
                            <p className="text-center text-[11px] text-slate-400 mt-3">
                              Gemini may display inaccurate info, including about people, so double-check its responses.
                            </p>
                          </div>
                        </>
                      ) : (
                        /* Regular Tool Workspace (non-chat) */
                        <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                          <div className={`h-24 w-24 rounded-full ${tool.bgLight} flex items-center justify-center mb-6 relative`}>
                            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current text-blue-500" />
                            <Bot className={`h-12 w-12 bg-clip-text text-transparent bg-gradient-to-br ${tool.color}`} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-3">Ready to Start?</h3>
                          <p className="text-slate-500 max-w-md mb-8">
                            Provide a few details and our AI will generate professional, tailored content for you in seconds.
                          </p>
                          
                          <button className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:ring-4 hover:ring-slate-900/20 active:scale-95">
                            <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                            <span>Launch {tool.title}</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
